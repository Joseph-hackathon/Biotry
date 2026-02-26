import type { Post, Editor, Hub, LeaderboardEntry } from '../types';

export const MOCK_POSTS: Post[] = [
    {
        id: '1',
        author: 'vitalik.eth',
        researchField: 'Bioinformatics',
        type: 'Research',
        title: 'Verifiable Research Graphs: Solving the Peer Review Crisis with ZK-Proofs',
        doi: '10.1038/s41586-024-07153-x',
        abstract: 'Peer review is currently opaque and centralized. We propose a decentralized graph where every citation and review is cryptographically linked to the author\'s expertise weight.',
        content: 'The current scientific publishing model faces a severe trust crisis. By introducing on-chain expertise weights and quadratic funding via Bio Protocol, we can ensure that high-impact research is funded directly by the community. This node details the ZK-circuit logic required for anonymous yet verifiable review submission.',
        upvotes: 42000,
        commentCount: 124,
        createdAt: '2h ago',
        references: ['0x8a...2e1', '0x5e...2f6'],
        topics: ['ZK-Proofs', 'Peer Review', 'Social Graph'],
        license: 'CC-BY',
        versions: [
            { version: 'v1', date: 'Feb 1, 2026', url: '#' },
            { version: 'v2', date: 'Feb 20, 2026', url: '#' }
        ],
        status: 'Published'
    },
    {
        id: '2',
        author: 'ox_critic',
        researchField: 'Genomics',
        type: 'Critique',
        title: 'Critique: Flaws in the "Open Source Genomics" Methodology on Solana',
        doi: '10.1101/2024.02.14.579124',
        abstract: 'Our analysis reveals significant data sampling bias in the recent "Q3 Funding Wave" proposal. We argue for more robust validator selection for genotype sequencing.',
        content: 'While the Bio Foundation\'s latest funding wave is ambitious, the underlying data layer for the genomics pool has significant latency issues. My investigation shows that node distribution is concentrated in only two regions, compromising the "open source" claim.',
        upvotes: 8500,
        commentCount: 56,
        createdAt: '5h ago',
        topics: ['Genomics', 'Open Source', 'Solana'],
        license: 'Apache-2.0',
        status: 'In-Review'
    },
    {
        id: '3',
        author: 'investigative_node_7',
        researchField: 'AI Safety',
        type: 'Investigation',
        title: 'Investigation: Hidden Centralization in Large Language Model Training Clusters',
        abstract: 'A deep-dive into the physical hardware distribution of major AI alignment labs, utilizing Proof-of-Research to verify server locations.',
        content: 'Our latest draft on agent-to-agent negotiation safety is now live on the Biotry social graph. Every citation in this paper is backed by a cryptographic proof of reference. We have uncovered that 3 out of 5 major labs share the same underlying data center infrastructure.',
        upvotes: 18900,
        commentCount: 42,
        createdAt: '8h ago',
        topics: ['AI Safety', 'Hardware', 'Transparency'],
        versions: [{ version: 'v1', date: 'Jan 20, 2026', url: '#' }],
        status: 'In-Review'
    },
    {
        id: '4',
        author: 'biotry_dev',
        researchField: 'Infrastructure',
        type: 'Research',
        title: 'Integrating Verifiable Research Proofs into Social Reputation Systems',
        doi: '10.1145/3543873',
        abstract: 'A formal framework for integrating ZK-level proof of compute into social graph reputation metrics.',
        content: 'We are thrilled to announce Biotry Protocol integration. Researchers can now prove data ownership and computation integrity directly within their social research nodes. This node provides the technical specification for the Proof-of-Research adapter in the Biotry Protocol.',
        upvotes: 3400,
        commentCount: 18,
        createdAt: '12h ago',
        topics: ['Reputation', 'ZK-Proofs', 'Infrastructure'],
        license: 'MIT',
        status: 'Published'
    }
];

export const EDITORIAL_BOARD: Editor[] = [
    {
        id: '1',
        name: 'Ruslan Rust, PhD',
        role: 'Senior Editor',
        institution: 'University of Southern California',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Ruslan'
    },
    {
        id: '2',
        name: 'Attila Karsi, PhD',
        role: 'Senior Editor',
        institution: 'Mississippi State University',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Attila'
    },
    {
        id: '3',
        name: 'Selda Yildiz, PhD',
        role: 'Associate Editor',
        institution: 'Oregon Health & Science University',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Selda'
    },
    {
        id: '4',
        name: 'Scott Nelson, PhD',
        role: 'Associate Editor',
        institution: 'Iowa State University',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Scott'
    },
    {
        id: '5',
        name: 'Qingyu Luo, MD, PhD',
        role: 'Associate Editor',
        institution: 'Harvard University',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Qingyu'
    }
];

export const FEATURED_HUBS: Hub[] = [
    { id: '1', name: 'Bioinformatics', icon: 'Binary', count: 124 },
    { id: '2', name: 'Genomics', icon: 'Microscope', count: 85 },
    { id: '3', name: 'AI Safety', icon: 'ShieldCheck', count: 62 },
    { id: '4', name: 'Neuroscience', icon: 'Activity', count: 45 },
    { id: '5', name: 'Infrastructure', icon: 'Server', count: 38 }
];

export const TOP_CONTRIBUTORS: LeaderboardEntry[] = [
    { id: '1', name: 'vitalik.eth', points: 4200, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=vitalik' },
    { id: '2', name: 'dr_bio', points: 3850, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=dr_bio' },
    { id: '3', name: 'research_ninja', points: 3100, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=ninja' },
    { id: '4', name: 'quant_scie', points: 2900, avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=quant' }
];
