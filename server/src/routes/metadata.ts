import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

// --- HUBS ---
router.get('/hubs', async (req, res) => {
  try {
    const hubs = await prisma.hub.findMany();
    res.json(hubs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hubs' });
  }
});

// --- EDITORS ---
router.get('/editors', async (req, res) => {
  try {
    const editors = await prisma.editor.findMany();
    res.json(editors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch editors' });
  }
});

// --- LEADERBOARD ---
router.get('/leaderboard', async (req, res) => {
  try {
    const entries = await prisma.leaderboardEntry.findMany({
      orderBy: { points: 'desc' }
    });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// --- DIAGNOSTICS & HEALTH ---
router.get('/diag', async (req, res) => {
    try {
        const postCount = await prisma.post.count();
        res.json({ dbConnected: true, postCount, timestamp: new Date().toISOString() });
    } catch (error: any) {
        res.status(500).json({ dbConnected: false, error: error.message });
    }
});

export default router;
