import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting GitHub token migration...");

  // 1. Fetch all GitHub accounts
  const githubAccounts = await prisma.account.findMany({
    where: {
      providerId: "github",
    },
  });

  console.log(`Found ${githubAccounts.length} GitHub accounts to migrate.`);

  let migratedCount = 0;
  let skippedCount = 0;

  for (const account of githubAccounts) {
    if (!account.accessToken) {
      console.log(`Skipping account ${account.id} (no access token).`);
      skippedCount++;
      continue;
    }

    try {
      // 2. Upsert into Integration table
      // @ts-ignore
      await prisma.integration.upsert({
        where: {
          userId_provider: {
            userId: account.userId,
            provider: "github",
          },
        },
        update: {
          accessToken: account.accessToken,
          refreshToken: account.refreshToken,
          expiresAt: account.accessTokenExpiresAt,
        },
        create: {
          userId: account.userId,
          provider: "github",
          accessToken: account.accessToken,
          refreshToken: account.refreshToken,
          expiresAt: account.accessTokenExpiresAt,
        },
      });

      migratedCount++;
    } catch (error) {
      console.error(`Error migrating account ${account.id}:`, error);
    }
  }

  console.log(`✅ Migration complete!`);
  console.log(`Migrated: ${migratedCount}`);
  console.log(`Skipped: ${skippedCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
