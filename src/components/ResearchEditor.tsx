import React, { useState, useRef } from 'react';
import {
    FlaskConical, Upload, Link2, X, Plus, Send, FileText, Sparkles, ChevronDown, Eye, Code
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { clsx } from 'clsx';
import { usePrivy } from '@privy-io/react-auth';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useSolana } from '../context/useSolana';
import { submitProposal, findDaoConfigPDA } from '../lib/program';
import { PublicKey } from '@solana/web3.js';

const RESEARCH_FIELDS = [
    'Biology', 'Chemistry', 'Physics', 'Medicine', 'Neuroscience',
    'Genomics', 'Longevity', 'Climate', 'Computer Science', 'Mathematics',
    'Economics', 'Psychology', 'Astronomy', 'Engineering', 'Other'
];

const POST_TYPES = ['Research', 'Critique', 'Investigation'];

const typeStyle = {
    Research: { active: 'bg-accent-purple text-white shadow-flat', inactive: 'bg-white text-black hover:bg-accent-softPurple' },
    Critique: { active: 'bg-accent-pink text-white shadow-flat', inactive: 'bg-white text-black hover:bg-accent-softPink' },
    Investigation: { active: 'bg-black text-white shadow-flat', inactive: 'bg-white text-black hover:bg-gray-100' },
};

const truncateAddress = (address: string) =>
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

