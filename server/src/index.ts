import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

import { x402Middleware } from './middleware/x402';
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
app.get('/api/posts/:id/audit', x402Middleware, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({ where: { id: id as string } });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    // In a real app, this would trigger the actual AI War Room simulation.
    // For the hackathon demo, we return the high-value audit metrics.
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

    // Deep OWS Integration: Sign the audit with the Agent's Sovereign Wallet
    const { signature, address } = await signAgentAudit(auditResult);

    res.json({
      ...auditResult,
      agentAddress: address,
      agentSignature: signature
    });
  } catch (error) {
    res.status(500).json({ error: 'Audit failed' });
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
    console.error('[GET /api/posts] DB Error:', error?.message || error);
    res.status(500).json({ error: 'Failed to fetch posts', detail: error?.message });
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
