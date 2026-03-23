import React from 'react';
import { MessageSquare, ArrowBigUp, FileText, Link2, Binary, User, ExternalLink, ArrowUpRight, Play, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Post } from '../types';
import { clsx } from 'clsx';
import { usePrivy } from '@privy-io/react-auth';
import { useAppContext } from '../context/AppContext';
import { tapestry, TAPESTRY_API_KEY } from '../lib/tapestry';
import { truncateAddress } from '../utils/address';

interface PostCardProps { post: Post; }

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const { authenticated, login, user } = usePrivy();
    const { voteOnProposal: upvotePost } = useAppContext();
    const navigate = useNavigate();

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

    return (
        <article 
            onClick={() => navigate(`/node/${post.id}`)}
            className="glass-card p-6 flex flex-col gap-6 cursor-pointer group relative overflow-hidden"
        >
            {/* Hover Glow Effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#F6851B]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex gap-5">
                {/* Status & Category */}
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

            {/* Title & Abstract */}
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

            {/* Tags & Meta */}
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

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
                <button 
                    onClick={handleSimulate}
                    className="flex-1 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-[#F6851B] hover:border-[#F6851B] transition-all group/sim shadow-lg"
                >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    Simulate & Verify
                </button>
                <button 
                    onClick={handleLike}
                    className="w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-[#F6851B] hover:bg-[#F6851B]/10 hover:border-[#F6851B]/30 transition-all"
                >
                    <ArrowBigUp className="w-5 h-5" />
                </button>
                <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/40">
                    <MessageSquare className="w-4 h-4" />
                </div>
            </div>
        </article>
    );
};

export default PostCard;
