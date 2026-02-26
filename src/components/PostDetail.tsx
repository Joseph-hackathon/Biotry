import React, { useState } from 'react';
import {
    ArrowLeft, ArrowBigUp, MessageSquare, Clock, User,
    ChevronRight, Send, FileText, Link2, ExternalLink, ArrowUpRight,
    Tag, Coins, History, ShieldCheck, Map
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Post } from '../types';
import { clsx } from 'clsx';
import { usePrivy } from '@privy-io/react-auth';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useSolana } from '../context/useSolana';
import { voteOnProposal as onChainVote, findProposalPDA } from '../lib/program';
import { PublicKey } from '@solana/web3.js';
import { truncateAddress } from '../utils/address';

interface PostDetailProps { post: Post; onBack: () => void; }


const PostDetail: React.FC<PostDetailProps> = ({ post, onBack }) => {
    const { authenticated, login, user } = usePrivy();
    const { voteOnProposal: upvotePost, addComment, comments } = useAppContext();
    const { program, solanaAddress, hasProfile, showTransactionModal, showSystemModal } = useSolana();
    const navigate = useNavigate();
    const [commentText, setCommentText] = useState('');

    const postComments = comments[post.id] || [];
    const walletAddress = user?.wallet?.address || '';

    const handleUpvote = async () => {
        if (!authenticated) return login();

        // On-Chain Voice
        if (program && solanaAddress) {
            console.log('Voting on-chain...');

            // PROFILE CHECK: Ensure account is initialized
            if (!hasProfile) {
                showTransactionModal({
                    status: 'error',
                    category: 'UPVOTE',
                    message: 'Join the DAO to vote on-chain! Initialize your membership in the profile page.'
                });
                navigate('/profile');
                return;
            }

            try {
                // Validate if post.id is a valid PublicKey before attempting on-chain vote
                let proposalPubkey: PublicKey;
                try {
                    proposalPubkey = new PublicKey(post.id);
                } catch (e) {
                    throw new Error(`Invalid local ID (${post.id}). Voting is only available for on-chain research.`);
                }

                const { tx } = await onChainVote(program, {
                    voter: new PublicKey(solanaAddress),
                    proposalPDA: proposalPubkey,
                    approve: true
                });
                console.log('On-chain vote success');
                showTransactionModal({
                    status: 'success',
                    category: 'UPVOTE',
                    txId: tx
                });
            } catch (err) {
                console.error('Vote Error Detail:', err);

                let errorMsg = 'On-chain vote failed. This might happen if you have already voted or have insufficient funds.';
                if (err instanceof Error && err.message.includes('Invalid local ID')) {
                    errorMsg = err.message;
                }

                showTransactionModal({
                    status: 'error',
                    category: 'UPVOTE',
                    message: errorMsg
                });
            }
        }

        upvotePost(post.id, true);
    };
    const handleSubmitComment = () => {
        if (!authenticated) return login();
        if (!commentText.trim()) return;
        const author = walletAddress ? truncateAddress(walletAddress) : 'Anonymous';
        addComment(post.id, author, commentText.trim());
        setCommentText('');
    };

    return (
        <div className="space-y-8 pb-10 font-soft">
            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="btn-illu-outline px-6 py-2.5 flex items-center gap-3"
            >
                <ArrowLeft className="w-4 h-4" />
                BACK TO FEED
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-9 space-y-8">
                    {/* Hero Card */}
                    <div className="illustration-card space-y-6 relative overflow-visible bg-white">
                        {/* Meta */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-accent-softPurple border-3 border-black flex items-center justify-center shadow-flat-sm overflow-hidden">
                                    <User className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <span className="text-xs font-header font-black text-black uppercase tracking-wider block leading-tight">{truncateAddress(post.author)}</span>
                                    <span className="text-[10px] font-header font-black text-black/40 uppercase flex items-center gap-1.5 mt-1">
                                        <Clock className="w-3 h-3 text-accent-purple" /> {post.createdAt}
                                    </span>
                                </div>
                            </div>
                            <span className="px-4 py-1.5 bg-white border-3 border-black text-[10px] font-header font-black uppercase tracking-widest text-black shadow-flat-sm">
                                {post.type}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl md:text-4xl font-display font-black uppercase tracking-tight text-black leading-tight">
                            {post.title}
                        </h1>

                        {/* Topics Section */}
                        {post.topics && post.topics.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {post.topics.map((topic, i) => (
                                    <span key={topic} className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-softPurple border-2 border-black text-[9px] font-header font-black text-black uppercase tracking-widest shadow-flat-xs hover:-translate-y-0.5 transition-transform cursor-default">
                                        <Tag className="w-3 h-3 text-accent-purple" /> {topic}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Abstract */}
                        {post.abstract && (
                            <div className="p-5 bg-accent-softPurple/30 border-l-4 border-accent-purple shadow-flat-sm">
                                <p className="text-sm text-black/70 font-black uppercase tracking-tight leading-relaxed">{post.abstract}</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-6 mt-2 border-t-3 border-black">
                            <div className="flex items-center gap-6">
                                <button onClick={handleUpvote}
                                    className="flex items-center gap-2 text-xs font-header font-bold text-black group/btn">
                                    <div className="w-10 h-10 border-3 border-black bg-white flex items-center justify-center transition-all group-hover/btn:bg-accent-softPurple group-hover/btn:shadow-flat-xs active:shadow-none active:translate-x-0.5 active:translate-y-0.5 shadow-flat-sm">
                                        <ArrowBigUp className="w-5 h-5" />
                                    </div>
                                    <span className="font-black tabular-nums">{post.upvotes.toLocaleString()}</span>
                                </button>
                                <span className="flex items-center gap-2 text-xs font-header font-bold text-black/50">
                                    <div className="w-10 h-10 border-3 border-black bg-white flex items-center justify-center shadow-flat-xs opacity-50">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <span className="font-black tabular-nums">{post.commentCount}</span>
                                </span>
                            </div>

                            <button
                                onClick={() => showSystemModal({
                                    type: 'info',
                                    title: 'BioCoin Support',
                                    message: 'BioCoin donations and support features will be available in the next release.'
                                })}
                                className="flex items-center gap-2 px-6 py-3 bg-accent-pink border-3 border-black text-[10px] font-header font-black text-white uppercase tracking-widest shadow-flat hover:shadow-flat-hover active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                            >
                                <Coins className="w-4 h-4" /> SUPPORT WITH BIOCOIN
                            </button>
                        </div>
                    </div>

                    {/* Full Content */}
                    <div className="illustration-card space-y-6 bg-white">
                        <h3 className="text-xl font-display font-black uppercase tracking-tight text-black underline decoration-4 decoration-accent-pink">Full Research Content</h3>
                        <div className="prose prose-sm md:prose-base max-w-none
                            prose-headings:font-display prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-black
                            prose-p:font-header prose-p:font-black prose-p:uppercase prose-p:tracking-tight prose-p:text-black/80
                            prose-strong:text-black prose-a:text-accent-purple prose-code:text-accent-pink
                            prose-li:font-header prose-li:font-black prose-li:uppercase prose-li:text-black/70
                            prose-hr:border-black prose-blockquote:border-accent-purple prose-blockquote:bg-accent-softPurple/30 prose-blockquote:p-4">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {post.content || post.abstract || 'No content available for this research node.'}
                            </ReactMarkdown>
                        </div>

                        {/* Support Block (Mid-Page) */}
                        <div className="p-8 bg-accent-softPink/20 border-3 border-dashed border-black text-center space-y-4">
                            <Coins className="w-10 h-10 text-accent-pink mx-auto" />
                            <div className="space-y-1">
                                <p className="text-sm font-header font-black text-black uppercase tracking-wider">Support Research Transparency</p>
                                <p className="text-[10px] font-header font-black text-black/40 uppercase tracking-widest">Authors receive 95% of all BioCoin donations directly.</p>
                            </div>
                            <button
                                onClick={() => showSystemModal({
                                    type: 'info',
                                    title: 'Contribute',
                                    message: 'Direct BioCoin contributions are strictly for verified researchers.'
                                })}
                                className="btn-illu-primary bg-accent-pink w-full sm:w-auto"
                            >
                                CONTRIBUTE BIOCOIN
                            </button>
                        </div>
                    </div>

                    {/* Comments */}
                    <div className="illustration-card space-y-6 bg-white overflow-visible">
                        <h3 className="text-xl font-display font-black uppercase tracking-tight text-black">
                            Community Discussion <span className="text-accent-pink">({postComments.length})</span>
                        </h3>

                        {/* Input */}
                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-accent-softPurple border-3 border-black flex items-center justify-center shrink-0 mt-1">
                                <User className="w-5 h-5 text-black" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <textarea
                                    value={commentText}
                                    onChange={e => setCommentText(e.target.value)}
                                    placeholder={authenticated ? 'ADD A COMMENT...' : 'CONNECT WALLET TO COMMENT...'}
                                    disabled={!authenticated}
                                    rows={3}
                                    className="illu-input resize-none h-auto min-h-[100px]"
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleSubmitComment}
                                        disabled={!commentText.trim()}
                                        className="btn-illu-primary flex items-center gap-3 px-8 py-3 text-[11px] bg-black text-white"
                                    >
                                        <Send className="w-4 h-4" /> SUBMIT COMMENT
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Comment List */}
                        {postComments.length > 0 && (
                            <div className="space-y-4 pt-4 border-t-3 border-black">
                                {postComments.map(comment => (
                                    <div key={comment.id} className="flex gap-4">
                                        <div className="w-10 h-10 bg-gray-100 border-3 border-black flex items-center justify-center shrink-0">
                                            <User className="w-5 h-5 text-black/40" />
                                        </div>
                                        <div className="flex-1 p-4 bg-white border-3 border-black shadow-flat-sm">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-[11px] font-header font-black text-black uppercase tracking-wider">{comment.author}</span>
                                                <span className="text-[10px] font-header font-black text-black/30 uppercase">{comment.createdAt}</span>
                                            </div>
                                            <p className="text-sm text-black/70 font-black uppercase tracking-tight leading-relaxed">{comment.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {postComments.length === 0 && (
                            <div className="py-12 text-center border-3 border-dashed border-black bg-gray-50/50">
                                <p className="text-xs font-header font-black text-black/20 uppercase tracking-[0.25em]">
                                    No discussions yet. Start the conversation.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Metadata */}
                <div className="lg:col-span-3 space-y-6">
                    {/* DOI & License */}
                    <div className="illustration-card bg-white space-y-4">
                        <div className="space-y-3">
                            <p className="text-[10px] font-header font-black text-black/30 uppercase tracking-widest">Object Identifier</p>
                            {post.doi ? (
                                <a href={`https://doi.org/${post.doi}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-accent-softPurple border-2 border-black text-[11px] font-header font-black text-black uppercase tracking-tight shadow-flat-xs hover:shadow-flat transition-all group">
                                    <Map className="w-4 h-4 text-accent-purple" /> DOI: {post.doi}
                                    <ArrowUpRight className="w-3 h-3 ml-auto opacity-20 group-hover:opacity-100" />
                                </a>
                            ) : (
                                <p className="text-[11px] font-header font-black text-black/40 uppercase">NO DOI RECORDED</p>
                            )}
                        </div>
                        <div className="pt-4 border-t-2 border-black/5 flex items-center justify-between">
                            <p className="text-[10px] font-header font-black text-black/30 uppercase tracking-widest">Rights</p>
                            <span className="flex items-center gap-1.5 px-2 py-1 bg-white border-2 border-black text-[9px] font-header font-black text-black uppercase tracking-widest shadow-flat-xs">
                                <ShieldCheck className="w-3 h-3 text-accent-pink" /> {post.license || 'Proprietary'}
                            </span>
                        </div>
                    </div>

                    {/* Versions History */}
                    {post.versions && post.versions.length > 0 && (
                        <div className="illustration-card bg-white space-y-4">
                            <div className="flex items-center gap-2">
                                <History className="w-4 h-4 text-black" />
                                <h4 className="text-sm font-header font-black text-black uppercase tracking-widest">Available Versions</h4>
                            </div>
                            <div className="space-y-2">
                                {post.versions.map((v, i) => (
                                    <a key={i} href={v.url} className="flex items-center justify-between p-3 border-2 border-black hover:bg-accent-softPurple shadow-flat-xs hover:shadow-flat active:shadow-none transition-all group">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-header font-black text-black uppercase tracking-widest">{v.version}</span>
                                            <span className="text-[9px] font-header font-black text-black/30 uppercase">{v.date}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-black/20 group-hover:text-black transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Resources & PDF (Moved to sidebar) */}
                    <div className="illustration-card bg-white space-y-4">
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-black" />
                            <h4 className="text-sm font-header font-black text-black uppercase tracking-widest">Assets</h4>
                        </div>
                        {post.pdfUrl && (
                            <a href={post.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-accent-softPink/30 border-2 border-black shadow-flat-xs hover:shadow-flat transition-all group">
                                <div className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-black" />
                                </div>
                                <span className="text-[10px] font-header font-black text-black uppercase">MANUSCRIPT.PDF</span>
                                <ArrowUpRight className="w-3 h-3 ml-auto opacity-20" />
                            </a>
                        )}
                        {post.attachedLinks && post.attachedLinks.map((link, i) => (
                            <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white border-2 border-black shadow-flat-xs hover:shadow-flat transition-all group">
                                <Link2 className="w-4 h-4 text-accent-purple" />
                                <span className="text-[9px] font-header font-black text-black uppercase truncate">{link.replace(/^https?:\/\//, '')}</span>
                                <ArrowUpRight className="w-3 h-3 ml-auto opacity-20" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
