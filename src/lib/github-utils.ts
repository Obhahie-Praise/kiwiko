import prisma from "@/lib/prisma";

/**
 * Server-only utility to fetch the GitHub access token for a specific user.
 * 
 * @param userId - The ID of the authenticated user.
 * @returns The GitHub access token if found.
 * @throws Error if the user is not connected via GitHub.
 */
export async function getGithubAccessToken(userId: string): Promise<string> {
  // First check the Integration table (for users who linked GitHub later)
  const connectedAccount = await prisma.connectedAccount.findFirst({
    where: {
      userId: userId,
      provider: "GITHUB",
    },
    select: {
      accessToken: true,
    },
  });

  if (connectedAccount && connectedAccount.accessToken) {
    return connectedAccount.accessToken;
  }

  // Fallback to the Account table (for users who signed up with GitHub)
  const account = await prisma.account.findFirst({
    where: {
      userId: userId,
      providerId: "github",
    },
    select: {
      accessToken: true,
    },
  });

  if (!account || !account.accessToken) {
    throw new Error("no linked github");
  }

  return account.accessToken;
}
