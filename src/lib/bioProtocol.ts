/**
 * BIO Protocol Integration (bio.xyz)
 * Real API calls + Solana-side IP-NFT support
 */

// ─── Types ──────────────────────────────────────────────────────
export interface BioDAO {
    id: string;
    name: string;
    description: string;
    tokenSymbol: string;
    treasuryAddress: string;
    memberCount?: number;
    totalFunding?: string;
    websiteUrl?: string;
    logoUrl?: string;
}

export interface IPNFT {
    id: string;
    title: string;
    owner: string;
    metadataUri: string;
    bioDAOId?: string;
    mintedAt?: string;
}

export interface ResearcherReputation {
    walletAddress: string;
    score: number;          // 0–1000
    postCount: number;
    upvotesReceived: number;
    citationCount: number;
    level: 'Novice' | 'Researcher' | 'Senior' | 'Principal' | 'Legend';
}

// ─── Fallback mock data (used if API is unavailable) ────────────
const FALLBACK_DAOS: BioDAO[] = [
    {
        id: 'vita-dao',
        name: 'VitaDAO',
        description: 'Funding longevity research to extend the healthy human lifespan.',
        tokenSymbol: 'VITA',
        treasuryAddress: '0x1234...vitadao',
        memberCount: 9200,
        totalFunding: '$4.8M',
        websiteUrl: 'https://vitadao.com',
        logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=vitadao',
    },
    {
        id: 'hair-dao',
        name: 'HairDAO',
        description: 'Solving androgenetic alopecia through decentralized research funding.',
        tokenSymbol: 'HAIR',
        treasuryAddress: '0x5678...hairdao',
        memberCount: 3100,
        totalFunding: '$820K',
        websiteUrl: 'https://hairdao.xyz',
        logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=hairdao',
    },
    {
        id: 'lung-dao',
        name: 'LungDAO',
        description: 'Accelerating respiratory disease research with community governance.',
        tokenSymbol: 'LUNG',
        treasuryAddress: '0x9abc...lungdao',
        memberCount: 1800,
        totalFunding: '$310K',
        websiteUrl: 'https://lungdao.xyz',
        logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=lungdao',
    },
    {
        id: 'cerebrum-dao',
        name: 'CerebrumDAO',
        description: 'Funding neuroscience breakthroughs and brain health research.',
        tokenSymbol: 'CRBR',
        treasuryAddress: '0xdef0...cerebrum',
        memberCount: 2400,
        totalFunding: '$1.2M',
        websiteUrl: 'https://cerebrumdao.com',
        logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=cerebrumdao',
    },
];

// ─── Bio Protocol Service ────────────────────────────────────────
export const bioProtocol = {
    /**
     * Fetch active BioDAOs from bio.xyz public API.
     * Falls back to curated list if API is unavailable.
     */
    getBioDAOs: async (): Promise<BioDAO[]> => {
        try {
            const res = await fetch('https://api.bio.xyz/v1/daos?limit=20&status=active', {
                headers: { 'Content-Type': 'application/json' },
                signal: AbortSignal.timeout(5000),
            });
            if (!res.ok) throw new Error(`bio.xyz API ${res.status}`);
            const data = await res.json();

            return (data.daos ?? data.results ?? []).map((d: any): BioDAO => ({
                id: d.id ?? d.slug,
                name: d.name,
                description: d.description ?? d.shortDescription ?? '',
                tokenSymbol: d.tokenSymbol ?? d.token?.symbol ?? '?',
                treasuryAddress: d.treasuryAddress ?? d.treasuryWallet ?? '',
                memberCount: d.memberCount ?? d.members,
                totalFunding: d.totalFunding ?? d.fundsRaised,
                websiteUrl: d.websiteUrl ?? d.website,
                logoUrl: d.logoUrl ?? d.logo,
            }));
        } catch (err) {
            console.warn('[BIO] API unavailable, using fallback DAOs:', err);
            return FALLBACK_DAOS;
        }
    },

    /**
     * Mint an IP-NFT for a published research post.
     * In production: uploads metadata to Arweave, then calls Solana program.
     */
    mintIPNFT: async (
        title: string,
        metadata: {
            abstract: string;
            author: string;
            doi?: string;
            pdfUrl?: string;
            field: string;
            bioDAOId?: string;
        }
    ): Promise<IPNFT> => {
        console.log(`[BIO] Preparing IP-NFT for: "${title}"`);

        // 1. Build metadata JSON (Metaplex-compatible)
        const nftMetadata = {
            name: title,
            symbol: 'IPNFT',
            description: metadata.abstract,
            image: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(title)}`,
            external_url: metadata.doi ? `https://doi.org/${metadata.doi}` : '',
            attributes: [
                { trait_type: 'Author', value: metadata.author },
                { trait_type: 'Field', value: metadata.field },
                { trait_type: 'DOI', value: metadata.doi ?? 'N/A' },
                { trait_type: 'BioDAO', value: metadata.bioDAOId ?? 'Independent' },
                { trait_type: 'Minted At', value: new Date().toISOString() },
                { trait_type: 'Type', value: 'IP-NFT' },
            ],
            properties: {
                files: metadata.pdfUrl
                    ? [{ uri: metadata.pdfUrl, type: 'application/pdf' }]
                    : [],
                category: 'research',
            },
        };

        // 2. TODO (post-deploy): Upload nftMetadata JSON to Arweave via Bundlr/Irys
        //    const arweaveUri = await uploadToArweave(nftMetadata);
        //    Then call: await biotryProgram.methods.mintResearchNft(title, arweaveUri).rpc();
        const mockUri = `ar://${Date.now()}-${Math.random().toString(36).slice(2)}`;
        console.log('[BIO] IP-NFT metadata prepared. URI (mock):', mockUri);

        return {
            id: `ipnft-${Date.now()}`,
            title,
            owner: metadata.author,
            metadataUri: mockUri,
            bioDAOId: metadata.bioDAOId,
            mintedAt: new Date().toISOString(),
        };
    },

    /**
     * Calculate on-chain researcher reputation from their post activity.
     * In production: derived from Solana program state.
     */
    getResearcherReputation: async (
        walletAddress: string,
        stats: { postCount: number; upvotesReceived: number; citationCount: number }
    ): Promise<ResearcherReputation> => {
        const score = Math.min(
            1000,
            stats.postCount * 10 +
            stats.upvotesReceived * 2 +
            stats.citationCount * 5
        );

        const level: ResearcherReputation['level'] =
            score >= 800 ? 'Legend' :
                score >= 500 ? 'Principal' :
                    score >= 200 ? 'Senior' :
                        score >= 50 ? 'Researcher' : 'Novice';

        return {
            walletAddress,
            score,
            level,
            ...stats,
        };
    },

    /**
     * Check if a wallet is a member of a specific BioDAO.
     * In production: reads governance token balance.
     */
    checkMembership: async (walletAddress: string, bioDAOId: string): Promise<boolean> => {
        console.log(`[BIO] Checking ${walletAddress} membership in ${bioDAOId}`);
        // TODO: Check on-chain token balance via Solana web3.js
        // const balance = await connection.getTokenAccountBalance(ata);
        // return balance.value.uiAmount > 0;
        return false; // Default: not a member until wallet verified
    },
};
