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
import { useState } from 'react';

interface PostCardProps { post: Post; }

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const { authenticated, login, user } = usePrivy();
    const { voteOnProposal: upvotePost } = useAppContext();
    const { connection, solanaAddress, isReady, program } = useSolana();
    const navigate = useNavigate();
    const [isFunding, setIsFunding] = useState(false);
    const [showFundSuccess, setShowFundSuccess] = useState(false);

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
            alert("Please connect your Solana wallet first.");
            return;
        }

        setIsFunding(true);
        try {
            // OWS Micropayment: 1.0 USDC equivalent (0.01 SOL for hackathon demo speed)
            const recipientPubKey = new PublicKey('pvK3j774HX9g3fRX19csEoD1j1wcRgSNhmKjrSsGaM5');
            const instruction = SystemProgram.transfer({
                fromPubkey: new PublicKey(solanaAddress),
                toPubkey: recipientPubKey,
                lamports: 0.01 * LAMPORTS_PER_SOL,
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
            const res = await fetch(`${process.env.VITE_API_URL || 'https://biotry-production.up.railway.app'}/api/posts/${post.id}/fund`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-PAYMENT-SIGNATURE': signature
                }
            });

            if (res.ok) {
                setShowFundSuccess(true);
                setTimeout(() => setShowFundSuccess(false), 3000);
            } else {
                throw new Error('Backend failed to verify funding');
            }
        } catch (error: any) {
            console.error('Funding failed', error);
            alert(`Funding failed: ${error.message || 'Error occurred'}`);
        } finally {
            setIsFunding(false);
        }
    };

    const fundingPercentage = Math.min(((post.fundUSDC || 0) / (post.fundingGoal || 100)) * 100, 100);

    return (
        <article 
            onClick={() => navigate(`/node/${post.id}`)}
            className="glass-card p-6 flex flex-col gap-6 cursor-pointer group relative overflow-hidden"
        >
            {/* OWS Funding Success Toast */}
            {showFundSuccess && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-40 flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                        <CheckCircle2 className="w-7 h-7 text-black" />
                    </div>
                    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-green-400">Funding_Proven_On_Chain</p>
                    <p className="text-[8px] text-white/30 font-mono mt-1 tracking-widest">+1.0 USDC ADDED</p>
                </div>
            )}

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
                        <p className="text-[14px] font-bold text-white">${post.fundUSDC?.toFixed(2) || '0.00'} <span className="text-[10px] opacity-40">/ ${post.fundingGoal || 100}</span></p>
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

            <div className="flex items-center gap-3 pt-2">
                <button 
                    onClick={handleSimulate}
                    className="flex-1 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all group/sim shadow-lg"
                >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    Audit
                </button>
                <button 
                    onClick={handleFund}
                    disabled={isFunding}
                    className="flex-1 h-11 bg-[#F6851B] border border-[#F6851B]/30 rounded-2xl flex items-center justify-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-black hover:shadow-[0_0_20px_#F6851B] transition-all disabled:opacity-50"
                >
                    {isFunding ? <Info className="w-4 h-4 animate-spin" /> : <Coins className="w-4 h-4" />}
                    Fund USDC
                </button>
                <button 
                    onClick={handleLike}
                    className="w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-[#F6851B] hover:bg-[#F6851B]/10 hover:border-[#F6851B]/30 transition-all"
                >
                    <ArrowBigUp className="w-5 h-5" />
                </button>
            </div>
        </article>
    );
};

export default PostCard;
