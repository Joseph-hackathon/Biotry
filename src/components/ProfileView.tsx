import React, { useState } from 'react';
import { FlaskConical, ArrowUpRight, Activity, User, Microscope, Copy, Check, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useSolana } from '../context/useSolana';
import { initializeDao, findDaoConfigPDA, createProfile } from '../lib/program';
import { PublicKey } from '@solana/web3.js';
import { Shield, AlertCircle, History, ExternalLink, Clock } from 'lucide-react';
import ActivityHistory from './profile/ActivityHistory';
import ProfileHero from './profile/ProfileHero';
import { truncateAddress } from '../utils/address';

const typeStyle: Record<string, string> = {
    Research: 'bg-accent-softPurple border-black text-accent-purple',
    Critique: 'bg-accent-softPink border-black text-accent-pink',
    Investigation: 'bg-gray-100 border-black text-black',
};

const ProfileView: React.FC = () => {
    const { authenticated, login, logout, user, connectWallet, linkWallet } = usePrivy();
    const { proposals: posts } = useAppContext();
    const { program, solanaAddress, availableWallets, setActiveAddress, balance, refreshBalance, hasProfile, refreshProfile, memberProfile, showTransactionModal, showSystemModal } = useSolana();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);
    const [daoStatus, setDaoStatus] = useState<'checking' | 'initialized' | 'not-initialized'>('checking');
    const [showWalletSelector, setShowWalletSelector] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const activeAddress = solanaAddress || '';
    const myAuthorTag = activeAddress ? truncateAddress(activeAddress) : null;

    React.useEffect(() => {
        const checkDaoStatus = async () => {
            if (!program) {
                setDaoStatus('checking');
                return;
            }
            try {
                const [configPDA] = findDaoConfigPDA();
                const account = await (program.account as any).daoConfig.fetch(configPDA);
                if (account) setDaoStatus('initialized');
            } catch (e) {
                console.log('DAO Not initialized yet');
                setDaoStatus('not-initialized');
            }
        };
        checkDaoStatus();
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

            // Fetch detailed transaction info to categorize
            const detailedHistory = await Promise.all(signatures.map(async (sig) => {
                try {
                    const tx = await connection.getParsedTransaction(sig.signature, { maxSupportedTransactionVersion: 0 });
                    let category = 'GENERIC';
                    if (tx && tx.meta && tx.meta.logMessages) {
                        const logs = tx.meta.logMessages.join(' ');
                        if (logs.includes('Instruction: CreateProfile')) category = 'DAO_JOIN';
                        else if (logs.includes('Instruction: VoteOnProposal')) category = 'UPVOTE';
                        else if (logs.includes('Instruction: SubmitProposal')) category = 'PUBLISH';
                        else if (logs.includes('Instruction: InitializeDao')) category = 'DAO_INIT';
                    }
                    return { ...sig, category };
                } catch (e) {
                    return { ...sig, category: 'GENERIC' };
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

    const handleCopy = () => {
        if (!activeAddress) return;
        navigator.clipboard.writeText(activeAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const myPosts = myAuthorTag ? posts.filter(p => p.author === myAuthorTag) : [];
    const totalUpvotes = myPosts.reduce((sum, p) => sum + p.upvotes, 0);

    const handleJoinDao = async () => {
        if (!program || !activeAddress || isInitializing) return;

        const username = prompt('Enter Username:', '') || '';
        const bio = prompt('Enter Bio:', '') || '';

        if (!username) {
            showSystemModal({
                type: 'error',
                title: 'Required Field',
                message: 'A username is required to join the DAO.'
            });
            return;
        }

        setIsInitializing(true);
        try {
            console.log('[Profile] Creating profile for:', activeAddress);
            const { tx } = await createProfile(program, {
                owner: new PublicKey(activeAddress),
                username,
                bio
            });
            showTransactionModal({
                status: 'success',
                category: 'DAO_JOIN',
                txId: tx
            });
            await refreshProfile();
            fetchHistory();
        } catch (err: any) {
            console.error('Failed to create profile:', err);
            showTransactionModal({
                status: 'error',
                category: 'DAO_JOIN',
                message: err.message || String(err)
            });
        } finally {
            setIsInitializing(false);
        }
    };

    const handleInitializeDao = async () => {
        if (!program || !activeAddress || isInitializing) return;

        // Final safety check for base58 validity
        if (activeAddress === 'null' || activeAddress === 'undefined' || activeAddress.length < 32) {
            showTransactionModal({
                status: 'error',
                category: 'DAO_INIT',
                message: `Invalid wallet address detected (${activeAddress}). Please try reconnecting your wallet.`
            });
            return;
        }

        setIsInitializing(true);
        try {
            console.log('[Profile] Initializing DAO with address:', activeAddress);
            const daoName = prompt('Enter DAO Name:', 'Biotry DAO') || 'Biotry DAO';

            const cleanAddr = activeAddress.trim();
            const { tx } = await initializeDao(program, daoName, new PublicKey(cleanAddr));
            showTransactionModal({
                status: 'success',
                category: 'DAO_INIT',
                txId: tx
            });
            setDaoStatus('initialized');
            fetchHistory();
        } catch (err: any) {
            console.error('Failed to initialize DAO:', err);
            showTransactionModal({
                status: 'error',
                category: 'DAO_INIT',
                message: err.message || String(err)
            });
        } finally {
            setIsInitializing(false);
        }
    };

    if (!authenticated || !activeAddress) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-6 text-center">
                <div className="w-24 h-24 bg-accent-softPurple border-4 border-black flex items-center justify-center shadow-flat rotate-3">
                    <User className="w-12 h-12 text-accent-purple" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-display font-black uppercase tracking-tight text-black">
                        {!authenticated ? 'CONNECT NODE.' : 'LINK SOLANA WALLET.'}
                    </h2>
                    <p className="text-[11px] font-header font-black text-black/50 uppercase tracking-[0.2em] max-w-xs">
                        {!authenticated
                            ? 'LOGIN VIA PRIVY TO ACCESS THE RESEARCH GRAPH.'
                            : 'PLEASE LINK A SOLANA WALLET (PHANTOM/BACKPACK) TO VIEW YOUR RESEARCH PROFILE.'}
                    </p>
                </div>
                {!authenticated ? (
                    <button onClick={login} className="btn-illu-primary px-10 py-4">
                        LOGIN VIA PRIVY
                    </button>
                ) : (
                    <div className="flex flex-col gap-4">
                        {user?.linkedAccounts?.some(a => a.type === 'wallet' && (a as any).chainType === 'solana') ? (
                            <button
                                onClick={() => connectWallet()}
                                className="btn-illu-primary px-10 py-4"
                            >
                                CONNECT EXISTING WALLET
                            </button>
                        ) : (
                            <button
                                onClick={() => linkWallet()}
                                className="btn-illu-primary px-10 py-4"
                            >
                                LINK NEW WALLET
                            </button>
                        )}
                        <button onClick={() => navigate('/')} className="btn-illu-outline px-10 py-4">
                            RETURN TO JOURNAL
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-black">
            <div className="space-y-8 pb-10">
                <ProfileHero
                    activeAddress={activeAddress}
                    balance={balance}
                    availableWallets={availableWallets}
                    setActiveAddress={setActiveAddress}
                    refreshBalance={refreshBalance}
                    logout={logout}
                    navigate={navigate}
                    daoStatus={daoStatus}
                    hasProfile={hasProfile}
                    memberProfile={memberProfile}
                    programReady={!!program}
                />

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                        { label: 'Publications', value: myPosts.length.toString(), icon: FlaskConical, color: 'text-accent-purple', bg: 'bg-accent-softPurple' },
                        { label: 'Total Upvotes', value: totalUpvotes.toLocaleString(), icon: Activity, color: 'text-accent-pink', bg: 'bg-accent-softPink' },
                    ].map((stat, i) => (
                        <div key={i} className="illustration-card group flex flex-col items-center text-center gap-4 py-8 bg-white hover:-translate-y-1 transition-all duration-200">
                            <div className={`w-14 h-14 ${stat.bg} border-3 border-black flex items-center justify-center shadow-flat-sm group-hover:shadow-flat transition-all`}>
                                <stat.icon className={clsx('w-8 h-8', stat.color)} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-4xl font-display font-black text-black tracking-tight leading-none uppercase">{stat.value}</p>
                                <p className="text-[11px] font-header font-black text-black/40 uppercase tracking-[0.2em]">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* My Posts */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-display font-black uppercase tracking-tight text-black">MY RESEARCH GRAPH</h3>

                    {myPosts.length === 0 ? (
                        <div className="illustration-card flex flex-col items-center py-16 text-center space-y-6 bg-white">
                            <div className="w-20 h-20 bg-gray-100 border-3 border-black flex items-center justify-center rotate-6">
                                <FlaskConical className="w-10 h-10 text-black/20" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-header font-black text-black uppercase tracking-[0.2em]">GRAPH IS EMPTY.</p>
                                <p className="text-[11px] font-header font-black text-black/40 uppercase tracking-[0.15em] max-w-xs">
                                    PUBLISH YOUR FIRST RESEARCH NODE TO START BUILDING YOUR SCIENTIFIC REPUTATION.
                                </p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-4">
                                <button onClick={() => navigate('/studio')} className="btn-illu-primary px-10 py-4">
                                    NEW POST
                                </button>
                                {!hasProfile && (
                                    <button
                                        onClick={handleJoinDao}
                                        disabled={isInitializing}
                                        className="btn-illu-primary px-10 py-4 bg-accent-purple text-white border-black"
                                    >
                                        {isInitializing ? 'JOINING...' : 'JOIN BIOTRY DAO'}
                                    </button>
                                )}
                                {daoStatus === 'not-initialized' && (
                                    <button
                                        onClick={handleInitializeDao}
                                        disabled={isInitializing}
                                        className="btn-illu-outline px-10 py-4 border-accent-purple text-accent-purple"
                                    >
                                        {isInitializing ? 'INITIALIZING...' : 'INITIALIZE DAO'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {myPosts.map((post) => (
                                <div
                                    key={post.id}
                                    onClick={() => navigate(`/node/${post.id}`)}
                                    className="illustration-card group cursor-pointer flex flex-col md:flex-row justify-between gap-6 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all bg-white"
                                >
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className={clsx(
                                                'px-3 py-1.5 border-2 text-[10px] font-header font-black uppercase tracking-[0.2em] shadow-flat-xs',
                                                typeStyle[post.type] ?? typeStyle.Research
                                            )}>
                                                {post.type}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-display font-black uppercase tracking-tight text-black leading-tight group-hover:text-accent-purple transition-colors">
                                            {post.title}
                                        </h3>
                                        {post.abstract && (
                                            <p className="text-xs text-black/60 font-black uppercase tracking-tight leading-relaxed line-clamp-2">{post.abstract}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between pt-4 md:pt-0 border-t-2 md:border-t-0 md:border-l-2 border-black md:pl-6 shrink-0 gap-4">
                                        <div className="text-right">
                                            <p className="text-2xl font-display font-black text-black">{post.upvotes.toLocaleString()}</p>
                                            <p className="text-[9px] font-header font-black text-black/40 uppercase">UPVOTES</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-header font-black text-black uppercase tracking-widest">{post.createdAt}</p>
                                            <p className="text-[9px] font-header font-black text-accent-pink uppercase">PUBLISHED</p>
                                        </div>
                                        <div className="hidden md:flex w-10 h-10 border-3 border-black bg-white items-center justify-center group-hover:bg-accent-softPurple shadow-flat-xs transition-all">
                                            <ArrowUpRight className="w-5 h-5 text-black" />
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
            </div >
        </div >
    );
};

export default ProfileView;
