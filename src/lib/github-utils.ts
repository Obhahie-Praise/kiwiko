import prisma from "@/lib/prisma";

/**
 * Server-only utility to fetch the GitHub access token for a specific user.
 * 
 * @param userId - The ID of the authenticated user.
 * @returns The GitHub access token if found.
 * @throws Error if the user is not connected via GitHub.
 */
export async function getGithubAccessToken(userId: string): Promise<string> {
  // @ts-ignore
  const integration = await prisma.integration.findUnique({
    where: {
      userId_provider: {
        userId: userId,
        provider: "github",
      },
    },
    select: {
      accessToken: true,
    },
  });

  if (!integration || !integration.accessToken) {
    throw new Error("no linked github");
  }

  return integration.accessToken;
}
