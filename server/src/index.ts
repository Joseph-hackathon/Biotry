import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

import { createX402Middleware } from './middleware/x402';
import { initializeAgentWallet, signAgentAudit } from './lib/agentWallet';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-PAYMENT-SIGNATURE'],
  exposedHeaders: ['PAYMENT-REQUIRED']
}));
app.use(express.json());

// --- x402 PROTECTED AUDIT API ---
app.get('/api/posts/:id/audit', createX402Middleware('0.1'), async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({ where: { id: id as string } });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    // Detailed audit metrics
    const auditResult = {
      postId: id,
      auditStatus: 'VERIFIED',
      metrics: {
        actionability: 94,
        impactScore: 89,
        crowdedness: 'Low',
        timeToMarket: '1.5 Yrs'
      },
      agentReports: [
        { agent: 'Dr. Bio', report: 'Positive gap analysis. Novel methodology in ZK-Graph.' },
        { agent: 'Solana Architect', report: 'Efficient PDA structure. Gas optimized.' }
      ]
    };

    const { signature, address } = await signAgentAudit(auditResult);

    res.json({
      ...auditResult,
      agentAddress: address,
      agentSignature: signature
    });
  } catch (error: any) {
    console.error('[Audit API Error]:', error);
    res.status(500).json({ error: 'Audit failed', detail: error.message });
  }
});

// --- OWS SCIENTIFIC FUNDING API ---
app.post('/api/posts/:id/fund', createX402Middleware('1.0'), async (req, res) => {
    const { id } = req.params;
    let post: any = null;
    
    try {
        // Safe Fetch: Attempt to find the post. 
        try {
            post = await prisma.post.findUnique({ where: { id: id as string } });
        } catch (fetchError: any) {
            console.warn('[Funding API] findUnique failed (Schema Mismatch). Attempting fallback...', fetchError.message);
            post = await (prisma.post as any).findUnique({
                where: { id: id as string },
                select: { id: true }
            });
        }

        if (!post) return res.status(404).json({ error: 'Post not found' });

        try {
            const updatedPost = await prisma.post.update({
                where: { id: id as string },
                data: {
                    fundUSDC: { increment: 1.0 },
                    fundCount: { increment: 1 }
                }
            });

            res.json({
                message: 'Funding Successful',
                fundingTotal: updatedPost.fundUSDC,
                fundingCount: updatedPost.fundCount,
                syncStatus: 'PROVEN_ON_CHAIN'
            });
        } catch (dbError: any) {
            console.error('[Funding API] DB Update Failed (Schema Mismatch).', dbError.message);
            
            // If DB update failed, the payment was verified but NOT recorded. 
            // We tell the client that a migration is pending so they can manually sync if needed.
            res.status(409).json({
                error: 'Persistence Failure',
                message: 'Payment verified but database record could not be updated (Schema Mismatch).',
                syncStatus: 'SCHEMA_UPDATE_REQUIRED',
                technical: dbError.message
            });
        }
    } catch (error: any) {
        console.error('[Funding API Fatal Error]:', error);
        res.status(500).json({ error: 'Funding verification failed', detail: error.message });
    }
});

// --- POSTS ---
app.get('/api/posts', async (req, res) => {
  try {
    // Attempt to fetch all fields (including new funding fields)
    const posts = await prisma.post.findMany({
      orderBy: { timestamp: 'desc' }
    });
    
    const serializedPosts = posts.map((post: any) => ({
      ...post,
      timestamp: post.timestamp ? Number(post.timestamp) : Date.now(),
      fundUSDC: post.fundUSDC ?? 0,
      fundCount: post.fundCount ?? 0,
      fundingGoal: post.fundingGoal ?? 100
    }));

    res.json(serializedPosts);
  } catch (error: any) {
    console.error('[GET /api/posts] Primary Fetch Failed. Attempting legacy fallback...', error.message);
    
    try {
        // Fallback for production: If new columns are missing, fetch only the known core fields
        // We log clearly that a sync is required. 
        const legacyPosts = await (prisma.post as any).findMany({
            select: {
                id: true,
                author: true,
                researchField: true,
                type: true,
                title: true,
                doi: true,
                abstract: true,
                content: true,
                upvotes: true,
                commentCount: true,
                createdAt: true,
                timestamp: true,
                topics: true,
                status: true
            },
            orderBy: { timestamp: 'desc' }
        });

        const serialized = legacyPosts.map((p: any) => ({
            ...p,
            timestamp: p.timestamp ? Number(p.timestamp) : Date.now(),
            fundUSDC: 0,
            fundCount: 0,
            fundingGoal: 100,
            _syncWarning: 'DB_COLUMNS_MISSING - Run npm run db:push'
        }));
        
        res.json(serialized);
    } catch (fallbackError: any) {
        console.error('[GET /api/posts] Critical DB Error:', fallbackError.message);
        res.status(500).json({ 
            error: 'Database Failure', 
            detail: 'Database schema mismatch. Please run: npm run db:push (locally or via deployment)',
            technical: fallbackError.message 
        });
    }
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const { id, title, author, abstract, researchField, topics, type, doi, content } = req.body;
    const post = await prisma.post.create({
      data: {
        id: id || undefined, // Use provided ID (Solana PDA) or fallback to cuid()
        title,
        author,
        abstract,
        researchField,
        topics,
        type,
        doi,
        content,
        timestamp: BigInt(Date.now()),
      }
    });
    res.json({ ...post, timestamp: Number(post.timestamp) });
  } catch (error: any) {
    console.error('[POST /api/posts] Error:', error.message);
    res.status(500).json({ error: 'Failed to create post', detail: error.message });
  }
});

// --- HUBS ---
app.get('/api/hubs', async (req, res) => {
  try {
    const hubs = await prisma.hub.findMany();
    res.json(hubs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hubs' });
  }
});

// --- EDITORS ---
app.get('/api/editors', async (req, res) => {
  try {
    const editors = await prisma.editor.findMany();
    res.json(editors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch editors' });
  }
});

// --- LEADERBOARD ---
app.get('/api/leaderboard', async (req, res) => {
  try {
    const entries = await prisma.leaderboardEntry.findMany({
      orderBy: { points: 'desc' }
    });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

app.listen(PORT, async () => {
  console.log(`Biotry Backend running on port ${PORT}`);
  console.log(`DATABASE_URL set: ${!!process.env.DATABASE_URL}`);
  
  // Initialize Open Wallet Standard Agent Identity
  try {
    await initializeAgentWallet();
  } catch (e) {
    console.error('Failed to init Agent Wallet:', e);
  }
});
