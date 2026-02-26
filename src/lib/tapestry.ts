import { SocialFi } from 'socialfi';

// ─── Configuration ────────────────────────────────────────────────
export const TAPESTRY_API_KEY = '7ef7d2eb-1c0e-41d7-baaf-06a3fa5fbf49';
export const TAPESTRY_NAMESPACE = 'biotry';

export const tapestry = new SocialFi({
    headers: { 'Authorization': `Bearer ${TAPESTRY_API_KEY}` }
});

// ─── Profile Sync ───────────────────────────────────────────────
/**
 * Create or update a researcher's Tapestry social profile.
 */
export const syncResearcherToTapestry = async (
    walletAddress: string,
    metadata: {
        name: string;
        bio: string;
        institution?: string;
        orcid?: string;
        field?: string;
    }
) => {
    try {
        await tapestry.profiles.profilesCreate(
            { apiKey: TAPESTRY_API_KEY },
            {
                walletAddress,
                namespace: TAPESTRY_NAMESPACE,
                name: metadata.name,
                bio: metadata.bio,
                image: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${walletAddress}`,
                properties: [
                    ...(metadata.institution ? [{ key: 'institution', value: metadata.institution }] : []),
                    ...(metadata.orcid ? [{ key: 'orcid', value: metadata.orcid }] : []),
                    ...(metadata.field ? [{ key: 'researchField', value: metadata.field }] : []),
                    { key: 'version', value: '1.0' },
                ],
            }
        );
        console.log(`[Tapestry] Profile synced: ${walletAddress}`);
        return true;
    } catch (err) {
        console.error('[Tapestry] Profile sync failed:', err);
        return false;
    }
};

// ─── Follow / Unfollow ──────────────────────────────────────────
/**
 * Follow another researcher on the Tapestry social graph.
 */
export const followUser = async (followerAddress: string, followeeAddress: string) => {
    try {
        await tapestry.follows.followsCreate(
            { apiKey: TAPESTRY_API_KEY },
            {
                startId: followerAddress,
                endId: followeeAddress,
                namespace: TAPESTRY_NAMESPACE,
            }
        );
        console.log(`[Tapestry] ${followerAddress} → followed → ${followeeAddress}`);
        return true;
    } catch (err) {
        console.error('[Tapestry] Follow failed:', err);
        return false;
    }
};

/**
 * Unfollow a researcher on the Tapestry social graph.
 */
export const unfollowUser = async (followerAddress: string, followeeAddress: string) => {
    try {
        await tapestry.follows.followsDelete(
            { apiKey: TAPESTRY_API_KEY },
            {
                startId: followerAddress,
                endId: followeeAddress,
                namespace: TAPESTRY_NAMESPACE,
            }
        );
        console.log(`[Tapestry] ${followerAddress} → unfollowed → ${followeeAddress}`);
        return true;
    } catch (err) {
        console.error('[Tapestry] Unfollow failed:', err);
        return false;
    }
};

/**
 * Get the list of followers for a researcher.
 */
export const getFollowers = async (walletAddress: string): Promise<string[]> => {
    try {
        const res = await tapestry.follows.followsGetFollowers({
            apiKey: TAPESTRY_API_KEY,
            id: walletAddress,
            namespace: TAPESTRY_NAMESPACE,
        });
        return (res as any)?.followers?.map((f: any) => f.id) ?? [];
    } catch (err) {
        console.error('[Tapestry] getFollowers failed:', err);
        return [];
    }
};

/**
 * Get the list of accounts a researcher is following.
 */
export const getFollowing = async (walletAddress: string): Promise<string[]> => {
    try {
        const res = await tapestry.follows.followsGetFollowing({
            apiKey: TAPESTRY_API_KEY,
            id: walletAddress,
            namespace: TAPESTRY_NAMESPACE,
        });
        return (res as any)?.following?.map((f: any) => f.id) ?? [];
    } catch (err) {
        console.error('[Tapestry] getFollowing failed:', err);
        return [];
    }
};

// ─── Post Node ──────────────────────────────────────────────────
/**
 * Register a research post as a node in the Tapestry social graph.
 * Links the author to the post via a "published" edge.
 */
export const createPostNode = async (
    walletAddress: string,
    postId: string,
    title: string
) => {
    try {
        await tapestry.nodes.nodesCreate(
            { apiKey: TAPESTRY_API_KEY },
            {
                id: postId,
                namespace: TAPESTRY_NAMESPACE,
                label: 'ResearchPost',
                properties: [
                    { key: 'title', value: title },
                    { key: 'author', value: walletAddress },
                    { key: 'createdAt', value: new Date().toISOString() },
                ],
            }
        );
        // Create "published" edge: author → post
        await tapestry.edges.edgesCreate(
            { apiKey: TAPESTRY_API_KEY },
            {
                startId: walletAddress,
                endId: postId,
                label: 'PUBLISHED',
                namespace: TAPESTRY_NAMESPACE,
            }
        );
        console.log(`[Tapestry] Post node created: ${postId}`);
        return true;
    } catch (err) {
        console.error('[Tapestry] createPostNode failed:', err);
        return false;
    }
};

// ─── Comment Node ────────────────────────────────────────────────
/**
 * Register a comment as a node in the Tapestry social graph.
 * Links: author →COMMENTED_ON→ post
 */
export const createCommentNode = async (
    walletAddress: string,
    postId: string,
    commentId: string,
    content: string
) => {
    try {
        await tapestry.nodes.nodesCreate(
            { apiKey: TAPESTRY_API_KEY },
            {
                id: commentId,
                namespace: TAPESTRY_NAMESPACE,
                label: 'Comment',
                properties: [
                    { key: 'content', value: content.slice(0, 280) },
                    { key: 'author', value: walletAddress },
                    { key: 'postId', value: postId },
                    { key: 'createdAt', value: new Date().toISOString() },
                ],
            }
        );
        await tapestry.edges.edgesCreate(
            { apiKey: TAPESTRY_API_KEY },
            {
                startId: walletAddress,
                endId: postId,
                label: 'COMMENTED_ON',
                namespace: TAPESTRY_NAMESPACE,
            }
        );
        console.log(`[Tapestry] Comment node created: ${commentId}`);
        return true;
    } catch (err) {
        console.error('[Tapestry] createCommentNode failed:', err);
        return false;
    }
};

// ─── Like (existing, re-exported cleanly) ───────────────────────
export const likePost = async (walletAddress: string, postId: string) => {
    try {
        await tapestry.likes.likesCreate(
            { nodeId: postId, apiKey: TAPESTRY_API_KEY },
            { startId: walletAddress }
        );
        console.log(`[Tapestry] Like created: ${walletAddress} → ${postId}`);
        return true;
    } catch (err) {
        console.warn('[Tapestry] Like failed:', err);
        return false;
    }
};

export const unlikePost = async (walletAddress: string, postId: string) => {
    try {
        await tapestry.likes.likesDelete(
            { nodeId: postId, apiKey: TAPESTRY_API_KEY },
            { startId: walletAddress }
        );
        return true;
    } catch (err) {
        console.warn('[Tapestry] Unlike failed:', err);
        return false;
    }
};
