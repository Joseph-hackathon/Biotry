import React from 'react';
import { MessageSquare, ArrowBigUp, FileText, Link2, Binary, User, ExternalLink, ArrowUpRight } from 'lucide-react';
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

    return (
        <article className="illustration-card group cursor-pointer mb-6 hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-200">
            <div className="flex gap-4">
                {/* Avatar */}
                <div className="shrink-0">
                    <div className="w-12 h-12 bg-accent-softPurple border-3 border-black flex items-center justify-center shadow-flat-sm overflow-hidden">
                        <User className="w-6 h-6 text-black" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-3">
                    {/* Author row */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs font-header font-black text-black uppercase tracking-wider">{truncateAddress(post.author)}</span>
                        <span className="text-black/20 font-black">/</span>
                        <span className="text-[10px] font-header font-black text-black/40 uppercase tracking-widest">{post.createdAt}</span>
                        {post.status && (
                            <span className={clsx(
                                "px-2 py-0.5 border-2 border-black text-[8px] font-header font-black uppercase tracking-widest shadow-flat-xs",
                                post.status === 'Published' ? "bg-accent-softPurple text-black" : "bg-accent-softPink text-black"
                            )}>
                                {post.status}
                            </span>
                        )}
                        <span className="ml-auto px-3 py-1 bg-white border-2 border-black text-[9px] font-header font-black uppercase tracking-widest text-black shadow-flat-xs">
                            {post.type}
                        </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-display font-black uppercase tracking-tight leading-tight text-black group-hover:text-accent-purple transition-colors">
                        {post.title}
                    </h2>

                    {/* Abstract */}
                    {post.abstract && (
                        <p className="text-sm text-black/60 font-black uppercase tracking-tight leading-relaxed line-clamp-2">
                            {post.abstract}
                        </p>
                    )}

                    {/* Field & Meta */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-softPurple border-2 border-black text-[10px] font-header font-black text-black uppercase tracking-wider">
                            <Binary className="w-3.5 h-3.5 text-accent-purple" /> {post.researchField}
                        </span>
                        {post.doi && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border-2 border-black text-[10px] font-header font-black text-black/50 uppercase tracking-tight">
                                DOI: {post.doi}
                            </span>
                        )}
                    </div>

                    {/* PDF & Links */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        {post.pdfUrl && (
                            <a href={post.pdfUrl} target="_blank" rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="flex items-center gap-3 p-3 bg-white border-3 border-black shadow-flat-xs hover:shadow-flat transition-all group/pdf">
                                <div className="w-9 h-9 bg-accent-softPurple border-2 border-black flex items-center justify-center shrink-0">
                                    <FileText className="w-5 h-5 text-black" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-header font-black text-black uppercase truncate">RESEARCH.PDF</p>
                                    <p className="text-[9px] font-header font-black text-accent-pink uppercase">VIEW MANUSCRIPT</p>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-black/20 group-hover/pdf:translate-x-0.5 group-hover/pdf:-translate-y-0.5 transition-transform" />
                            </a>
                        )}

                        {post.attachedLinks && post.attachedLinks[0] && (
                            <a href={post.attachedLinks[0]} target="_blank" rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="flex items-center gap-3 p-3 bg-white border-3 border-black shadow-flat-xs hover:shadow-flat transition-all group/link">
                                <div className="w-9 h-9 bg-accent-softPink border-2 border-black flex items-center justify-center shrink-0">
                                    <Link2 className="w-5 h-5 text-black" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-header font-black text-black uppercase truncate">EXTERNAL LINK</p>
                                    <p className="text-[9px] font-header font-black text-accent-purple uppercase">RESOURCES</p>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-black/20 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                            </a>
                        )}
                    </div>

                    {/* Action bar */}
                    <div className="flex items-center gap-8 pt-4 mt-2 border-t-2 border-black/5">
                        <button onClick={handleLike} className="flex items-center gap-2 text-black/40 hover:text-accent-purple transition-colors group/up">
                            <div className="p-1 rounded-full group-hover/up:bg-accent-softPurple transition-colors">
                                <ArrowBigUp className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-header font-black tabular-nums">{post.upvotes.toLocaleString()}</span>
                        </button>
                        <span className="flex items-center gap-2 text-black/40">
                            <div className="p-1">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-header font-black tabular-nums">{post.commentCount}</span>
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default PostCard;
