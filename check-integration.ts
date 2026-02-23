
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function checkIntegrationTable() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  try {
    const res = await client.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns 
      WHERE table_name = 'integration'
      ORDER BY ordinal_position;
    `);
    console.log("Columns in 'integration' table:");
    res.rows.forEach(row => console.log(` - ${row.column_name} (${row.data_type}, ${row.udt_name})`));
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

checkIntegrationTable();
