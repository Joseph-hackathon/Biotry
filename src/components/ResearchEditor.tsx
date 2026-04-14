import React, { useState, useRef } from 'react';
import {
    FlaskConical, Upload, Link2, X, Plus, Send, FileText, Sparkles, ChevronDown, Eye, Code, Terminal, BookOpen, Activity, Zap, File
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { clsx } from 'clsx';
import { usePrivy } from '@privy-io/react-auth';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useSolana } from '../context/SolanaContext';
import { useUI } from '../context/UIContext';
import { submitProposal } from '../lib/program';
import { PublicKey } from '@solana/web3.js';

const RESEARCH_FIELDS = [
    'Biology', 'Chemistry', 'Physics', 'Medicine', 'Neuroscience',
    'Genomics', 'Longevity', 'Climate', 'Computer Science', 'Mathematics',
    'Economics', 'Psychology', 'Astronomy', 'Engineering', 'Other'
];

const POST_TYPES = ['Research', 'Critique', 'Investigation'];

const typeStyle = {
    Research: { active: 'bg-[#F6851B] text-white shadow-2xl', inactive: 'bg-white/5 text-white/40 hover:bg-white/10 border-white/5' },
    Critique: { active: 'bg-[#7C3AED] text-white shadow-2xl', inactive: 'bg-white/5 text-white/40 hover:bg-white/10 border-white/5' },
    Investigation: { active: 'bg-white text-black shadow-2xl', inactive: 'bg-white/5 text-white/40 hover:bg-white/10 border-white/5' },
};

const truncateAddress = (address: string) =>
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

