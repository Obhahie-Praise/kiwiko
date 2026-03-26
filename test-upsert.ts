import * as dotenv from 'dotenv';
dotenv.config();
import prisma from './src/lib/prisma';
async function test() {
  const userId = 'test-user-id';
  
  try {
    // We just need a dummy user to exist for foreign keys
    try {
      await prisma.user.create({
        data: {
          id: userId,
          name: 'Test',
          email: 'test@example.com',
        }
      });
    } catch(e) {}

    console.log('Testing startupOnboarding.upsert...');
    await prisma.startupOnboarding.upsert({
      where: { userId },
      update: { userRole: 'FOUNDER', consent: true },
      create: { userId, userRole: 'FOUNDER', consent: true }
    });
    console.log('startupOnboarding passed\n');

    console.log('Testing organization.upsert...');
    const orgSlug = 'test-org-slug';
    const org = await prisma.organization.upsert({
      where: { slug: orgSlug },
      update: {},
      create: { name: 'Test Org', slug: orgSlug, ownerId: userId }
    });
    console.log('organization passed\n');

    console.log('Testing membership.upsert...');
    await prisma.membership.upsert({
      where: { userId_orgId: { userId, orgId: org.id } },
      update: { role: 'OWNER' },
      create: { userId, orgId: org.id, role: 'OWNER' }
    });
    console.log('membership passed\n');
    
  } catch (err: any) {
    console.error('ERROR:', err.message);
  } finally {
    // cleanup
    try {
      await prisma.user.delete({ where: { id: userId } }).catch(() => {});
    } catch(e) {}
    await prisma.$disconnect();
  }
}

test();
