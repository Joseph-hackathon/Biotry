import { Request, Response, NextFunction } from 'express';
import { Connection, PublicKey } from '@solana/web3.js';

const RECIPIENT_WALLET = process.env.RECIPIENT_WALLET || 'pvK3j774HX9g3fRX19csEoD1j1wcRgSNhmKjrSsGaM5';
const AUDIT_PRICE_USDC = process.env.AUDIT_PRICE_USDC || '0.1';
const SOLANA_NETWORK = 'https://api.devnet.solana.com';

/**
 * x402 Middleware: Implements the 'Payment Required' protocol for Pay-per-Call APIs.
 * Following Open Wallet Standard (x402).
 */
export const x402Middleware = async (req: Request, res: Response, next: NextFunction) => {
  const paymentSignature = req.header('X-PAYMENT-SIGNATURE') as string | undefined;

  // 1. If NO signature is provided, return 402 Challenge
  if (!paymentSignature) {
    res.setHeader('PAYMENT-REQUIRED', `network=solana:5eykt4UsFv8P8NJdTREpY1vzqf69S1v7; amount=${AUDIT_PRICE_USDC}; recipient=${RECIPIENT_WALLET}; token=USDC; type=mpp`);
    return res.status(402).json({
      error: 'Payment Required',
      message: 'This research audit requires a micropayment of 0.1 USDC.',
      instructions: {
        recipient: RECIPIENT_WALLET,
        amount: AUDIT_PRICE_USDC,
        currency: 'USDC',
        network: 'Solana Devnet'
      }
    });
  }

  // 2. If signature IS provided, verify it on-chain
  try {
    // Demo Mode: Allow mock signatures for hackathon testing
    // To disable, set DISABLE_DEMO_MODE=true in .env
    if (paymentSignature.startsWith('HACKATHON_DEMO_SIG_') && process.env.DISABLE_DEMO_MODE !== 'true') {
        console.log('[x402] Demo Signature Detected. Bypassing real verification.');
        return next();
    }

    const connection = new Connection(SOLANA_NETWORK, 'confirmed');
    
    // 3. Real On-Chain Verification using Parsed Transaction (with Retry Logic for Production Reliability)
    let tx = null;
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
        try {
            tx = await connection.getParsedTransaction(paymentSignature, { 
                maxSupportedTransactionVersion: 0,
                commitment: 'confirmed'
            });
            if (tx) break;
        } catch (e) {
            console.warn(`[x402] Attempt ${i + 1} failed:`, e);
        }
        
        if (i < maxRetries - 1) {
            console.log(`[x402] Transaction not found yet, retrying in 2s... (${i + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    if (!tx) {
      return res.status(402).json({ 
        error: 'Payment Pending', 
        message: 'Transaction found but not yet finalized. Please wait a moment and try starting the audit again.',
        detail: 'HINT: Solana Devnet occasionally has propagation delays. Retrying the START_STRATEGIC_AUDIT button shortly usually works.'
      });
    }

    // Inspect internal instructions for USDC Transfer (SPL Token)
    let isPaid = false;
    const postAmount = parseFloat(AUDIT_PRICE_USDC);

    // Check for SPL Token transfers in the transaction
    const tokenTransfers = tx.meta?.postTokenBalances || [];
    const recipientBalanceMatch = tokenTransfers.find(tb => 
      tb.owner === RECIPIENT_WALLET && 
      (tb.mint === '4zMMC9MSDRsbG22Wxy2ATaZ9toM71i2iaSjaMc9mws56' || tb.mint === 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v') // Devnet or Mainnet USDC
    );

    if (recipientBalanceMatch) {
       // Deep check for the actual delta in balance
       const preBalance = tx.meta?.preTokenBalances?.find(tb => tb.accountIndex === recipientBalanceMatch.accountIndex)?.uiTokenAmount.uiAmount || 0;
       const postBalance = recipientBalanceMatch.uiTokenAmount.uiAmount || 0;
       const delta = postBalance - preBalance;
       
       if (delta >= postAmount - 0.001) { // Allowance for precision
           isPaid = true;
       }
    }

    // Fallback: Check for native SOL transfer (if USDC is not found but SOL equivalent is there)
    if (!isPaid) {
        const solTransfer = tx.transaction.message.instructions.find(ix => {
            if ('parsed' in ix && ix.program === 'system' && ix.parsed.type === 'transfer') {
                return ix.parsed.info.destination === RECIPIENT_WALLET;
            }
            return false;
        });

        if (solTransfer && 'parsed' in solTransfer) {
            const lamports = solTransfer.parsed.info.lamports;
            const solAmount = lamports / 1e9;
            if (solAmount >= 0.0009) { // ~0.1 USD equivalent in SOL
                isPaid = true;
            }
        }
    }
    
    if (!isPaid) {
      return res.status(403).json({ error: 'Invalid Payment', message: `Transaction failed verification. Must send ${AUDIT_PRICE_USDC} USDC to ${RECIPIENT_WALLET}.` });
    }

    // Payment verified!
    console.log(`[x402] Payment Verified for signature: ${paymentSignature}`);
    next();
  } catch (error: any) {
    console.error('[x402] Verification Catch Error:', {
      message: error.message,
      stack: error.stack,
      signature: paymentSignature
    });
    res.status(500).json({ 
      error: 'Verification failed', 
      detail: `On-chain verification error: ${error.message || 'Unknown error'}. Ensure the signature '${paymentSignature}' is valid on Devnet.` 
    });
  }
};
