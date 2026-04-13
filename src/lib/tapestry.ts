// ─── Configuration ────────────────────────────────────────────────
const BACKEND_URL = 'https://biotry-production.up.railway.app';
const TAPESTRY_BASE_URL = `${BACKEND_URL}/api/tapestry`;

/**
 * Helper to perform authenticated Tapestry API requests via the Biotry Backend Proxy.
 * This resolves CORS issues for production origins (e.g., Vercel).
 */
const tapestryFetch = async (endpoint: string, method: string = 'GET', body?: any, queryParams?: Record<string, string>) => {
    try {
        // Identifier Integrity: Reject truncated addresses containing '...'
        if (endpoint.includes('...')) {
            console.warn(`[Tapestry] Blocked invalid truncated identifier: ${endpoint}`);
            return null;
        }

        let url = `${TAPESTRY_BASE_URL}${endpoint}`;
        if (queryParams) {
            const searchParams = new URLSearchParams(queryParams);
            url += `?${searchParams.toString()}`;
        }

        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
        });

        // 404 from Tapestry indicates a new user/no profile yet. 
        // We return null to allow getters to handle the fallback.
        if (res.status === 404) return null;

        if (!res.ok) throw new Error(`Tapestry API Error: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.warn(`[Tapestry] Request fallback for ${endpoint}:`, err);
        return null;
    }
};

// ─── Profile Sync ───────────────────────────────────────────────
export const syncResearcherToTapestry = async (
    walletAddress: string,
    metadata: { name: string; bio: string; institution?: string; orcid?: string; field?: string; }
) => {
    return !!(await tapestryFetch('/profiles', 'POST', {
        username: metadata.name,
        walletAddress,
        bio: metadata.bio,
        image: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${walletAddress}`,
        properties: [
            ...(metadata.institution ? [{ key: 'institution', value: metadata.institution }] : []),
            ...(metadata.orcid ? [{ key: 'orcid', value: metadata.orcid }] : []),
            ...(metadata.field ? [{ key: 'researchField', value: metadata.field }] : []),
            { key: 'version', value: '1.0' },
        ],
    }));
};

// ─── Follow / Unfollow ──────────────────────────────────────────
export const followUser = async (followerAddress: string, followeeAddress: string) => {
    return !!(await tapestryFetch('/followers', 'POST', {
        startId: followerAddress,
        endId: followeeAddress,
    }));
};

export const unfollowUser = async (followerAddress: string, followeeAddress: string) => {
    return !!(await tapestryFetch(`/followers/${followerAddress}/${followeeAddress}`, 'DELETE'));
};

export const getFollowers = async (walletAddress: string): Promise<string[]> => {
    const res = await tapestryFetch(`/profiles/${walletAddress}/followers`);
    return res?.followers?.map((f: any) => f.profile?.id || f.id) ?? [];
};

export const getFollowing = async (walletAddress: string): Promise<string[]> => {
    const res = await tapestryFetch(`/profiles/${walletAddress}/following`);
    return res?.following?.map((f: any) => f.profile?.id || f.id) ?? [];
};

// ─── Profile Management ──────────────────────────────────────────

export const ensureTapestryProfile = async (walletAddress: string) => {
    try {
        // Tapestry v1 requires a 'username' for profile initialization.
        // We also explicitly define the blockchain for proper indexing.
        const res = await tapestryFetch('/profiles/findOrCreate', 'POST', {
            id: walletAddress,
            username: walletAddress,
            blockchain: 'SOLANA',
            execution: 'FAST_UNCONFIRMED'
        });
        return !!res;
    } catch (err) {
        console.warn(`[Tapestry] Profile sync error for ${walletAddress}:`, err);
        return false;
    }
};

// ─── Metadata & Aggregation ──────────────────────────────────────

export const getNetworkStats = async () => {
    try {
        const [profiles, contents] = await Promise.all([
            tapestryFetch('/profiles', 'GET'),
            tapestryFetch('/contents', 'GET')
        ]);
        return {
            scientistCount: profiles?.totalCount || 0,
            nodeCount: contents?.totalCount || 0
        };
    } catch (err) {
        console.warn('[Tapestry] Global stats fetch error:', err);
        return { scientistCount: 0, nodeCount: 0 };
    }
};

export const getContentStats = async (postId: string) => {
    try {
        const res = await tapestryFetch(`/contents/${postId}`, 'GET');
        return {
            upvotes: res?.socialCounts?.likeCount || 0,
            comments: res?.socialCounts?.commentCount || 0
        };
    } catch (err) {
        console.warn(`[Tapestry] Stats fetch error for node ${postId}:`, err);
        return null;
    }
};

