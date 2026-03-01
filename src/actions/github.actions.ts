"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { getGithubAccessToken } from "@/lib/github-utils";
import { revalidatePath } from "next/cache";

export type ActionResponse<T = any> = 
  | { success: true; data: T }
  | { success: false; error: string };

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  default_branch: string;
  commit_count?: number;
  is_deployed?: boolean;
}

export async function getUserGithubRepos(): Promise<ActionResponse<GithubRepo[]>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const accessToken = await getGithubAccessToken(session.user.id);
    
    const response = await fetch("https://api.github.com/user/repos?per_page=50&sort=updated", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GitHub API Error (${response.status}):`, errorText);
      
      if (response.status === 401) return { success: false, error: "no linked github" };
      
      let errorMessage = "Failed to fetch repositories";
      try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
      } catch (e) {}
      
      return { success: false, error: errorMessage };
    }

    const repos: any[] = await response.json();
    if (repos.length === 0) return { success: true, data: [] };

    const firstBatch = repos.slice(0, 20);
    const remaining = repos.slice(20);

    const enriched = await Promise.all(
        firstBatch.map(async (repo) => {
            try {
                // Fetch commit count
                const cRes = await fetch(`https://api.github.com/repos/${repo.full_name}/commits?per_page=1`, {
                    headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" }
                });
                
                let commitCount = 0;
                if (cRes.ok) {
                    const link = cRes.headers.get("Link");
                    if (link) {
                        const match = link.match(/&page=(\d+)>; rel="last"/);
                        if (match) commitCount = parseInt(match[1]);
                    } else {
                        const commits = await cRes.json();
                        commitCount = Array.isArray(commits) ? commits.length : 0;
                    }
                }

                // Fetch deployment status
                const dRes = await fetch(`https://api.github.com/repos/${repo.full_name}/deployments?per_page=1`, {
                    headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" }
                });
                
                let isDeployed = false;
                if (dRes.ok) {
                    const deployments = await dRes.json();
                    isDeployed = Array.isArray(deployments) && deployments.length > 0;
                }

                return { ...repo, commit_count: commitCount, is_deployed: isDeployed };
            } catch (e) {
                return repo;
            }
        })
    );

    const finalRepos = [...enriched, ...remaining].map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        private: repo.private,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        pushed_at: repo.pushed_at,
        default_branch: repo.default_branch,
        commit_count: repo.commit_count,
        is_deployed: repo.is_deployed || false,
    }));

    return { success: true, data: finalRepos };
  } catch (error: any) {
    if (error.message === "no linked github") return { success: false, error: "no linked github" };
    return { success: false, error: error.message || "Internal server error" };
  }
}

export async function connectGithubRepoToProject(
  projectId: string, 
  repoFullName: string
): Promise<ActionResponse<boolean>> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { orgId: true, organization: { select: { slug: true } } }
    });

    if (!project) return { success: false, error: "Project not found" };

    const membership = await prisma.membership.findUnique({
      where: { userId_orgId: { userId: session.user.id, orgId: project.orgId } }
    });

    if (!membership) return { success: false, error: "Access denied" };

    await prisma.project.update({
      where: { id: projectId },
      data: {
        githubRepoFullName: repoFullName,
        githubConnectedBy: session.user.id,
        githubLastSyncedAt: null,
      },
    });

    revalidatePath(`/${project.organization.slug}/projects`);
    return { success: true, data: true };
  } catch (error: any) {
    return { success: false, error: "Failed to connect repository" };
  }
}

