// ─── Configuration ────────────────────────────────────────────────
export const TAPESTRY_API_KEY = '7ef7d2eb-1c0e-41d7-baaf-06a3fa5fbf49';
export const TAPESTRY_NAMESPACE = 'biotry';

// ─── Native REST Implementation ──────────────────────────────────
const TAPESTRY_BASE_URL = 'https://api.usetapestry.dev/v1';

/**
 * Helper to perform authenticated Tapestry API requests.
 */
const tapestryFetch = async (endpoint: string, method: string = 'GET', body?: any) => {
    try {
        const res = await fetch(`${TAPESTRY_BASE_URL}${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TAPESTRY_API_KEY}`
            },
            body: body ? JSON.stringify(body) : undefined
        });
        if (!res.ok) throw new Error(`Tapestry API Error: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error(`[Tapestry] Request failed: ${endpoint}`, err);
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

// ─── Actions ───────────────────────────────────────────────────
export const createPostNode = async (walletAddress: string, postId: string, title: string) => {
    return !!(await tapestryFetch('/contents', 'POST', {
        id: postId,
        profileId: walletAddress,
        properties: [
            { key: 'title', value: title },
            { key: 'author', value: walletAddress },
            { key: 'label', value: 'ResearchPost' }
        ],
    }));
};

export const likePost = async (walletAddress: string, postId: string) => {
    return !!(await tapestryFetch(`/likes/${postId}`, 'POST', { startId: walletAddress }));
};

export const unlikePost = async (walletAddress: string, postId: string) => {
    return !!(await tapestryFetch(`/likes/${postId}/${walletAddress}`, 'DELETE'));
};

// ─── Reputation Engine ──────────────────────────────────────────
export const getResearcherReputation = async (walletAddress: string) => {
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
