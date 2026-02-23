
import { PrismaClient } from './src/generated/prisma';
import { PrismaPg } from "@prisma/adapter-pg";
import { Client } from 'pg';
import 'dotenv/config';

async function testQuery() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL not found");
    return;
  }

  const client = new Client({ connectionString });
  await client.connect();
  const adapter = new PrismaPg(client);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Starting reproduction test query...");
    const result = await prisma.integration.findFirst({
        where: {
            userId: "test-user-id",
            provider: "GITHUB"
        }
    });
    console.log("Query success result:", result);
  } catch (e: any) {
    console.error("Query failed with error:");
    console.error("Code:", e.code);
    console.error("Message:", e.message);
    if (e.meta) console.error("Meta:", JSON.stringify(e.meta, null, 2));
  } finally {
    await prisma.$disconnect();
    await client.end();
  }
}

testQuery();
