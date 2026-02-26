import { PrismaClient } from "./src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function testAnalytics() {
  console.log("🚀 Starting Analytics Verification...");

  // 1. Find or create a test project
  let project = await prisma.project.findFirst();
  if (!project) {
    console.log("No project found. Please create one in the UI first.");
    process.exit(1);
  }

  const publicKey = project.publicKey;
  const secretKey = project.secretKey;

  if (!publicKey || !secretKey) {
     console.log("Project is missing keys. Ensure createProjectAction generated them.");
     process.exit(1);
  }

  console.log(`Using Project: ${project.name} (${project.id})`);
  console.log(`Public Key: ${publicKey}`);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // 2. Test Tracker Script Delivery
  console.log("\n📦 Testing Tracker Script Delivery...");
  try {
    const res = await fetch(`${baseUrl}/api/tracker.js`);
    if (res.ok && res.headers.get("content-type")?.includes("javascript")) {
      console.log("✅ Tracker script delivered correctly.");
    } else {
      console.error("❌ Failed to fetch tracker script:", res.status, res.headers.get("content-type"));
    }
  } catch (e) {
    console.error("❌ Error fetching tracker script. Is the dev server running?", e);
  }

  // 3. Test Event Ingestion (Public Key)
  console.log("\n📡 Testing Event Ingestion (Public Key)...");
  try {
    const payload = {
      publicKey,
      userId: "test_user_123",
      sessionId: "test_sess_456",
      eventName: "test_event_frontend",
      url: "http://localhost:3000/test",
      metadata: { source: "verification_script" }
    };

    const res = await fetch(`${baseUrl}/api/ingest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      console.log("✅ Frontend event ingested successfully.");
    } else {
      const err = await res.text();
      console.error("❌ Frontend ingest failed:", res.status, err);
    }
  } catch (e) {
    console.error("❌ Error during frontend ingest:", e);
  }

  // 4. Test Event Ingestion (Secret Key)
  console.log("\n🔐 Testing Event Ingestion (Secret Key)...");
  try {
    const payload = {
      eventName: "test_event_backend",
      userId: "test_user_123",
      metadata: { type: "server_side" }
    };

    const res = await fetch(`${baseUrl}/api/ingest`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${secretKey}`
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      console.log("✅ Backend event ingested successfully.");
    } else {
      const err = await res.text();
      console.error("❌ Backend ingest failed:", res.status, err);
    }
  } catch (e) {
    console.error("❌ Error during backend ingest:", e);
  }

  // 5. Verify Database State
  console.log("\n📊 Verifying DB Records...");
  const eventCount = await prisma.event.count({
    where: { projectId: project.id, eventName: { startsWith: "test_event" } }
  });

  if (eventCount >= 2) {
    console.log(`✅ Verified ${eventCount} test events in DB.`);
  } else {
    console.error(`❌ DB Verification failed. Expected at least 2 events, found ${eventCount}.`);
  }

  await prisma.$disconnect();
  await pool.end();
  console.log("\n🏁 Verification Complete.");
}

testAnalytics();
