import React, { useState } from 'react';
import { FlaskConical, ArrowUpRight, Activity, User, Microscope, Copy, Check, Info, Zap, Sparkles, ChevronRight, Share2, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useSolana } from '../context/SolanaContext';
import { useUI } from '../context/UIContext';
import { initializeDao, findDaoConfigPDA, createProfile } from '../lib/program';
import { PublicKey } from '@solana/web3.js';
import { Shield, AlertCircle, History, ExternalLink, Clock } from 'lucide-react';
import ActivityHistory from './profile/ActivityHistory';
import ProfileHero from './profile/ProfileHero';
import { truncateAddress } from '../utils/address';

const typeStyle: Record<string, string> = {
    Research: 'bg-[#F6851B]/10 border-[#F6851B]/30 text-[#F6851B]',
    Critique: 'bg-[#7C3AED]/10 border-[#7C3AED]/30 text-[#A78BFA]',
    Investigation: 'bg-white/5 border-white/10 text-white/50',
};

const ProfileView: React.FC = () => {
    const { authenticated, login, logout, user, connectWallet, linkWallet } = usePrivy();
    const { proposals: posts } = useAppContext();
    const { program, solanaAddress, availableWallets, setActiveAddress, balance, refreshBalance, hasProfile, refreshProfile, memberProfile } = useSolana();
    const { showTransactionModal, showSystemModal } = useUI();
    const navigate = useNavigate();
    const [isInitializing, setIsInitializing] = useState(false);
    const [protocolStatus, setProtocolStatus] = useState<'checking' | 'initialized' | 'not-initialized'>('checking');
    const [history, setHistory] = useState<any[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const activeAddress = solanaAddress || '';
    const myAuthorTag = activeAddress ? truncateAddress(activeAddress) : null;

    React.useEffect(() => {
        const checkProtocolStatus = async () => {
            if (!program) {
                setProtocolStatus('checking');
                return;
            }
            try {
                const [configPDA] = findDaoConfigPDA();
                const account = await (program.account as any).daoConfig.fetch(configPDA);
                if (account) setProtocolStatus('initialized');
            } catch (e) {
                setProtocolStatus('not-initialized');
            }
        };
        checkProtocolStatus();
    }, [program, activeAddress]);

    const fetchHistory = React.useCallback(async () => {
        if (!activeAddress || !program) return;
        setIsLoadingHistory(true);
        try {
            const connection = program.provider.connection;
            const signatures = await connection.getSignaturesForAddress(
                new PublicKey(activeAddress),
                { limit: 25 }
            );

            const detailedHistory = await Promise.all(signatures.map(async (sig) => {
                try {
                    const tx = await connection.getParsedTransaction(sig.signature, { maxSupportedTransactionVersion: 0 });
                    let category = 'NETWORK_INTERACTION';
                    if (tx && tx.meta && tx.meta.logMessages) {
                        const logs = tx.meta.logMessages.join(' ');
                        if (logs.includes('Instruction: CreateProfile')) category = 'NETWORK_ONBOARD';
                        else if (logs.includes('Instruction: VoteOnProposal')) category = 'RESEARCH_UPVOTE';
                        else if (logs.includes('Instruction: SubmitProposal')) category = 'NODE_PUBLICATION';
                        else if (logs.includes('Instruction: InitializeDao')) category = 'PROTOCOL_INIT';
                    }
                    return { ...sig, category };
                } catch (e) {
                    return { ...sig, category: 'GENERIC_EXECUTION' };
                }
            }));

            setHistory(detailedHistory);
        } catch (err) {
            console.error('[History] Failed to fetch:', err);
        } finally {
            setIsLoadingHistory(false);
        }
    }, [activeAddress, program]);

    React.useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const myPosts = activeAddress ? posts.filter(p => 
        p.author === activeAddress || 
        p.author === truncateAddress(activeAddress)
    ) : [];
    const totalUpvotes = myPosts.reduce((sum, p) => sum + p.upvotes, 0);

    const handleActivateIdentity = async () => {
        if (!program || !activeAddress || isInitializing) return;
        const username = prompt('Enter Network Handle:', '') || '';
        const bio = prompt('Enter Biography Summary:', '') || '';
        if (!username) {
            showSystemModal({ type: 'error', title: 'Action Required', message: 'A username is required to activate your network identity.' });
            return;
        }
        setIsInitializing(true);
        try {
            const { tx } = await createProfile(program, { owner: new PublicKey(activeAddress), username, bio });
            showTransactionModal({ status: 'success', category: 'NETWORK_IDENTITY', txId: tx });
            await refreshProfile();
            fetchHistory();
        } catch (err: any) {
            showTransactionModal({ status: 'error', category: 'NETWORK_IDENTITY', message: err.message || String(err) });
        } finally {
            setIsInitializing(false);
        }
    };

    const handleInitializeProtocol = async () => {
        if (!program || !activeAddress || isInitializing) return;
        if (activeAddress.length < 32) {
            showTransactionModal({ status: 'error', category: 'PROTOCOL_INIT', message: `Invalid identifier (${activeAddress}).` });
            return;
        }
        setIsInitializing(true);
        try {
            const daoName = prompt('Enter Protocol Name:', 'Biotry Network') || 'Biotry Network';


            const { tx } = await initializeDao(program, daoName, new PublicKey(activeAddress));
            showTransactionModal({ status: 'success', category: 'PROTOCOL_INIT', txId: tx });
            setProtocolStatus('initialized');
            fetchHistory();
        } catch (err: any) {
            showTransactionModal({ status: 'error', category: 'PROTOCOL_INIT', message: err.message || String(err) });
        } finally {
            setIsInitializing(false);
        }
    };

    if (!authenticated || !activeAddress) {
        return (
            <div className="flex flex-col items-center justify-center py-40 space-y-10 text-center animate-in fade-in zoom-in duration-700">
                <div className="w-32 h-32 bg-white/5 border border-white/10 rounded-[32px] flex items-center justify-center shadow-2xl relative group">
                    <div className="absolute inset-0 bg-[#F6851B]/5 rounded-[32px] blur-2xl group-hover:bg-[#F6851B]/10 transition-all" />
                    <User className="w-16 h-16 text-[#F6851B] animate-pulse" />
                </div>
                <div className="space-y-4 max-w-lg">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white uppercase">AUTHENTICATION <span className="text-[#F6851B]">REQUIRED.</span></h2>
                    <p className="text-base font-medium text-white/40 uppercase tracking-tight leading-relaxed">Please connect your Solana identity or authenticate via Privy to access the Research Social Graph.</p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-6">
                    {!authenticated ? (
                        <button onClick={login} className="btn-metamask h-16 px-14 shadow-2xl">CONNECT IDENTITY</button>
                    ) : (
                        <button onClick={() => linkWallet()} className="btn-metamask h-16 px-14 shadow-2xl">LINK SOLANA WALLET</button>
                    )}
                    <button onClick={() => navigate('/')} className="h-16 px-10 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all">RETURN TO FEED</button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700">
            <ProfileHero
                activeAddress={activeAddress}
                balance={balance}
                availableWallets={availableWallets}
                setActiveAddress={setActiveAddress}
                refreshBalance={refreshBalance}
                logout={logout}
                navigate={navigate}
                protocolStatus={protocolStatus}
                hasProfile={hasProfile}
                memberProfile={memberProfile}
                programReady={!!program}
            />

            {/* Publication Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                    { label: 'Network Publications', value: myPosts.length.toString(), icon: FlaskConical, color: 'text-[#A78BFA]', bg: 'bg-[#7C3AED]/10' },
                    { label: 'Cumulative Influence', value: totalUpvotes.toLocaleString(), icon: Zap, color: 'text-[#F6851B]', bg: 'bg-[#F6851B]/10' },
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-10 flex flex-col items-center text-center gap-6 group hover:border-white/20 transition-all duration-500">
                        <div className={clsx('w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform', stat.bg)}>
                            <stat.icon className={clsx('w-8 h-8', stat.color)} />
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] mb-2">{stat.label}</p>
                            <p className="text-5xl font-bold text-white tracking-tighter leading-none">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* On-Chain Research Feed */}
            <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-xl flex items-center justify-center">
                            <Microscope className="w-5 h-5 text-[#A78BFA]" />
                        </div>
                        <h3 className="text-2xl font-bold uppercase tracking-tight text-white">MY RESEARCH GRAPH</h3>
                     </div>
                     <div className="flex gap-4">
                         {!hasProfile && (
                            <button onClick={handleActivateIdentity} disabled={isInitializing} className="h-10 px-6 bg-[#F6851B] text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all">
                                {isInitializing ? 'BUFFERING...' : 'ACTIVATE_NETWORK_IDENTITY'}
                            </button>
                         )}
                         <button onClick={() => navigate('/studio')} className="h-10 px-6 bg-white border border-white rounded-xl text-[10px] font-black uppercase tracking-widest text-black hover:bg-white/90 transition-all">
                            + CREATE_NODE
                         </button>
                     </div>
                </div>

                {myPosts.length === 0 ? (
                    <div className="glass-panel py-24 text-center space-y-8 bg-black/40 border-dashed border-2 border-white/5">
                        <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[32px] mx-auto flex items-center justify-center opacity-30">
                            <FlaskConical className="w-10 h-10" />
                        </div>
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-white/40 uppercase tracking-[0.4em]">NO RESEARCH NODES IDENTIFIED</p>
                            <p className="text-[10px] uppercase tracking-widest text-white/10 font-bold max-w-sm mx-auto leading-relaxed">Publish your first scientific node to start building your on-chain research reputation.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {myPosts.map((post) => (
                            <div
                                key={post.id}
                                onClick={() => navigate(`/node/${post.id}`)}
                                className="glass-card p-8 group cursor-pointer flex flex-col md:flex-row justify-between gap-8 hover:border-[#F6851B]/40 hover:bg-white/5 transition-all duration-300"
                            >
                                <div className="space-y-6 flex-1">
                                    <div className="flex items-center gap-4">
                                        <span className={clsx(
                                            'px-3.5 py-1.5 border rounded-lg text-[9px] font-bold uppercase tracking-[0.2em] shadow-xl',
                                            typeStyle[post.type] ?? typeStyle.Research
                                        )}>
                                            {post.type}
                                        </span>
                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Transaction_{post.id.slice(0, 10)}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold tracking-tight text-white uppercase group-hover:text-gradient-orange transition-all">
                                        {post.title}
                                    </h3>
                                    {post.abstract && (
                                        <p className="text-xs text-white/40 font-medium uppercase tracking-tight leading-relaxed line-clamp-2">{post.abstract}</p>
                                    )}
                                </div>
                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-white/5 md:pl-10 shrink-0 gap-6">
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-2">Network Upvotes</p>
                                        <p className="text-4xl font-bold text-white tracking-tighter leading-none">{post.upvotes.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.1em] mb-2">Block_Created</p>
                                        <p className="text-base font-bold text-[#F6851B] uppercase tracking-widest">{post.createdAt}</p>
                                    </div>
                                    <div className="hidden md:flex w-12 h-12 border border-white/10 bg-white/5 items-center justify-center rounded-2xl group-hover:bg-[#F6851B] group-hover:border-[#F6851B] transition-all duration-500">
                                        <ArrowUpRight className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ActivityHistory
                history={history}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                setCurrentPage={setCurrentPage}
                isLoading={isLoadingHistory}
                onRefresh={fetchHistory}
            />
        </div>
    );
};

export default ProfileView;
