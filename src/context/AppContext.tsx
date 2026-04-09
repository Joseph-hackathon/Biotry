import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Post, Comment } from '../types';

const EDITORIAL_BOARD = [
    { id: '1', name: 'Dr. Sarah Chen', role: 'Genetics Lead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { id: '2', name: 'Prof. James Wilson', role: 'Neuroscience', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
    { id: '3', name: 'Dr. Elena Rossi', role: 'Longevity Research', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' }
];

const FEATURED_HUBS = [
    { id: '1', name: 'Longevity', icon: 'zap', count: 124 },
    { id: '2', name: 'Neurotech', icon: 'binary', count: 89 },
    { id: '3', name: 'Synthetic Bio', icon: 'flask', count: 56 }
];

const TOP_CONTRIBUTORS = [
    { id: '1', name: 'quantum_doc', points: 1240, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=quantum' },
    { id: '2', name: 'bio_hacker', points: 980, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hacker' },
    { id: '3', name: 'longevity_insider', points: 850, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=insider' }
];

interface AppContextValue {
    proposals: Post[];
    members: any[];
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    addProposal: (proposal: Post) => void;
    voteOnProposal: (proposalId: string, approve: boolean) => void;
    fundPost: (postId: string, amount: number) => void;
    addComment: (postId: string, author: string, content: string) => void;
    comments: Record<string, Comment[]>;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [proposals, setProposals] = useState<Post[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [comments, setComments] = useState<Record<string, Comment[]>>({});

    const API_URL = 'https://biotry-production.up.railway.app/api';

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
    }, []);

    const addProposal = useCallback(async (proposalData: Post) => {
        // Optimistic update
        setProposals(prev => [proposalData, ...prev]);

        try {
            const response = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(proposalData)
            });
            if (!response.ok) {
                console.error("Failed to persist proposal to backend");
            }
        } catch (err) {
            console.error("Error adding proposal to backend:", err);
        }
    }, []);

    const addComment = useCallback((postId: string, author: string, content: string) => {
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
    }, []);

    const voteOnProposal = useCallback((proposalId: string, approve: boolean) => {
        setProposals(prev =>
            prev.map(p => p.id === proposalId
                ? { ...p, upvotes: approve ? p.upvotes + 1 : p.upvotes }
                : p
            )
        );
    }, []);

    const fundPost = useCallback((postId: string, amount: number) => {
        // UI update: Synchronizes counts across the network for a seamless experience
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
