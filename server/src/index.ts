import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabaseRawSQL } from './db';
import postsRouter from './routes/posts';
import metadataRouter from './routes/metadata';
import tapestryRouterV2 from './routes/tapestry_v2';

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
    // Standardize origins to prevent preflight failures
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    // Allow for development and high-integrity environments
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
app.use('/api/tapestry', tapestryRouterV2);
app.use('/api', metadataRouter);

// --- HEALTH CHECK ---
app.get('/health', (req, res) => res.status(200).json({ status: 'OK', timestamp: Date.now() }));

// --- CATCH-ALL 404 HANDLER ---
app.use((req: any, res: any) => {
    try {
        const endpoint = req.path || '';
        res.status(404).json({ error: `Endpoint ${endpoint} not found` });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// --- SERVER INITIALIZATION ---
app.listen(PORT, () => {
    console.log(`[SYSTEM] Biotry Backend Professional listening on port ${PORT}`);
    
    // Background self-healing (non-blocking)
    if (process.env.DATABASE_URL) {
        initializeDatabaseRawSQL().catch(err => console.error('[FATAL] DB Init Failed:', err));
    }
});
