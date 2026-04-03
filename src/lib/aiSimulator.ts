import { Post } from '../types';

export interface SimulationStep {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    icon?: string;
}

export interface SimulationResult {
    successRate: number;
    impactScore: number;
    crowdednessScore: 'Low' | 'Medium' | 'High';
    actionabilityIndex: number;
    timeToMarket: string;
    keyInsight: string;
    hurdles: string[];
    simulationScript: string[];
    marketLandscape: string;
    concreteProblem: string;
    quantifiedImpact: string;
    revenueModel: string;
    gtmStrategy: string;
    whySolana: string;
    founderMarketFit: string;
    risks: {
        technical: string;
        regulatory: string;
        market: string;
        execution: string;
    };
}

export interface AgentReport {
    agentName: string;
    specialization: string;
    status: 'analyzing' | 'completed' | 'warning';
    feedback: string;
    scientificGap?: 'Full' | 'Partial' | 'False';
    toolUsed?: string;
}

export interface ResearchAnalysis {
    title: string;
    researchField: string;
    summary: string;
    agentReports: AgentReport[];
    steps: SimulationStep[];
    result: SimulationResult;
}

interface ColosseumProject {
    name: string;
    slug: string;
    description: string;
    hackathon: { name: string; slug: string };
    score?: number;
}

const fetchColosseumStrategicAnalysis = async (query: string): Promise<{ projects: ColosseumProject[], archives: any[] }> => {
    const apiBase = '/api-colosseum/api/v1';
    const pat = import.meta.env.VITE_COLOSSEUM_COPILOT_PAT;

    if (!pat) {
        console.warn('Colosseum Copilot credentials not found.');
        return { projects: [], archives: [] };
    }

    try {
        const projectRes = await fetch(`${apiBase}/search/projects`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${pat}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, limit: 5 })
        });
        const projectData = projectRes.ok ? await projectRes.json() : { results: [] };

        const archiveRes = await fetch(`${apiBase}/search/archives`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${pat}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, limit: 3 })
        });
        const archiveData = archiveRes.ok ? await archiveRes.json() : { results: [] };

        return { projects: projectData.results || [], archives: archiveData.results || [] };
    } catch (error) {
        console.error('Colosseum Copilot API Error:', error);
        return { projects: [], archives: [] };
    }
};

const extractKeywords = (post: Post): string[] => {
    const text = `${post.title} ${post.abstract || ''} ${post.topics?.join(' ') || ''}`.toLowerCase();
    const techKeywords = [
        'blockchain', 'zk', 'zero-knowledge', 'dao', 'defi', 'solana', 'anchor',
        'did', 'decentralized', 'smart contract', 'nft', 'privacy', 'cryptography',
        'ai', 'machine learning', 'federated learning', 'homomorphic', 'mpc',
        'genomics', 'proteomics', 'drug discovery', 'clinical trial', 'rna', 'crispr'
    ];
    return techKeywords.filter(kw => text.includes(kw));
};

// Use VITE_API_URL for production (Railway/Vercel), fallback to local for dev
const API_BASE = import.meta.env.VITE_API_URL || '';

export const analyzeResearchForSimulation = async (
    post: Post,
    leadAgent?: string,
    signature?: string
): Promise<ResearchAnalysis> => {
    // 1. Try to fetch from the x402-protected Backend for 'Pay-per-Call' Audit
    if (post.id) {
        try {
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (signature) headers['X-PAYMENT-SIGNATURE'] = signature;

            const backendRes = await fetch(`${API_BASE}/api/posts/${post.id}/audit`, { headers });
            
            if (backendRes.status === 402) {
                // x402 Challenge detected!
                const paymentInfo = backendRes.headers.get('PAYMENT-REQUIRED');
                throw { status: 402, paymentInfo, message: 'Strategic audit requires a 0.1 USDC micropayment.' };
            }

            if (backendRes.ok) {
                const auditData = await backendRes.json();
                // Merge backend precise metrics with simulation logic
                const analysis = await generateSimulationResult(post, leadAgent, auditData);
                return analysis;
            }
        } catch (error: any) {
            if (error.status === 402) throw error;
            console.error('Backend Audit Fetch Error (Falling back to local sim):', error);
        }
    }

    // 2. Fallback to local simulation (un-monetized prototype)
    return generateSimulationResult(post, leadAgent);
};

