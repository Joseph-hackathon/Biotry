import { 
    createWallet, 
    listWallets, 
    signMessage, 
    getWallet 
} from '@open-wallet-standard/core';
import path from 'path';
import fs from 'fs';

const VAULT_PATH = path.join(process.cwd(), 'ows-vault');
const AGENT_NAME = 'BiotryAuditAgent';
const PASSPHRASE = process.env.AGENT_PASSPHRASE || 'biotry-agent-secure-vault-pass';

/**
 * Ensures the Agent Wallet exists in the OWS Vault.
 * Returns the Agent's Solana address.
 */
export async function initializeAgentWallet(): Promise<string> {
    if (!fs.existsSync(VAULT_PATH)) {
        fs.mkdirSync(VAULT_PATH, { recursive: true });
    }

    try {
        const wallets = listWallets(VAULT_PATH);
        const existingAgent = wallets.find(w => w.name === AGENT_NAME);

        if (existingAgent) {
            const solanaAccount = existingAgent.accounts.find((a: any) => a.chainId === 'solana');
            console.log(`[OWS] Agent Wallet Loaded: ${solanaAccount?.address}`);
            return solanaAccount?.address || '';
        }

        console.log(`[OWS] Creating new Agent Wallet: ${AGENT_NAME}...`);
        const newWallet = createWallet(AGENT_NAME, PASSPHRASE, 12, VAULT_PATH);
        const solanaAccount = newWallet.accounts.find((a: any) => a.chainId === 'solana');
        
        console.log(`[OWS] Agent Wallet Created: ${solanaAccount?.address}`);
        return solanaAccount?.address || '';
    } catch (error) {
        console.error('[OWS] Failed to initialize Agent Wallet:', error);
        throw error;
    }
}

/**
 * signs the audit report data using the Agent's Solana private key.
 */
export async function signAgentAudit(auditData: any): Promise<{ signature: string, address: string }> {
    const message = JSON.stringify(auditData);
    const wallets = listWallets(VAULT_PATH);
    const agent = wallets.find(w => w.name === AGENT_NAME);

    if (!agent) {
        throw new Error('Agent wallet not found. Run initializeAgentWallet first.');
    }

    const solanaAccount = agent.accounts.find((a: any) => a.chainId === 'solana');
    if (!solanaAccount) {
        throw new Error('Solana account not found in Agent wallet.');
    }

    // signMessage(walletId, chain, message, passphrase, encoding, index, vaultPath)
    const result = signMessage(
        agent.id,
        'solana',
        message,
        PASSPHRASE,
        'utf8',
        0,
        VAULT_PATH
    );

    return {
        signature: result.signature,
        address: solanaAccount.address
    };
}
