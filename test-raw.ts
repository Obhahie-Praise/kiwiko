
import prisma from "./src/lib/prisma";

async function testRawQuery() {
  try {
    console.log("Starting raw test query...");
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    console.log("Raw query success:", result);
    
    const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log("Tables (raw):", tables);

  } catch (e: any) {
    console.error("Raw query failed:");
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

testRawQuery();
