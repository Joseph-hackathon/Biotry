import { 
    MessageSquare, ArrowBigUp, FileText, Link2, 
    Binary, User, ExternalLink, ArrowUpRight, 
    Play, Zap, Coins, CheckCircle2, Globe, Info, Code2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Post } from '../types';
import { clsx } from 'clsx';
import { usePrivy } from '@privy-io/react-auth';
import { useAppContext } from '../context/AppContext';
import { tapestry, TAPESTRY_API_KEY } from '../lib/tapestry';
import { truncateAddress } from '../utils/address';
import { useSolana } from '../context/SolanaContext';
import { Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useState, useEffect } from 'react';
import SystemModal, { SystemModalType } from './SystemModal';

interface PostCardProps { post: Post; }

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const { authenticated, login, user } = usePrivy();
    const { voteOnProposal: upvotePost } = useAppContext();
    const { connection, solanaAddress, isReady, program } = useSolana();
    const navigate = useNavigate();
    
    // Real-time state
    const [postData, setPostData] = useState(post);
    const [fundingAmount, setFundingAmount] = useState(1.0);
    const [isFunding, setIsFunding] = useState(false);

    // Sync with prop changes to ensure local state doesn't track stale prop data
    useEffect(() => {
        setPostData(post);
    }, [post]);
    
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

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!authenticated) return login();
        upvotePost(post.id, true);
        const profileId = user?.wallet?.address;
        if (profileId) {
            try {
                await tapestry.likes.likesCreate(
                    { nodeId: post.id, apiKey: TAPESTRY_API_KEY },
                    { startId: profileId }
                );
            } catch (err) { console.warn('[Tapestry] Like failed:', err); }
        }
    };

    const handleSimulate = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/node/${post.id}/simulate`);
    };

    const handleFund = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isReady || !solanaAddress || !program) {
            showModal('warning', 'WALLET_DISCONNECTED', 'Please connect your Solana wallet to contribute funds.');
            return;
        }

        setIsFunding(true);
        try {
            // OWS Micropayment: Dynamic amount
            const lamports = 0.01 * fundingAmount * LAMPORTS_PER_SOL;
            const recipientPubKey = new PublicKey('pvK3j774HX9g3fRX19csEoD1j1wcRgSNhmKjrSsGaM5');
            const instruction = SystemProgram.transfer({
                fromPubkey: new PublicKey(solanaAddress),
                toPubkey: recipientPubKey,
                lamports: lamports,
            });

            const transaction = new Transaction().add(instruction);
            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = new PublicKey(solanaAddress);

            const signedTx = await (program.provider as any).wallet.signTransaction(transaction);
            const signature = await connection.sendRawTransaction(signedTx.serialize());
            
            console.log('[OWS_FUND] Signature:', signature);
            await connection.confirmTransaction(signature, 'confirmed');

            // Notify backend
            const res = await fetch(`${process.env.VITE_API_BASE_URL || 'https://biotry-production.up.railway.app'}/api/posts/${post.id}/fund`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-PAYMENT-SIGNATURE': signature
                }
            });

            if (res.ok) {
                // Real-time UI Update
                setPostData(prev => ({
                    ...prev,
                    fundUSDC: (prev.fundUSDC || 0) + fundingAmount,
                    fundCount: (prev.fundCount || 0) + 1
                }));

                const explorerLink = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
                showModal(
                    'success', 
                    'FUNDING_PROVEN_ON_CHAIN', 
                    `Your $${fundingAmount.toFixed(2)} contribution has been verified. Thank you for accelerating open science!`,
                    explorerLink
                );
            } else {
                const errData = await res.json();
                throw new Error(errData.detail || 'Backend failed to verify funding');
            }
        } catch (error: any) {
            console.error('Funding failed', error);
            showModal('error', 'CONTRIBUTION_FAILED', error.message || 'We encountered an error during on-chain verification.');
        } finally {
            setIsFunding(false);
        }
    };

    const fundingPercentage = Math.min(((postData.fundUSDC || 0) / (postData.fundingGoal || 100)) * 100, 100);

    return (
        <article 
            onClick={() => navigate(`/node/${post.id}`)}
            className="glass-card p-6 flex flex-col gap-6 cursor-pointer group relative overflow-hidden"
        >
            <SystemModal 
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                type={modalConfig.type}
                title={modalConfig.title}
                message={modalConfig.message}
                actionLink={modalConfig.actionLink}
                actionLabel="VIEW_ON_SOLANA_EXPLORER"
            />

            {/* Hover Glow Effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#F6851B]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex gap-5">
                <div className="flex-1 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#F6851B]/10 group-hover:border-[#F6851B]/30 transition-all">
                        <img 
                            src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${post.author}`} 
                            className="w-7 h-7 rounded-sm" 
                            alt="Author" 
                        />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] font-bold text-white uppercase tracking-tight truncate">{truncateAddress(post.author)}</p>
                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{post.createdAt}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold text-white/50 uppercase tracking-wider">
                        {post.type}
                    </span>
                </div>
            </div>

            <div className="space-y-3">
                <h2 className="text-xl font-bold tracking-tight text-white group-hover:text-gradient-orange transition-all">
                    {post.title}
                </h2>
                {post.abstract && (
                    <p className="text-sm text-white/40 font-medium leading-relaxed line-clamp-2 uppercase tracking-tight">
                        {post.abstract}
                    </p>
                )}
            </div>

            {/* Funding Progress Bar - OWS Track */}
            <div className="space-y-3">
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Scientific Funding</p>
                        <p className="text-[14px] font-bold text-white">${postData.fundUSDC?.toFixed(2) || '0.00'} <span className="text-[10px] opacity-40">/ ${postData.fundingGoal || 100}</span></p>
                    </div>
                    <p className="text-[10px] font-black text-[#F6851B]">{fundingPercentage.toFixed(0)}%</p>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-[#F6851B] to-orange-400 transition-all duration-1000" 
                        style={{ width: `${fundingPercentage}%` }} 
                    />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-full text-[9px] font-bold text-[#A78BFA] uppercase tracking-widest">
                    <Binary className="w-3.5 h-3.5" /> {post.researchField}
                </span>
                {post.topics?.slice(0, 2).map(topic => (
                    <span key={topic} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-full text-[9px] font-bold text-white/30 uppercase tracking-widest">
                        # {topic}
                    </span>
                ))}
            </div>

            <div className="space-y-3 pt-2">
                {/* Amount Selector */}
                <div className="flex gap-2 p-1.5 bg-black/40 border border-white/5 rounded-[18px]">
                    {[1, 5, 10, 50].map(amt => (
                        <button
                            key={amt}
                            onClick={(e) => { e.stopPropagation(); setFundingAmount(amt); }}
                            className={clsx(
                                "flex-1 h-9 rounded-[12px] text-[10px] font-black tracking-widest transition-all",
                                fundingAmount === amt 
                                    ? "bg-[#F6851B] text-black shadow-[0_4px_15px_rgba(246,133,27,0.3)]" 
                                    : "text-white/30 hover:text-white/60 hover:bg-white/5"
                            )}
                        >
                            ${amt}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleSimulate}
                        className="w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-[#7C3AED] hover:bg-[#7C3AED]/10 transition-all group/sim"
                    >
                        <Zap className="w-5 h-5 fill-current" />
                    </button>
                    <button 
                        onClick={handleFund}
                        disabled={isFunding}
                        className="flex-1 h-12 bg-[#F6851B] border border-[#F6851B]/30 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-black hover:shadow-[0_0_25px_#F6851B] transition-all disabled:opacity-50"
                    >
                        {isFunding ? <Info className="w-4 h-4 animate-spin" /> : <Coins className="w-4 h-4" />}
                        Support ${fundingAmount}
                    </button>
                    <button 
                        onClick={handleLike}
                        className="w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-[#F6851B] hover:bg-[#F6851B]/10 transition-all"
                    >
                        <ArrowBigUp className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </article>
    );
};

export default PostCard;
