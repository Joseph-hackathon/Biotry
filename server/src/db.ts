import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

/**
 * PRODUCTION SELF-HEALING: Ensures required columns exist via Raw SQL.
 * This ensures the database schema stays synchronized across environments.
 */
export async function initializeDatabaseRawSQL() {
    console.log('[DATABASE] Starting Raw SQL Schema Verification...');
    try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "fundingGoal" DOUBLE PRECISION DEFAULT 100.0;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "fundUSDC" DOUBLE PRECISION DEFAULT 0.0;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "fundCount" INTEGER DEFAULT 0;`);
        
        console.log('[DATABASE] Raw SQL Schema Sync: SUCCESS');
    } catch (error: any) {
        console.error('[DATABASE] Raw SQL Schema Sync: FAILED', error.message);
    }
}
