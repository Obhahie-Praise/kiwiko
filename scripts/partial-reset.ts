import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🚀 Starting partial database reset (sequential)...");

    const tables = [
        "aIChatMessage",
        "projectUpdate",
        "chatMessage",
        "calendarEvent",
        "notification",
        "trashedEmail",
        "email",
        "event",
        "projectMessage",
        "projectCommit",
        "projectView",
        "projectSignal",
        "connectedAccount",
        "projectMetricSnapshot",
        "projectMember",
        "projectInvite",
        "project",
        "organizationInvite",
        "membership",
        "organization",
        "startupOnboarding",
        "account",
        "session",
        "verification",
        "user",
        "investor",
        "platformMetric"
    ];

    try {
        // Special case: nullify waitlist links before user deletion
        console.log("🔗 Nullifying waitlist links...");
        await prisma.waitlist.updateMany({ data: { convertedUserId: null } });

        for (const table of tables) {
            console.log(`🧹 Clearing ${table}...`);
            try {
                await (prisma as any)[table].deleteMany();
            } catch (e) {
                console.warn(`⚠️ Failed to clear ${table}:`, e instanceof Error ? e.message : e);
            }
        }

        console.log("✅ Database reset successfully! (Waitlist and WaitlistUpdate preserved)");
    } catch (error) {
        console.error("❌ Unexpected error during database reset:", error);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
