import React, { useState, useEffect, useRef } from 'react';
import { 
    X, Zap, Activity, Cpu, Shield, TrendingUp, 
    AlertCircle, CheckCircle2, FlaskConical, Beaker,
    ArrowLeft, Terminal, Code2, Play, Info
} from 'lucide-react';
import { clsx } from 'clsx';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Post } from '../types';
import { analyzeResearchForSimulation, ResearchAnalysis, SimulationStep } from '../lib/aiSimulator';

interface SimulatePageProps {
    post: Post;
    onBack: () => void;
}

const SimulatePage: React.FC<SimulatePageProps> = ({ post, onBack }) => {
    const [phase, setPhase] = useState<'analyzing' | 'simulating' | 'result'>('analyzing');
    const [analysis, setAnalysis] = useState<ResearchAnalysis | null>(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [progress, setProgress] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const scanLineRef = useRef<HTMLDivElement>(null);
    const logsRef = useRef<HTMLDivElement>(null);

    // Initial Analysis
    useEffect(() => {
        const start = async () => {
            const result = await analyzeResearchForSimulation(post);
            setAnalysis(result);
            setPhase('simulating');
        };
        start();
    }, [post]);

    // Simulation Loop
    useEffect(() => {
        if (phase === 'simulating' && analysis) {
            let step = 0;
            const interval = setInterval(() => {
                if (step < analysis.steps.length) {
                    setCurrentStepIndex(step);
                    setProgress(((step + 1) / analysis.steps.length) * 100);
                    step++;
                } else {
                    clearInterval(interval);
                    setTimeout(() => setPhase('result'), 800);
                }
            }, 1200);
            return () => clearInterval(interval);
        }
    }, [phase, analysis]);

    // GSAP Animations
    useGSAP(() => {
        if (phase === 'analyzing') {
            gsap.to(scanLineRef.current, {
                top: '100%',
                duration: 1.5,
                repeat: -1,
                ease: 'none'
            });
        }
    }, { scope: containerRef, dependencies: [phase] });

    // Auto-scroll logs
    useEffect(() => {
        if (logsRef.current) {
            logsRef.current.scrollTop = logsRef.current.scrollHeight;
        }
    }, [currentStepIndex, phase]);

    return (
        <div ref={containerRef} className="min-h-screen bg-[#030303] text-white flex flex-col font-sans overflow-hidden">
            {/* Glassmorphic Top Navbar */}
            <nav className="h-20 border-b border-white/5 px-8 flex items-center justify-between backdrop-blur-md bg-black/40 z-50">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={onBack}
                        className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:border-[#F6851B] transition-all group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="h-8 w-[1px] bg-white/10" />
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-[#F6851B] animate-pulse" />
                             <h1 className="text-sm font-bold uppercase tracking-tight text-white">{post.title}</h1>
                        </div>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-5">RESEARCH SIMULATOR v2.1 // NODE_{post.id.slice(0, 8)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <div className="hidden md:flex flex-col items-end mr-4">
                         <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">System Status</span>
                         <span className="text-[11px] font-bold text-green-400 uppercase tracking-widest">LIVE_DOCK_ACTIVE</span>
                     </div>
                     <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                         <Zap className="w-5 h-5 text-[#F6851B] fill-[#F6851B]" />
                     </div>
                </div>
            </nav>

            {/* Main Command Center Layout */}
            <main className="flex-1 flex overflow-hidden">
                {/* Visual Simulation Area (Left) */}
                <section className="flex-1 relative flex flex-col items-center justify-center p-12 overflow-hidden">
                     {/* Background Grid & Glow */}
                     <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px] -z-10" />
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#F6851B]/5 rounded-full blur-[120px] -z-10" />

                     {phase === 'analyzing' && (
                         <div className="relative w-80 h-96 glass-panel rounded-3xl flex items-center justify-center group">
                             <div ref={scanLineRef} className="absolute top-0 left-0 w-full h-[2px] bg-[#F6851B] shadow-[0_0_20px_#F6851B] z-30" />
                             <FlaskConical className="w-24 h-24 text-[#F6851B]/20 animate-pulse" />
                             <div className="absolute bottom-10 left-0 w-full text-center">
                                 <p className="text-[10px] font-bold text-[#F6851B] uppercase tracking-[0.4em] animate-pulse">Scanning On-Chain Metadata</p>
                             </div>
                         </div>
                     )}

                     {(phase === 'simulating' || phase === 'result') && (
                         <div className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                             {/* AI Research Evaluation */}
                             {analysis && (
                                 <div className="p-8 glass-card border border-[#7C3AED]/20 space-y-4 relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/5 blur-3xl" />
                                     <div className="flex items-center gap-3 text-[#A78BFA]">
                                         <FlaskConical className="w-5 h-5" />
                                         <h3 className="text-xs font-bold uppercase tracking-[0.3em]">Research Recipe Evaluation</h3>
                                     </div>
                                     <p className="text-sm text-white/80 font-medium leading-relaxed italic border-l-2 border-[#7C3AED]/40 pl-6">
                                         {analysis.summary}
                                     </p>
                                     <div className="flex flex-wrap gap-2 pt-2">
                                         {analysis.theses.map((thesis, i) => (
                                             <span key={i} className="text-[9px] px-3 py-1.5 bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#A78BFA] font-bold uppercase tracking-widest rounded-full">
                                                 # {thesis}
                                             </span>
                                         ))}
                                     </div>
                                 </div>
                             )}

                             {/* Visualizer */}
                             <div className="relative aspect-video glass-panel rounded-[32px] border border-white/5 flex items-center justify-center p-8 overflow-hidden group">
                                 <div className="relative w-full h-full flex items-center justify-center">
                                     <Activity className={clsx(
                                         "w-32 h-32 transition-all duration-1000",
                                         phase === 'simulating' ? "text-[#F6851B] animate-pulse" : "text-[#7C3AED] opacity-20"
                                     )} />
                                     <div className="absolute inset-0 flex items-center justify-center scale-75">
                                          <div className="w-[300px] h-[300px] border border-dashed border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
                                          <div className="w-[350px] h-[350px] border border-dotted border-[#F6851B]/10 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
                                     </div>
                                 </div>

                                 {phase === 'simulating' && (
                                     <div className="absolute inset-x-12 bottom-12 space-y-4">
                                         <div className="flex justify-between items-end">
                                             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 font-mono">Intensity_Scan...</span>
                                             <span className="text-3xl font-bold text-[#F6851B] tracking-tighter">{Math.round(progress)}%</span>
                                         </div>
                                         <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                             <div 
                                                 className="h-full bg-gradient-to-r from-[#7C3AED] to-[#F6851B] shadow-[0_0_20px_#F6851B] transition-all duration-300" 
                                                 style={{ width: `${progress}%` }} 
                                             />
                                         </div>
                                     </div>
                                 )}
                             </div>
                         </div>
                     )}
                </section>

                {/* Control Panel (Right) */}
                <aside className="w-[480px] border-l border-white/5 bg-[#0B0E11]/80 backdrop-blur-3xl flex flex-col">
                    <div className="p-8 border-b border-white/5 bg-white/5 flex items-center gap-4">
                        <Terminal className="w-5 h-5 text-[#F6851B]" />
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Live Execution Stream</h3>
                    </div>
                    
                    <div ref={logsRef} className="flex-1 p-8 space-y-4 overflow-y-auto scrollbar-hide font-mono">
                        {analysis?.steps.map((step, i) => (
                            <div key={step.id} className={clsx(
                                "p-5 rounded-2xl border transition-all duration-500",
                                i < currentStepIndex ? "border-green-500/20 bg-green-500/5 text-green-400/80" : 
                                i === currentStepIndex ? "border-[#F6851B]/50 bg-[#F6851B]/5 text-white shadow-lg" : "border-white/5 text-white/10"
                            )}>
                                <div className="flex items-center gap-3 mb-2">
                                    {i < currentStepIndex ? <CheckCircle2 className="w-4 h-4" /> : 
                                     i === currentStepIndex ? <div className="w-2 h-2 rounded-full bg-[#F6851B] animate-ping" /> : null}
                                    <span className="text-[11px] font-bold uppercase tracking-widest">{step.title}</span>
                                </div>
                                {i === currentStepIndex && (
                                    <p className="text-[10px] uppercase leading-relaxed mt-3 text-white/70 font-bold border-l-2 border-[#F6851B] pl-4">{" >> "} {step.description}</p>
                                )}
                            </div>
                        ))}

                        {/* Detailed Scripts Section */}
                        {phase === 'result' && (
                             <div className="pt-8 space-y-8 animate-in fade-in slide-in-from-right-10 duration-1000">
                                 <div className="flex items-center gap-3 py-3 border-b border-white/5">
                                     <Code2 className="w-5 h-5 text-purple-400" />
                                     <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">Simulation Logic Scripts</h4>
                                 </div>
                                 <div className="bg-black/60 p-6 rounded-2xl border border-white/10 font-mono shadow-inner">
                                     {analysis?.result.simulationScript.map((line, i) => (
                                         <p key={i} className="text-[10px] text-white/90 mb-2 leading-relaxed tracking-tight">
                                             <span className="text-[#F6851B] mr-4 opacity-50">{i+1}</span> {line}
                                         </p>
                                     ))}
                                 </div>
                                 
                                 <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl space-y-5">
                                       <div className="flex items-center gap-3 text-red-400 mb-2">
                                           <AlertCircle className="w-5 h-5" />
                                           <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Identified Hurdles</span>
                                       </div>
                                       <div className="space-y-3">
                                           {analysis?.result.hurdles.map((hurdle: string, i: number) => (
                                               <div key={i} className="flex items-start gap-3 text-[11px] text-white font-medium uppercase leading-tight">
                                                   <span className="text-red-500 font-bold">•</span>
                                                   <span>{hurdle}</span>
                                               </div>
                                           ))}
                                       </div>
                                  </div>
                             </div>
                        )}
                    </div>

                    {/* Result Summary Bar */}
                    {phase === 'result' && (
                        <div className="p-10 bg-[#F6851B] text-black">
                            <div className="flex items-center justify-between mb-10">
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.2] opacity-40">Impact Prediction</p>
                                    <p className="text-5xl font-bold tracking-tighter leading-none">{analysis?.result.impactScore}%</p>
                                </div>
                                <div className="h-12 w-[1px] bg-black/10" />
                                <div className="space-y-1 text-right">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.2] opacity-40">Implementation Viability</p>
                                    <p className="text-5xl font-bold tracking-tighter leading-none">{analysis?.result.successRate}%</p>
                                </div>
                            </div>
                            <button 
                                onClick={onBack}
                                className="w-full h-16 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:shadow-2xl transition-all"
                            >
                                <Play className="w-5 h-5 fill-white rotate-180" /> TERMINATE SESSION
                            </button>
                        </div>
                    )}
                </aside>
            </main>
        </div>
    );
};

export default SimulatePage;
