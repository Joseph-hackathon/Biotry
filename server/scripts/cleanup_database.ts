import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Biotry Social Graph Integrity Maintenance Script
 * 
 * This script identifies and audits research nodes with truncated author addresses.
 * Truncated addresses (containing '...') cannot resolve on Tapestry and should be 
 * updated with the full 44-character Solana public key.
 */
async function auditDatabase() {
  console.log('--- Biotry Social Graph Audit Started ---');

  try {
    const posts = await prisma.post.findMany();
    const truncatedPosts = posts.filter(p => p.author.includes('...'));

    if (truncatedPosts.length === 0) {
      console.log('✅ PASS: No truncated addresses detected in the database.');
    } else {
      console.warn(`⚠️ WARNING: Detected ${truncatedPosts.length} nodes with truncated author IDs.`);
      
      truncatedPosts.forEach(p => {
        console.log(`  - [Node ${p.id}]: Author "${p.author}" is malformed.`);
      });

      console.log('\n[RECOVERY]: To fix these, you must manually update the "author" field to the full Solana address.');
      console.log('New research nodes created via the ResearchEditor will now use the correct full identifiers.');
    }

  } catch (err: any) {
    console.error('❌ Audit Failed:', err.message);
  } finally {
    await prisma.$disconnect();
    console.log('--- Audit Completed ---');
  }
}

auditDatabase();
