export type PublicationType = 'Research' | 'Critique' | 'Investigation';

export interface Post {
    id: string;
    author: string;
    researchField: string;
    type: PublicationType;
    title: string;
    doi?: string;
    abstract?: string;
    content?: string;
    image?: string;
    upvotes: number;
    commentCount: number;
    createdAt: string;
    references?: string[];
    isNsfw?: boolean;
    pdfUrl?: string;
    pdfName?: string;
    attachedLinks?: string[];
    topics?: string[];
    license?: string;
    versions?: { version: string; date: string; url: string }[];
    status?: 'Published' | 'In-Review' | 'Draft';
}

export interface Editor {
    id: string;
    name: string;
    role: string;
    institution: string;
    avatar?: string;
}

export interface Hub {
    id: string;
    name: string;
    icon: string;
    count: number;
}

export interface LeaderboardEntry {
    id: string;
    name: string;
    points: number;
    avatar: string;
}

export interface Community {
    id: string;
    name: string;
    memberCount: number;
    description: string;
}

export interface Comment {
    id: string;
    author: string;
    content: string;
    createdAt: string;
    upvotes: number;
    replies?: Comment[];
}
