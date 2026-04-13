import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Post, Comment } from '../types';

interface AppContextValue {
    proposals: Post[];
    members: any[];
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    addProposal: (proposal: Post) => void;
    voteOnProposal: (proposalId: string, approve: boolean) => void;
    fundPost: (postId: string, amount: number) => void;
    addComment: (postId: string, author: string, content: string, walletAddress?: string) => void;
    comments: Record<string, Comment[]>;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [proposals, setProposals] = useState<Post[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [comments, setComments] = useState<Record<string, Comment[]>>({});

    const API_URL = (import.meta.env.VITE_API_BASE_URL || 'https://biotry-production.up.railway.app') + '/api';

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetch(`${API_URL}/posts`);
                if (response.ok) {
                    const data = await response.json();
                    setProposals(data);
                }
            } catch (err) {
                console.error("Failed to load posts from backend:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [API_URL]);

    const addProposal = useCallback(async (proposalData: Post) => {
        setProposals(prev => [proposalData, ...prev]);

        try {
            const response = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(proposalData)
            });
            if (!response.ok) console.error("Failed to persist proposal to backend");
        } catch (err) {
            console.error("Error adding proposal to backend:", err);
        }
    }, [API_URL]);

    const addComment = useCallback(async (postId: string, author: string, content: string, walletAddress?: string) => {
        const newComment: Comment = {
            id: Math.random().toString(36).substr(2, 9),
            author,
            content,
            createdAt: 'Just now',
            upvotes: 0
        };
        setComments(prev => ({
            ...prev,
            [postId]: [...(prev[postId] || []), newComment],
        }));

        // Persistent Social Graph Anchoring
        if (walletAddress) {
            const { postComment } = await import('../lib/tapestry');
            await postComment(walletAddress, postId, content);
        }
    }, []);

    const voteOnProposal = useCallback((proposalId: string, approve: boolean) => {
        setProposals(prev =>
            prev.map(p => p.id === proposalId
                ? { ...p, upvotes: approve ? (p.upvotes || 0) + 1 : (p.upvotes || 0) }
                : p
            )
        );
    }, []);

    const fundPost = useCallback((postId: string, amount: number) => {
        setProposals(prev =>
            prev.map(p => p.id === postId
                ? { 
                    ...p, 
                    fundUSDC: (p.fundUSDC || 0) + amount,
                    fundCount: (p.fundCount || 0) + 1
                  }
                : p
            )
        );
    }, []);

    return (
        <AppContext.Provider value={{ proposals, members, searchQuery, setSearchQuery, addProposal, voteOnProposal, fundPost, addComment, comments }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useAppContext must be used within AppProvider');
    return ctx;
};