export async function syncProjectGithubMetrics(projectId: string): Promise<ActionResponse<boolean>> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || !project.githubRepoFullName || !project.githubConnectedBy) {
      return { success: false, error: "Integration missing" };
    }

    const accessToken = await getGithubAccessToken(project.githubConnectedBy);
    const repoRes = await fetch(`https://api.github.com/repos/${project.githubRepoFullName}`, {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" }
    });

    if (!repoRes.ok) throw new Error("Metadata fetch failed");
    const repoData = await repoRes.json();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Also need 30 days for some fields, but we focus on 7d for commitsPerWeek
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const commitsRes = await fetch(
      `https://api.github.com/repos/${project.githubRepoFullName}/commits?since=${sevenDaysAgo.toISOString()}&per_page=1`, 
      {
        headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" }
      }
    );

    let commitCount7d = 0;
    let latestCommits: any[] = [];
    if (commitsRes.ok) {
       const link = commitsRes.headers.get("Link");
       if (link) {
         const match = link.match(/&page=(\d+)>; rel="last"/);
         if (match) commitCount7d = parseInt(match[1]);
       } else {
         const c = await commitsRes.json();
         commitCount7d = Array.isArray(c) ? c.length : 0;
       }

       // Fetch actual commit data to persist
       const detailRes = await fetch(
         `https://api.github.com/repos/${project.githubRepoFullName}/commits?per_page=20`,
         {
           headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" }
         }
       );
       if (detailRes.ok) {
         latestCommits = await detailRes.json();
       }
    }

    const commitsRes30d = await fetch(
      `https://api.github.com/repos/${project.githubRepoFullName}/commits?since=${thirtyDaysAgo.toISOString()}&per_page=1`, 
      {
        headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" }
      }
    );

    let commitCount30d = 0;
    if (commitsRes30d.ok) {
        const link = commitsRes30d.headers.get("Link");
        if (link) {
            const match = link.match(/&page=(\d+)>; rel="last"/);
            if (match) commitCount30d = parseInt(match[1]);
        } else {
            const c = await commitsRes30d.json();
            commitCount30d = Array.isArray(c) ? c.length : 0;
        }
    }

    const commitsPerWeek = commitCount30d === 0 && commitCount7d > 0 ? commitCount7d : commitCount7d; // Strictly rolling 7d

    await prisma.$transaction([
      prisma.project.update({
        where: { id: projectId },
        data: {
          githubStars: repoData.stargazers_count,
          githubForks: repoData.forks_count,
          githubOpenIssues: repoData.open_issues_count,
          githubCommitCount30d: commitCount30d,
          githubCommitsPerWeek: commitsPerWeek,
          githubLastCommitAt: repoData.pushed_at ? new Date(repoData.pushed_at) : null,
          githubLastSyncedAt: new Date(),
        },
      }),
      prisma.projectMetricSnapshot.create({
        data: {
          projectId,
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          openIssues: repoData.open_issues_count,
          commitCount30d: commitCount30d,
        }
      }),
      // Upsert commits
      ...latestCommits.map((c: any) => prisma.projectCommit.upsert({
        where: {
          projectId_sha: {
            projectId,
            sha: c.sha
          }
        },
        update: {
          message: c.commit.message,
          authorName: c.commit.author.name,
          authorEmail: c.commit.author.email,
          authorAvatar: c.author?.avatar_url,
          url: c.html_url,
          committedAt: new Date(c.commit.author.date),
        },
        create: {
          projectId,
          sha: c.sha,
          message: c.commit.message,
          authorName: c.commit.author.name,
          authorEmail: c.commit.author.email,
          authorAvatar: c.author?.avatar_url,
          url: c.html_url,
          committedAt: new Date(c.commit.author.date),
        }
      }))
    ]);

    // Send notifications for new commits
    if (latestCommits.length > 0) {
      const existingCommitsAfterSync = await prisma.projectCommit.findMany({
        where: { projectId, sha: { in: latestCommits.map(c => c.sha) } },
        select: { sha: true, createdAt: true, committedAt: true }
      });

      // Filter to commits that were created in the last 10 seconds to detect "new" ones from this sync
      const nowTime = Date.now();
      const newShas = new Set(
        existingCommitsAfterSync
          .filter(c => nowTime - c.createdAt.getTime() < 10000)
          .map(c => c.sha)
      );

      const newCommitsToNotify = latestCommits.filter(c => newShas.has(c.sha));

      if (newCommitsToNotify.length > 0) {
        const admins = await prisma.projectMember.findMany({
          where: { projectId, role: { in: ["OWNER", "ADMIN", "FOUNDER", "CO_FOUNDER"] } },
          select: { userId: true }
        });

        const notifications = [];
        for (const admin of admins) {
          for (const c of newCommitsToNotify) {
            notifications.push({
              projectId,
              userId: admin.userId,
              type: "git_commit",
              title: "New Commit Pushed",
              message: `${c.commit.author.name} pushed a commit: ${c.commit.message}`,
              metadata: {
                sha: c.sha,
                url: c.html_url
              }
            });
          }
        }

        if (notifications.length > 0) {
          await prisma.notification.createMany({ data: notifications });
        }
      }
    }

    return { success: true, data: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getProjectRepoDetails(repoFullName: string, connectedByUserId: string): Promise<ActionResponse<any>> {
  try {
    const accessToken = await getGithubAccessToken(connectedByUserId);
    const repoResponse = await fetch(`https://api.github.com/repos/${repoFullName}`, {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" },
      next: { revalidate: 3600 }
    });

    if (!repoResponse.ok) throw new Error(`GitHub Error: ${repoResponse.status}`);
    const repoData = await repoResponse.json();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const commitsRes = await fetch(
      `https://api.github.com/repos/${repoFullName}/commits?since=${sevenDaysAgo.toISOString()}&per_page=100`, 
      {
        headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" }
      }
    );
    
    let totalCommits = 0;
    let recentCommits = [];
    let uniqueAuthors = new Set();
    let commitsPerWeek = 0;

    if (commitsRes.ok) {
      recentCommits = await commitsRes.json();
      recentCommits.forEach((c: any) => {
        if (c.author?.login) uniqueAuthors.add(c.author.login);
        else if (c.commit?.author?.email) uniqueAuthors.add(c.commit.author.email);
      });
      
      commitsPerWeek = Math.round((recentCommits.length / 30) * 7 * 10) / 10;
      
      const totalCommitsRes = await fetch(
        `https://api.github.com/repos/${repoFullName}/commits?per_page=1`, 
        {
          headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" }
        }
      );
      
      const link = totalCommitsRes.headers.get("Link");
      if (link) {
        const match = link.match(/&page=(\d+)>; rel="last"/);
        if (match) totalCommits = parseInt(match[1]);
      } else if (totalCommitsRes.ok) {
        const c = await totalCommitsRes.json();
        totalCommits = Array.isArray(c) ? c.length : 0;
      }
    }

    return { 
      success: true, 
      data: { 
        ...repoData, 
        total_commits: totalCommits,
        active_engineers: uniqueAuthors.size || 1,
        commits_per_week: commitsPerWeek
      } 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getProjectGithubBranches(repoFullName: string, connectedByUserId: string): Promise<ActionResponse<any[]>> {
  try {
    const accessToken = await getGithubAccessToken(connectedByUserId);
    const response = await fetch(`https://api.github.com/repos/${repoFullName}/branches`, {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" },
      next: { revalidate: 1800 }
    });

    if (!response.ok) throw new Error("Branch fetch failed");
    return { success: true, data: await response.json() };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getProjectGithubCommits(
  repoFullName: string, 
  connectedByUserId?: string, 
  branch?: string
): Promise<ActionResponse<any[]>> {
  try {
    if (!connectedByUserId) {
      return fetchFromDB(repoFullName);
    }

    const accessToken = await getGithubAccessToken(connectedByUserId).catch(() => null);
    
    if (!accessToken) {
        return fetchFromDB(repoFullName);
    }

    const url = `https://api.github.com/repos/${repoFullName}/commits?per_page=20${branch ? `&sha=${branch}` : ""}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" },
      next: { revalidate: 600 }
    });

    if (!response.ok) {
        return fetchFromDB(repoFullName);
    }
    
    return { success: true, data: await response.json() };
  } catch (error: any) {
    return fetchFromDB(repoFullName);
  }
}

async function fetchFromDB(repoFullName: string): Promise<ActionResponse<any[]>> {
  try {
    const project = await prisma.project.findFirst({
        where: { githubRepoFullName: repoFullName },
        select: { id: true }
    });
    
    if (!project) return { success: false, error: "Project not found" };

    const commits = await prisma.projectCommit.findMany({
        where: { projectId: project.id },
        orderBy: { committedAt: "desc" },
        take: 20
    });

    const mappedCommits = commits.map(c => ({
        sha: c.sha,
        commit: {
          message: c.message,
          author: {
            name: c.authorName,
            email: c.authorEmail,
            date: c.committedAt.toISOString()
          }
        },
        author: {
          avatar_url: c.authorAvatar
        },
        html_url: c.url
    }));

    return { success: true, data: mappedCommits };
  } catch (e) {
    return { success: false, error: "Failed to fetch commits from database" };
  }
}
