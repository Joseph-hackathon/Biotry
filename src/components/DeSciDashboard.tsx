import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Activity, Users, TrendingUp, ArrowRight, FlaskConical, Zap, Info, Network, Globe } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { buildGraphData, GraphNode, GraphLink } from '../lib/graphUtils';
import { clsx } from 'clsx';

const SocialGraph: React.FC<{ posts: any[] }> = ({ posts }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [{ nodes, links }, setGraph] = useState(() => buildGraphData(posts));
    const [hoverNode, setHoverNode] = useState<string | null>(null);
    const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

    // Simple Force-Directed Layout
    useEffect(() => {
        let animationFrame: number;
        const width = 800;
        const height = 500;

        const update = () => {
            const strength = 0.05;
            const distance = 120;
            const repulsion = 6000;

            // Apply forces
            nodes.forEach((node, i) => {
                // Return to center
                node.vx += (width / 2 - node.x) * strength * 0.1;
                node.vy += (height / 2 - node.y) * strength * 0.1;

                // Repulsion between nodes
                nodes.forEach((other, j) => {
                    if (i === j) return;
                    const dx = node.x - other.x;
                    const dy = node.y - other.y;
                    const d2 = dx * dx + dy * dy + 0.01;
                    if (d2 < 60000) {
                        const force = repulsion / d2;
                        node.vx += dx * force * strength;
                        node.vy += dy * force * strength;
                    }
                });
            });

            // Link forces
            links.forEach(link => {
                const source = nodes.find(n => n.id === link.source);
                const target = nodes.find(n => n.id === link.target);
                if (!source || !target) return;

                const dx = target.x - source.x;
                const dy = target.y - source.y;
                const d = Math.sqrt(dx * dx + dy * dy) || 0.1;
                const force = (d - distance) * strength;
                const fx = (dx / d) * force;
                const fy = (dy / d) * force;

                source.vx += fx;
                source.vy += fy;
                target.vx -= fx;
                target.vy -= fy;
            });

            // Apply velocity and damping
            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;
                node.vx *= 0.9;
                node.vy *= 0.9;

                // Bounds
                node.x = Math.max(50, Math.min(width - 50, node.x));
                node.y = Math.max(50, Math.min(height - 50, node.y));
            });

            setGraph({ nodes: [...nodes], links: [...links] });
            animationFrame = requestAnimationFrame(update);
        };

        animationFrame = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationFrame);
    }, [posts]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 illustration-card relative bg-white overflow-hidden p-0 h-[550px]">
                <div className="absolute top-6 left-6 z-10 space-y-2 pointer-events-none">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black shadow-flat-sm text-[10px] font-header font-black uppercase tracking-widest text-black">
                        <Network className="w-3.5 h-3.5 text-accent-purple" /> Tapestry Social Mesh
                    </div>
                </div>

                <div className="absolute bottom-6 right-6 z-10 flex flex-wrap gap-4 pointer-events-none">
                    <div className="flex items-center gap-2 text-[10px] font-header font-black uppercase tracking-widest bg-white/90 p-2 border-2 border-black text-black">
                        <div className="w-3 h-3 rounded-full bg-accent-purple" /> Researcher
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-header font-black uppercase tracking-widest bg-white/90 p-2 border-2 border-black text-black">
                        <div className="w-3 h-3 rounded-full bg-accent-pink" /> Research
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-header font-black uppercase tracking-widest bg-white/90 p-2 border-2 border-black text-black">
                        <div className="w-3 h-3 rounded-full bg-black" /> Investigation
                    </div>
                </div>

                <svg ref={svgRef} viewBox="0 0 800 500" className="w-full h-full cursor-grab active:cursor-grabbing">
                    <defs>
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="2" dy="2" stdDeviation="0" floodOpacity="1" />
                        </filter>
                    </defs>
                    {/* Connections */}
                    {links.map((link, i) => {
                        const source = nodes.find(n => n.id === link.source);
                        const target = nodes.find(n => n.id === link.target);
                        if (!source || !target) return null;
                        const isPrimary = selectedNode?.id === source.id || selectedNode?.id === target.id;
                        const isTransition = hoverNode === source.id || hoverNode === target.id;

                        return (
                            <line
                                key={`${link.source}-${link.target}-${i}`}
                                x1={source.x} y1={source.y}
                                x2={target.x} y2={target.y}
                                stroke={isPrimary ? '#8B5CF6' : (isTransition ? '#F472B6' : '#000')}
                                strokeWidth={isPrimary ? 3 : (isTransition ? 2 : 1)}
                                strokeDasharray={link.type === 'cited' ? '6,4' : '0'}
                                className="transition-all duration-300 opacity-20"
                            />
                        );
                    })}

                    {/* Nodes */}
                    {nodes.map((node) => {
                        const isAuthor = node.type === 'author';
                        const color = isAuthor ? '#8B5CF6' : (node.subType === 'Research' ? '#F472B6' : (node.subType === 'Investigation' ? '#000' : '#8B5CF6'));
                        const isHovered = hoverNode === node.id;
                        const isSelected = selectedNode?.id === node.id;

                        return (
                            <g
                                key={node.id}
                                transform={`translate(${node.x},${node.y})`}
                                onMouseEnter={() => setHoverNode(node.id)}
                                onMouseLeave={() => setHoverNode(null)}
                                onClick={() => setSelectedNode(node)}
                                className="cursor-pointer group"
                            >
                                <circle
                                    r={isAuthor ? 14 : 10}
                                    fill={isSelected ? '#FFF' : color}
                                    stroke="#000"
                                    strokeWidth={3}
                                    className={clsx(
                                        "transition-all duration-200",
                                        isSelected && "shadow-flat-sm"
                                    )}
                                />
                                {(isHovered || isSelected) && (
                                    <g transform="translate(18, -18)">
                                        <rect
                                            width={node.label.length * 7 + 30}
                                            height="32"
                                            fill="white"
                                            stroke="black"
                                            strokeWidth="3"
                                            className="shadow-flat-xs"
                                        />
                                        <text
                                            x="12"
                                            y="20"
                                            className="text-[10px] font-header font-black uppercase tracking-tight fill-black"
                                        >
                                            {node.label.slice(0, 30)}{node.label.length > 30 ? '...' : ''}
                                        </text>
                                    </g>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Selection Panel */}
            <div className="illustration-card bg-white flex flex-col min-h-[550px] p-6">
                {selectedNode ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-3">
                            <div className={clsx(
                                "w-12 h-12 border-3 border-black flex items-center justify-center shadow-flat-xs",
                                selectedNode.type === 'author' ? 'bg-accent-softPurple' : 'bg-accent-softPink'
                            )}>
                                {selectedNode.type === 'author' ? <Users className="w-6 h-6 text-accent-purple" /> : <FlaskConical className="w-6 h-6 text-accent-pink" />}
                            </div>
                            <div>
                                <h4 className="text-lg font-display font-black uppercase tracking-tight text-black leading-none">{selectedNode.type === 'author' ? 'Researcher' : 'Research Node'}</h4>
                                <p className="text-[10px] font-header font-black text-black/40 uppercase tracking-widest mt-1">On-Chain Identity</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t-3 border-black">
                            <div>
                                <p className="text-[10px] font-header font-black text-black uppercase tracking-widest mb-1">Title / ID</p>
                                <p className="text-sm font-header font-black text-black uppercase tracking-tight">{selectedNode.label}</p>
                            </div>

                            <div>
                                <p className="text-[10px] font-header font-black text-black uppercase tracking-widest mb-1">Solana Address</p>
                                <div className="flex items-center gap-2 group">
                                    <code className="bg-gray-100 p-2 border-2 border-black text-[10px] font-mono font-bold text-black flex-1 truncate">
                                        {selectedNode.address || 'system_account'}
                                    </code>
                                    <a
                                        href={`https://explorer.solana.com/address/${selectedNode.address}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-10 h-10 border-3 border-black bg-white flex items-center justify-center shadow-flat-xs hover:bg-accent-purple hover:text-white transition-all"
                                    >
                                        <Globe className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>

                            {selectedNode.type === 'author' ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 border-2 border-black p-3 shadow-flat-xs">
                                        <p className="text-[9px] font-header font-black text-black/40 uppercase tracking-widest">Reputation</p>
                                        <p className="text-xl font-display font-black text-accent-purple">4.8k</p>
                                    </div>
                                    <div className="bg-gray-50 border-2 border-black p-3 shadow-flat-xs">
                                        <p className="text-[9px] font-header font-black text-black/40 uppercase tracking-widest">Nodes</p>
                                        <p className="text-xl font-display font-black text-accent-pink">{links.filter(l => l.source === selectedNode.id).length}</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 border-2 border-black p-3 shadow-flat-xs">
                                            <p className="text-[9px] font-header font-black text-black/40 uppercase tracking-widest">Citations</p>
                                            <p className="text-xl font-display font-black text-accent-purple">{links.filter(l => l.target === selectedNode.id && l.type === 'cited').length}</p>
                                        </div>
                                        <div className="bg-gray-50 border-2 border-black p-3 shadow-flat-xs">
                                            <p className="text-[9px] font-header font-black text-black/40 uppercase tracking-widest">Upvotes</p>
                                            <p className="text-xl font-display font-black text-accent-pink">{selectedNode.metadata?.upvotes || 0}</p>
                                        </div>
                                    </div>
                                    <a
                                        href={`https://explorer.solana.com/tx/${selectedNode.id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-4 border-3 border-black bg-black text-white font-header font-black uppercase text-sm shadow-flat transition-all hover:bg-accent-purple hover:shadow-none"
                                    >
                                        <Activity className="w-4 h-4" /> View Transaction
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                        <Info className="w-12 h-12 text-black" />
                        <div>
                            <p className="font-header font-black uppercase text-black">Select a node</p>
                            <p className="text-[10px] font-header font-black text-black uppercase tracking-widest">to view on-chain metadata</p>
                        </div>
                    </div>
                )}

                <div className="mt-auto pt-6 border-t-3 border-black">
                    <div className="bg-accent-softPurple/30 p-4 border-2 border-dashed border-accent-purple text-black">
                        <p className="text-[10px] font-header font-black uppercase tracking-widest mb-1">Graph Health</p>
                        <div className="flex items-center justify-between text-xs font-header font-black">
                            <span>Synced Blocks</span>
                            <span className="text-accent-purple">99.8%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DeSciDashboard: React.FC = () => {
    const { proposals } = useAppContext();

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-3 border-black shadow-flat-sm text-[11px] font-header font-black text-black uppercase tracking-[0.2em]">
                    <Activity className="w-3.5 h-3.5 text-accent-purple" /> ANALYTICS HUB
                </div>
                <h2 className="text-4xl font-display font-black uppercase tracking-tight text-black leading-tight">
                    ON-CHAIN <span className="text-accent-pink italic underline decoration-4 decoration-black">SOCIAL GRAPH.</span>
                </h2>
                <p className="text-xs font-header font-black text-black/40 uppercase tracking-widest max-w-2xl">
                    VISUALIZING THE PROFESSIONAL RELATIONSHIPS, CITATIONS, AND AUTHORSHIP NETWORK ACROSS THE BIOTRY ECOSYSTEM IN REAL-TIME.
                </p>
            </div>

            {/* Social Graph Section */}
            <SocialGraph posts={proposals} />

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    {
                        label: 'Active Graph Nodes', value: proposals.length + 4, sub: 'REAL-TIME SYNC',
                        icon: Users, color: 'text-accent-purple',
                        bg: 'bg-accent-softPurple',
                    },
                    {
                        label: 'Social Interactions', value: proposals.reduce((acc, p) => acc + p.upvotes, 0).toLocaleString(), sub: 'TOTAL UPVOTES',
                        icon: Zap, color: 'text-accent-pink',
                        bg: 'bg-accent-softPink',
                    }
                ].map((stat) => (
                    <div key={stat.label} className="illustration-card group flex flex-col justify-between relative bg-white p-6"
                        style={{ minHeight: 120 }}>
                        <div className="relative z-10 flex justify-between items-start">
                            <div className={`w-12 h-12 border-3 border-black flex items-center justify-center transition-all duration-500 group-hover:shadow-flat-sm ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color} fill-current/10`} />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-header font-black text-black/50 uppercase tracking-[0.2em]">{stat.label}</p>
                                <p className="text-2xl font-display font-black text-black mt-1 tracking-tight leading-none">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Live Activity Ticker (Keep existing for context) */}
            <div className="illustration-card relative bg-white">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 bg-accent-purple border-2 border-black animate-pulse" />
                    <h3 className="text-xl font-display font-black uppercase tracking-tight text-black">Live Graph Activity</h3>
                    <span className="ml-auto text-[11px] font-header font-black text-black/40 uppercase tracking-[0.2em]">Tapestry Sync</span>
                </div>
                <div className="space-y-4">
                    {proposals.slice(0, 3).map((item, idx) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border-3 border-black shadow-flat-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer group bg-white">
                            <div className={`w-3 h-3 border-2 border-black ${idx % 2 === 0 ? 'bg-accent-purple' : 'bg-accent-pink'} shrink-0 rotate-45`} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-header font-black uppercase tracking-tight text-black">{item.title}</p>
                                <p className="text-[10px] font-header font-black text-black/40 uppercase tracking-widest">{item.author} published a node</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-black group-hover:text-accent-purple transition-colors shrink-0" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DeSciDashboard;

