import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

/**
 * PRODUCTION SELF-HEALING: Ensures required columns exist via Raw SQL.
 * This ensures the database schema stays synchronized across environments.
 */
export async function initializeDatabaseRawSQL() {
    console.log('[DATABASE] Starting Raw SQL Schema Verification...');
    if (!process.env.DATABASE_URL) {
        console.warn('[DATABASE] Warning: DATABASE_URL is not set. Database features may be unavailable.');
        return;
    }

    try {
        // Test connection
        await prisma.$connect();
        console.log('[DATABASE] Connection established successfully.');

        await prisma.$executeRawUnsafe(`ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "fundingGoal" DOUBLE PRECISION DEFAULT 100.0;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "fundUSDC" DOUBLE PRECISION DEFAULT 0.0;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "fundCount" INTEGER DEFAULT 0;`);
        
        console.log('[DATABASE] Raw SQL Schema Sync: SUCCESS');
    } catch (error: any) {
        console.error('[DATABASE] ERROR during schema sync or connection:', error.message);
        if (error.message.includes('Can\'t reach database server')) {
            console.error('[DATABASE] SUGGESTION: Check if your DATABASE_URL environment variable is correctly set in Railway.');
        }
    }
}
