import prisma from './src/lib/prisma';

async function main() {
    console.log('--- Database Diagnostic ---');
    try {
        const tables = await prisma.$queryRawUnsafe(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log('Tables:', JSON.stringify(tables, null, 2));

        const columns = await prisma.$queryRawUnsafe(`
            SELECT table_name, column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'Project'
        `);
        console.log('Project Columns:', JSON.stringify(columns, null, 2));

    } catch (error) {
        console.error('Diagnostic failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
