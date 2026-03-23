import React, { useState, useMemo } from 'react';
import {
    BookOpen, Users, FileText, Send,
    ChevronRight, ExternalLink, ShieldCheck,
    Activity, Clock, Globe, Search,
    Binary, Server, Trophy, TrendingUp, Sparkles, MoveRight, Coins, Zap, ArrowUpRight
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { EDITORIAL_BOARD, FEATURED_HUBS, TOP_CONTRIBUTORS } from '../constants/mockData';
import PostCard from './PostCard';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useSolana } from '../context/useSolana';

type JournalTab = 'All' | 'In-Review' | 'Published' | 'About';

const JournalView: React.FC = () => {
    const { proposals: posts, searchQuery } = useAppContext();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<JournalTab>('All');
    const [selectedHub, setSelectedHub] = useState<string | null>(null);
    const { showSystemModal } = useSolana();

    const filteredPosts = useMemo(() => {
        let result = [...posts];
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(q) ||
                (p.abstract?.toLowerCase().includes(q) ?? false) ||
                p.author.toLowerCase().includes(q) ||
                p.researchField.toLowerCase().includes(q)
            );
        }
        if (selectedHub) result = result.filter(p => p.researchField === selectedHub);
        if (activeTab === 'About') return [];
        if (activeTab !== 'All') result = result.filter(p => p.status === activeTab);
        return result.sort((a, b) => b.timestamp - a.timestamp);
    }, [posts, activeTab, searchQuery, selectedHub]);

    const stats = [
        { label: 'Network Nodes', value: '1,284', icon: Binary, color: 'text-[#A78BFA]', bg: 'bg-[#7C3AED]/10' },
        { label: 'Active Scientists', value: '542', icon: Users, color: 'text-[#F6851B]', bg: 'bg-[#F6851B]/10' },
        { label: 'BioCoin Reserves', value: '12.4M', icon: Coins, color: 'text-[#A78BFA]', bg: 'bg-[#7C3AED]/10' },
    ];

    const hubIcons: Record<string, any> = {
        Binary: Binary,
        Microscope: Globe,
        ShieldCheck: ShieldCheck,
        Activity: Activity,
        Server: Server
    };

    return (
        <div className="space-y-12 pb-20 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700">
            {/* ── Hero Section ── */}
            <div className="glass-panel overflow-hidden p-0 relative bg-black/40 border border-white/5 shadow-2xl rounded-[40px]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/10 via-transparent to-[#F6851B]/5 opacity-50" />
                <div className="relative z-10 lg:flex items-center gap-16 p-10 md:p-16">
                    <div className="flex-1 space-y-8">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-[#F6851B] uppercase tracking-[0.5em] backdrop-blur-md">
                            <Sparkles className="w-4 h-4" /> DeSci Network v2
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white uppercase leading-none">
                            ORBIT <span className="text-gradient-orange">OPEN SCIENCE.</span>
                        </h1>
                        <p className="text-base md:text-lg font-medium text-white/40 uppercase tracking-tight leading-relaxed max-w-xl">
                            The decentralized hub for peer-reviewed research, open-access data sets, and cryptographic scientific verification.
                        </p>
                        <div className="flex flex-wrap gap-6 pt-4">
                            <button
                                onClick={() => navigate('/studio')}
                                className="btn-metamask h-16 px-12 shadow-2xl"
                            >
                                SUBMIT RESEARCH NODE
                            </button>
                            <button
                                onClick={() => {
                                    const el = document.getElementById('featured-hubs');
                                    el?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="h-16 px-10 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/10 transition-all border-dashed"
                            >
                                EXPLORE HUBS
                            </button>
                        </div>
                    </div>

                    <div className="hidden lg:block w-80 h-80 bg-[#0B0E11] border-2 border-white/10 rounded-[32px] shadow-2xl relative rotate-3 hover:rotate-0 transition-all duration-700 p-8 group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#F6851B]/10 to-[#7C3AED]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative z-10 space-y-6 w-full">
                            <div className="h-4 bg-white/5 rounded-full w-3/4 animate-pulse" />
                            <div className="h-4 bg-[#F6851B]/20 rounded-full w-1/2" />
                            <div className="h-20 bg-white/5 rounded-2xl border border-white/5" />
                            <div className="pt-4 flex justify-between items-center">
                                <div className="w-14 h-14 rounded-2xl bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center text-[#A78BFA] shadow-xl">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <Zap className="w-10 h-10 text-[#F6851B] animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Global Stats ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((s) => (
                    <div key={s.label} className="glass-card p-10 flex items-center justify-between group hover:border-[#F6851B]/40 transition-all duration-500">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-2">{s.label}</p>
                            <p className="text-3xl font-bold text-white tracking-tighter uppercase">{s.value}</p>
                        </div>
                        <div className={clsx("w-16 h-16 rounded-2xl border border-white/5 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform", s.bg, s.color)}>
                            <s.icon className="w-8 h-8" />
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Featured Hubs ── */}
            <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                            <Globe className="w-5 h-5 text-[#F6851B]" />
                        </div>
                        <h3 id="featured-hubs" className="text-xl font-bold uppercase tracking-tight text-white flex items-center gap-3">
                            FEATURED SCIENTIFIC HUBS
                        </h3>
                    </div>
                    <button
                        onClick={() => setSelectedHub(null)}
                        className="text-[10px] font-bold text-[#A78BFA] uppercase tracking-widest hover:text-white transition-all flex items-center gap-2"
                    >
                         RESET_FILTERS <MoveRight className="w-3.5 h-3.5" />
                    </button>
                </div>
                <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 mask-fade-right">
                    {FEATURED_HUBS.map((hub) => {
                        const Icon = hubIcons[hub.icon] || Globe;
                        const isActive = selectedHub === hub.name;
                        return (
                            <button
                                key={hub.id}
                                onClick={() => setSelectedHub(isActive ? null : hub.name)}
                                className={clsx(
                                    "glass-card px-8 py-6 flex items-center gap-6 shrink-0 transition-all duration-500",
                                    isActive
                                        ? "bg-white/10 border-[#F6851B] scale-[1.02] shadow-[0_0_30px_rgba(246,133,27,0.15)]"
                                        : "bg-black/40 hover:bg-white/5 border-white/5"
                                )}
                            >
                                <div className={clsx(
                                    "w-12 h-12 rounded-2xl border flex items-center justify-center shadow-xl transition-all duration-500",
                                    isActive ? "bg-[#F6851B] border-[#F6851B] text-white" : "bg-white/5 border-white/10 text-white/30"
                                )}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-white uppercase tracking-tight">{hub.name}</p>
                                    <p className="text-[9px] font-bold text-white/10 uppercase tracking-[0.2em] mt-1">{hub.count} NETWORK_NODES</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Main Content Area ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* ── Left Column: Feed ── */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Tabs */}
                    <div className="flex items-center justify-between border-b border-white/5">
                        <div className="flex gap-2">
                            {(['All', 'In-Review', 'Published', 'About'] as JournalTab[]).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={clsx(
                                        "px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative",
                                        activeTab === tab
                                            ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#F6851B] bg-white/5"
                                            : "text-white/20 hover:text-white/40"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold text-white/30 uppercase tracking-widest">
                            <TrendingUp className="w-3 h-3" /> RANKING: TRENDING
                        </div>
                    </div>

                    {/* About Tab Content */}
                    {activeTab === 'About' && (
                        <div className="glass-panel p-12 space-y-12 bg-black/40 border-white/5 rounded-[32px]">
                            <div className="space-y-6 text-center max-w-2xl mx-auto">
                                <h2 className="text-3xl font-bold tracking-tighter text-white uppercase">The Protocol for Verified Science.</h2>
                                <p className="text-base text-white/40 uppercase tracking-tight leading-relaxed">DeSci Protocol decentralizes scientific peer review and publication via Solana, ensuring immutable open-access forever.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                {[
                                    { icon: Clock, title: "14 Days", desc: "Mean Peer-Review Latency" },
                                    { icon: Activity, title: "Real-Time", desc: "Immediate Preprint Sync" },
                                    { icon: Globe, title: "Universal", desc: "Indestructible Open Access" }
                                ].map((feature) => (
                                    <div key={feature.title} className="text-center space-y-4 p-6 glass-card border-white/5 bg-white/5 hover:border-[#F6851B]/30 transition-all duration-500">
                                        <div className="w-14 h-14 bg-[#7C3AED]/10 rounded-2xl border border-[#7C3AED]/20 flex items-center justify-center mx-auto text-[#A78BFA] shadow-xl">
                                            <feature.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xs font-bold uppercase text-white tracking-widest">{feature.title}</h3>
                                        <p className="text-[9px] font-bold text-white/20 uppercase leading-snug tracking-tight">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Feed Content */}
                    {activeTab !== 'About' && (
                        <div className="space-y-8">
                            {filteredPosts.length > 0 ? (
                                filteredPosts.map((post) => (
                                    <div key={post.id} onClick={() => navigate(`/node/${post.id}`)} className="cursor-pointer">
                                        <PostCard post={post} />
                                    </div>
                                ))
                            ) : (
                                <div className="glass-panel py-32 text-center space-y-6 bg-black/40 border-dashed border-2 border-white/5">
                                    <Search className="w-16 h-16 text-white/5 mx-auto" />
                                    <div className="space-y-1">
                                         <p className="text-xs font-bold text-white/20 uppercase tracking-[0.4em]">NO NODES IDENTIFIED</p>
                                         <p className="text-[9px] uppercase tracking-widest text-white/10 font-bold">Try adjusting your network filters.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Right Column: Sidebar ── */}
                <div className="lg:col-span-4 space-y-10">
                    {/* Top Contributors */}
                    <div className="glass-panel p-8 bg-black/40 rounded-[32px] border-white/5 space-y-8">
                        <div className="flex items-center gap-4 border-b border-white/5 pb-6 -mx-8 px-8">
                            <Trophy className="w-5 h-5 text-[#F6851B]" />
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Network Leaders</h3>
                        </div>
                        <div className="space-y-6">
                            {TOP_CONTRIBUTORS.map((user, i) => (
                                <div key={user.id} className="flex items-center gap-4 group cursor-pointer">
                                    <div className="relative shrink-0">
                                        <div className="w-12 h-12 rounded-2xl border-2 border-white/ object-cover shadow-2xl overflow-hidden group-hover:border-[#F6851B]/50 transition-all duration-500">
                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                        </div>
                                        <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-[#0B0E11] border border-white/10 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shadow-xl">
                                            {i + 1}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-bold text-white uppercase group-hover:text-[#F6851B] transition-colors truncate">{user.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                                            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{user.points.toLocaleString()} REPUTATION</p>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-white transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Promo Card */}
                    <div className="glass-panel p-8 bg-[#F6851B]/10 rounded-[32px] border-[#F6851B]/20 space-y-6 group hover:bg-[#F6851B]/20 transition-all duration-700">
                        <div className="w-14 h-14 bg-[#F6851B] rounded-2xl flex items-center justify-center text-black shadow-[0_0_30px_rgba(246,133,27,0.3)]">
                            <Zap className="w-8 h-8 font-bold" />
                        </div>
                        <div className="space-y-2">
                             <h4 className="text-xl font-bold text-white uppercase tracking-tight leading-tight">BioCoin Reward Protocol</h4>
                             <p className="text-xs font-medium text-white/40 uppercase tracking-tight leading-relaxed">Perform validated peer reviews and earn network incentives in BioCoin.</p>
                        </div>
                        <button
                            onClick={() => showSystemModal({
                                type: 'info',
                                title: 'Coming Soon',
                                message: 'The peer review reward program is currently in pilot phase. Public applications will open soon!'
                            })}
                            className="w-full h-14 bg-white text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/90 transition-all shadow-2xl"
                        >
                            APPLY_FOR_REVIEWER_NODE
                        </button>
                    </div>

                    {/* Resources */}
                    <div className="glass-panel p-8 bg-black/40 rounded-[32px] border-white/5 space-y-6">
                        <div className="flex items-center gap-4 border-b border-white/5 pb-6 -mx-8 px-8 mb-2">
                            <BookOpen className="w-5 h-5 text-white/20" />
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">SDK & Docs</h3>
                        </div>
                        <a href="#" className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-[#F6851B] hover:bg-white/10 transition-all group">
                            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Protocol Guidelines</span>
                            <ExternalLink className="w-4 h-4 text-white/10 group-hover:text-white transition-all" />
                        </a>
                        <a href="#" className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-[#F6851B] hover:bg-white/10 transition-all group">
                            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Network API v1.0</span>
                            <ExternalLink className="w-4 h-4 text-white/10 group-hover:text-white transition-all" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JournalView;