const generateSimulationResult = async (post: Post, leadAgent?: string, auditData?: any): Promise<ResearchAnalysis> => {
    const colosseumContext = await fetchColosseumStrategicAnalysis(post.abstract || post.title);

    const hasCompetitors = colosseumContext.projects.length > 0;
    const hasArchives = colosseumContext.archives.length > 0;
    const keywords = extractKeywords(post);
    const field = post.researchField || 'Life Science';
    const topicList = post.topics?.join(', ') || field;
    const shortAbstract = (post.abstract || post.title).slice(0, 150);

    const baseSuccess = hasCompetitors ? 65 : 85;
    const successRate = parseFloat(Math.min(98, baseSuccess + (Math.random() * 10)).toFixed(2));
    const impactScore = parseFloat(Math.min(99, (hasArchives ? 80 : 60) + (Math.random() * 20)).toFixed(2));
    const actionabilityIndex = parseFloat((hasCompetitors ? 70 : 92 + (Math.random() * 5)).toFixed(2));
    const hasPrivacy = keywords.some(k => ['privacy', 'zk', 'zero-knowledge', 'mpc', 'homomorphic'].includes(k));

    const agentReports: AgentReport[] = [
        {
            agentName: 'Dr. Bio',
            specialization: 'DeSci Auditor',
            status: 'completed',
            feedback: hasArchives
                ? `Scientific audit of "${post.title}" complete. Conceptual precedents found (referencing "${colosseumContext.archives[0]?.title || 'prior DeSci work'}"). The methodology falls into a "Partial Gap" — the science is sound, but the specific on-chain integration in ${field} is novel. This reduces execution risk while preserving a strong scientific wedge.`
                : `No direct precedents found for "${post.title}" in current archives. The research represents a "Full Gap" opportunity in ${field}. Key identified technologies: ${keywords.slice(0, 3).join(', ') || 'novel methodology'}. This is pioneering work with high risk and high reward.`,
            scientificGap: hasArchives ? 'Partial' : 'Full',
            toolUsed: 'Archive-Scan'
        },
        {
            agentName: 'Solana Architect',
            specialization: 'Tenequm Expert',
            status: 'completed',
            feedback: `Architecture analysis of "${post.title}" reveals strong on-chain compatibility. The research methodology around "${shortAbstract}..." maps well to a PDA-based state model on Solana. Topics [${topicList}] can be efficiently compressed using Light Protocol v1. 400ms finality ensures atomic time-stamping of discoveries in ${field}.`,
            toolUsed: 'Anchor-Valid'
        },
        {
            agentName: 'ZK Shadow',
            specialization: 'Light Protocol',
            status: hasPrivacy ? 'completed' : 'warning',
            feedback: hasPrivacy
                ? `Strong privacy alignment detected in "${post.title}". The ${keywords.filter(k => ['zk', 'zero-knowledge', 'mpc', 'did'].includes(k)).join('/')} approach maps directly to a ZK-compression wedge. Recommending Groth16 proof system for the data verification layer described in this research.`
                : `Privacy considerations for "${post.title}" should be addressed. The current ${field} research does not explicitly detail ZK-proof integration. Recommend adding a ZK-layer for sensitive data before on-chain publication.`,
            toolUsed: 'Light-V1'
        },
        {
            agentName: 'Codama Bot',
            specialization: 'IDL Specialist',
            status: 'completed',
            feedback: `IDL schema for "${post.title}" is generatable from the described data model. The ${topicList} structures can be rendered as fully typed Kinobi clients. Estimated SDK generation: 2-3 days for a TypeScript client compatible with web3.js v2.`,
            toolUsed: 'Codama-Render'
        },
        {
            agentName: 'Colosseum Strategist',
            specialization: 'Investment Analyst',
            status: 'completed',
            feedback: hasCompetitors
                ? `Found ${colosseumContext.projects.length} related projects in hackathon history. However, the ${field} wedge in "${post.title}" is unique in its approach to [${topicList}]. Competitors lack deep vertical integration into on-chain scientific auditability for this domain. Actionability index: high — 10x transparency improvement is achievable.`
                : `Zero competing builder projects found for "${post.title}" in ${field}. This is a rare First-Mover Wedge — the specific combination of [${topicList}] on Solana has no hackathon precedent. You are targeting a genuine scientific gap with zero direct competition.`,
            scientificGap: hasCompetitors ? 'False' : 'Full',
            toolUsed: 'Copilot-8Step'
        }
    ];

    return {
        title: post.title,
        researchField: field,
        summary: post.abstract?.slice(0, 300) || `Strategic verification of "${post.title}" targeting a novel wedge in the ${field} landscape.`,
        agentReports,
        steps: [
            { id: 'data-ingestion', title: 'LANDSCAPE SCAN', description: `Scanning for ${field} builders across ${colosseumContext.projects.length} hackathon projects...`, status: 'completed' },
            { id: 'modeling', title: 'GAP CLASSIFICATION', description: `Classifying ${hasArchives ? 'Partial' : 'Full'} scientific gap in [${topicList}].`, status: 'completed' },
            { id: 'scenario-run', title: 'STRATEGIC RANKING', description: `Actionability Index: ${auditData?.metrics?.actionability || actionabilityIndex}%`, status: 'completed' },
            { id: 'validation', title: 'OUTCOME SIMULATION', description: 'Consensus synthesis finalized.', status: 'completed' }
        ],
        result: {
            successRate,
            impactScore: auditData?.metrics?.impactScore || impactScore,
            crowdednessScore: auditData?.metrics?.crowdedness || (hasCompetitors ? 'Medium' : 'Low'),
            actionabilityIndex: auditData?.metrics?.actionability || actionabilityIndex,
            timeToMarket: auditData?.metrics?.timeToMarket || (hasCompetitors ? '1.2 Years' : '1.8 Years'),
            keyInsight: hasCompetitors
                ? `Strategic differentiation is key for "${post.title}". While ${colosseumContext.projects[0]?.name || 'similar projects'} exist, they lack deep ${field}-specific on-chain auditability. The Atomic Wedge is the unique combination of ${keywords.slice(0, 2).join(' + ') || 'the proposed methodology'} with Solana's architecture.`
                : `"${post.title}" is an unprecedented opportunity in ${field} with zero direct hackathon competition. Establish a data-moat via early on-chain scientific attestations in [${topicList}] before incumbents pivot to this niche.`,
            hurdles: [
                `Regulatory alignment for on-chain ${field} data across international jurisdictions`,
                `Scaling proof generation for high-frequency ${topicList} data attestations`,
                `Adoption of embedded wallet solutions among non-technical ${field} researchers`
            ],
            simulationScript: [
                'init_colosseum_scan()',
                `map_${field.toLowerCase().replace(/[\s/]+/g, '_')}_gap()`,
                'run_wedge_analysis()',
                'finalize_consensus()'
            ],
            marketLandscape: hasCompetitors
                ? `The ${field} market shows ${colosseumContext.projects.length} existing Solana projects (notably ${colosseumContext.projects[0]?.name}). These focus on general data storage without ${field}-specific optimization. "${post.title}" targets a $2-3B underserved gap in specialized scientific auditing for [${topicList}].`
                : `Blue Ocean scenario for "${post.title}". No builder history exists for this concept in ${field} on Solana. The specific methodology of [${topicList}] applied to on-chain validation is entirely novel, creating 100% first-mover awareness potential.`,
            concreteProblem: `Current ${field} research validation — including work like "${post.title}" — relies on non-transparent, centralized peer-review. The topics covered [${topicList}] lack trustless verification mechanisms. This research directly addresses the reproducibility crisis: ~50% of published ${field} studies cannot be independently verified due to data opacity and centralized control.`,
            quantifiedImpact: `Applying the on-chain audit methodology from "${post.title}" on Solana reduces attestation costs from ~$5.00 to under $0.001 — a 5000x reduction. For ${field} research covering [${topicList}], this enables continuous integrity checks and increases reproducibility from ~50% to over 90%. Research velocity improves 5-10x as scientists can instantly build on trustless on-chain validated results.`,
            revenueModel: `The methodology in "${post.title}" enables a Science-as-a-Service protocol: sub-cent fees per data attestation for ${topicList} datasets, plus commissions on IP-NFT fractionalization of ${field} discoveries. Projected protocol fees from verified research streams create a sustainable loop independent of VC funding.`,
            gtmStrategy: `Phase 1: Partner with 3-5 leading ${field} labs to onboard datasets from work similar to "${post.title}". Phase 2: Launch referral loops for junior researchers via embedded wallet kits targeting [${topicList}] users. Phase 3: Integrate with academic archives to auto-index and verify new ${field} papers on-chain as they are published.`,
            whySolana: `Solana's 400ms finality and sub-cent fees are uniquely suited for the high-frequency data attestations required in ${field} research like "${post.title}". Anchor and Codama provide type-safe SDKs compatible with Python tools used in [${topicList}] workflows. No other L1 offers the cost/performance profile needed for real-time scientific data integrity at this scale.`,
            founderMarketFit: `Strongest for researchers with direct ${field} expertise and Solana/Rust development depth. "${post.title}" demonstrates strong technical foundation — the primary execution challenge is scientific community adoption of on-chain verification workflows, not technical delivery.`,
            risks: {
                technical: `Low-to-Medium — The ${keywords.slice(0, 2).join('/') || 'proposed'} architecture is technically feasible but requires ${field}-specific optimization.`,
                regulatory: `Medium — ${field} research data is subject to strict regulations (HIPAA, GDPR equivalents) that must be addressed in the on-chain data model.`,
                market: hasCompetitors ? `Medium — ${colosseumContext.projects.length} incumbents may pivot to the ${field} niche.` : `Low — Blue ocean in ${field} with no direct on-chain competition currently.`,
                execution: `Low — The methodology in "${post.title}" is well-defined. Primary challenge is academic community adoption of on-chain verification workflows.`
            }
        }
    };
};
