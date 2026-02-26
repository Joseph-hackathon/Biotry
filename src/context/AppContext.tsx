import React, { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_POSTS } from '../constants/mockData';
import type { Post } from '../types';

export interface Comment {
    id: string;
    postId: string;
    author: string;
    content: string;
    createdAt: string;
}

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
    const [proposals, setProposals] = useState<Post[]>(MOCK_POSTS);
    const [members, setMembers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [comments, setComments] = useState<Record<string, Comment[]>>({});

    const addProposal = useCallback((proposal: Post) => {
        setProposals(prev => [proposal, ...prev]);
    }, []);

    const addComment = useCallback((postId: string, author: string, content: string) => {
        const newComment: Comment = {
            id: Math.random().toString(36).substr(2, 9),
            postId,
            author,
            content,
            createdAt: 'Just now',
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
