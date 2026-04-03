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
    try {
        const post = await prisma.post.findUnique({ where: { id: id as string } });
        if (!post) return res.status(404).json({ error: 'Post not found' });

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
            fundingCount: updatedPost.fundCount
        });
    } catch (error: any) {
        console.error('[Funding API Error]:', error);
        res.status(500).json({ error: 'Funding update failed', detail: error.message });
    }
});

// --- POSTS ---
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { timestamp: 'desc' }
    });
    // Serialize BigInt to String for JSON
    const serializedPosts = posts.map((post: any) => ({
      ...post,
      timestamp: Number(post.timestamp)
    }));
    res.json(serializedPosts);
  } catch (error: any) {
    console.error('[GET /api/posts] DB Connection/Schema Error:', {
        message: error?.message || 'Unknown Error',
        code: error?.code,
        meta: error?.meta
    });
    res.status(500).json({ 
        error: 'Failed to fetch posts from network', 
        detail: error?.message || 'Production Database Error. Try running: npx prisma migrate deploy'
    });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const { title, author, abstract, researchField, topics, type, doi, content } = req.body;
    const post = await prisma.post.create({
      data: {
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
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
