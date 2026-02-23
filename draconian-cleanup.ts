
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function cleanupDB() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  try {
    console.log("Cleaning up database...");
    
    // Drop tables (quoted to handle case sensitivity)
    const tablesToDrop = [
      'Integration', 
      'integration', 
      'ProjectIntegration', 
      'project_integration',
      'IntegrationRecord'
    ];
    
    for (const table of tablesToDrop) {
      try {
        await client.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
        console.log(`Dropped table "${table}" (if it existed)`);
      } catch (e: any) {
        console.error(`Failed to drop table "${table}": ${e.message}`);
      }
    }

    // Drop enums
    try {
      await client.query(`DROP TYPE IF EXISTS "IntegrationProvider" CASCADE`);
      console.log(`Dropped enum "IntegrationProvider"`);
    } catch (e: any) {
        console.error(`Failed to drop enum: ${e.message}`);
    }

    console.log("Cleanup complete!");
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

cleanupDB();
