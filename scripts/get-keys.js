const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const project = await prisma.project.findFirst({
    select: {
      id: true,
      name: true,
      publicKey: true,
      secretKey: true
    }
  });
  console.log(JSON.stringify(project, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
