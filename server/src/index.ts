import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabaseRawSQL } from './db';
import postsRouter from './routes/posts';
import metadataRouter from './routes/metadata';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- CORS CONFIGURATION ---
const allowedOrigins = [
  'https://biotry.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); 
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-UMBRA-STEALTH', 'x-umbra-stealth'],
  exposedHeaders: ['X-UMBRA-STEALTH'],
  credentials: true
}));

app.use(express.json());

// --- ROUTES ---
app.use('/api/posts', postsRouter);
app.use('/api', metadataRouter);

// --- SERVER INITIALIZATION ---
app.listen(PORT, async () => {
    console.log(`[SYSTEM] Biotry Backend Professional listening on port ${PORT}`);
    
    // Self-healing database initialization (Prisma + Raw SQL)
    if (process.env.DATABASE_URL) {
        await initializeDatabaseRawSQL();
    }
});
