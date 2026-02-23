
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function checkUserTable() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  try {
    const res = await client.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns 
      WHERE table_name = 'user'
      ORDER BY ordinal_position;
    `);
    console.log("Columns in 'user' table:");
    res.rows.forEach(row => console.log(` - ${row.column_name} (${row.data_type}, ${row.udt_name})`));
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

checkUserTable();
