import React, { useRef, useEffect } from 'react';
import {
    Microscope, Zap, Database, Globe, ArrowRight, Sparkles,
    FlaskConical, Fingerprint, Network, Activity, MessageSquare,
    Search, Upload, Users, BookOpen, ChevronRight, ChevronDown,
    FileText, Coins, ShieldCheck
} from 'lucide-react';
import { clsx } from 'clsx';
import { useSolana } from '../context/useSolana';

const LandingPage = ({ onLaunch }: { onLaunch: () => void }) => {
    const { showSystemModal } = useSolana();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('animate-visible'); observer.unobserve(e.target); }
            }),
            { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
        );
        containerRef.current?.querySelectorAll('.anim-item').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.top < window.innerHeight) el.classList.add('animate-visible');
            else observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-[#FAFAFA] text-black overflow-x-hidden">

            {/* Floating Nav */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-5xl bg-white border-3 border-black p-4 flex items-center justify-between shadow-flat animate-fade-in-down">
                <button onClick={onLaunch} className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-10 h-10 bg-accent-softPurple border-3 border-black flex items-center justify-center transition-all group-hover:bg-accent-softPink">
                        <img src="/biotry-logo.png" alt="Biotry Logo" className="w-full h-full object-contain p-1.5" />
                    </div>
                    <span className="text-xl font-display font-black tracking-tight uppercase text-black">BIOTRY<span className="text-accent-pink">.</span></span>
                </button>
                <div className="hidden lg:flex items-center gap-10 text-[11px] font-header font-black uppercase tracking-[0.2em] text-black/40">
                    {[{ label: 'Story', href: '#story' }, { label: 'Solution', href: '#solution' }, { label: 'Comparison', href: '#comparison' }, { label: 'BioCoin', href: '#biocoin' }].map(link => (
                        <a key={link.label} href={link.href} className="hover:text-black transition-colors relative group">
                            {link.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-1 bg-accent-purple transition-all duration-300 group-hover:w-full" />
                        </a>
                    ))}
                </div>
                <button onClick={onLaunch} className="btn-illu-primary text-[10px] px-6 py-2.5">LAUNCH APP</button>
            </nav>

            {/* HERO */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden bg-white pt-32">
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

                <div className="relative z-10 flex flex-col items-center gap-10 max-w-5xl mx-auto pb-20">
                    {/* Badge */}
                    <div className="anim-item inline-flex items-center gap-3 px-5 py-2 border-3 border-black bg-white text-black shadow-flat-sm text-[11px] font-header font-black uppercase tracking-[0.3em]">
                        <Sparkles className="w-4 h-4 text-accent-purple" /> THE SOCIAL GRAPH OF SCIENCE
                    </div>

                    {/* Headline */}
                    <h1 className="anim-item text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter leading-[0.85] uppercase">
                        RESEARCH IS A<br />
                        <span className="text-accent-purple italic underline decoration-8 decoration-black">SOCIAL GRAPH.</span>
                    </h1>

                    <p className="anim-item text-lg md:text-xl text-black/60 max-w-4xl font-black uppercase tracking-tight leading-relaxed">
                        Science is stuck in <span className="bg-accent-softPurple px-2 text-black">Web2 silos</span>. We're building the first <span className="bg-accent-softPink px-2 text-black">On-Chain Social Network</span> where expertise is assetized and research is peer-verified in real-time.
                    </p>

                    <div className="anim-item flex flex-wrap justify-center gap-6">
                        <button onClick={onLaunch} className="btn-illu-primary px-12 py-5 text-base flex items-center gap-3 bg-black text-white">
                            JOIN THE GRAPH <ArrowRight className="w-5 h-5 text-accent-pink" />
                        </button>
                        <button
                            onClick={() => {
                                const el = document.getElementById('solution');
                                el?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="btn-illu-outline bg-white px-12 py-5 text-base border-3 border-black shadow-flat"
                        >
                            EXPLORE RESEARCH
                        </button>
                    </div>

                    {/* Floating Illustration elements */}
                    <div className="absolute -left-40 top-1/2 -translate-y-1/2 hidden xl:block">
                        <div className="illustration-card bg-white w-48 h-64 rotate-6 shadow-flat-purple border-3 border-black animate-fluid-float p-6 flex flex-col justify-between">
                            <div className="w-10 h-10 bg-accent-softPurple border-2 border-black flex items-center justify-center">
                                <Network className="w-6 h-6 text-black" />
                            </div>
                            <div className="space-y-4">
                                <div className="h-3 bg-gray-100 border-2 border-black w-full" />
                                <div className="h-3 bg-gray-100 border-2 border-black w-3/4" />
                                <div className="h-3 bg-gray-100 border-2 border-black w-1/2" />
                            </div>
                            <div className="text-[10px] font-header font-black uppercase">SOCIAL GRAPH</div>
                        </div>
                    </div>
                    <div className="absolute -right-40 top-1/2 -translate-y-1/2 hidden xl:block">
                        <div className="illustration-card bg-white w-48 h-64 -rotate-6 shadow-flat-pink border-3 border-black animate-fluid-float p-6 flex flex-col justify-between" style={{ animationDelay: '1s' }}>
                            <div className="w-10 h-10 bg-accent-softPink border-2 border-black flex items-center justify-center">
                                <Fingerprint className="w-6 h-6 text-black" />
                            </div>
                            <div className="space-y-4">
                                <div className="h-3 bg-gray-100 border-2 border-black w-full" />
                                <div className="h-10 border-2 border-black flex items-center justify-center text-xs font-black bg-accent-softPurple">VERIFIED</div>
                            </div>
                            <div className="text-[10px] font-header font-black uppercase">IDENTITY</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PROBLEM / STORY */}
            <section id="story" className="py-28 px-6 bg-black text-white border-y-3 border-black relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, #FFF 1px, transparent 1px), linear-gradient(to bottom, #FFF 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

                <div className="max-w-6xl mx-auto space-y-20 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                        <div className="space-y-10">
                            <p className="anim-item text-xs font-header font-black text-accent-pink uppercase tracking-[0.4em]">RESEARCH STORYTELLING</p>
                            <h2 className="anim-item text-4xl md:text-6xl font-display font-black uppercase tracking-tight leading-none text-white">
                                SCIENCE IS BROKEN.<br />
                                <span className="text-accent-pink italic">WE FIXED IT.</span>
                            </h2>
                            <div className="space-y-6 text-lg font-header font-black uppercase text-white/60 leading-relaxed">
                                <p className="anim-item">Research is trapped in opaque journals. Reward structures are distorted. Early researchers lack access to capital while investors bet blindly.</p>
                                <p className="anim-item">Reddit and Twitter discuss research, but they lack verification systems and trust-based structures.</p>
                                <p className="anim-item">We need <span className="text-white bg-accent-purple px-2">Credibly Neutral</span> infrastructure where reputation is the new asset class.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {[
                                { title: "Opaque Research", desc: "Locked behind paywalls and centralized gatekeepers.", icon: ShieldCheck },
                                { title: "Slow Valuation", desc: "Centralized evaluation cycles take years, not days.", icon: Activity },
                                { title: "Funding Asymmetry", desc: "Information gaps between researchers and capital.", icon: Coins },
                            ].map((item) => (
                                <div key={item.title} className="anim-item bg-white/5 border-2 border-white/20 p-8 flex items-center gap-8 hover:border-accent-pink transition-all group">
                                    <div className="w-16 h-16 bg-white flex items-center justify-center shrink-0 border-3 border-black shadow-[4px_4px_0px_0px_rgba(255,51,153,1)]">
                                        <item.icon className="w-8 h-8 text-black" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-display font-black uppercase group-hover:text-accent-pink transition-colors">{item.title}</h3>
                                        <p className="text-xs font-header font-black text-white/40 uppercase tracking-widest">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SOLUTION */}
            <section id="solution" className="py-28 px-6 bg-[#FDFDFD]">
                <div className="max-w-6xl mx-auto space-y-20">
                    <div className="text-center space-y-6 max-w-3xl mx-auto">
                        <p className="anim-item text-xs font-header font-black text-accent-purple uppercase tracking-[0.4em]">OUR SOLUTION</p>
                        <h2 className="anim-item text-4xl md:text-6xl font-display font-black uppercase tracking-tight leading-none text-black">
                            RESEARCH IS A SOCIAL GRAPH.
                        </h2>
                        <p className="anim-item text-sm font-header font-black text-black/40 uppercase tracking-widest leading-relaxed">
                            A Solana-based on-chain research network where metrics are derived from a graph of professional expertise.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Fingerprint,
                                title: 'ON-CHAIN PROFILE',
                                subtitle: 'EXPERTISE GRAPH',
                                desc: 'METADATA-DRIVEN PROFESSIONAL IDENTITY INCLUDING FIELD, RESEARCH THEMES, AND ZK-VERIFIED CAREER PATHS.',
                                bg: 'bg-accent-softPurple',
                                color: 'text-accent-purple'
                            },
                            {
                                icon: Network,
                                title: 'ON-CHAIN POSTS',
                                subtitle: 'REAL-TIME STREAM',
                                desc: 'EXPERIMENT LOGS, DATASETS, AND PAPERS AS ON-CHAIN POSTS VIA TAPESTRY. PEER REVIEW TRACKED VIA INFLUENCE GRAPH.',
                                bg: 'bg-accent-softPink',
                                color: 'text-accent-pink'
                            },
                            {
                                icon: Coins,
                                title: 'DAO FUNDING',
                                subtitle: 'ASSETIZED RESULTS',
                                desc: 'BIO PROTOCOL DRIVEN FUNDING POOLS AND RESEARCH DAOS. MILESTONE-BAWERED REWARDS FOR PROVEN IMPACT.',
                                bg: 'bg-white',
                                color: 'text-black'
                            },
                        ].map((item) => (
                            <div key={item.title} className="anim-item illustration-card bg-white p-10 flex flex-col justify-between min-h-[400px] group hover:-translate-y-2 transition-all">
                                <div className="space-y-8">
                                    <div className={clsx("w-16 h-16 border-3 border-black flex items-center justify-center shadow-flat-sm group-hover:shadow-flat transition-all", item.bg)}>
                                        <item.icon className={clsx("w-8 h-8", item.color)} />
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-header font-black text-accent-purple uppercase tracking-widest">{item.subtitle}</h4>
                                        <h3 className="text-3xl font-display font-black uppercase tracking-tight text-black leading-tight">{item.title}</h3>
                                        <p className="text-xs font-header font-black text-black/50 uppercase leading-relaxed tracking-tight">{item.desc}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => showSystemModal({
                                        type: 'info',
                                        title: 'Coming Soon',
                                        message: 'The documentation portal is currently under development. Stay tuned!'
                                    })}
                                    className="mt-8 flex items-center gap-2 text-[10px] font-header font-black uppercase tracking-widest text-black group-hover:text-accent-purple transition-colors"
                                >
                                    LEARN MORE <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* COMPARISON - REDDIT/TWITTER/US */}
            < section className="py-28 px-6 bg-white border-y-3 border-black" >
                <div className="max-w-6xl mx-auto space-y-16">
                    <div className="text-center">
                        <h2 className="anim-item text-4xl md:text-5xl font-display font-black uppercase tracking-tight leading-none text-black mb-12">
                            WHY BIOTRY?
                        </h2>
                    </div>

                    <div className="anim-item overflow-x-auto">
                        <table className="w-full border-4 border-black font-header font-black uppercase text-xs">
                            <thead>
                                <tr className="bg-black text-white text-center">
                                    <th className="p-6 border-r-4 border-white whitespace-nowrap">FEATURE</th>
                                    <th className="p-6 border-r-4 border-white whitespace-nowrap">REDDIT</th>
                                    <th className="p-6 border-r-4 border-white whitespace-nowrap">TWITTER</th>
                                    <th className="p-6 bg-accent-purple">BIOTRY</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { label: "DISCUSSION", c1: "ANONYMOUS", c2: "VIRAL", c3: "PROFESSIONAL NETWORK" },
                                    { label: "FOCUS", c1: "MEMES", c2: "INFLUENCERS", c3: "EXPERTISE" },
                                    { label: "MODEL", c1: "AD REVENUE", c2: "AD REVENUE", c3: "RESEARCH PERFORMANCE" },
                                    { label: "TRUST", c1: "CENTRALIZED", c2: "CENTRALIZED", c3: "ON-CHAIN VERIFIED" }
                                ].map((row) => (
                                    <tr key={row.label} className="border-b-4 border-black text-center">
                                        <td className="p-6 border-r-4 border-black bg-gray-50 text-left font-black">{row.label}</td>
                                        <td className="p-6 border-r-4 border-black text-black/40">{row.c1}</td>
                                        <td className="p-6 border-r-4 border-black text-black/40">{row.c2}</td>
                                        <td className="p-6 bg-accent-softPurple font-black">{row.c3}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section >

            {/* COMPARISON - RESEARCHHUB VS BIOTRY */}
            < section id="comparison" className="py-28 px-6 bg-[#FAFAFA]" >
                <div className="max-w-6xl mx-auto space-y-16">
                    <div className="space-y-6 max-w-3xl">
                        <p className="anim-item text-xs font-header font-black text-accent-pink uppercase tracking-[0.4em]">DEEP COMPARISON</p>
                        <h2 className="anim-item text-4xl md:text-6xl font-display font-black uppercase tracking-tight leading-none text-black">
                            BIOTRY VS. RESEARCHHUB
                        </h2>
                        <p className="anim-item text-sm font-header font-black text-black/40 uppercase tracking-widest leading-relaxed">
                            ResearchHub is for sharing and rewards. <span className="text-black bg-accent-softPink px-2">Biotry is the infrastructure for research assets and social graphs.</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                title: "IDENTITY & GRAPH",
                                hub: "Simple tagging / Profile based",
                                try: "Expertise Graph / On-chain Metadata",
                                desc: "ResearchHub focuses on open tagging. Biotry creates a structural expertise network for professional matching."
                            },
                            {
                                title: "CONTENT FEED",
                                hub: "PDFs / Hubs / Static papers",
                                try: "Stream / Experiment Logs / On-chain posts",
                                desc: "Biotry treats research as a live stream of activities and logs, not just final static PDFs."
                            },
                            {
                                title: "REPUTATION MODEL",
                                hub: "Token accumulation (RSC)",
                                try: "Expertise Metrics / Impact Index",
                                desc: "Biotry calculates reputation based on field-specific impact and peer-influence within the social graph."
                            },
                            {
                                title: "FUNDING STRUCTURE",
                                hub: "Bounties / Community Fund",
                                try: "DAO / Milestone Pools / Capital Markets",
                                desc: "Biotry enables structured investment and research DAOs with milestone-based capital flows."
                            }
                        ].map((item) => (
                            <div key={item.title} className="anim-item illustration-card bg-white p-10 space-y-6">
                                <h3 className="text-2xl font-display font-black uppercase text-black border-b-3 border-black pb-4">{item.title}</h3>
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[10px] font-header font-black text-black/40 uppercase">RESEARCHHUB</span>
                                        <p className="text-sm font-black text-black/60 uppercase">{item.hub}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[10px] font-header font-black text-accent-purple uppercase">BIOTRY</span>
                                        <p className="text-sm font-black text-black uppercase">{item.try}</p>
                                    </div>
                                </div>
                                <p className="text-xs font-header font-black text-black/40 uppercase leading-relaxed pt-4 border-t-2 border-black/5">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* WHY SOLANA */}
            < section className="py-28 px-6 bg-accent-purple text-white overflow-hidden relative" >
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="space-y-10">
                        <h2 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tight leading-none text-white">
                            BUILT ON <br /><span className="text-black italic underline decoration-8 decoration-white">SOLANA.</span>
                        </h2>
                        <p className="text-lg font-header font-black uppercase text-white/80 leading-relaxed">
                            To build a real-time research activity stream, you need speed and performance. Solana provides the throughput necessary to make "Research as a Social Graph" a reality.
                        </p>
                        <div className="space-y-4">
                            {[
                                "FASTEST TRANSACTION SETTLEMENT",
                                "MINIMAL ON-CHAIN FEES",
                                "HIGH-PERFORMANCE SOCIAL LAYER",
                                "REAL-TIME ACTIVITY RECORDING"
                            ].map((text) => (
                                <div key={text} className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-black border-2 border-white flex items-center justify-center shrink-0">
                                        <Zap className="w-4 h-4 text-white fill-white" />
                                    </div>
                                    <span className="text-sm font-header font-black uppercase tracking-[0.2em]">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="illustration-card bg-white p-8 space-y-4 rotate-3 text-black">
                            <Activity className="w-8 h-8 text-accent-purple" />
                            <h4 className="font-black text-2xl uppercase">65K+ TPS</h4>
                        </div>
                        <div className="illustration-card bg-white p-8 space-y-4 -rotate-6 text-black mt-12">
                            <Globe className="w-8 h-8 text-accent-pink" />
                            <h4 className="font-black text-xl uppercase">GLOBAL SCALE</h4>
                        </div>
                    </div>
                </div>
            </section >

            {/* BIOCOIN */}
            < section id="biocoin" className="py-28 px-6 bg-black text-white relative overflow-hidden" >
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #8B5CF6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                        <div className="w-20 h-20 bg-accent-pink border-3 border-white flex items-center justify-center shadow-[6px_6px_0px_0px_white]">
                            <Coins className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tight leading-none text-white">
                            POWERED BY <br /><span className="text-accent-purple italic underline decoration-8 decoration-white">BIOCOIN.</span>
                        </h2>
                        <p className="text-base font-header font-black uppercase tracking-wide leading-relaxed text-white/60">
                            THE DIGITAL TOKEN THAT MAKES RESEARCHERS CO-OWNERS OF THE SCIENTIFIC ECOSYSTEM. REPUTATION IS NOW A CALCULABLE, TRADABLE ASSET.
                        </p>
                        <div className="space-y-4">
                            {[
                                "A16Z: ON-CHAIN REPUTATION",
                                "VITALIK: PUBLIC GOODS FUNDING",
                                "COINBASE: CREATOR ECONOMY 2.0",
                                "DELPHI: AI + DATA MARKETS"
                            ].map((text) => (
                                <div key={text} className="flex items-center gap-4">
                                    <div className="w-6 h-6 bg-accent-purple border-2 border-white flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-xs font-header font-black uppercase tracking-[0.2em]">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="illustration-card bg-white p-12 space-y-8 rotate-3 shadow-[12px_12px_0px_0px_#8B5CF6] border-4 border-black text-black">
                            <div className="flex items-center justify-between border-b-4 border-black pb-8">
                                <span className="text-xs font-header font-black uppercase tracking-widest text-black/40">RESEARCH ASSET</span>
                                <Sparkles className="w-6 h-6 text-accent-pink" />
                            </div>
                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-header font-black uppercase text-black/30">RELIABILITY INDEX</p>
                                        <p className="text-4xl font-display font-black">98.2%</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-accent-purple font-black">STABLE</div>
                                </div>
                                <div className="h-4 bg-gray-100 border-2 border-black relative overflow-hidden">
                                    <div className="absolute inset-y-0 left-0 bg-accent-softPurple w-full" />
                                </div>
                                <button onClick={onLaunch} className="w-full py-5 bg-black text-white text-xs font-header font-black uppercase tracking-[0.2em] shadow-flat-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                                    ASSETIZE RESEARCH →
                                </button>
                            </div>
                        </div>
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent-softPurple border-3 border-black rounded-full flex items-center justify-center animate-bounce shadow-flat">
                            <Coins className="w-10 h-10 text-black" />
                        </div>
                    </div>
                </div>
            </section >

            {/* FOOTER */}
            < footer className="py-24 px-6 border-t-3 border-black bg-white" >
                <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-12">
                    <button onClick={onLaunch} className="flex items-center gap-4 group">
                        <div className="w-16 h-16 bg-accent-softPurple border-4 border-black flex items-center justify-center shadow-flat-sm group-hover:shadow-flat transition-all overflow-hidden p-2">
                            <img src="/biotry-logo.png" alt="Biotry Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-4xl font-display font-black tracking-tight uppercase text-black">BIOTRY<span className="text-accent-pink">.</span></span>
                    </button>
                    <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-[10px] font-header font-black uppercase tracking-[0.3em] text-black/40">
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            showSystemModal({
                                type: 'info',
                                title: 'Coming Soon',
                                message: 'This feature is currently in development.'
                            });
                        }} className="hover:text-black transition-colors">Research Graph</a>
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            showSystemModal({
                                type: 'info',
                                title: 'Coming Soon',
                                message: 'Reputation metas are being indexed.'
                            });
                        }} className="hover:text-black transition-colors">Expertise Metas</a>
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            showSystemModal({
                                type: 'info',
                                title: 'Coming Soon',
                                message: 'DAO Governance will be available soon.'
                            });
                        }} className="hover:text-black transition-colors">DAO Governance</a>
                        <a href="https://tapestry.social" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">Tapestry Protocol</a>
                    </div>
                    <p className="text-[10px] font-header font-black text-black/20 uppercase tracking-[0.4em]">© 2026 BIOTRY • RESEARCH IS A SOCIAL GRAPH • BUILT ON SOLANA</p>
                </div>
            </footer >
        </div >
    );
};


export default LandingPage;
