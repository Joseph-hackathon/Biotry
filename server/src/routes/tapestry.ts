import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();
const TAPESTRY_BASE_URL = 'https://api.usetapestry.dev/v1';
const TAPESTRY_API_KEY = process.env.TAPESTRY_API_KEY || '7ef7d2eb-1c0e-41d7-baaf-06a3fa5fbf49';

/**
 * Catch-all proxy for Tapestry API requests.
 * Relays requests to api.usetapestry.dev with the API key injected.
 */
router.use(async (req: any, res: any) => {
    try {
        const endpoint = req.path || '';
        const url = `${TAPESTRY_BASE_URL}${endpoint}`;
        
        console.log(`[PROXY] Relaying ${req.method} to Tapestry: ${endpoint}`);

        const response = await fetch(url, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TAPESTRY_API_KEY}`
            },
            body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined
        });

        const rawText = await response.text();
        let data;
        try {
            data = rawText ? JSON.parse(rawText) : {};
        } catch (parseErr) {
            console.warn(`[PROXY WARNING] Tapestry returned non-JSON response. Serving raw text.`);
            return res.status(response.status).send(rawText);
        }

        res.status(response.status).json(data);
    } catch (error) {
        console.error(`[PROXY ERROR] Tapestry relay failed:`, error);
        res.status(502).json({ error: 'Tapestry Gateway Error', details: String(error) });
    }
});

export default router;
