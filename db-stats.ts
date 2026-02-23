import prisma from "./src/lib/prisma";

async function main() {
    try {
        const userCount = await prisma.user.count();
        const orgCount = await prisma.organization.count();
        const membershipCount = await prisma.membership.count();

        console.log("DIAGNOSTICS:");
        console.log("User Count:", userCount);
        console.log("Organization Count:", orgCount);
        console.log("Membership Count:", membershipCount);

        if (userCount > 0) {
            const users = await prisma.user.findMany({ take: 5 });
            console.log("Sample User Emails:", users.map(u => u.email).join(", "));
        }
    } catch (error) {
        console.error("DIAGNOSTICS FAILED:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
