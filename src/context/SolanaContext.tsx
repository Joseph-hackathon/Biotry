import React, { createContext, useContext, useState, useMemo, useEffect, useRef } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Idl } from '@coral-xyz/anchor';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useStandardWallets } from '@privy-io/react-auth/solana';
import { buildBiotryProgram, fetchMemberProfile, isProfileInitialized } from '../lib/program';
import idl from '../lib/bio_dao_idl.json';
import { useUI } from './UIContext';

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
    const { showTransactionModal, showSystemModal } = useUI();

    const [network, setNetwork] = useState<SolanaNetwork>('devnet');
    const [program, setProgram] = useState<Program | null>(null);
    const [solanaAddress, setSolanaAddress] = useState<string | null>(null);
    const [availableWallets, setAvailableWallets] = useState<any[]>([]);
    const [balance, setBalance] = useState<number | null>(null);
    const [memberProfile, setMemberProfile] = useState<any | null>(null);
    const [hasProfile, setHasProfile] = useState(false);
    const [hasProtocolConfig, setHasProtocolConfig] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const connection = useMemo(() => {
        const endpoint = network === 'localhost' 
            ? 'http://127.0.0.1:8899' 
            : (network === 'devnet' ? 'https://api.devnet.solana.com' : clusterApiUrl(network));
        
        return new Connection(endpoint, {
            commitment: 'confirmed',
            disableRetryOnRateLimit: false,
            confirmTransactionInitialTimeout: 60000
        });
    }, [network]);

    const lastRefreshRef = useRef<number>(0);
    const THROTTLE_MS = 2000;

    const refreshBalance = async () => {
        if (!solanaAddress) return;
        const now = Date.now();
        if (now - lastRefreshRef.current < THROTTLE_MS) return;
        
        try {
            lastRefreshRef.current = now;
            const bal = await connection.getBalance(new PublicKey(solanaAddress));
            setBalance(bal / 1e9);
        } catch (e: any) {
            console.error('[Solana] Balance fetch failed:', e);
            if (e.message?.includes('429')) {
                showSystemModal({
                    type: 'warning',
                    title: 'Network Congestion',
                    message: 'Solana Devnet is currently experiencing high traffic.'
                });
            }
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

        const linkedSolanaAccount = user?.linkedAccounts?.find(a => a.type === 'wallet' && (a as any).chainType === 'solana');
        const linkedAddr = linkedSolanaAccount ? sanitize((linkedSolanaAccount as any).address) : null;

        if (linkedAddr && !solanaAddress) {
            setSolanaAddress(linkedAddr);
        } else if (!solanaAddress && valid.length > 0) {
            const phantom = valid.find(w => w.walletClientType === 'phantom');
            const selection = phantom || valid[0];
            setSolanaAddress(selection.cleanAddress);
        }
    }, [authenticated, allWallets, user, solanaAddress]);

    const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const init = async () => {
            if (!solanaAddress) {
                setProgram(null);
                setIsReady(false);
                return;
            }

            const sw = standardWallets.find(w => sanitize(w.accounts[0]?.address) === solanaAddress);
            const aw = allWallets.find(w => sanitize(w.address) === solanaAddress);

            if (!sw && !aw) {
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
                            return await (aw as any).signTransaction(tx);
                        }
                        throw new Error('No wallet available');
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
                        throw new Error('No wallet available');
                    }
                };

                const biotryProgram = buildBiotryProgram(anchorWallet, idl as unknown as Idl, connection);
                setProgram(biotryProgram);
                setIsReady(true);
                
                await Promise.allSettled([
                    refreshBalance(),
                    refreshProfile(),
                    checkProtocolConfig()
                ]);
            } catch (err) {
                setIsReady(false);
            }
        };

        if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = setTimeout(init, 300);

        return () => {
            if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current);
        };
    }, [solanaAddress, standardWallets, network, connection]);

    const value = useMemo(() => ({
        connection, program, network, setNetwork, isReady,
        solanaAddress, availableWallets, setActiveAddress: setSolanaAddress,
        balance, refreshBalance,
        memberProfile, hasProfile, refreshProfile,
        hasProtocolConfig, initializeHub
    }), [connection, program, network, isReady, solanaAddress, availableWallets, balance, memberProfile, hasProfile, hasProtocolConfig]);

    return (
        <SolanaContext.Provider value={value}>
            {children}
        </SolanaContext.Provider>
    );
};

