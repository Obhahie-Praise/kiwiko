import prisma from "./src/lib/prisma";

async function main() {
    const orgs = await prisma.organization.findMany({
        include: {
            memberships: true
        }
    });

    console.log("Total Organizations:", orgs.length);
    orgs.forEach(org => {
        console.log(`Org: ${org.name} (${org.slug}), Members: ${org.memberships.length}`);
    });

    const users = await prisma.user.findMany({
        include: {
            memberships: true
        }
    });
    console.log("Total Users:", users.length);
    users.forEach(user => {
        console.log(`User: ${user.email}, Memberships: ${user.memberships.length}`);
    });
}

main();
