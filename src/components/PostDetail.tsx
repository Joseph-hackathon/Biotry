import React, { useState } from 'react';
import { 
    ArrowLeft, MessageSquare, ArrowBigUp, Share2, 
    MoreHorizontal, FileText, Globe, Link2, 
    Binary, Zap, Sparkles, ShieldCheck, 
    ChevronRight, ArrowUpRight, Play, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Post, Comment } from '../types';
import { clsx } from 'clsx';
import { usePrivy } from '@privy-io/react-auth';
import { useAppContext } from '../context/AppContext';
import { truncateAddress } from '../utils/address';

interface PostDetailProps { post: Post; onBack: () => void; }

const PostDetail: React.FC<PostDetailProps> = ({ post, onBack }) => {
    const { authenticated, login } = usePrivy();
    const { voteOnProposal: upvotePost, addComment, comments: allComments } = useAppContext();
    const postComments = allComments[post.id] || [];
    const navigate = useNavigate();
    const [selectedLeadAgent, setSelectedLeadAgent] = useState('Dr. Bio');
    const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);
    const [newComment, setNewComment] = useState('');

    const AGENTS = ['Dr. Bio', 'Solana Architect', 'ZK Shadow', 'Codama Bot', 'Colosseum Strategist'];

    const handleUpvote = (postId: string) => {
        if (!authenticated) return login();
        upvotePost(postId, true);
    };

    const handleAddComment = () => {
        if (!authenticated) return login();
        if (!newComment.trim()) return;
        addComment(post.id, authenticated ? truncateAddress("User") : "Anonymous", newComment);
        setNewComment('');
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
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
                             <p className="text-base font-bold text-white tracking-tight">{truncateAddress(post.author)}</p>
                         </div>
                    </div>
                    <div className="h-10 w-[1px] bg-white/5 hidden sm:block" />
                    <div className="hidden sm:block space-y-0.5">
                         <p className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">Research Field</p>
                         <p className="text-base font-bold text-[#A78BFA] tracking-tight">{post.researchField}</p>
                    </div>
                </div>
            </div>

            {/* ── Simulator CTA Banner with Dropdown ── */}
            <div className="glass-panel p-8 rounded-[32px] border-2 border-[#F6851B]/20 bg-gradient-to-r from-[#F6851B]/5 to-transparent flex flex-col md:flex-row items-center justify-between gap-8 group relative z-[60]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F6851B]/5 blur-[80px] -z-10 group-hover:bg-[#F6851B]/10 transition-all" />
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-[#F6851B] flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500">
                        <Zap className="w-10 h-10 text-white fill-white animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight text-white uppercase">AI Research Simulator</h3>
                        <p className="text-white/40 font-medium max-w-sm uppercase text-xs tracking-widest leading-relaxed">Execute this research context through our LLM simulation engine to predict impact and validity.</p>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 relative z-50 w-full md:w-auto">
                    {/* Agent Selection Dropdown */}
                    <div className="relative w-full sm:w-64 z-50">
                         <button 
                            onClick={() => setIsAgentMenuOpen(!isAgentMenuOpen)}
                            className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 flex items-center justify-between hover:bg-white/10 transition-all group"
                         >
                            <div className="text-left">
                                <p className="text-[10px] font-black text-[#F6851B] uppercase tracking-widest">Select Lead Agent</p>
                                <p className="text-sm font-bold text-white uppercase">{selectedLeadAgent}</p>
                            </div>
                            <ChevronRight className={clsx("w-5 h-5 text-white/20 transition-transform", isAgentMenuOpen ? "rotate-90" : "")} />
                         </button>

                         {isAgentMenuOpen && (
                             <div className="absolute top-full mt-3 left-0 w-full bg-[#121212] border border-white/10 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-top-2 z-[100] backdrop-blur-xl">
                                 {AGENTS.map((agent) => (
                                     <button 
                                        key={agent}
                                        onClick={() => {
                                            setSelectedLeadAgent(agent);
                                            setIsAgentMenuOpen(false);
                                        }}
                                        className={clsx(
                                            "w-full text-left px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-tight transition-all",
                                            selectedLeadAgent === agent ? "bg-[#F6851B] text-black" : "text-white/60 hover:text-white hover:bg-white/5"
                                        )}
                                     >
                                         {agent}
                                     </button>
                                 ))}
                             </div>
                         )}
                    </div>

                    <button 
                        onClick={() => navigate(`/node/${post.id}/simulate?lead=${selectedLeadAgent}`)}
                        className="btn-metamask h-16 px-10 text-xs shadow-[0_0_30px_rgba(246,133,27,0.2)] whitespace-nowrap w-full sm:w-auto"
                    >
                        RUN SIMULATION <Play className="w-4 h-4 fill-white ml-2" />
                    </button>
                </div>
            </div>

            {/* ── Abstract & Body ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative z-0">
                <div className="lg:col-span-2 space-y-10">
                    <div className="space-y-6">
                        <h4 className="text-xs font-bold text-[#F6851B] uppercase tracking-[0.3em]">Research Abstract</h4>
                        <div className="text-xl text-white/80 font-medium leading-relaxed uppercase tracking-tight">
                            {post.abstract}
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
                        <ArrowBigUp className="w-6 h-6 group-hover:scale-110 transition-transform" />
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
                                         <ArrowBigUp className="w-3.5 h-3.5 text-white/40" />
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