const ResearchEditor = () => {
    const { user, authenticated, login } = usePrivy();
    const { addProposal } = useAppContext();
    const navigate = useNavigate();
    const { program, isReady, solanaAddress, showTransactionModal, showSystemModal } = useSolana();
    const activeAddress = solanaAddress || '';

    if (!authenticated || !activeAddress) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white border-3 border-black shadow-flat">
                <div className="w-20 h-20 bg-accent-softPurple border-4 border-black flex items-center justify-center shadow-flat mb-6">
                    <FlaskConical className="w-10 h-10 text-accent-purple" />
                </div>
                <h2 className="text-3xl font-display font-black uppercase mb-2">
                    {!authenticated ? 'AUTHENTICATION REQUIRED' : 'LINK WALLET REQUIRED'}
                </h2>
                <p className="text-[11px] font-header font-black text-black/50 uppercase tracking-widest max-w-sm mb-8">
                    {!authenticated
                        ? 'PLEASE LOGIN TO ACCESS THE RESEARCH STUDIO.'
                        : 'YOU MUST LINK A SOLANA WALLET (PHANTOM/BACKPACK) TO PUBLISH RESEARCH NODES.'}
                </p>
                {!authenticated ? (
                    <button onClick={login} className="btn-illu-primary px-8 py-3">LOGIN VIA PRIVY</button>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-xs text-black/70 italic max-w-[200px]">PLEASE USE THE "LINK WALLET" BUTTON IN THE SIDEBAR TO CONTINUE.</p>
                        <button onClick={() => navigate('/')} className="btn-illu-primary px-8 py-3">BACK TO JOURNAL</button>
                    </div>
                )}
            </div>
        );
    }

    const [type, setType] = useState<'Research' | 'Critique' | 'Investigation'>('Research');
    const [title, setTitle] = useState('');
    const [field, setField] = useState('Biology');
    const [doi, setDoi] = useState('');
    const [abstract, setAbstract] = useState('');
    const [content, setContent] = useState('');
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [links, setLinks] = useState<string[]>([]);
    const [newLink, setNewLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showFieldDropdown, setShowFieldDropdown] = useState(false);
    const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
    const fileRef = useRef<HTMLInputElement>(null);

    const canSubmit = title.trim() && abstract.trim() && content.trim();

    const addLink = () => {
        if (newLink.trim()) {
            setLinks([...links, newLink.trim()]);
            setNewLink('');
        }
    };

    const removeLink = (index: number) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!canSubmit || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const walletAddress = solanaAddress || 'Anonymous';
            const shortAddress = truncateAddress(walletAddress);

            let txHash = 'MOCK_TX';
            let finalId = Math.random().toString(36).substr(2, 9);

            console.log('Submission Debug:', { hasProgram: !!program, solanaAddress, isReady, authenticated });

            // On-Chain Transaction
            if (program && solanaAddress) {
                console.log('Submitting on-chain...');
                try {
                    // Safety check for base58 format
                    if (!/^[1-9A-HJ-NP-Za-km-z]+$/.test(solanaAddress)) {
                        throw new Error(`Invalid wallet address format: ${solanaAddress}. Please ensure you are connected with a Solana wallet.`);
                    }

                    const { tx, proposalPDA } = await submitProposal(program, {
                        author: new PublicKey(solanaAddress),
                        title,
                        contentUri: abstract, // Simplified for now
                        fundingGoal: 0
                    });
                    txHash = tx;
                    console.log('On-chain success:', tx, 'PDA:', proposalPDA.toBase58());
                    showTransactionModal({
                        status: 'success',
                        category: 'PUBLISH',
                        txId: tx
                    });
                    // Use PDA as the unique ID so we can vote on it later
                    finalId = proposalPDA.toBase58();
                } catch (txErr) {
                    console.error('On-chain submission failed:', txErr);
                    const errorMessage = txErr instanceof Error ? txErr.message : String(txErr);

                    let errorMsg = `On-chain submission failed: ${errorMessage}`;
                    if (errorMessage.includes('prior credit') || errorMessage.includes('InsufficientFunds')) {
                        errorMsg = `Your wallet (${solanaAddress}) has insufficient funds for the transaction fees. Please ensure you have SOL on Devnet.`;
                    }

                    showTransactionModal({
                        status: 'error',
                        category: 'PUBLISH',
                        message: errorMsg
                    });
                }
            } else {
                console.warn('Skipping on-chain submission: Wallet/Program not ready');
                if (authenticated) {
                    showSystemModal({
                        type: 'warning',
                        title: 'Off-Chain Mode',
                        message: 'Off-chain submission only: Wallet not fully initialized for transactions.'
                    });
                }
            }

            addProposal({
                id: finalId,
                title,
                abstract,
                content,
                type,
                researchField: field,
                doi: doi || undefined,
                author: shortAddress,
                upvotes: 0,
                commentCount: 0,
                createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                attachedLinks: links
            });
            navigate('/journal');
        } catch (error) {
            console.error('Failed to publish research post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="space-y-8 pb-10">
            <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-3 border-black shadow-flat-sm text-[11px] font-header font-black text-black uppercase tracking-[0.2em]">
                    <Sparkles className="w-3.5 h-3.5 text-accent-purple" /> RESEARCH STUDIO
                </div>
                <h2 className="text-4xl font-display font-black uppercase tracking-tight text-black leading-tight">
                    PUBLISH <span className="text-accent-pink italic">RESEARCH.</span>
                </h2>
            </div>

            <div className="illustration-card space-y-4">
                <p className="text-[11px] font-header font-black text-black uppercase tracking-[0.2em]">Post Type</p>
                <div className="flex gap-4 flex-wrap">
                    {POST_TYPES.map((t) => (
                        <button key={t} onClick={() => setType(t as any)}
                            className={`px-6 py-3 border-3 border-black text-xs font-header font-black uppercase tracking-wider transition-all duration-200 ${type === t ? typeStyle[t as keyof typeof typeStyle].active : typeStyle[t as keyof typeof typeStyle].inactive}`}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="illustration-card space-y-6 relative">
                {/* Removed overflow-hidden to fix dropdown clipping */}
                <div className="space-y-2">
                    <label className="text-[11px] font-header font-black text-black uppercase tracking-[0.2em]">Research Title *</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                        placeholder="ENTER YOUR RESEARCH TITLE..."
                        className="illu-input" />
                </div>
                <div className="space-y-2 relative">
                    <label className="text-[11px] font-header font-black text-black uppercase tracking-[0.2em]">Research Field</label>
                    <button onClick={() => setShowFieldDropdown(v => !v)}
                        className="w-full bg-white border-3 border-black px-4 py-3 text-sm font-header font-black text-black uppercase tracking-tight flex items-center justify-between hover:bg-accent-softPurple transition-all shadow-flat-sm">
                        {field}
                        <ChevronDown className={`w-5 h-5 text-black transition-transform duration-200 ${showFieldDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showFieldDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border-3 border-black shadow-flat overflow-hidden">
                            {RESEARCH_FIELDS.map(f => (
                                <button key={f} onClick={() => { setField(f); setShowFieldDropdown(false); }}
                                    className={`w-full text-left px-5 py-3 text-xs font-header font-black uppercase tracking-tight transition-all border-b-2 border-black last:border-b-0 ${field === f ? 'bg-accent-purple text-white' : 'text-black hover:bg-accent-softPurple'}`}>
                                    {f}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="space-y-2">
                    <label className="text-[11px] font-header font-black text-black uppercase tracking-[0.2em]">DOI (OPTIONAL)</label>
                    <input type="text" value={doi} onChange={e => setDoi(e.target.value)} placeholder="10.XXXX/XXXXX"
                        className="illu-input" />
                </div>
            </div>

            <div className="illustration-card space-y-3">
                <label className="text-[11px] font-header font-black text-black uppercase tracking-[0.2em]">Abstract *</label>
                <textarea value={abstract} onChange={e => setAbstract(e.target.value)}
                    placeholder="SUMMARIZE YOUR RESEARCH..." rows={4}
                    className="illu-input resize-none" />
                <p className="text-[10px] font-header font-black text-gray-400 uppercase tracking-widest">{abstract.length} CHARS</p>
            </div>

            <div className="illustration-card space-y-3">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-header font-black text-black uppercase tracking-[0.2em]">Research Content (Markdown Supported) *</label>
                    <div className="flex bg-gray-100 border-2 border-black p-1 shadow-flat-sm">
                        <button
                            onClick={() => setPreviewMode('edit')}
                            className={clsx(
                                "px-3 py-1 text-[10px] font-header font-black uppercase transition-all flex items-center gap-2",
                                previewMode === 'edit' ? "bg-black text-white shadow-flat-xs" : "text-black hover:bg-white"
                            )}
                        >
                            <Code className="w-3 h-3" /> Edit
                        </button>
                        <button
                            onClick={() => setPreviewMode('preview')}
                            className={clsx(
                                "px-3 py-1 text-[10px] font-header font-black uppercase transition-all flex items-center gap-2",
                                previewMode === 'preview' ? "bg-black text-white shadow-flat-xs" : "text-black hover:bg-white"
                            )}
                        >
                            <Eye className="w-3 h-3" /> Preview
                        </button>
                    </div>
                </div>

                {previewMode === 'edit' ? (
                    <textarea value={content} onChange={e => setContent(e.target.value)}
                        placeholder="ADD EXTENDED RESEARCH CONTENT USING MARKDOWN...&#10;# Heading&#10;- List item&#10;**Bold text**" rows={12}
                        className="illu-input resize-none font-mono text-sm" />
                ) : (
                    <div className="illu-input min-h-[300px] overflow-auto bg-white p-6">
                        <div className="prose prose-sm prose-slate max-w-none 
                            prose-headings:font-display prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-black
                            prose-p:font-header prose-p:font-black prose-p:uppercase prose-p:tracking-tight prose-p:text-black/80
                            prose-strong:text-black prose-a:text-accent-purple prose-code:text-accent-pink
                            prose-li:font-header prose-li:font-black prose-li:uppercase prose-li:text-black/70">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {content || '*No content to preview*'}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>

            <div className="illustration-card space-y-4">
                <p className="text-[11px] font-header font-black text-black uppercase tracking-[0.2em]">PDF Attachment</p>
                <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => setPdfFile(e.target.files?.[0] ?? null)} />
                {pdfFile ? (
                    <div className="flex items-center gap-4 p-4 bg-accent-softPurple border-3 border-black shadow-flat-sm">
                        <div className="w-11 h-11 bg-white border-3 border-black flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6 text-accent-purple" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-header font-black text-black uppercase truncate">{pdfFile.name}</p>
                            <p className="text-[10px] font-header font-black text-gray-500 uppercase">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button onClick={() => setPdfFile(null)} className="w-8 h-8 flex items-center justify-center border-3 border-black bg-white hover:bg-accent-pink hover:text-white transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <button onClick={() => fileRef.current?.click()}
                        className="w-full border-3 border-dashed border-black bg-white py-12 flex flex-col items-center gap-4 hover:bg-accent-softPurple transition-all group shadow-flat-sm">
                        <div className="w-12 h-12 bg-white border-3 border-black flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                            <Upload className="w-6 h-6 text-black" />
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-header font-black text-black uppercase tracking-widest">CLICK TO UPLOAD PDF</p>
                            <p className="text-[10px] font-header font-black text-gray-400 uppercase mt-1">MAX 20MB</p>
                        </div>
                    </button>
                )}
            </div>

            <div className="illustration-card space-y-4">
                <p className="text-[11px] font-header font-black text-black uppercase tracking-[0.2em]">Citation Links</p>
                <div className="flex gap-3">
                    <input type="url" value={newLink} onChange={e => setNewLink(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addLink()}
                        placeholder="HTTPS://ARXIV.ORG/..."
                        className="illu-input" />
                    <button onClick={addLink} className="btn-illu-primary px-6 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> ADD
                    </button>
                </div>
                {links.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {links.map((link, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-white border-3 border-black shadow-flat-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all group">
                                <Link2 className="w-4 h-4 text-accent-purple shrink-0" />
                                <span className="text-xs font-header font-black text-black uppercase tracking-tight truncate flex-1">
                                    {link.replace(/^https?:\/\//, '')}
                                </span>
                                <button onClick={() => removeLink(i)} className="w-6 h-6 flex items-center justify-center border-2 border-black hover:bg-accent-pink hover:text-white transition-colors">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between gap-6 pt-4">
                <button onClick={() => navigate('/feed')} className="btn-illu-outline px-10 py-4">CANCEL</button>
                <button onClick={handleSubmit} disabled={!canSubmit}
                    className="btn-illu-primary px-12 py-4 text-sm flex items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none bg-accent-pink">
                    {isSubmitting ? (
                        <><div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />PUBLISHING...</>
                    ) : (
                        <><Send className="w-5 h-5" />PUBLISH RESEARCH</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ResearchEditor;
