import React, { createContext, useContext, useState, useMemo, useEffect, useRef } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Idl } from '@coral-xyz/anchor';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useStandardWallets } from '@privy-io/react-auth/solana';
import { buildBiotryProgram, fetchMemberProfile, isProfileInitialized } from '../lib/program';
import idl from '../lib/bio_dao_idl.json';
import TransactionModal, { TransactionCategory } from '../components/TransactionModal';
import SystemModal, { SystemModalType } from '../components/SystemModal';

export type SolanaNetwork = 'devnet' | 'mainnet-beta' | 'localhost';

interface SolanaContextValue {
    connection: Connection;
    program: Program | null;
    network: SolanaNetwork;
    setNetwork: (network: SolanaNetwork) => void;
    isReady: boolean;
    solanaAddress: string | null;
    availableWallets: any[];
    setActiveAddress: (addr: string) => void;
    balance: number | null;
    refreshBalance: () => Promise<void>;
    memberProfile: any | null;
    hasProfile: boolean;
    refreshProfile: () => Promise<void>;
    hasProtocolConfig: boolean;
    initializeHub: () => Promise<void>;
    showTransactionModal: (params: {
        status: 'success' | 'error';
        category: TransactionCategory;
        txId?: string;
        message?: string;
    }) => void;
    showSystemModal: (params: {
        type: SystemModalType;
        title: string;
        message: string;
    }) => void;
}

export const SolanaContext = createContext<SolanaContextValue | null>(null);

export const useSolana = () => {
    const context = useContext(SolanaContext);
    if (!context) throw new Error('useSolana must be used within a SolanaProvider');
    return context;
};

const sanitize = (addr: any): string | null => {
    if (!addr || typeof addr !== 'string') return null;
    let clean = addr;
    if (addr.includes(':')) {
        clean = addr.split(':').pop() || addr;
    }
    clean = clean.trim();
    if (clean.startsWith('0x') && clean.length === 42) return null;
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(clean)) return null;
    return clean;
};

