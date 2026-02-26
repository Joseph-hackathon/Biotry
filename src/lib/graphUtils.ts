import { Post } from '../types';

export interface GraphNode {
    id: string;
    label: string;
    type: 'author' | 'post';
    subType?: Post['type'];
    x: number;
    y: number;
    vx: number;
    vy: number;
    address: string;
    metadata?: any;
}

export interface GraphLink {
    source: string;
    target: string;
    type: 'published' | 'cited';
}

export const buildGraphData = (posts: Post[]) => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const nodeMap = new Set<string>();

    const addNode = (id: string, label: string, type: 'author' | 'post', address: string, subType?: Post['type'], metadata?: any) => {
        if (!nodeMap.has(id)) {
            nodes.push({
                id,
                label,
                type,
                subType,
                address,
                metadata,
                x: Math.random() * 800,
                y: Math.random() * 500,
                vx: 0,
                vy: 0,
            });
            nodeMap.add(id);
        }
    };

    posts.forEach(post => {
        // Add Author Node
        addNode(post.author, post.author, 'author', post.author, undefined, { field: post.researchField });

        // Add Post Node
        addNode(post.id, post.title, 'post', post.id, post.type, { ...post });

        // Link Author -> Post
        links.push({
            source: post.author,
            target: post.id,
            type: 'published'
        });

        // Link Post -> References (Citations)
        if (post.references) {
            post.references.forEach(refId => {
                // If the referenced post exists in our list, link it
                const targetPost = posts.find(p => p.id === refId || p.doi === refId);
                const targetId = targetPost ? targetPost.id : refId;

                // Add dummy node for unknown references if needed
                if (!nodeMap.has(targetId)) {
                    addNode(targetId, targetId, 'post', targetId);
                }

                links.push({
                    source: post.id,
                    target: targetId,
                    type: 'cited'
                });
            });
        }
    });

    return { nodes, links };
};