const ResearchEditor = () => {
    const { authenticated, login } = usePrivy();
    const { addProposal, addActivity } = useAppContext();
    const navigate = useNavigate();
    const { program, solanaAddress, hasProtocolConfig, initializeHub } = useSolana();
    const { showTransactionModal, showSystemModal } = useUI();
    const activeAddress = solanaAddress || '';

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

    if (!authenticated || !activeAddress) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-40 text-center">
                 <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[32px] flex items-center justify-center shadow-2xl mb-10 group">
                    <FlaskConical className="w-12 h-12 text-[#F6851B] group-hover:scale-110 transition-transform" />
                </div>
                <h2 className="text-4xl font-bold tracking-tighter text-white uppercase mb-4">
                    STUDIO ACCESS <span className="text-red-500">BLOCKED.</span>
                </h2>
                <p className="text-sm font-medium text-white/40 uppercase tracking-widest max-w-sm mb-10">
                    Authenticating your scientific identity is required to publish new nodes to the research graph.
                </p>
                {!authenticated ? (
                    <button onClick={login} className="btn-metamask h-16 px-14 shadow-2xl">CONNECT IDENTITY</button>
                ) : (
                    <button onClick={() => navigate('/')} className="btn-metamask h-16 px-14 shadow-2xl">LINK SOLANA WALLET</button>
                )}
            </div>
        );
    }

    const addLink = () => {
        if (newLink.trim()) {
            setLinks([...links, newLink.trim()]);
            setNewLink('');
        }
    };

    const removeLink = (index: number) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPdfFile(e.target.files[0]);
        }
    };

    const removeFile = () => {
        setPdfFile(null);
        if (fileRef.current) fileRef.current.value = '';
    };

    const handleSubmit = async () => {
        if (!canSubmit || isSubmitting) return;
        setIsSubmitting(true);
        try {
            // Generate a random ID for fallback or use provided PDA later
            let finalId = Math.random().toString(36).substr(2, 9);

            if (program && solanaAddress) {
                try {
                    // Stricter truncation to avoid 'UriTooLong' (UTF-8 bytes count)
                    const onChainTitle = title.slice(0, 190);
                    const onChainUri = abstract.slice(0, 500); 

                    const { tx, proposalPDA } = await submitProposal(program, {
                        author: new PublicKey(solanaAddress),
                        title: onChainTitle,
                        contentUri: onChainUri,
                        fundingGoal: 0
                    });
                    showTransactionModal({ status: 'success', category: 'PUBLISH', txId: tx });
                    addActivity({
                        signature: tx,
                        category: 'NODE_PUBLICATION',
                        err: false,
                        target: title
                    });
                    finalId = proposalPDA.toBase58();
                } catch (txErr: any) {
                    showTransactionModal({ status: 'error', category: 'PUBLISH', message: txErr.message || String(txErr) });
                    setIsSubmitting(false); // Stop here if on-chain fails to allow retry
                    return; 
                }
            } else {
                // If the user expects on-chain but program is missing
                showSystemModal({
                    type: 'error',
                    title: 'On-Chain Sync Failed',
                    message: 'The Solana program instance is not ready. Please ensure your Solana wallet is correctly linked and refreshed.'
                });
                setIsSubmitting(false);
                return;
            }

            addProposal({
                id: finalId,
                title,
                abstract,
                content,
                type,
                researchField: field,
                doi: doi || undefined,
                author: activeAddress,
                upvotes: 0,
                commentCount: 0,
                createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                timestamp: Date.now(),
                attachedLinks: links,
                milestones: [
                    { label: 'Setup & Equipment', percentage: 30, state: 'Ready' },
                    { label: 'Data Collection', percentage: 40, state: 'Locked' },
                    { label: 'Final Synthesis', percentage: 30, state: 'Locked' }
                ]
            });
            navigate('/journal');
        } catch (error) {
            console.error('Failed to publish research post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-12 pb-20 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700">
            {/* Header */}
            <div className="space-y-4">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-[#A78BFA] uppercase tracking-[0.5em]">
                    <Terminal className="w-4 h-4" /> Research Authoring Studio
                </div>
                <h2 className="text-4xl md:text-7xl font-bold tracking-tighter text-white uppercase leading-none">
                    EMIT <span className="text-gradient-orange">RESEARCH.</span>
                </h2>
                <p className="text-base font-medium text-white/40 uppercase tracking-tight max-w-2xl">Publish high-integrity scientific findings directly to the on-chain social graph.</p>
            </div>

            {/* Type Selector */}
            <div className="glass-panel p-10 rounded-[32px] border border-white/5 space-y-8 bg-black/40">
                <div className="flex items-center gap-4">
                    <BookOpen className="w-5 h-5 text-white/30" />
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Node Classification</p>
                </div>
                <div className="flex gap-4 flex-wrap">
                    {POST_TYPES.map((t) => (
                        <button key={t} onClick={() => setType(t as any)}
                            className={clsx(
                                "px-8 py-4 border rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300",
                                type === t ? typeStyle[t as keyof typeof typeStyle].active : typeStyle[t as keyof typeof typeStyle].inactive
                            )}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Initialize HUB if needed */}
            {!hasProtocolConfig && (
                <div className="glass-panel p-10 rounded-[32px] border-[#F6851B]/20 bg-[#F6851B]/5 space-y-6 animate-in fade-in slide-in-from-top-4">
                     <div className="flex items-center gap-4">
                        <Zap className="w-8 h-8 text-[#F6851B]" />
                        <h3 className="text-xl font-bold uppercase text-white tracking-tight">Biotry Network Hub Not Initialized</h3>
                     </div>
                     <p className="text-xs font-medium text-white/40 uppercase tracking-tight leading-relaxed max-w-xl">
                        The smart contract environment for this network has not been initialized. You must initialize the core Biotry config before you can publish research nodes.
                     </p>
                     <button onClick={initializeHub} className="btn-metamask h-14 px-10 text-[10px] font-black uppercase tracking-widest shadow-2xl">
                        INITIALIZE BIOTRY HUB
                     </button>
                </div>
            )}

            {/* Core Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-0">
                <div className="glass-panel p-10 rounded-[32px] border border-white/5 space-y-8 bg-black/40 md:col-span-2 relative z-[60]">
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] ml-2">Node Title Identifier</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                            placeholder="Enter the primary research title..."
                            className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-bold text-white focus:border-[#F6851B]/50 transition-all outline-none placeholder:text-white/10 uppercase tracking-tight" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3 relative z-50">
                            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] ml-2">Field of Study</label>
                            <div className="relative">
                                <button onClick={() => setShowFieldDropdown(v => !v)}
                                    className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-bold text-white uppercase tracking-tight flex items-center justify-between hover:border-[#F6851B] transition-all">
                                    {field}
                                    <ChevronDown className={clsx("w-5 h-5 transition-transform", showFieldDropdown && "rotate-180")} />
                                </button>
                                {showFieldDropdown && (
                                    <div className="absolute top-20 left-0 right-0 z-[100] bg-[#0B0E11]/90 border border-white/10 rounded-2xl shadow-2xl p-2 max-h-64 overflow-y-auto backdrop-blur-3xl animate-in fade-in slide-in-from-top-2 duration-200">
                                        {RESEARCH_FIELDS.map(f => (
                                            <button key={f} onClick={() => { setField(f); setShowFieldDropdown(false); }}
                                                className={clsx(
                                                    "w-full text-left p-4 rounded-xl text-[10px] font-bold uppercase transition-all mb-1 last:mb-0",
                                                    field === f ? "bg-[#F6851B]/10 text-[#F6851B]" : "text-white/40 hover:bg-white/5 hover:text-white"
                                                )}>
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] ml-2">DOI Lookup (Optional)</label>
                            <input type="text" value={doi} onChange={e => setDoi(e.target.value)} placeholder="10.XXXX/XXXXX"
                                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-bold text-white focus:border-[#F6851B]/50 transition-all outline-none placeholder:text-white/10" />
                        </div>
                    </div>
                </div>

                {/* Abstract */}
                <div className="glass-panel p-10 rounded-[32px] border border-white/5 space-y-8 bg-black/40 md:col-span-2 relative z-40">
                    <div className="space-y-3">
                         <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] ml-2">Executive Abstract</label>
                         <textarea value={abstract} onChange={e => setAbstract(e.target.value)}
                            placeholder="Summarize the core findings and methodology..." rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm font-medium text-white/80 focus:border-[#F6851B]/50 transition-all outline-none placeholder:text-white/10" />
                         <p className="text-[9px] font-bold text-white/10 uppercase tracking-widest text-right">{abstract.length} Characters encoded</p>
                    </div>
                </div>

                {/* Supporting Artifacts (PDF/DOCX) */}
                <div className="glass-panel p-10 rounded-[32px] border border-white/5 space-y-8 bg-black/40 md:col-span-2 relative z-30">
                    <div className="flex items-center gap-4">
                         <FileText className="w-5 h-5 text-white/30" />
                         <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Supporting Artifacts</label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div 
                            onClick={() => fileRef.current?.click()}
                            className="border-2 border-dashed border-white/5 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 hover:border-[#F6851B]/30 hover:bg-[#F6851B]/5 transition-all cursor-pointer group"
                        >
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                <Upload className="w-6 h-6 text-white/40 group-hover:text-[#F6851B]" />
                            </div>
                            <div className="text-center">
                                <p className="text-[11px] font-bold text-white uppercase tracking-widest mb-1">Upload Source Node</p>
                                <p className="text-[9px] font-bold text-white/20 uppercase tracking-tight">PDF or DOCX (MAX 25MB)</p>
                            </div>
                            <input
                                ref={fileRef}
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="space-y-4">
                            {pdfFile ? (
                                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-right-4">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-10 h-10 bg-[#F6851B]/10 rounded-xl flex items-center justify-center shrink-0">
                                            <File className="w-5 h-5 text-[#F6851B]" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-bold text-white truncate uppercase tracking-tight">{pdfFile.name}</p>
                                            <p className="text-[9px] font-bold text-white/20 uppercase">{(pdfFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <button onClick={removeFile} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="h-full border border-dashed border-white/5 rounded-2xl flex items-center justify-center text-[10px] font-bold text-white/10 uppercase tracking-[0.2em]">
                                    No node artifact selected
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Editor */}
                <div className="glass-panel p-10 rounded-[32px] border border-white/5 space-y-8 bg-black/40 md:col-span-2 relative z-20">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <Code className="w-5 h-5 text-white/30" />
                            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Extended Data Content</label>
                         </div>
                         <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                            <button
                                onClick={() => setPreviewMode('edit')}
                                className={clsx("px-4 py-2 rounded-lg text-[9px] font-bold uppercase transition-all", previewMode === 'edit' ? "bg-white text-black" : "text-white/40 hover:text-white")}
                            >
                                EDITOR
                            </button>
                            <button
                                onClick={() => setPreviewMode('preview')}
                                className={clsx("px-4 py-2 rounded-lg text-[9px] font-bold uppercase transition-all", previewMode === 'preview' ? "bg-white text-black" : "text-white/40 hover:text-white")}
                            >
                                PREVIEW
                            </button>
                         </div>
                    </div>

                    {previewMode === 'edit' ? (
                        <textarea value={content} onChange={e => setContent(e.target.value)}
                            placeholder="Use Markdown to document your full research methodology and data sets..." rows={12}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm font-mono text-white/80 focus:border-[#F6851B]/50 transition-all outline-none placeholder:text-white/10 scrollbar-hide" />
                    ) : (
                        <div className="w-full min-h-[300px] bg-white/5 border border-white/10 rounded-2xl p-8 overflow-auto">
                            <div className="prose prose-invert prose-sm max-w-none 
                                prose-headings:text-white prose-headings:font-bold prose-headings:uppercase 
                                prose-p:text-white/60 prose-strong:text-white prose-a:text-[#F6851B]">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {content || '*No content to preview*'}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Publishing Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-10 border-t border-white/5">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.5em]">Network Status</p>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <p className="text-xs font-bold text-green-500 uppercase tracking-widest">Awaiting_Solana_Payload</p>
                    </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto">
                    <button onClick={() => navigate('/journal')} className="h-14 px-10 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all">ABORT_PUBLISH</button>
                    <button onClick={handleSubmit} disabled={!canSubmit || isSubmitting}
                        className="btn-metamask flex-1 md:flex-none h-16 px-16 shadow-2xl disabled:opacity-20 disabled:grayscale"
                    >
                        {isSubmitting ? 'EXECUTING_TX...' : 'EMIT_TO_GRAPH'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResearchEditor;
