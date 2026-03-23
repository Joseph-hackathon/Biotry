import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Activity, Users, TrendingUp, ArrowRight, FlaskConical, Zap, Info, Network, Globe, MousePointer2 } from 'lucide-react';
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
                node.vx += (width / 2 - node.x) * strength * 0.1;
                node.vy += (height / 2 - node.y) * strength * 0.1;

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

            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;
                node.vx *= 0.9;
                node.vy *= 0.9;
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-panel rounded-[32px] border border-white/5 relative bg-black/40 overflow-hidden p-0 h-[600px] group shadow-2xl">
                {/* Visual Indicators */}
                <div className="absolute top-8 left-8 z-10 space-y-3 pointer-events-none">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 backdrop-blur-md">
                        <Network className="w-4 h-4 text-[#F6851B]" /> Tapestry Social Mesh_v4.2
                    </div>
                </div>

                <div className="absolute bottom-8 right-8 z-10 flex flex-col gap-3 pointer-events-none">
                     <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40 bg-black/60 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-md">
                        <div className="w-2 h-2 rounded-full bg-[#7C3AED]" /> Researcher Entity
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40 bg-black/60 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-md">
                        <div className="w-2 h-2 rounded-full bg-[#F6851B]" /> Research Node
                    </div>
                </div>

                <svg ref={svgRef} viewBox="0 0 800 500" className="w-full h-full cursor-grab active:cursor-grabbing">
                    {/* Connections */}
                    {links.map((link, i) => {
                        const source = nodes.find(n => n.id === link.source);
                        const target = nodes.find(n => n.id === link.target);
                        if (!source || !target) return null;
                        const isPrimary = selectedNode?.id === source.id || selectedNode?.id === target.id;
                        const isHovered = hoverNode === source.id || hoverNode === target.id;

                        return (
                            <line
                                key={`${link.source}-${link.target}-${i}`}
                                x1={source.x} y1={source.y}
                                x2={target.x} y2={target.y}
                                stroke={isPrimary ? '#F6851B' : (isHovered ? '#7C3AED' : '#FFFFFF')}
                                strokeWidth={isPrimary ? 2 : 0.5}
                                strokeDasharray={link.type === 'cited' ? '4,4' : '0'}
                                className="transition-all duration-300 opacity-10"
                            />
                        );
                    })}

                    {/* Nodes */}
                    {nodes.map((node) => {
                        const isAuthor = node.type === 'author';
                        const color = isAuthor ? '#7C3AED' : '#F6851B';
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
                                    r={isAuthor ? 12 : 8}
                                    fill={isSelected ? '#FFFFFF' : color}
                                    className={clsx(
                                        "transition-all duration-300",
                                        isSelected ? "opacity-100 shadow-[0_0_20px_#FFF]" : "opacity-40 hover:opacity-100"
                                    )}
                                />
                                {(isHovered || isSelected) && (
                                    <g transform="translate(18, -18)">
                                        <rect
                                            width={node.label.length * 7 + 30}
                                            height="32"
                                            className="fill-black/80 stroke-white/20 stroke-1 backdrop-blur-xl"
                                            rx="8"
                                        />
                                        <text
                                            x="12"
                                            y="20"
                                            className="text-[10px] font-bold uppercase tracking-tight fill-white"
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
            <div className="glass-panel rounded-[32px] border border-white/5 flex flex-col min-h-[550px] p-8 bg-[#0B0E11]/60">
                {selectedNode ? (
                    <div className="space-y-8 animate-in mt-2 fade-in slide-in-from-right-10 duration-500">
                        <div className="flex items-center gap-4">
                            <div className={clsx(
                                "w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center shadow-xl",
                                selectedNode.type === 'author' ? 'bg-[#7C3AED]/10' : 'bg-[#F6851B]/10'
                            )}>
                                {selectedNode.type === 'author' ? <Users className="w-7 h-7 text-[#7C3AED]" /> : <FlaskConical className="w-7 h-7 text-[#F6851B]" />}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold uppercase tracking-tight text-white leading-none">{selectedNode.type === 'author' ? 'Principal Investigator' : 'Research Artifact'}</h4>
                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1.5">Meta-Data Graph</p>
                            </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-white/10">
                            <div>
                                <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] mb-2">Entity Description</p>
                                <p className="text-base font-bold text-white uppercase tracking-tight leading-tight">{selectedNode.label}</p>
                            </div>

                            <div>
                                <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] mb-2">Address Identifier</p>
                                <div className="flex items-center gap-3">
                                    <code className="bg-white/5 px-4 py-3 rounded-xl border border-white/5 text-[10px] font-mono font-bold text-white/70 flex-1 truncate">
                                        {selectedNode.address || '0x_system_graph_lock'}
                                    </code>
                                    <button className="w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-[#F6851B] transition-all">
                                        <Globe className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-2xl border border-white/5 p-5">
                                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">Influence</p>
                                    <p className="text-2xl font-bold tracking-tighter text-[#7C3AED]">4.8k</p>
                                </div>
                                <div className="bg-white/5 rounded-2xl border border-white/5 p-5">
                                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">Density</p>
                                    <p className="text-2xl font-bold tracking-tighter text-[#F6851B]">{links.filter(l => l.source === selectedNode.id).length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 opacity-20">
                        <MousePointer2 className="w-16 h-16 text-white" />
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.4em] text-white">Select Node</p>
                            <p className="text-[10px] uppercase tracking-widest text-white/60">Analyze Social Connectivity</p>
                        </div>
                    </div>
                )}

                <div className="mt-auto pt-8 border-t border-white/10">
                    <div className="bg-[#7C3AED]/5 p-5 rounded-2xl border border-[#7C3AED]/20">
                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2">Graph Health Status</p>
                        <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-white/60">Real-time Synchronization</span>
                            <span className="text-green-400 tracking-widest">STABLE_99%</span>
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
        <div className="space-y-12 pb-20 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700">
            {/* Header */}
            <div className="space-y-4">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-[#F6851B] uppercase tracking-[0.5em]">
                    <Zap className="w-4 h-4 fill-current" /> Analytics Core v2
                </div>
                <h2 className="text-4xl md:text-7xl font-bold tracking-tighter text-white uppercase leading-none">
                    ON-CHAIN <span className="text-gradient-orange">SOCIAL GRAPH.</span>
                </h2>
                <p className="text-base font-medium text-white/40 uppercase tracking-tight max-w-3xl leading-relaxed">
                    Visualizing the relationships, citations, and authorship network across the Biotry ecosystem. Metadata derived from Solana activity logs.
                </p>
            </div>

            {/* Social Graph Section */}
            <SocialGraph posts={proposals} />

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                    {
                        label: 'Active Graph Nodes', value: (proposals.length + 4).toLocaleString(), sub: 'LIVE_DATA_FEED',
                        icon: Users, color: 'text-[#7C3AED]',
                        bg: 'bg-[#7C3AED]/10', border: 'border-[#7C3AED]/20'
                    },
                    {
                        label: 'Social Interactions', value: proposals.reduce((acc, p) => acc + p.upvotes, 0).toLocaleString(), sub: 'UPVOTE_VELOCITY',
                        icon: Zap, color: 'text-[#F6851B]',
                        bg: 'bg-[#F6851B]/10', border: 'border-[#F6851B]/20'
                    }
                ].map((stat) => (
                    <div key={stat.label} className={clsx(
                        "glass-card p-10 flex flex-col justify-between group h-40",
                        stat.border
                    )}>
                        <div className="flex justify-between items-start">
                            <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 overflow-hidden", stat.bg)}>
                                <stat.icon className={clsx("w-7 h-7", stat.color)} />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-1">{stat.label}</p>
                                <p className="text-4xl font-bold text-white tracking-tighter leading-none">{stat.value}</p>
                                <p className={clsx("text-[9px] font-bold uppercase tracking-widest mt-3", stat.color)}>{stat.sub}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Live Activity Ticker */}
            <div className="glass-panel p-10 rounded-[32px] border border-white/5 space-y-10 bg-black/40">
                <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 bg-[#F6851B] rounded-full animate-pulse shadow-[0_0_10px_#F6851B]" />
                    <h3 className="text-2xl font-bold uppercase tracking-tight text-white">Live Execution Stream</h3>
                </div>
                <div className="space-y-4">
                    {proposals.slice(0, 4).map((item, idx) => (
                        <div key={item.id} className="flex items-center gap-6 p-6 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-[#F6851B]/30 transition-all cursor-pointer group">
                            <div className={clsx(
                                "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-white/10 transition-all group-hover:scale-105",
                                idx % 2 === 0 ? "bg-[#7C3AED]/10 text-[#7C3AED]" : "bg-[#F6851B]/10 text-[#F6851B]"
                            )}>
                                 <PlusIcon isLarge={false} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-base font-bold text-white uppercase tracking-tight truncate">{item.title}</p>
                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Transaction_{item.id.slice(0,10)} // Block_{Math.floor(Math.random()*1000000)}</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-[#F6851B] group-hover:translate-x-1 transition-all" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const PlusIcon = ({ isLarge }: { isLarge: boolean }) => (
    <svg width={isLarge ? "24" : "16"} height={isLarge ? "24" : "16"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

export default DeSciDashboard;
