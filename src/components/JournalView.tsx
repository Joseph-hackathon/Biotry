import React, { useState, useMemo } from 'react';
import {
    BookOpen, Users, FileText, Send,
    ChevronRight, ExternalLink, ShieldCheck,
    Activity, Clock, Globe, Search,
    Binary, Server, Trophy, TrendingUp, Sparkles, MoveRight, Coins
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

        // Apply search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(q) ||
                (p.abstract?.toLowerCase().includes(q) ?? false) ||
                p.author.toLowerCase().includes(q) ||
                p.researchField.toLowerCase().includes(q)
            );
        }

        // Apply Hub filter
        if (selectedHub) {
            result = result.filter(p => p.researchField === selectedHub);
        }

        // Apply tab filtering
        if (activeTab === 'About') return [];
        if (activeTab !== 'All') {
            result = result.filter(p => p.status === activeTab);
        }

        // Fallback: Default to trending (upvotes) if no other specific order
        return result.sort((a, b) => b.upvotes - a.upvotes);
    }, [posts, activeTab, searchQuery, selectedHub]);

    const stats = [
        { label: 'Total Nodes', value: '1,284', icon: Binary, color: 'text-accent-purple' },
        { label: 'Active Scientists', value: '542', icon: Users, color: 'text-accent-pink' },
        { label: 'BioCoin Funded', value: '12.4M', icon: Coins, color: 'text-accent-purple' },
    ];

    const hubIcons: Record<string, any> = {
        Binary: Binary,
        Microscope: Globe,
        ShieldCheck: ShieldCheck,
        Activity: Activity,
        Server: Server
    };

    return (
        <div className="space-y-10 pb-20">
            {/* ── Hero Section ── */}
            <div className="illustration-card bg-accent-softPurple border-black relative overflow-hidden p-8 sm:p-12">
                <div className="relative z-10 lg:flex items-center gap-12">
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black text-[10px] font-header font-black text-black uppercase tracking-[0.2em] shadow-flat-xs">
                            <BookOpen className="w-4 h-4 text-accent-purple" /> Biotry Journal
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black uppercase tracking-tight text-black leading-tight">
                            Explore <span className="text-accent-purple underline decoration-4 underline-offset-4">cutting-edge</span> research.
                        </h1>
                        <p className="text-sm md:text-base font-header font-black text-black/60 uppercase tracking-tight leading-relaxed max-w-lg">
                            The decentralized hub for peer-reviewed science, open access publishing, and cryptographic verification.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <button
                                onClick={() => navigate('/studio')}
                                className="btn-illu-primary px-8 py-3 bg-black text-white"
                            >
                                SUBMIT RESEARCH
                            </button>
                            <button
                                onClick={() => {
                                    const el = document.getElementById('featured-hubs');
                                    el?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="btn-illu-outline px-8 py-3 bg-white"
                            >
                                EXPLORE HUBS
                            </button>
                        </div>
                    </div>

                    <div className="hidden lg:block w-72 h-72 bg-white border-4 border-black shadow-flat relative rotate-3 hover:rotate-0 transition-transform">
                        <div className="absolute inset-0 flex items-center justify-center p-8">
                            <div className="space-y-4 w-full">
                                <div className="h-4 bg-accent-softPurple border-2 border-black w-3/4" />
                                <div className="h-4 bg-accent-softPink border-2 border-black w-1/2" />
                                <div className="h-4 bg-gray-100 border-2 border-black w-full" />
                                <div className="pt-4 flex justify-between">
                                    <div className="w-12 h-12 rounded-full bg-accent-purple border-3 border-black shadow-flat-xs" />
                                    <ShieldCheck className="w-12 h-12 text-black" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-accent-purple/5 -skew-x-12 translate-x-1/2" />
            </div>

            {/* ── Global Stats ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((s) => (
                    <div key={s.label} className="illustration-card bg-white p-6 flex items-center justify-between group hover:-translate-y-1 transition-transform">
                        <div className="space-y-1">
                            <p className="text-[10px] font-header font-black text-black/40 uppercase tracking-widest">{s.label}</p>
                            <p className="text-2xl font-display font-black text-black">{s.value}</p>
                        </div>
                        <div className={clsx("w-12 h-12 border-3 border-black flex items-center justify-center shadow-flat-sm group-hover:shadow-flat transition-all bg-white", s.color)}>
                            <s.icon className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Featured Hubs ── */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 id="featured-hubs" className="text-sm font-header font-black text-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent-pink" /> Featured Hubs
                    </h3>
                    <button
                        onClick={() => setSelectedHub(null)}
                        className="text-[10px] font-header font-black text-accent-purple uppercase tracking-widest hover:underline flex items-center gap-1"
                    >
                        Reset Filter <MoveRight className="w-3 h-3" />
                    </button>
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    {FEATURED_HUBS.map((hub) => {
                        const Icon = hubIcons[hub.icon] || Globe;
                        const isActive = selectedHub === hub.name;
                        return (
                            <button
                                key={hub.id}
                                onClick={() => setSelectedHub(isActive ? null : hub.name)}
                                className={clsx(
                                    "illustration-card px-6 py-4 flex items-center gap-4 shrink-0 transition-all",
                                    isActive
                                        ? "bg-accent-softPurple border-accent-purple shadow-none translate-x-0.5 translate-y-0.5"
                                        : "bg-white hover:bg-accent-softPurple/30"
                                )}
                            >
                                <div className={clsx(
                                    "w-10 h-10 border-2 border-black flex items-center justify-center shadow-flat-xs",
                                    isActive ? "bg-white" : "bg-accent-softPurple"
                                )}>
                                    <Icon className="w-5 h-5 text-accent-purple" />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-header font-black text-black uppercase truncate">{hub.name}</p>
                                    <p className="text-[9px] font-header font-black text-black/30 uppercase">{hub.count} Nodes</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Main Layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* ── Left Column: Content ── */}
                <div className="lg:col-span-9 space-y-8">

                    {/* Tabs */}
                    <div className="flex border-b-3 border-black items-center justify-between">
                        <div className="flex">
                            {(['All', 'In-Review', 'Published', 'About'] as JournalTab[]).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={clsx(
                                        "px-6 py-4 text-xs font-header font-black uppercase tracking-widest transition-all relative top-[3px]",
                                        activeTab === tab
                                            ? "border-3 border-black bg-white border-b-white z-10"
                                            : "text-black/40 hover:text-black"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 border-2 border-black text-[9px] font-header font-black text-black/50 uppercase tracking-widest">
                            <TrendingUp className="w-3 h-3" /> Sort: Trending
                        </div>
                    </div>

                    {/* About Tab Content */}
                    {activeTab === 'About' && (
                        <div className="illustration-card bg-white p-8 space-y-10">
                            <div className="space-y-4 text-center pb-8 border-b-3 border-black border-dashed">
                                <h2 className="text-3xl font-display font-black uppercase text-black">Building the New Infrastructure of Science.</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { icon: Clock, title: "14 Days", desc: "Average time to peer review completion." },
                                    { icon: Activity, title: "Immediate", desc: "Preprints available right after submission." },
                                    { icon: Globe, title: "Open Access", desc: "Scientific research free for everyone, forever." }
                                ].map((feature) => (
                                    <div key={feature.title} className="text-center space-y-3 p-4">
                                        <div className="w-12 h-12 bg-accent-softPink border-3 border-black flex items-center justify-center mx-auto shadow-flat-sm">
                                            <feature.icon className="w-6 h-6 text-accent-pink" />
                                        </div>
                                        <h3 className="text-sm font-header font-black uppercase text-black">{feature.title}</h3>
                                        <p className="text-[10px] font-header font-black text-black/50 uppercase leading-snug">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Feed Content */}
                    {activeTab !== 'About' && (
                        <div className="space-y-6">
                            {filteredPosts.length > 0 ? (
                                filteredPosts.map((post) => (
                                    <div key={post.id} onClick={() => navigate(`/node/${post.id}`)} className="cursor-pointer">
                                        <PostCard post={post} />
                                    </div>
                                ))
                            ) : (
                                <div className="illustration-card bg-gray-50 border-dashed border-black/20 p-20 text-center">
                                    <Search className="w-12 h-12 text-black/10 mx-auto mb-4" />
                                    <p className="text-sm font-header font-black text-black/30 uppercase tracking-[0.2em]">No manuscripts found in this category.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Right Column: Sidebar ── */}
                <div className="lg:col-span-3 space-y-8">

                    {/* Top Contributors Leaderboard */}
                    <div className="illustration-card bg-white space-y-6">
                        <div className="flex items-center gap-3 border-b-3 border-black pb-4 -mx-6 px-6">
                            <Trophy className="w-5 h-5 text-accent-pink" />
                            <h3 className="text-xs font-header font-black text-black uppercase tracking-widest">Top Contributors</h3>
                        </div>
                        <div className="space-y-4">
                            {TOP_CONTRIBUTORS.map((user, i) => (
                                <div key={user.id} className="flex items-center gap-3 group">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full border-2 border-black overflow-hidden shadow-flat-xs group-hover:shadow-none group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all">
                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white border-2 border-black flex items-center justify-center text-[9px] font-black italic">
                                            {i + 1}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-header font-black text-black uppercase truncate">{user.name}</p>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <div className="w-2 h-2 rounded-full bg-accent-pink" />
                                            <p className="text-[8px] font-header font-black text-black/40 uppercase">{user.points} Reputation</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Earn BioCoin Promo */}
                    <div className="illustration-card bg-accent-pink border-black p-6 space-y-4 text-white hover:shadow-flat-hover transition-all group">
                        <Coins className="w-10 h-10 group-hover:rotate-12 transition-transform" />
                        <h4 className="text-lg font-display font-black uppercase tracking-tight leading-tight">Earn BioCoin for Peer Review.</h4>
                        <p className="text-[10px] font-header font-black text-white/70 uppercase leading-relaxed">
                            Join our expert network and get rewarded for high-quality manuscript critiques.
                        </p>
                        <button
                            onClick={() => showSystemModal({
                                type: 'info',
                                title: 'Coming Soon',
                                message: 'The peer review reward program is currently in pilot phase. Public applications will open soon!'
                            })}
                            className="w-full py-3 bg-white border-3 border-black text-[10px] font-header font-black text-black uppercase tracking-widest shadow-flat-sm active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                        >
                            APPLY TO REVIEW
                        </button>
                    </div>

                    {/* Editorial Board (Condensed) */}
                    <div className="illustration-card bg-white space-y-6">
                        <div className="flex items-center gap-3 border-b-3 border-black pb-4 -mx-6 px-6">
                            <Users className="w-5 h-5 text-accent-purple" />
                            <h3 className="text-xs font-header font-black text-black uppercase tracking-widest">Editors</h3>
                        </div>
                        <div className="space-y-4">
                            {EDITORIAL_BOARD.slice(0, 3).map((editor) => (
                                <div key={editor.id} className="flex gap-3 group cursor-default">
                                    <div className="w-10 h-10 bg-accent-softPurple border-2 border-black shrink-0 shadow-flat-xs group-hover:shadow-flat transition-all">
                                        <img src={editor.avatar} alt={editor.name} className="w-full h-full p-1" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-header font-black text-black uppercase leading-tight truncate">{editor.name}</p>
                                        <p className="text-[8px] font-header font-black text-accent-pink uppercase tracking-widest mt-1 truncate">{editor.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-2 bg-gray-50 border-2 border-black text-[9px] font-header font-black text-black uppercase tracking-widest hover:bg-white transition-colors">
                            FULL BOARD
                        </button>
                    </div>

                    {/* Resources */}
                    <div className="illustration-card bg-white space-y-4">
                        <div className="flex items-center gap-3 border-b-3 border-black pb-4 -mx-6 px-6 mb-2">
                            <FileText className="w-5 h-5 text-accent-pink" />
                            <h3 className="text-xs font-header font-black text-black uppercase tracking-widest">Resources</h3>
                        </div>
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            showSystemModal({
                                type: 'info',
                                title: 'Coming Soon',
                                message: 'Research submission guidelines are being finalized.'
                            });
                        }} className="flex items-center justify-between p-3 bg-accent-softPink/30 border-2 border-black shadow-flat-xs hover:shadow-flat transition-all group text-[9px] font-header font-black text-black uppercase">
                            GUIDELINES <ExternalLink className="w-3 h-3 text-black/20" />
                        </a>
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            showSystemModal({
                                type: 'info',
                                title: 'Coming Soon',
                                message: 'API documentation for developers is in progress.'
                            });
                        }} className="flex items-center justify-between p-3 bg-white border-2 border-black shadow-flat-xs hover:shadow-flat transition-all group text-[9px] font-header font-black text-black uppercase">
                            API DOCS <ExternalLink className="w-3 h-3 text-black/20" />
                        </a>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default JournalView;