export const SolanaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { authenticated, user } = usePrivy();
    const { wallets: standardWallets } = useStandardWallets();
    const { wallets: allWallets } = useWallets();

    const [network, setNetwork] = useState<SolanaNetwork>('devnet');
    const [program, setProgram] = useState<Program | null>(null);
    const [solanaAddress, setSolanaAddress] = useState<string | null>(null);
    const [availableWallets, setAvailableWallets] = useState<any[]>([]);
    const [balance, setBalance] = useState<number | null>(null);
    const [memberProfile, setMemberProfile] = useState<any | null>(null);
    const [hasProfile, setHasProfile] = useState(false);
    const [hasProtocolConfig, setHasProtocolConfig] = useState(false);
    const [isReady, setIsReady] = useState(false);

    // Modal State
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        status: 'success' | 'error';
        category: TransactionCategory;
        txId?: string;
        message?: string;
    }>({
        isOpen: false,
        status: 'success',
        category: 'GENERIC'
    });

    const [systemModalConfig, setSystemModalConfig] = useState<{
        isOpen: boolean;
        type: SystemModalType;
        title: string;
        message: string;
    }>({
        isOpen: false,
        type: 'info',
        title: '',
        message: ''
    });

    const connection = useMemo(() => {
        const endpoint = network === 'localhost' ? 'http://127.0.0.1:8899' : clusterApiUrl(network);
        return new Connection(endpoint, 'confirmed');
    }, [network]);

    const refreshBalance = async () => {
        if (!solanaAddress) return;
        try {
            const bal = await connection.getBalance(new PublicKey(solanaAddress));
            setBalance(bal / 1e9);
        } catch (e) {
            console.error('[Solana] Balance fetch failed:', e);
        }
    };

    const refreshProfile = async () => {
        if (!program || !solanaAddress) return;
        try {
            const exists = await isProfileInitialized(program, new PublicKey(solanaAddress));
            setHasProfile(exists);
            if (exists) {
                const profile = await fetchMemberProfile(program, new PublicKey(solanaAddress));
                setMemberProfile(profile);
            } else {
                setMemberProfile(null);
            }
        } catch (e) {
            console.error('[Solana] Profile fetch failed:', e);
            setHasProfile(false);
            setMemberProfile(null);
        }
    };

    const checkProtocolConfig = async () => {
        if (!program) return;
        try {
            const { findDaoConfigPDA } = await import('../lib/program');
            const [configPDA] = findDaoConfigPDA();
            const accountInfo = await connection.getAccountInfo(configPDA);
            setHasProtocolConfig(accountInfo !== null);
        } catch (e) {
            setHasProtocolConfig(false);
        }
    };

    const initializeHub = async () => {
        if (!program || !solanaAddress) return;
        try {
            const { initializeDao } = await import('../lib/program');
            const { tx } = await initializeDao(program, "Biotry Network Hub", new PublicKey(solanaAddress));
            showTransactionModal({ status: 'success', category: 'GENERIC', txId: tx, message: 'Biotry Network Initialized Successfully' });
            setHasProtocolConfig(true);
        } catch (e: any) {
            showTransactionModal({ status: 'error', category: 'GENERIC', message: e.message || String(e) });
        }
    };

    // 1. Sync & Discover Wallets
    useEffect(() => {
        if (!authenticated) {
            setAvailableWallets([]);
            setSolanaAddress(null);
            setProgram(null);
            setIsReady(false);
            return;
        }

        const valid = allWallets
            .map(w => ({ ...w, cleanAddress: sanitize(w.address) }))
            .filter(w => w.cleanAddress !== null);

        setAvailableWallets(valid);

        // SYNC LOGIC: Check if user already has a linked Solana wallet in their Privy account
        const linkedSolanaAccount = user?.linkedAccounts?.find(a => a.type === 'wallet' && (a as any).chainType === 'solana');
        const linkedAddr = linkedSolanaAccount ? sanitize((linkedSolanaAccount as any).address) : null;

        if (linkedAddr && !solanaAddress) {
            console.log('[Solana] Found existing linked wallet in Privy profile:', linkedAddr);
            setSolanaAddress(linkedAddr);
        } else if (!solanaAddress && valid.length > 0) {
            // Fallback: auto-select the first discovered wallet (prioritize Phantom)
            const phantom = valid.find(w => w.walletClientType === 'phantom');
            const selection = phantom || valid[0];
            console.log('[Solana] Auto-selected discovered wallet:', selection.cleanAddress);
            setSolanaAddress(selection.cleanAddress);
        }
    }, [authenticated, allWallets, user, solanaAddress]);

    // 2. Initialize Program
    useEffect(() => {
        const init = async () => {
            if (!solanaAddress) {
                setProgram(null);
                setIsReady(false);
                return;
            }

            // Find wallet in standardWallets OR any linked Solana wallet in allWallets
            const sw = standardWallets.find(w => sanitize(w.accounts[0]?.address) === solanaAddress);
            const aw = allWallets.find(w => sanitize(w.address) === solanaAddress);

            if (!sw && !aw) {
                console.log('[Solana] Active address not yet available in any wallet list:', solanaAddress);
                setIsReady(false);
                return;
            }

            try {
                const anchorWallet = {
                    publicKey: new PublicKey(solanaAddress),
                    signTransaction: async (tx: any) => {
                        if (sw) {
                            const feature = sw.features['solana:signTransaction'];
                            if (!feature) throw new Error('Wallet lacks signTransaction feature');
                            const [out] = await feature.signTransaction({
                                account: sw.accounts[0],
                                transaction: tx.serialize({ verifySignatures: false, requireAllSignatures: false }),
                                chain: (network === 'mainnet-beta' ? 'solana:mainnet' : 'solana:devnet') as any
                            });
                            return tx.constructor.from(out.signedTransaction);
                        } else if (aw) {
                            // Fallback to Privy universal sign (Privy Embedded or other)
                            const txRes = await (aw as any).signTransaction(tx);
                            return txRes;
                        }
                        throw new Error('No wallet available for signing');
                    },
                    signAllTransactions: async (txs: any[]) => {
                        if (sw) {
                            const feature = sw.features['solana:signTransaction'];
                            if (!feature) throw new Error('Wallet lacks signTransaction feature');
                            const outputs = await feature.signTransaction(...txs.map(tx => ({
                                account: sw.accounts[0],
                                transaction: tx.serialize(),
                                chain: (network === 'mainnet-beta' ? 'solana:mainnet' : 'solana:devnet') as any
                            })));
                            return outputs.map((out, i) => txs[i].constructor.from(out.signedTransaction));
                        } else if (aw) {
                            return Promise.all(txs.map(tx => (aw as any).signTransaction(tx)));
                        }
                        throw new Error('No wallet available for signing');
                    }
                };

                const biotryProgram = buildBiotryProgram(anchorWallet, idl as unknown as Idl, connection);
                setProgram(biotryProgram);
                setIsReady(true);
                console.log('[Solana] Program Ready');
                refreshBalance();
                refreshProfile();
                checkProtocolConfig();
            } catch (err) {
                console.error('[Solana] Init failed:', err);
                setIsReady(false);
            }
        };

        init();
    }, [solanaAddress, standardWallets, network, connection]);

    const showTransactionModal = (params: {
        status: 'success' | 'error';
        category: TransactionCategory;
        txId?: string;
        message?: string;
    }) => {
        setModalConfig({ ...params, isOpen: true });
    };

    const showSystemModal = (params: {
        type: SystemModalType;
        title: string;
        message: string;
    }) => {
        setSystemModalConfig({ ...params, isOpen: true });
    };

    const value = useMemo(() => ({
        connection, program, network, setNetwork, isReady,
        solanaAddress, availableWallets, setActiveAddress: setSolanaAddress,
        balance, refreshBalance,
        memberProfile, hasProfile, refreshProfile,
        hasProtocolConfig, initializeHub,
        showTransactionModal,
        showSystemModal
    }), [connection, program, network, isReady, solanaAddress, availableWallets, balance, memberProfile, hasProfile, hasProtocolConfig]);

    return (
        <SolanaContext.Provider value={value}>
            {children}
            <TransactionModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                status={modalConfig.status}
                category={modalConfig.category}
                txId={modalConfig.txId}
                message={modalConfig.message}
                cluster={network === 'mainnet-beta' ? 'mainnet-beta' : 'devnet'}
            />
            <SystemModal
                isOpen={systemModalConfig.isOpen}
                onClose={() => setSystemModalConfig(prev => ({ ...prev, isOpen: false }))}
                type={systemModalConfig.type}
                title={systemModalConfig.title}
                message={systemModalConfig.message}
            />
        </SolanaContext.Provider>
    );
};

