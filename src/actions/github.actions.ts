"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { getGithubAccessToken } from "@/lib/github-utils";
import { revalidatePath } from "next/cache";

export type ActionResponse<T = any> = 
  | { success: true; data: T }
  | { success: false; error: string };

interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  commit_count?: number;
}

/**
 * Fetches the GitHub repositories for the currently authenticated user.
 */
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
      if (response.status === 401) {
        return { success: false, error: "no linked github" };
      }
      const errorData = await response.json();
      return { success: false, error: errorData.message || "Failed to fetch repositories from GitHub" };
    }

    const repos: any[] = await response.json();
    
    if (repos.length === 0) {
      return { success: false, error: "there is no repo" };
    }

    // Enrich the first 20 repos with commit counts (optional metadata)
    const enrichedRepos = await Promise.all(
      repos.slice(0, 20).map(async (repo) => {
        try {
          const commitsRes = await fetch(
            `https://api.github.com/repos/${repo.full_name}/commits?per_page=1`, 
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github.v3+json",
              },
            }
          );
          
          let commitCount = 0;
          if (commitsRes.ok) {
            const linkHeader = commitsRes.headers.get("Link");
            if (linkHeader) {
              const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
              if (match) commitCount = parseInt(match[1]);
            } else {
              const commits = await commitsRes.json();
              commitCount = commits.length;
            }
          }
          return { ...repo, commit_count: commitCount };
        } catch (e) {
          return repo;
        }
      })
    );

    const finalRepos = [...enrichedRepos, ...repos.slice(20)];

    const simplifiedRepos: GithubRepo[] = finalRepos.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      private: repo.private,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      pushed_at: repo.pushed_at,
      commit_count: repo.commit_count,
    }));

    return { success: true, data: simplifiedRepos };
  } catch (error: any) {
    console.error("getUserGithubRepos error:", error);
    if (error.message === "no linked github") {
      return { success: false, error: "no linked github" };
    }
    return { success: false, error: error.message || "Failed to retrieve GitHub connection" };
  }
}

/**
 * Connects a GitHub repository to a specific project.
 */
export async function connectGithubRepoToProject(
  projectId: string, 
  repoFullName: string
): Promise<ActionResponse<boolean>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { orgId: true, organization: { select: { slug: true } } }
    });

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    // Verify user membership in the organization
    const membership = await prisma.membership.findUnique({
      where: {
        userId_orgId: {
          userId: session.user.id,
          orgId: project.orgId,
        },
      },
    });

    if (!membership) {
      return { success: false, error: "You are not a member of this organization." };
    }

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
    console.error("connectGithubRepoToProject error:", error);
    return { success: false, error: "Failed to connect repository" };
  }
}

/**
 * Synchronizes GitHub metrics (stars, forks, issues, commits) for a project.
 */
export async function syncProjectGithubMetrics(projectId: string): Promise<ActionResponse<boolean>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || !project.githubRepoFullName || !project.githubConnectedBy) {
      return { success: false, error: "Project is not connected to a GitHub repository." };
    }

    const accessToken = await getGithubAccessToken(project.githubConnectedBy);

    // Fetch Repo Metadata
    const repoRes = await fetch(`https://api.github.com/repos/${project.githubRepoFullName}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!repoRes.ok) throw new Error("Failed to fetch repository data from GitHub");
    const repoData = await repoRes.json();

    // Fetch Commits from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const commitsRes = await fetch(
      `https://api.github.com/repos/${project.githubRepoFullName}/commits?since=${thirtyDaysAgo.toISOString()}&per_page=1`, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    let commitCount30d = 0;
    if (commitsRes.ok) {
       // Using Link header to get total count efficiently if many commits
       const linkHeader = commitsRes.headers.get("Link");
       if (linkHeader) {
         const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
         if (match) commitCount30d = parseInt(match[1]);
       } else {
         const commits = await commitsRes.json();
         commitCount30d = commits.length;
       }
    }

    await prisma.$transaction([
      prisma.project.update({
        where: { id: projectId },
        data: {
          githubStars: repoData.stargazers_count,
          githubForks: repoData.forks_count,
          githubOpenIssues: repoData.open_issues_count,
          githubCommitCount30d: commitCount30d,
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
      })
    ]);

    return { success: true, data: true };
  } catch (error: any) {
    console.error("syncProjectGithubMetrics error:", error);
    return { success: false, error: error.message || "Failed to sync GitHub metrics" };
  }
}

/**
 * Fetches repository metadata directly from GitHub.
 */
export async function getProjectRepoDetails(repoFullName: string, connectedByUserId: string): Promise<ActionResponse<any>> {
  try {
    const accessToken = await getGithubAccessToken(connectedByUserId);
    
    // Fetch basic repo data
    const repoResponse = await fetch(`https://api.github.com/repos/${repoFullName}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 }
    });

    if (!repoResponse.ok) {
      throw new Error(`GitHub API error: ${repoResponse.statusText}`);
    }

    const repoData = await repoResponse.json();

    // Fetch total commit count using Link header trick
    const commitsRes = await fetch(
      `https://api.github.com/repos/${repoFullName}/commits?per_page=1`, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    
    let totalCommits = 0;
    if (commitsRes.ok) {
      const linkHeader = commitsRes.headers.get("Link");
      if (linkHeader) {
        const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
        if (match) totalCommits = parseInt(match[1]);
      } else {
        const commits = await commitsRes.json();
        totalCommits = commits.length;
      }
    }

    return { 
      success: true, 
      data: { 
        ...repoData, 
        total_commits: totalCommits 
      } 
    };
  } catch (error: any) {
    console.error("getProjectRepoDetails error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetches all branches for a repository.
 */
export async function getProjectGithubBranches(repoFullName: string, connectedByUserId: string): Promise<ActionResponse<any[]>> {
  try {
    const accessToken = await getGithubAccessToken(connectedByUserId);
    const response = await fetch(`https://api.github.com/repos/${repoFullName}/branches`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 1800 } // Cache for 30 mins
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return { success: true, data: await response.json() };
  } catch (error: any) {
    console.error("getProjectGithubBranches error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetches commits for a specific branch.
 */
export async function getProjectGithubCommits(
  repoFullName: string, 
  connectedByUserId: string, 
  branch?: string
): Promise<ActionResponse<any[]>> {
  try {
    const accessToken = await getGithubAccessToken(connectedByUserId);
    const url = `https://api.github.com/repos/${repoFullName}/commits?per_page=20${branch ? `&sha=${branch}` : ""}`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 600 } // Cache for 10 mins
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return { success: true, data: await response.json() };
  } catch (error: any) {
    console.error("getProjectGithubCommits error:", error);
    return { success: false, error: error.message };
  }
}
