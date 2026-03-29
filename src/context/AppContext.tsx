import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { apiClient } from '../lib/api';
// AppContext.tsx
import type { Post, Comment } from '../types';

interface AppContextValue {
    proposals: Post[];
    members: any[];
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    addProposal: (proposal: Post) => void;
    voteOnProposal: (proposalId: string, approve: boolean) => void;
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

    useEffect(() => {
        const loadData = async () => {
            try {
                const posts = await apiClient.getPosts();
                setProposals(posts);
            } catch (err) {
                console.error("Failed to load posts:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const addProposal = useCallback(async (proposalData: Partial<Post>) => {
        try {
            const newPost = await apiClient.createPost(proposalData);
            setProposals(prev => [newPost, ...prev]);
        } catch (err) {
            console.error("Failed to add proposal:", err);
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

    return (
        <AppContext.Provider value={{ proposals, members, searchQuery, setSearchQuery, addProposal, voteOnProposal, addComment, comments }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useAppContext must be used within AppProvider');
    return ctx;
};
