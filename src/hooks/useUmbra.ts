import { useMemo, useCallback } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { UmbraProtocol } from '../lib/umbraProtocol';

/**
 * Custom hook for Umbra Privacy Protocol interactions.
 */
export const useUmbra = (connection: Connection) => {
    const umbra = useMemo(() => new UmbraProtocol(connection), [connection]);

    const getStealthAddress = useCallback(async (recipient: string) => {
        return await umbra.generateStealthAddress(recipient);
    }, [umbra]);

    const fundAnonymously = useCallback(async (params: { 
        amount: number; 
        recipient: string; 
        donor: string;
    }) => {
        return await umbra.executeStealthGrant(params);
    }, [umbra]);

    return {
        getStealthAddress,
        fundAnonymously,
        verifyGrantPrivacy: umbra.verifyGrantPrivacy.bind(umbra)
    };
};
