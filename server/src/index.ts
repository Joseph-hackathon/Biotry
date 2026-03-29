import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['https://biotry.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// --- POSTS ---
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { timestamp: 'desc' }
    });
    // Serialize BigInt to String for JSON
    const serializedPosts = posts.map(post => ({
      ...post,
      timestamp: Number(post.timestamp)
    }));
    res.json(serializedPosts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
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

app.listen(PORT, () => {
  console.log(`Biotry Backend running on port ${PORT}`);
});
