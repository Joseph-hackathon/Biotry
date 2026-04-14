import React, { useRef, useEffect } from 'react';
import {
    Zap, Globe, ArrowRight, Sparkles,
    FlaskConical, Fingerprint, Network, Activity,
    ChevronRight, Coins, Plus, ShieldCheck, Cpu, Code2, Users, Terminal
} from 'lucide-react';
import { clsx } from 'clsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FloatingGraph = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const nodes = Array.from({ length: 30 });
        const ctx = gsap.context(() => {
            nodes.forEach((_, i) => {
                const xStart = Math.random() * 100;
                const yStart = Math.random() * 100;
                const delay = Math.random() * 5;
                const duration = 20 + Math.random() * 30;

                gsap.to(`.node-enhanced-${i}`, {
                    x: `+=${Math.random() * 300 - 150}`,
                    y: `+=${Math.random() * 300 - 150}`,
                    duration,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay
                });
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 -z-10 bg-[#030303]">
            {/* Rich Mesh Gradients */}
            <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-purple-600/10 rounded-full blur-[180px] mix-blend-screen animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#F6851B]/10 rounded-full blur-[150px] mix-blend-screen animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[400px] bg-blue-500/5 rounded-full blur-[200px] -z-10" />
            
            {Array.from({ length: 60 }).map((_, i) => (
                <div
                    key={i}
                    className={clsx(
                        `node-enhanced-${i % 30} absolute rounded-full`,
                        i % 6 === 0 
                            ? 'w-1.5 h-1.5 bg-[#F6851B] shadow-[0_0_20px_#F6851B] opacity-60' 
                            : i % 8 === 0 
                                ? 'w-2.5 h-2.5 bg-[#7C3AED] shadow-[0_0_25px_#7C3AED] opacity-30'
                                : 'w-[1.5px] h-[1.5px] bg-white opacity-20'
                    )}
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                />
            ))}
            
            <svg className="absolute inset-0 w-full h-full opacity-20">
                <defs>
                    <linearGradient id="line-grad-metamask" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0" />
                        <stop offset="50%" stopColor="#F6851B" stopOpacity="1" />
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {Array.from({ length: 40 }).map((_, i) => (
                    <line
                        key={i}
                        x1={`${Math.random() * 100}%`}
                        y1={`${Math.random() * 100}%`}
                        x2={`${Math.random() * 100}%`}
                        y2={`${Math.random() * 100}%`}
                        stroke="url(#line-grad-metamask)"
                        strokeWidth="0.8"
                        className="opacity-40"
                    />
                ))}
            </svg>
        </div>
    );
};

const HeroCard = ({ title, icon: Icon, delay, rotate, color, className }: any) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(cardRef.current, {
                x: className.includes('left') ? -200 : 200,
                opacity: 0,
                scale: 0.8,
                rotation: -20,
                duration: 1.5,
                delay,
                ease: 'elastic.out(1, 0.7)'
            });

            gsap.to(cardRef.current, {
                y: '+=20',
                rotation: '+=5',
                duration: 3 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: delay + 1
            });
        });
        return () => ctx.revert();
    }, [delay, className]);

    return (
        <div ref={cardRef} className={clsx(
            "absolute w-64 h-80 glass-panel rounded-[40px] border-[3px] border-white/10 p-8 space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl z-20",
            rotate, "opacity-100 ring-1 ring-white/5",
            className
        )} style={{ borderColor: `${color}80`, background: `${color}05` }}>
            <div className="flex justify-between items-start">
                <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 shadow-xl")} style={{ backgroundColor: `${color}30` }}>
                    <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Plus className="text-white/40 w-4 h-4" />
                </div>
            </div>
            <div className="space-y-4">
                <div className="h-4 bg-white/10 rounded-full w-full" />
                <div className="h-4 bg-white/5 rounded-full w-3/4" />
                <div className="h-4 bg-white/5 rounded-full w-1/2 opacity-30" />
            </div>
            <div className="pt-12 flex items-center justify-between">
                <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-9 h-9 rounded-full border-2 border-[#0B0E11] bg-white/5 overflow-hidden shadow-lg">
                            <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${i * delay}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
                <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none drop-shadow-md">{title}</p>
            </div>
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/5 pointer-events-none rounded-[40px]" />
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
        </div>
    );
};