export const fetchComments = async (nodeId: string) => {
    try {
        const res = await tapestryFetch('/comments', 'GET', undefined, { contentId: nodeId });
        return res?.comments || [];
    } catch (err) {
        console.warn(`[Tapestry] Comment fetch error for node ${nodeId}:`, err);
        return [];
    }
};

export const postComment = async (walletAddress: string, nodeId: string, text: string) => {
    try {
        // Step 1: Guarantee author presence
        await ensureTapestryProfile(walletAddress);

        // Step 2: Just-In-Time Registration of the target node
        // This prevents 500 errors if commenting on a node that hasn't been liked yet.
        await createPostNode(walletAddress, nodeId, "Research Node");

        // Step 3: Anchor professional commentary
        const res = await tapestryFetch('/comments', 'POST', {
            profileId: walletAddress,
            contentId: nodeId,
            text,
            execution: 'FAST_UNCONFIRMED',
            properties: [
                { key: 'label', value: 'ScientificCommentary' },
                { key: 'network', value: 'Biotry' }
            ]
        });
        return !!res;
    } catch (err) {
        console.warn('[Tapestry] Comment anchoring rejected:', err);
        return false;
    }
};

// ─── Actions ───────────────────────────────────────────────────

export const createPostNode = async (walletAddress: string, postId: string, title: string) => {
    try {
        // Step 1: Guarantee author presence on graph
        await ensureTapestryProfile(walletAddress);

        // Step 2: Anchoring content node
        return !!(await tapestryFetch('/contents/findOrCreate', 'POST', {
            id: postId,
            profileId: walletAddress,
            content: title,
            contentType: 'text',
            blockchain: 'SOLANA',
            execution: 'FAST_UNCONFIRMED',
            properties: [
                { key: 'title', value: title || 'Research Node' },
                { key: 'author', value: walletAddress },
                { key: 'label', value: 'ResearchPost' }
            ],
        }));
    } catch (err) {
         console.warn(`[Tapestry] Content registration rejected:`, err);
         return false;
    }
};

export const likePost = async (walletAddress: string, postId: string, title?: string) => {
    try {
        // Step 1: Guarantee liker presence on graph
        await ensureTapestryProfile(walletAddress);

        // Step 2: Just-In-Time Registration of the target node
        await createPostNode(walletAddress, postId, title || 'Research Node');
        
        // Step 3: Atomic Like interaction
        const res = await tapestryFetch(`/likes/${postId}`, 'POST', { 
            startId: walletAddress,
            blockchain: 'SOLANA',
            execution: 'FAST_UNCONFIRMED'
        });
        return !!res;
    } catch (err) {
        console.warn(`[Tapestry] Interaction error for node ${postId}:`, err);
        return false;
    }
};

export const unlikePost = async (walletAddress: string, postId: string) => {
    return !!(await tapestryFetch(`/likes/${postId}/${walletAddress}`, 'DELETE'));
};

// ─── Reputation Engine ──────────────────────────────────────────
export const getResearcherReputation = async (walletAddress: string) => {
    // Identifier Integrity: Return Genesis defaults for truncated addresses
    if (!walletAddress || walletAddress.includes('...')) {
        return { score: 20, badges: [{ id: 'early_adopter', label: 'Genesis_Node', color: 'text-green-400' }], followerCount: 0 };
    }

    try {
        const [followers, following] = await Promise.all([
            getFollowers(walletAddress),
            getFollowing(walletAddress)
        ]);
        
        const baseScore = Math.min(100, (followers.length * 10) + (following.length * 2) + 20);
        const badges: Array<{ id: string; label: string; color: string }> = [];
        
        if (followers.length > 5) badges.push({ id: 'top_researcher', label: 'Top_Cited', color: 'text-purple-400' });
        if (walletAddress.startsWith('2BY4')) badges.push({ id: 'verified_academic', label: 'Verified_Hub', color: 'text-blue-400' });
        badges.push({ id: 'early_adopter', label: 'Genesis_Node', color: 'text-green-400' });

        return { score: baseScore, badges, followerCount: followers.length };
    } catch (err) {
        return { score: 20, badges: [{ id: 'early_adopter', label: 'Genesis_Node', color: 'text-green-400' }], followerCount: 0 };
    }
};
