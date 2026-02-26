import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit';

/**
 * SocialProviders wraps the application with authentication and social protocol providers.
 * Using Privy for social login and Solana wallet integration.
 */
export const SocialProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Correct Privy App ID provided by user
    const PRIVY_APP_ID = 'cmjwevmi40382ih0bcxl3nqoz';

    return (
        <PrivyProvider
            appId={PRIVY_APP_ID}
            config={{
                appearance: {
                    theme: 'dark',
                    accentColor: '#0066FF',
                    showWalletLoginFirst: true, // Improved UX for wallet-first apps
                    walletChainType: 'solana-only',
                },
                externalWallets: {
                    solana: {
                        connectors: toSolanaWalletConnectors(),
                    },
                },
                embeddedWallets: {
                    solana: {
                        createOnLogin: 'all-users',
                    }
                },
                solana: {
                    rpcs: {
                        'solana:mainnet': {
                            rpc: createSolanaRpc('https://api.mainnet-beta.solana.com'),
                            rpcSubscriptions: createSolanaRpcSubscriptions('wss://api.mainnet-beta.solana.com'),
                        },
                        'solana:mainnet-beta': {
                            rpc: createSolanaRpc('https://api.mainnet-beta.solana.com'),
                            rpcSubscriptions: createSolanaRpcSubscriptions('wss://api.mainnet-beta.solana.com'),
                        },
                        'solana:devnet': {
                            rpc: createSolanaRpc('https://api.devnet.solana.com'),
                            rpcSubscriptions: createSolanaRpcSubscriptions('wss://api.devnet.solana.com'),
                        }
                    }
                }
            }}
        >
            {children}
        </PrivyProvider>
    );
};
