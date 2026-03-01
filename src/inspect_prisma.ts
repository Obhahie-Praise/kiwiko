
import prisma from "../src/lib/prisma";

async function main() {
  console.log("Email model fields:", Object.keys((prisma as any).email));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
