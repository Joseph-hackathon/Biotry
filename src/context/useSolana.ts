import { useContext } from 'react';
import { SolanaContext } from './SolanaContext';

export const useSolana = () => {
    const ctx = useContext(SolanaContext);
    if (!ctx) throw new Error('useSolana must be used within SolanaProvider');
    return ctx;
};
