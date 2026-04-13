import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();
const TAPESTRY_BASE_URL = 'https://api.usetapestry.dev/api/v1';
const TAPESTRY_API_KEY = process.env.TAPESTRY_API_KEY || '7ef7d2eb-1c0e-41d7-baaf-06a3fa5fbf49';

/**
 * Biotry Tapestry Proxy v2.1 (Refreshed)
 * 
 * Force-refreshed version to ensure Railway build synchronization.
 * Uses definitive text-level relay to prevent JSON parsing crashes.
 */
router.use(async (req: any, res: any) => {
    try {
        const endpoint = req.path || '';
        
        // Identifier Integrity: Reject truncated addresses containing '...'
        if (endpoint.includes('...')) {
            console.warn(`[PROXY v2.1] Rejected truncated identifier: ${endpoint}`);
            return res.status(400).json({ 
                error: 'Invalid Profile Identifier', 
                details: 'Identifiers containing "..." are truncated and cannot be resolved on the Tapestry network. Use the full Solana public key.'
            });
        }

        // API v1 requires apiKey as a query parameter.
        // We preserve incoming query params and append the apiKey.
        const queryParams = new URLSearchParams(req.query as any);
        queryParams.set('apiKey', TAPESTRY_API_KEY);
        
        const url = `${TAPESTRY_BASE_URL}${req.path}?${queryParams.toString()}`;
        
        console.log(`[PROXY v2.3] Relaying [${req.method}] to: ${url}`);

        const response = await fetch(url, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined
        });

        // Capture raw body to avoid FetchError: invalid json response body
        const rawBody = await response.text();
        
        console.log(`[PROXY v2.1] Upstream Status: ${response.status}`);
        
        // Comprehensive 400-level error logging for protocol debugging
        if (response.status >= 400) {
            console.error(`[PROXY v2.1] Protocol Error from Tapestry:`, {
                status: response.status,
                endpoint: url,
                error: rawBody
            });
        }
        
        // 404 is a valid state for new researchers who haven't synced yet.
        if (response.status === 404) {
            console.log(`[PROXY v2.1] Researcher profile not yet initialized on Tapestry. Expected 404.`);
        }
        
        // Inject version header for verification
        res.set('X-Proxy-Version', '2.1-Sturdy');
        
        // Attempt JSON parse safely for logging, but relay raw body regardless
        try {
            if (rawBody) {
                const data = JSON.parse(rawBody);
                res.status(response.status).json(data);
            } else {
                res.status(response.status).send('');
            }
        } catch (parseErr) {
            console.warn(`[PROXY v2.1] Non-JSON payload detected. Relaying raw response.`);
            res.status(response.status).send(rawBody);
        }
    } catch (error) {
        console.error(`[PROXY v2.1] Fatal relay crash:`, error);
        res.status(502).json({ error: 'Proxy Gateway Failure (v2.1)', details: String(error) });
    }
});

export default router;
