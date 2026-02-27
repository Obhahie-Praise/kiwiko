import prisma from "@/lib/prisma";

async function test() {
    const project = await prisma.project.findFirst({
        where: {
            slug: "some-project",
            organization: {
                slug: "some-org"
            }
        }
    });
    console.log("Project:", project);
}

test();
