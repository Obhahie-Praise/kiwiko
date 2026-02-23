
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function checkData() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  try {
    const tables = ['Integration', 'integration', 'ProjectIntegration', 'project_integration'];
    for (const table of tables) {
      try {
        const res = await client.query(`SELECT count(*) FROM "${table}"`);
        console.log(`Table "${table}" has ${res.rows[0].count} rows.`);
      } catch (e) {
        console.log(`Table "${table}" dose not exist or check failed.`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

checkData();
