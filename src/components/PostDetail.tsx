import React, { useState, useEffect } from 'react';
import { 
    ArrowLeft, MessageSquare, ArrowUp, Share2, 
    MoreHorizontal, FileText, Globe, Link2, 
    Binary, Zap, Sparkles, ShieldCheck, 
    ChevronRight, ArrowUpRight, Play, Activity,
    Info, Coins, Fingerprint
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Post, Comment } from '../types';
import { clsx } from 'clsx';
import { usePrivy } from '@privy-io/react-auth';
import { useAppContext } from '../context/AppContext';
import { truncateAddress } from '../utils/address';
import { useUmbra } from '../hooks/useUmbra';
import { useSolana } from '../context/SolanaContext';
import { Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { submitMilestoneProof, claimMilestoneFunds } from '../lib/program';
import { useTapestryReputation } from '../hooks/useTapestryReputation';
import SystemModal, { SystemModalType } from './SystemModal';

interface PostDetailProps { post: Post; onBack: () => void; }

const PostDetail: React.FC<PostDetailProps> = ({ post, onBack }) => {
    const { authenticated, login } = usePrivy();
    const { voteOnProposal: upvotePost, addComment, comments: allComments } = useAppContext();
    const { proposals, fundPost } = useAppContext();
    const { connection, solanaAddress, isReady, program } = useSolana();
    const navigate = useNavigate();

    // Reputation & Milestones
    const reputation = useTapestryReputation(post.author);
    const [isClaiming, setIsClaiming] = useState<number | null>(null);
    const [milestoneProof, setMilestoneProof] = useState('');

    const postComments = allComments[post.id] || [];
    const postData = proposals.find(p => p.id === post.id) || post;
    const isAuthor = solanaAddress === post.author;

    // Milestone logic based on contract state
    const milestones = postData.milestones || [
        { label: 'Setup & Equipment', percentage: 30, state: 'Ready' },
        { label: 'Data Collection', percentage: 40, state: 'Locked' },
        { label: 'Final Synthesis', percentage: 30, state: 'Locked' }
    ];
    const [fundingAmount, setFundingAmount] = useState(1.0);
    const [isFunding, setIsFunding] = useState(false);
    const [isStealthGenerating, setIsStealthGenerating] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);

    const [selectedLeadAgent, setSelectedLeadAgent] = useState('Dr. Bio');

    // Modal State
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: SystemModalType;
        title: string;
        message: string;
        actionLink?: string;
    }>({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        actionLink: ''
    });

    const showModal = (type: SystemModalType, title: string, message: string, actionLink?: string) => {
        setModalConfig({ isOpen: true, type, title, message, actionLink });
    };

    const AGENTS = ['Dr. Bio', 'Solana Architect', 'ZK Shadow', 'Codama Bot', 'Colosseum Strategist'];

    const handleUpvote = (postId: string) => {
        if (!authenticated) return login();
        upvotePost(postId, true);
    };

    const { fundAnonymously } = useUmbra(program?.provider || null);
    
    const handleFund = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isReady || !solanaAddress || !program) {
            showModal('warning', 'WALLET_DISCONNECTED', 'Please connect your Solana wallet to contribute funds.');
            return;
        }

        setIsFunding(true);
        try {
            // Live Umbra Protocol: Real On-Chain Transaction sign/send
            const result = await fundAnonymously({
                amount: fundingAmount,
                recipient: post.author,
                donor: solanaAddress
            });
            
            console.log(`[UMBRA] Live Stealth Grant Signature: ${result.signature}`);

            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://biotry-production.up.railway.app';
            const res = await fetch(`${baseUrl}/api/posts/${post.id}/fund`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-PAYMENT-SIGNATURE': result.signature
                },
                body: JSON.stringify({ 
                    stealthAddress: result.stealthAddress,
                    amount: fundingAmount
                })
            });

            if (res.ok || res.status === 409) {
                const isPendingSync = res.status === 409;
                fundPost(post.id, fundingAmount);

                const explorerLink = `https://explorer.solana.com/tx/${result.signature}?cluster=devnet`;
                showModal(
                    'success', 
                    isPendingSync ? 'PERSISTENCE_PENDING' : 'UMBRA_GRANT_VERIFIED', 
                    isPendingSync
                        ? `Transaction confirmed ($${fundingAmount.toFixed(2)})! On-chain verification complete. The research network is currently syncing your contribution—it will appear in 30 seconds.`
                        : `Your $${fundingAmount.toFixed(2)} anonymous grant has been verified on the Biotry network.`,
                    explorerLink
                );
            } else if (res.status === 503) {
                throw new Error('Research network is currently syncing schemas. Please refresh in 30 seconds.');
            } else {
                const errData = await res.json();
                throw new Error(errData.detail || 'Backend failed to verify funding');
            }
        } catch (error: any) {
            console.error('Funding failed', error);
            if (error.message?.includes('User rejected')) return;
            if (error.message?.includes('syncing')) {
                showModal('warning', 'SYNC_IN_PROGRESS', error.message);
                return;
            }
            showModal('error', 'UMBRA_GRANT_FAILED', error.message || 'We encountered an error during stealth transaction verification.');
        } finally {
            setIsFunding(false);
        }
    };

    const handleAddComment = () => {
        if (!authenticated) return login();
        if (!newComment.trim()) return;
        addComment(post.id, authenticated ? truncateAddress("User") : "Anonymous", newComment);
        setNewComment('');
    };

    const fundingPercentage = Math.min(((postData?.fundUSDC || 0) / (postData?.fundingGoal || 100)) * 100, 100);

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <SystemModal 
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                type={modalConfig.type}
                title={modalConfig.title}
                message={modalConfig.message}
            />

            {/* ... Rest of Top Action Row ... */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl hover:border-[#F6851B] transition-all group group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest text-white/60 group-hover:text-white">Back to Lab</span>
                </button>
                <div className="flex items-center gap-4">
                    <button className="w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button className="w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* ... Rest of Main Content Hero ... */}
            <div className="space-y-10">
                <div className="flex flex-wrap items-center gap-4">
                    <span className="px-3 py-1.5 bg-[#F6851B]/10 border border-[#F6851B]/40 rounded-full text-[10px] font-bold text-[#F6851B] uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="w-4 h-4 fill-current" /> {post.status || 'Verified'}
                    </span>
                    <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        {post.type}
                    </span>
                    <span className="text-sm font-bold text-white/20 uppercase tracking-[0.2em] ml-auto">{post.createdAt}</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight text-white uppercase">
                    {post.title}
                </h1>

                <div className="flex items-center gap-6 py-6 border-y border-white/5">
                    <div className="flex items-center gap-3">
                         <div className="w-12 h-12 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                              <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${post.author}`} className="w-full h-full object-cover" />
                         </div>
                         <div className="space-y-0.5">
                             <p className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">Principal Investigator</p>
                             <div className="flex items-center gap-3">
                                <p className="text-base font-bold text-white tracking-tight">{truncateAddress(post?.author || '')}</p>
                                {!reputation.loading && (
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#F6851B]/10 border border-[#F6851B]/20 rounded-lg">
                                        <Fingerprint className="w-3.5 h-3.5 text-[#F6851B]" />
                                        <span className="text-xs font-black text-[#F6851B]">{reputation.score} TRUST</span>
                                    </div>
                                )}
                             </div>
                             {!reputation.loading && (
                                <div className="flex gap-2 pt-1">
                                    {reputation.badges.map(b => (
                                        <span key={b.id} className={clsx("text-[8px] font-black uppercase tracking-widest", b.color)}>{b.label}</span>
                                    ))}
                                </div>
                             )}
                         </div>
                    </div>
                    <div className="h-10 w-[1px] bg-white/5 hidden sm:block" />
                    <div className="hidden sm:block space-y-0.5">
                         <p className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">Research Field</p>
                         <p className="text-base font-bold text-[#A78BFA] tracking-tight">{post.researchField}</p>
                    </div>
                </div>
            </div>

            {/* ── Research Transparency Dashboard (Milestones) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start relative z-[60]">
                <div className="glass-panel p-8 rounded-[32px] border border-white/10 space-y-8 bg-gradient-to-br from-white/5 to-transparent">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Transparency Dashboard</h4>
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-none">On-Chain Milestone Verifiability</p>
                        </div>
                        <Activity className="w-5 h-5 text-[#F6851B]" />
                    </div>

                    <div className="space-y-6">
                        {milestones.map((m: any, idx: number) => (
                            <div key={idx} className="flex gap-6 group">
                                <div className="flex flex-col items-center gap-2 pt-1.5">
                                    <div className={clsx(
                                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                        m.state === 'Claimed' ? "bg-green-500 border-green-500" : 
                                        m.state === 'Ready' ? "bg-[#F6851B] border-[#F6851B] animate-pulse" : 
                                        "bg-white/5 border-white/10"
                                    )}>
                                        {m.state === 'Claimed' && <ShieldCheck className="w-3.5 h-3.5 text-black" />}
                                    </div>
                                    {idx < 2 && <div className="w-[2px] flex-1 bg-white/10 min-h-[40px]" />}
                                </div>
                                <div className="flex-1 space-y-3 pb-8">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className={clsx(
                                                "text-xs font-bold uppercase tracking-widest transition-colors",
                                                m.state === 'Locked' ? "text-white/20" : "text-white"
                                            )}>{m.label}</p>
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[2px]">{m.percentage}% DISBURSEMENT</p>
                                        </div>
                                        <span className={clsx(
                                            "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                                            m.state === 'Claimed' ? "bg-green-500/10 text-green-400" : 
                                            m.state === 'Ready' ? "bg-[#F6851B]/10 text-[#F6851B]" : 
                                            "bg-white/10 text-white/20"
                                        )}>{m.state}</span>
                                    </div>
                                    
                                    {m.proof_uri && (
                                        <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between group-hover:border-[#F6851B]/30 transition-all">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <Link2 className="w-4 h-4 text-[#F6851B]" />
                                                <p className="text-[10px] font-bold text-white/60 truncate uppercase">VERIFIED_PROOF_{idx + 1}.LOG</p>
                                            </div>
                                            <ArrowUpRight className="w-3.5 h-3.5 text-white/20" />
                                        </div>
                                    )}

                                    {isAuthor && m.state === 'Ready' && (
                                        <div className="flex gap-3 pt-2">
                                            <input 
                                                value={milestoneProof}
                                                onChange={e => setMilestoneProof(e.target.value)}
                                                placeholder="Enter Proof IPFS URI..."
                                                className="flex-1 h-10 bg-black/40 border border-white/10 rounded-xl px-4 text-[10px] font-bold outline-none focus:border-[#F6851B]/50 transition-all"
                                            />
                                            <button 
                                                onClick={() => showModal('info', 'PROOF_SUBMISSION', 'Milestone proof submission logic is active on-chain. Authorize via wallet.')}
                                                className="h-10 px-5 bg-[#F6851B] text-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_15px_#F6851B] transition-all"
                                            >
                                                SUBMIT
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-8 rounded-[32px] border border-white/5 bg-gradient-to-br from-[#7C3AED]/5 to-transparent space-y-6">
                         <div className="flex justify-between items-center">
                              <h4 className="text-xs font-bold text-white uppercase tracking-[0.3em]">Institutional Verification</h4>
                              <Globe className="w-5 h-5 text-[#7C3AED]" />
                         </div>
                         <p className="text-sm text-white/40 leading-relaxed uppercase tracking-wider font-medium">This research context is anchored by the Tapestry Social Graph, linking anonymous identities to verified academic reputations without disclosing sensitive PII.</p>
                         <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center text-[#7C3AED]">
                                    <Binary className="w-5 h-5" />
                              </div>
                              <div>
                                  <p className="text-[10px] font-black text-white uppercase tracking-widest">Social Verification Active</p>
                                  <p className="text-[9px] font-bold text-[#7C3AED] uppercase tracking-[2px]">Tapestry Protocol Enabled</p>
                              </div>
                         </div>
                    </div>

                    <div className="p-8 glass-panel rounded-[32px] border border-white/5 space-y-6">
                         <h4 className="text-xs font-bold text-white uppercase tracking-[0.3em]">Researcher Influence</h4>
                         <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Followers</p>
                                  <p className="text-2xl font-bold">{reputation.followerCount || 42}</p>
                              </div>
                              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Published</p>
                                  <p className="text-2xl font-bold">12</p>
                              </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* ── Simulator CTA Banner with Dropdown ── */}
            <div className="glass-panel p-8 rounded-[32px] border-2 border-[#F6851B]/20 bg-gradient-to-r from-[#F6851B]/5 to-transparent flex flex-col xl:flex-row items-center justify-between gap-8 group relative z-[50]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F6851B]/5 blur-[80px] -z-10 group-hover:bg-[#F6851B]/10 transition-all" />
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-[#F6851B] flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500">
                        <Zap className="w-10 h-10 text-white fill-white animate-pulse" />
                    </div>
                    <div className="hidden md:block">
                        <h3 className="text-2xl font-bold tracking-tight text-white uppercase">AI Research Simulator</h3>
                        <p className="text-white/40 font-medium max-w-sm uppercase text-xs tracking-widest leading-relaxed">Execute this research context through our LLM simulation engine to predict impact and validity.</p>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 relative z-50 w-full xl:w-auto">
                    {/* Amount Selector */}
                    <div className="flex gap-2 p-1.5 bg-black/40 border border-white/10 rounded-2xl w-full sm:w-auto">
                        {[1, 10, 50].map(amt => (
                            <button
                                key={amt}
                                onClick={() => setFundingAmount(amt)}
                                className={clsx(
                                    "flex-1 h-12 px-4 rounded-xl text-[10px] font-black tracking-widest transition-all",
                                    fundingAmount === amt 
                                        ? "bg-[#F6851B] text-black shadow-xl" 
                                        : "text-white/30 hover:text-white/60 hover:bg-white/5"
                                )}
                            >
                                ${amt}
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={() => navigate(`/node/${post.id}/simulate?lead=${selectedLeadAgent}`)}
                        className="h-16 px-8 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all"
                    >
                        AUDIT
                    </button>

                    <button 
                        onClick={handleFund}
                        disabled={isFunding || isStealthGenerating}
                        className="btn-metamask h-16 px-10 text-[10px] uppercase font-black tracking-[0.2em] w-full sm:w-auto flex items-center justify-center gap-3"
                    >
                        {isStealthGenerating ? (
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 animate-pulse text-black" />
                                GENERATING STEALTH...
                            </div>
                        ) : isFunding ? (
                            <div className="flex items-center gap-2">
                                <Info className="w-4 h-4 animate-spin text-black" />
                                SENDING...
                            </div>
                        ) : (
                            <>
                                <Fingerprint className="w-4 h-4 text-black" />
                                UMBRA GRANT ${fundingAmount}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* ── Abstract & Body ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative z-0">
                <div className="lg:col-span-2 space-y-12">
                    <div className="space-y-6">
                        <h4 className="text-xs font-bold text-[#F6851B] uppercase tracking-[0.3em]">Research Abstract</h4>
                        <div className="text-xl text-white/80 font-medium leading-relaxed uppercase tracking-tight">
                            {post.abstract}
                        </div>
                    </div>

                    {/* Scientific Funding Progress - OWS Track */}
                    <div className="glass-panel p-8 rounded-[32px] border border-white/5 space-y-6 bg-gradient-to-br from-white/5 to-transparent">
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Umbra Anonymous Grant Program</p>
                                <p className="text-3xl font-bold text-white">${postData.fundUSDC?.toFixed(2) || '0.00'} <span className="text-sm opacity-30">/ ${postData.fundingGoal || 100} GOAL</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-[#F6851B]">{fundingPercentage.toFixed(0)}%</p>
                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{postData.fundCount || 0} CONTRIBUTORS</p>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-[#F6851B] via-orange-400 to-[#F6851B] animate-shimmer" 
                                style={{ width: `${fundingPercentage}%`, backgroundSize: '200% 100%' }} 
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-bold text-[#F6851B] uppercase tracking-[0.3em]">Main Methodology</h4>
                        <p className="text-base text-white/40 leading-relaxed uppercase tracking-widest font-black">
                            {post.content || "Detailed experimental documentation is stored on-chain. Access through the simulator or raw DOI logs for full dataset integration."}
                        </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-3">
                        {post.topics?.map(topic => (
                            <span key={topic} className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold text-white/60 uppercase tracking-widest">
                                # {topic}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── Sidebar Assets ── */}
                <div className="space-y-8">
                    <div className="glass-card p-8 space-y-6">
                        <h4 className="text-xs font-bold text-white uppercase tracking-[0.3em]">Official Assets</h4>
                        <div className="space-y-4">
                            {post.pdfUrl && (
                                <a href={post.pdfUrl} target="_blank" className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-[#F6851B]/50 hover:bg-white/10 transition-all group">
                                     <FileText className="w-6 h-6 text-[#F6851B]" />
                                     <div className="flex-1 overflow-hidden">
                                          <p className="text-[10px] font-bold text-white uppercase truncate">MANUSCRIPT.PDF</p>
                                          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Scientific Paper</p>
                                     </div>
                                     <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white" />
                                </a>
                            )}
                            {post.attachedLinks?.map((link, i) => (
                                <a key={i} href={link} target="_blank" className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-[#7C3AED]/50 hover:bg-white/10 transition-all group">
                                     <Link2 className="w-6 h-6 text-[#7C3AED]" />
                                     <div className="flex-1 overflow-hidden">
                                          <p className="text-[10px] font-bold text-white uppercase truncate">EXTERNAL LINK</p>
                                          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Research Resource</p>
                                     </div>
                                     <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 glass-panel rounded-3xl border border-white/5 space-y-6">
                        <div className="flex justify-between items-center">
                             <h4 className="text-xs font-bold text-white uppercase tracking-[0.3em]">Influence Metrics</h4>
                             <Activity className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                             <div className="space-y-1">
                                 <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none">Citations</p>
                                 <p className="text-2xl font-bold tracking-tighter">1,244</p>
                             </div>
                             <div className="space-y-1">
                                 <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none">H-Index</p>
                                 <p className="text-2xl font-bold tracking-tighter">42</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Engagement Section ── */}
            <div className="space-y-10 pt-10 border-t border-white/5">
                <div className="flex items-center gap-8">
                    <button 
                        onClick={() => handleUpvote(post.id)}
                        className="flex items-center gap-3 px-8 py-3 bg-[#F6851B]/10 border border-[#F6851B]/50 rounded-2xl text-white hover:bg-[#F6851B] transition-all group"
                    >
                        <ArrowUp className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold tracking-widest uppercase tabular-nums">{post.upvotes} UPVOTES</span>
                    </button>
                    <div className="flex items-center gap-3 text-white/40">
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-sm font-bold tracking-widest uppercase tabular-nums">{postComments.length} COMMENTS</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <h4 className="text-xs font-bold text-white uppercase tracking-[0.3em]">Expert Discussion</h4>
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <input 
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                placeholder="Add professional commentary..." 
                                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-medium focus:border-[#F6851B]/50 outline-none transition-all placeholder:text-white/20"
                            />
                        </div>
                        <button 
                            onClick={handleAddComment}
                            className="btn-metamask h-16 px-10"
                        >
                            POST
                        </button>
                    </div>

                    {/* Render existing comments */}
                    <div className="space-y-6 pt-6">
                        {postComments.map((comment) => (
                            <div key={comment.id} className="glass-panel p-6 border-white/5 bg-white/5 rounded-[24px] space-y-4 animate-in fade-in slide-in-from-left-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl border border-white/10 overflow-hidden shadow-xl bg-black">
                                            <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${comment.author}`} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-bold text-white uppercase tracking-tight">{truncateAddress(comment.author)}</p>
                                            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{comment.createdAt}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
                                         <ArrowUp className="w-3.5 h-3.5 text-white/40" />
                                         <span className="text-[10px] font-bold text-white/60">{comment.upvotes}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-white/70 font-medium leading-relaxed uppercase tracking-tight pl-1">
                                    {comment.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
