import { useMemo, useCallback, useState } from 'react';
import { Provider } from '@coral-xyz/anchor';
import { UmbraProtocol } from '../lib/umbraProtocol';

/**
 * Custom hook for Umbra Privacy Protocol interactions.
 * Bridges the Solana Context (Provider/Wallet) with the Privacy Layer.
 */
export const useUmbra = (provider: Provider | null) => {
    const [isFunding, setIsFunding] = useState(false);

    const umbra = useMemo(() => {
        if (!provider) return null;
        return new UmbraProtocol(provider);
    }, [provider]);

    const getStealthAddress = useCallback(async (recipient: string) => {
        if (!umbra) throw new Error('Umbra Protocol not initialized. Connect wallet.');
        return await umbra.generateStealthAddress(recipient);
    }, [umbra]);

    const fundAnonymously = useCallback(async (params: { 
        amount: number; 
        recipient: string; 
        donor: string;
    }) => {
        if (!umbra) throw new Error('Umbra Protocol not initialized. Connect wallet.');
        try {
            setIsFunding(true);
            return await umbra.executeStealthGrant(params);
        } finally {
            setIsFunding(false);
        }
    }, [umbra]);

    return {
        getStealthAddress,
        fundAnonymously,
        isFunding,
        verifyGrantPrivacy: umbra ? umbra.verifyGrantPrivacy.bind(umbra) : () => false,
        getShieldedBalance: umbra ? () => umbra.getShieldedBalance() : () => 0,
        generatePrivacyProof: umbra ? umbra.generatePrivacyProof.bind(umbra) : null
    };
};
