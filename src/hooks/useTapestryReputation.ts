import { useState, useEffect } from 'react';
import { getResearcherReputation } from '../lib/tapestry';

export interface ReputationData {
    score: number;
    badges: Array<{ id: string; label: string; color: string }>;
    followerCount: number;
    loading: boolean;
}

/**
 * Custom hook to fetch and manage a researcher's social reputation 
 * from the Tapestry social graph.
 */
export const useTapestryReputation = (walletAddress: string | null) => {
    const [data, setData] = useState<ReputationData>({
        score: 0,
        badges: [],
        followerCount: 0,
        loading: true
    });

    useEffect(() => {
        if (!walletAddress) {
            setData(prev => ({ ...prev, loading: false }));
            return;
        }

        const fetchReputation = async () => {
            setData(prev => ({ ...prev, loading: true }));
            const rep = await getResearcherReputation(walletAddress);
            setData({
                ...rep,
                loading: false
            });
        };

        fetchReputation();
    }, [walletAddress]);

    return data;
};