const LandingPage = ({ onLaunch }: { onLaunch: () => void }) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Persistent Logo Scroll Animation
            gsap.to(logoRef.current, {
                scrollTrigger: {
                    trigger: rootRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1,
                },
                y: '100vh',
                rotation: 360,
                scale: 0.8,
                ease: 'none'
            });

            // Hero content entry
            gsap.from('.hero-reveal > *', {
                y: 50,
                opacity: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: 'power4.out'
            });

            // Reveal animations for sections
            gsap.utils.toArray('.reveal-section').forEach((el: any) => {
                gsap.from(el, {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    },
                    y: 60,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out'
                });
            });
        }, rootRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={rootRef} className="min-h-screen bg-[#030303] text-white selection:bg-[#F6851B]/30 overflow-x-hidden font-sans relative scroll-smooth">
            <FloatingGraph />
            
            {/* ── Persistent Floating Logo ── */}
            <div ref={logoRef} className="fixed top-1/2 right-10 -translate-y-1/2 w-32 h-32 hidden xl:flex items-center justify-center z-50 pointer-events-none mix-blend-screen opacity-10">
                <img src="/biotry-logo.png" className="w-full h-full object-contain brightness-0 invert" alt="Logo Scroll" />
                <div className="absolute inset-0 bg-[#F6851B]/20 blur-3xl rounded-full" />
            </div>

            {/* ── Navigation ── */}
            <nav className="fixed top-0 left-0 w-full h-20 px-12 flex items-center justify-between z-[100] backdrop-blur-xl border-b border-white/5 bg-black/40">
                <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                    <div className="w-10 h-10 bg-gradient-to-br from-[#F6851B] to-[#FFAB5E] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(246,133,27,0.2)]">
                         <img src="/biotry-logo.png" alt="Biotry" className="w-full h-full object-contain brightness-0 invert p-1.5" />
                    </div>
                    <span className="text-2xl font-bold tracking-tighter uppercase">BIOTRY<span className="text-[#F6851B]">.</span></span>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex gap-10">
                        {['Discovery', 'Simulation', 'Privacy_Hub', 'Governance'].map(l => (
                            <a key={l} href={`#${l.toLowerCase()}`} className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors">{l}</a>
                        ))}
                    </div>
                    <button onClick={onLaunch} className="btn-metamask h-11 px-10 shadow-2xl uppercase tracking-widest text-[11px] font-black">LAUNCH APP</button>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6" style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}>
                <div className="hero-reveal text-center max-w-5xl space-y-10 z-10 relative">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-[0.4em] backdrop-blur-xl mb-4 text-[#F6851B]">
                        <Fingerprint className="w-4 h-4 fill-current" /> Confidential Expertise Protocol
                    </div>
                    
                    <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.8] text-white uppercase italic">
                        LIQUEFYING <br />
                        <span className="text-gradient-orange">KNOWLEDGE.</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-white/40 max-w-4xl mx-auto font-medium leading-[1.6] tracking-tight">
                        The intersection of decentralized reputation and financial privacy. <br />
                        Powered by the <span className="text-white font-bold">Tapestry Social Graph</span> and the <span className="text-[#F6851B] font-bold">Umbra Privacy Protocol</span>.
                    </p>


                    <div className="flex flex-wrap justify-center gap-8 pt-6">
                        <button onClick={onLaunch} className="btn-metamask py-6 px-16 text-lg group">
                            JOIN THE SOCIAL GRAPH <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Multiple Hero Cards (Viewport Safe Positioning + Advanced Animations) */}
                <div className="absolute left-[12%] bottom-[15%] hidden xl:block">
                    <HeroCard title="Research Node_01" icon={FlaskConical} delay={0.5} rotate="-rotate-12" color="#F6851B" className="left-0" />
                </div>
                <div className="absolute right-[12%] top-[15%] hidden xl:block">
                    <HeroCard title="On-Chain Profile" icon={Fingerprint} delay={0.8} rotate="rotate-6" color="#7C3AED" className="right-0" />
                </div>
                <div className="absolute left-[8%] top-[15%] hidden xl:block opacity-60">
                    <HeroCard title="Funding Node" icon={Coins} delay={1.1} rotate="-rotate-6" color="#3B82F6" className="left-0" />
                </div>
            </section>

            {/* ── SECTION 1: DISCOVERY SOCIAL GRAPH ── */}
            <section id="discovery" className="py-40 px-6 relative">
                {/* Boundary Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-[#F6851B]/5 to-transparent -translate-y-1/2 blur-[120px] pointer-events-none" />
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="reveal-section space-y-10">
                        <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                            NO MORE <br /><span className="text-gradient-purple">SILOS.</span>
                        </h2>
                        <p className="text-xl text-white/40 font-medium uppercase tracking-tight leading-relaxed max-w-xl">
                            Science unchained. A real-time social mesh of citations, credits, and active collaboration without silos.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-8 glass-panel border border-white/10 rounded-3xl space-y-4">
                                <Network className="w-10 h-10 text-[#7C3AED]" />
                                <h4 className="text-sm font-black uppercase text-white">Dynamic Graphs</h4>
                                <p className="text-[10px] text-white/20 uppercase">Real-time mapping of research influence.</p>
                            </div>
                            <div className="p-8 glass-panel border border-white/10 rounded-3xl space-y-4">
                                <Users className="w-10 h-10 text-[#F6851B]" />
                                <h4 className="text-sm font-black uppercase text-white">Collab Nodes</h4>
                                <p className="text-[10px] text-white/20 uppercase">Matchmaking via scientific interest.</p>
                            </div>
                        </div>
                    </div>
                    <div className="reveal-section relative">
                        {/* Interactive Graph Mockup */}
                        <div className="w-full aspect-square glass-panel rounded-full border-2 border-white/5 flex items-center justify-center p-10 overflow-hidden group">
                            <div className="relative w-full h-full border border-dashed border-white/10 rounded-full animate-spin-slow" />
                            <div className="absolute w-2/3 h-2/3 border border-dotted border-[#F6851B]/20 rounded-full animate-spin-reverse" />
                            <div className="absolute w-32 h-32 bg-gradient-to-br from-[#F6851B] to-[#7C3AED] rounded-3xl group-hover:scale-110 transition-transform shadow-[0_0_100px_rgba(246,133,27,0.3)] flex items-center justify-center p-6">
                                <img src="/biotry-logo.png" className="w-full h-full object-contain brightness-0 invert" alt="Biotry" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 2: AI SIMULATION ── */}
            <section id="simulation" className="py-40 px-6 bg-[#030303] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#7C3AED]/10 to-transparent" />
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="reveal-section order-2 lg:order-1 relative">
                        <div className="glass-panel p-10 rounded-[40px] border-4 border-white/5 bg-black/80 shadow-[0_0_150px_rgba(124,58,237,0.15)] relative overflow-hidden">
                             <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-8">
                                 <Terminal className="text-[#F6851B]" />
                                 <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white">SIM_NODE_EXECUTOR // ACTIVE</span>
                             </div>
                             <div className="space-y-8 font-mono">
                                  <div className="flex justify-between items-end text-xs font-bold uppercase text-white/20">
                                      <span>VIABILITY_SCAN</span>
                                      <span className="text-green-400">SUCCESS</span>
                                  </div>
                                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                      <div className="h-full w-[94%] bg-[#F6851B]" />
                                  </div>
                                  <div className="bg-black p-8 rounded-2xl border border-white/5 text-[11px] text-[#A78BFA] leading-loose uppercase tracking-widest italic opacity-80">
                                       [SYSTEM] INGESTING DATASET_REF_882 <br />
                                       [AI] EXTRACTING METHODOLOGY... <br />
                                       [AI] GENERATING SIMULATION SCRIPT... <br />
                                       [STATUS] READY FOR EXECUTION
                                  </div>
                             </div>
                        </div>
                    </div>
                    <div className="reveal-section order-1 lg:order-2 space-y-12">
                        <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                            INSTANT <br /><span className="text-gradient-purple">PROOF.</span>
                        </h2>
                        <p className="text-xl text-white/40 font-medium uppercase tracking-tight leading-relaxed max-w-xl">
                            Skip the months of peer review. Predict methodology viability in sovereign AI sandboxes before the first drop hits the pipette.
                        </p>
                        <button onClick={onLaunch} className="btn-metamask py-5 px-14 text-sm group">
                            SIMULATE NOW <Zap className="w-5 h-5 ml-2 fill-current" />
                        </button>
                    </div>
                </div>
            </section>

            {/* ── SECTION 3: PROTOCOL PRIVACY LAYER ── */}
            <section id="monetization" className="py-40 px-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] bg-[#F6851B]/5 blur-[200px] -z-10 animate-pulse" />
                <div className="max-w-7xl mx-auto space-y-24">
                    <div className="reveal-section text-center space-y-8">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#F6851B]/10 border border-[#F6851B]/20 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-[#F6851B]">
                            <ShieldCheck className="w-3 h-3" /> UMBRA PRIVACY ENGINE
                        </div>
                        <h2 className="text-6xl md:text-[9rem] font-black tracking-tighter uppercase leading-[0.8] italic text-white/90">
                            EXPERT <br /><span className="text-gradient-orange">ECONOMY.</span>
                        </h2>
                        <p className="text-xl text-white/40 font-medium uppercase tracking-tight max-w-2xl mx-auto leading-relaxed">
                            Biotry bridges **Tapestry Reputation** with **Umbra Shielding** to reward research expertise without bias. Support discoveries anonymously.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="reveal-section glass-panel p-12 rounded-[40px] border-2 border-white/5 space-y-10 group hover:border-[#F6851B]/20 transition-all shadow-[0_0_80px_rgba(246,133,27,0.05)]">
                            <div className="w-20 h-20 rounded-3xl bg-[#F6851B]/10 flex items-center justify-center border border-[#F6851B]/20 group-hover:scale-110 transition-transform">
                                <Coins className="w-10 h-10 text-[#F6851B]" />
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-4xl font-black uppercase italic tracking-tighter">ANONYMOUS GRANTS</h3>
                                <p className="text-sm text-white/30 font-medium leading-relaxed uppercase tracking-tight">
                                    Support high-impact research without revealing strategic interests. Only the science remains public.
                                </p>
                                <div className="pt-4 flex items-center gap-4 text-[10px] font-black text-[#F6851B] uppercase tracking-[0.2em]">
                                    [STEALTH_TRANSFER] [ZERO_BIAS] [UMBRA_NATIVE]
                                </div>
                            </div>
                        </div>

                        <div className="reveal-section glass-panel p-12 rounded-[40px] border-2 border-white/5 space-y-10 group hover:border-[#7C3AED]/20 transition-all shadow-[0_0_80px_rgba(124,58,237,0.05)]">
                            <div className="w-20 h-20 rounded-3xl bg-[#7C3AED]/10 flex items-center justify-center border border-[#7C3AED]/20 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-10 h-10 text-[#7C3AED]" />
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-4xl font-black uppercase italic tracking-tighter">ZK-REPUTATION</h3>
                                <p className="text-sm text-white/30 font-medium leading-relaxed uppercase tracking-tight">
                                    Trust verified via Groth16 proofs. Protect your identity while proving domain mastery.
                                </p>
                                <div className="pt-4 flex items-center gap-4 text-[10px] font-black text-[#7C3AED] uppercase tracking-[0.2em]">
                                    [ZK_RP_PROOFS] [SOVEREIGN_ID] [VERIFIABLE_TRUST]
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 4: TRUST & IDENTITY ── */}
            <section id="identity" className="py-40 px-6 relative">
                 <div className="max-w-7xl mx-auto text-center space-y-20">
                    <div className="reveal-section space-y-6">
                        <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">TRUST BY <span className="text-gradient-orange">NATURE.</span></h2>
                        <p className="text-xl text-white/40 font-medium uppercase tracking-tight max-w-3xl mx-auto">Verified identity on-chain. Permissionless contributions. ZK-based credentials.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { i: ShieldCheck, t: 'ZK-Expertise', d: 'Prove domain mastery via Groth16 proofs without revealing identity.' },
                            { i: Activity, t: 'Live Sync', d: 'Real-time on-chain interaction stream for instant visibility.' },
                            { i: Cpu, t: 'Shielded Hub', d: 'The core ZK-Privacy engine for bias-free research grants.' }
                        ].map((item, i) => (
                            <div key={i} className="reveal-section glass-card p-12 flex flex-col items-center text-center space-y-8 group hover:border-[#F6851B]/40 transition-all duration-500 bg-[#0B0E11]/40 rounded-[40px]">
                                <item.i className="w-16 h-16 text-[#F6851B] group-hover:scale-110 transition-transform mb-2" />
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black uppercase text-white">{item.t}</h3>
                                    <p className="text-sm font-medium text-white/30 uppercase tracking-tight leading-relaxed">{item.d}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            </section>

            {/* ── SECTION 4: GOVERNANCE ── */}
            <section id="governance" className="py-40 px-6 bg-[#030303] relative">
                 <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#F6851B]/5 to-transparent opacity-50" />
                <div className="max-w-7xl mx-auto space-y-24">
                     <div className="reveal-section text-center md:text-left grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">
                        <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">OPEN <span className="text-gradient-purple">CORE.</span></h2>
                        <p className="text-xl text-white/40 font-medium uppercase tracking-tight max-w-xl pb-2">Biotry is more than a platform; it's an open framework for decentralized science. Build on our social graph and modular privacy layers.</p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { t: 'Tapestry API', d: 'Connect to the social graph mesh.', icon: Network },
                            { t: 'Researcher SDK', d: 'Publish nodes programmatically.', icon: Code2 },
                            { i: FlaskConical, t: 'Storage Nodes', d: 'Decentralized IPFS dataset hosting.', icon: Globe },
                            { t: 'Governance', d: 'Participate in network voting.', icon: ShieldCheck }
                        ].map((item, i) => (
                            <div key={i} className="reveal-section glass-panel p-8 flex flex-col justify-between h-56 hover:bg-white/5 transition-all border border-white/5">
                                <item.icon className="w-8 h-8 text-[#7C3AED]" />
                                <div className="space-y-2">
                                     <h4 className="text-sm font-black uppercase text-white">{item.t}</h4>
                                     <p className="text-[10px] text-white/30 uppercase font-medium">{item.d}</p>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="py-24 px-12 border-t border-white/5 bg-[#030303] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F6851B]/30 to-transparent" />
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
                     <div className="space-y-6 text-center md:text-left">
                        <div className="flex items-center gap-4 justify-center md:justify-start group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                            <div className="w-14 h-14 bg-gradient-to-br from-[#F6851B] to-[#FFAB5E] rounded-2xl flex items-center justify-center shadow-xl p-2">
                                <img src="/biotry-logo.png" alt="Biotry" className="w-full h-full object-contain brightness-0 invert" />
                            </div>
                            <span className="text-4xl font-black tracking-tighter uppercase italic">BIOTRY<span className="text-[#F6851B]">.</span></span>
                        </div>
                        <p className="text-xs font-bold text-white/20 uppercase tracking-[0.5em]">The High-Performance Protocol for Science.</p>

                     </div>

                      <div className="flex flex-wrap justify-center gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
                        {['Discovery', 'Simulation', 'Identity', 'Governance', 'Documentation'].map(f => (
                            <a key={f} href={`#${f.toLowerCase()}`} className="hover:text-white transition-colors">{f}</a>
                        ))}
                      </div>

                     <button onClick={onLaunch} className="btn-metamask h-16 px-16 shadow-2xl text-xs font-black uppercase tracking-widest">LAUNCH APP</button>
                </div>
                <div className="mt-20 text-center">
                    <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.6em]">© 2026 BIOTRY SYSTEMS // LIQUID DISCOVERY ON SOLANA</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
