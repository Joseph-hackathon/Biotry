import React, { useState, useEffect, useRef } from 'react';
import { 
    X, Zap, Activity, Cpu, Shield, TrendingUp, 
    AlertCircle, CheckCircle2, FlaskConical, Beaker,
    ArrowLeft, Terminal, Code2, Play, Info,
    Globe, DollarSign, Rocket, AlertTriangle, Target
} from 'lucide-react';
import { clsx } from 'clsx';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Post } from '../types';
import { analyzeResearchForSimulation, ResearchAnalysis, SimulationStep, AgentReport } from '../lib/aiSimulator';
import { useSolana } from '../context/SolanaContext';
import { Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

interface SimulatePageProps {
    post: Post;
    onBack: () => void;
}

const AGENT_METADATA: Record<string, { icon: any, color: string, glow: string, bg: string, border: string, deepDetail: string }> = {
    'Dr. Bio': { 
        icon: Beaker, color: '#A855F7', glow: 'shadow-[0_0_80px_rgba(168,85,247,0.8)]', bg: 'bg-zinc-900', border: 'border-purple-500',
        deepDetail: 'Scientific methodology validation, citation cross-referencing, and impact potential auditing.'
    },
    'Solana Architect': { 
        icon: Cpu, color: '#F97316', glow: 'shadow-[0_0_80px_rgba(249,115,22,0.8)]', bg: 'bg-zinc-900', border: 'border-orange-500',
        deepDetail: 'Anchor program structure analysis, PDA seed security, and instruction optimization.'
    },
    'ZK Shadow': { 
        icon: Shield, color: '#10B981', glow: 'shadow-[0_0_80px_rgba(16,185,129,0.8)]', bg: 'bg-zinc-900', border: 'border-emerald-500',
        deepDetail: 'State compression feasibility, ZK-proof generation overhead, and privacy-preserving data layers.'
    },
    'Codama Bot': { 
        icon: Zap, color: '#3B82F6', glow: 'shadow-[0_0_80px_rgba(59,130,246,0.8)]', bg: 'bg-zinc-900', border: 'border-blue-500',
        deepDetail: 'IDL-to-SDK generation, type-safe client-side rendering, and Kinobi-compatible metadata auditing.'
    },
    'Colosseum Strategist': { 
        icon: TrendingUp, color: '#F472B6', glow: 'shadow-[0_0_80px_rgba(244,114,182,0.8)]', bg: 'bg-zinc-900', border: 'border-pink-500',
        deepDetail: '8-step idea validation framework, scientific gap analysis, and market crowdedness assessment.'
    }
};

const getAgentMeta = (name: string) => {
    const key = Object.keys(AGENT_METADATA).find(k => name.includes(k));
    return AGENT_METADATA[key || 'Dr. Bio'];
};

const SimulatePage: React.FC<SimulatePageProps> = ({ post, onBack }) => {
    const [phase, setPhase] = useState<'analyzing' | 'simulating' | 'result'>('analyzing');
    const [analysis, setAnalysis] = useState<ResearchAnalysis | null>(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [progress, setProgress] = useState(0);
    const [activeAgentIndex, setActiveAgentIndex] = useState(0);
    const [selectedAgent, setSelectedAgent] = useState<AgentReport | null>(null);
    const [paymentRequired, setPaymentRequired] = useState<{ amount: string, recipient: string } | null>(null);
    const [isPaying, setIsPaying] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [lastSignature, setLastSignature] = useState<string | null>(null);

    const { connection, solanaAddress, isReady, program } = useSolana();

    const containerRef = useRef<HTMLDivElement>(null);
    const scanLineRef = useRef<HTMLDivElement>(null);
    const logsRef = useRef<HTMLDivElement>(null);
    const agentsRef = useRef<HTMLDivElement>(null);
    const analyzingRef = useRef<boolean>(false);

    const leadAgent = new URLSearchParams(window.location.search).get('lead');

    const startAnalysis = async (signature?: string) => {
        if (analyzingRef.current) return;
        analyzingRef.current = true;
        setIsPaying(!!signature);

        try {
            const result = await analyzeResearchForSimulation(
                post, 
                leadAgent || undefined,
                signature
            );
            setAnalysis(result);
            setPhase('simulating');
            setPaymentRequired(null);
        } catch (err: any) {
            if (err.status === 402) {
                // Parse x402 headers (mocked for demo)
                setPaymentRequired({ amount: '0.1', recipient: 'pvK3j774HX9g3fRX19csEoD1j1wcRgSNhmKjrSsGaM5' });
            }
            console.error("Simulation Start Error:", err);
        } finally {
            analyzingRef.current = false;
            setIsPaying(false);
        }
    };

    useEffect(() => {
        startAnalysis();
    }, [post, leadAgent]);

    const handlePayment = async () => {
        if (!isReady || !solanaAddress || !program) {
            alert("Please connect your Solana wallet first.");
            return;
        }

        setIsPaying(true);
        try {
            // Real x402 Payment Logic (SOL Transfer for hackathon demo reliability)
            // 0.001 SOL is ~0.1 USD, matching the 0.1 USDC requirement narrative
            const recipientPubKey = new PublicKey(paymentRequired?.recipient || 'pvK3j774HX9g3fRX19csEoD1j1wcRgSNhmKjrSsGaM5');
            const instruction = SystemProgram.transfer({
                fromPubkey: new PublicKey(solanaAddress),
                toPubkey: recipientPubKey,
                lamports: 0.001 * LAMPORTS_PER_SOL,
            });

            const transaction = new Transaction().add(instruction);
            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = new PublicKey(solanaAddress);

            // Request signature from provider
            const signedTx = await (program.provider as any).wallet.signTransaction(transaction);
            const signature = await connection.sendRawTransaction(signedTx.serialize());
            
            console.log('[x402] Transaction Sent:', signature);
            
            // Wait for confirmation
            await connection.confirmTransaction(signature, 'confirmed');
            
            setLastSignature(signature);
            setShowSuccessModal(true);
        } catch (error: any) {
            console.error('Payment failed', error);
            alert(`Payment failed: ${error.message || 'Check your wallet balance.'}`);
        } finally {
            setIsPaying(false);
        }
    };

    const proceedAfterPayment = () => {
        if (lastSignature) {
            startAnalysis(lastSignature);
            setShowSuccessModal(false);
        }
    };

    const handleMoonPay = () => {
        window.open('https://buy.moonpay.com?currencyCode=usdc_sol', '_blank');
    };

    useEffect(() => {
        if (phase === 'simulating' && analysis) {
            let step = 0;
            const totalSteps = analysis.steps.length;
            const agentCount = analysis.agentReports.length;
            
            const interval = setInterval(() => {
                if (step < totalSteps) {
                    setCurrentStepIndex(step);
                    setProgress(((step + 1) / totalSteps) * 100);
                    if (step % 2 === 0) {
                        setActiveAgentIndex((prev) => (prev + 1) % agentCount);
                    }
                    step++;
                } else {
                    clearInterval(interval);
                    setTimeout(() => setPhase('result'), 1000);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [phase, analysis]);

    useGSAP(() => {
        if (analysis && agentsRef.current) {
            gsap.from(agentsRef.current.children, {
                y: 20,
                duration: 0.8,
                ease: 'power3.out'
            });
        }
    }, [analysis !== null]);

    useEffect(() => {
        if (logsRef.current) {
            logsRef.current.scrollTop = logsRef.current.scrollHeight;
        }
    }, [currentStepIndex, phase]);

    return (
        <div ref={containerRef} className="min-h-screen bg-[#030303] text-white flex flex-col font-sans">
            <nav className="h-20 border-b border-white/5 px-8 flex items-center justify-between backdrop-blur-md bg-black/40 z-50 sticky top-0">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:border-[#F6851B] transition-all group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="h-8 w-[1px] bg-white/10" />
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-[#F6851B] animate-pulse" />
                             <h1 className="text-sm font-bold uppercase tracking-tight text-white">{post.title}</h1>
                        </div>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-5 font-mono">COLOSSEUM_COPILOT_ENGINE // NODE_SIMULATOR_3.2</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <div className="hidden md:flex flex-col items-end mr-4 font-mono">
                         <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest leading-none">STRATEGY_GAP</span>
                         <span className="text-[11px] font-bold text-[#F6851B] uppercase tracking-widest">INCUMBENT_VALIDATION_ACTIVE</span>
                     </div>
                     <div className="w-10 h-10 bg-[#F6851B]/10 border border-[#F6851B]/30 rounded-xl flex items-center justify-center">
                         <Shield className="w-5 h-5 text-[#F6851B] animate-pulse" />
                     </div>
                </div>
            </nav>

            <main className="flex-1 flex relative overflow-hidden">
                <section className="flex-1 relative flex flex-col items-start justify-start p-12 overflow-y-auto scrollbar-hide">
                     <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px] -z-10" />
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#F6851B]/5 rounded-full blur-[150px] -z-10" />

                     {phase === 'analyzing' && !paymentRequired && (
                         <div className="mt-40 self-center relative w-80 h-96 glass-panel rounded-3xl flex flex-col items-center justify-center gap-8 group">
                             <div ref={scanLineRef} className="absolute top-0 left-0 w-full h-[2px] bg-[#F6851B] shadow-[0_0_20px_#F6851B] z-30 opacity-50" />
                             <div className="relative w-24 h-24">
                                 <Activity className="w-full h-full text-[#F6851B] animate-pulse" />
                                 <div className="absolute inset-0 border border-[#F6851B]/40 rounded-full animate-ping scale-150 opacity-20" />
                             </div>
                             <div className="text-center space-y-2">
                                 <p className="text-[10px] font-bold text-[#F6851B] uppercase tracking-[0.4em] animate-pulse">Initializing Strategy Engine</p>
                                 <p className="text-[9px] text-white/30 font-mono">COPILOT_BOOTING...</p>
                             </div>
                         </div>
                     )}

                     {paymentRequired && (
                        <div className="mt-20 self-center max-w-2xl w-full p-12 glass-panel rounded-[48px] border-2 border-[#F6851B]/30 shadow-[0_0_100px_rgba(246,133,27,0.15)] space-y-10 text-center animate-in zoom-in duration-500">
                             <div className="mx-auto w-24 h-24 bg-[#F6851B] rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(246,133,27,0.4)]">
                                 <DollarSign className="w-12 h-12 text-black" />
                             </div>
                             <div className="space-y-4">
                                 <h2 className="text-4xl font-black uppercase italic tracking-tighter">Upgrade to Full Strategic Audit</h2>
                                 <p className="text-xl text-white/50 max-w-lg mx-auto leading-relaxed">
                                     This research node is protected by the <span className="text-white font-bold tracking-widest text-sm uppercase">Open Wallet x402 Protocol</span>.
                                     Unlock deep multi-agent intelligence and scientific gap analysis.
                                 </p>
                             </div>
                             
                             <div className="grid grid-cols-2 gap-6 bg-white/5 p-8 rounded-3xl border border-white/10">
                                 <div className="text-left space-y-1">
                                     <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Protocol Header</p>
                                     <p className="text-lg font-black text-[#F6851B] italic">HTTP 402 Required</p>
                                 </div>
                                 <div className="text-right space-y-1">
                                     <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Micropayment</p>
                                     <p className="text-2xl font-black text-white">{paymentRequired.amount} USDC</p>
                                 </div>
                             </div>

                             <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                 <button 
                                    onClick={handlePayment}
                                    disabled={isPaying}
                                    className="flex-1 h-20 bg-[#F6851B] text-black font-black uppercase text-sm tracking-[0.4em] rounded-[24px] flex items-center justify-center gap-4 hover:shadow-[0_0_30px_#F6851B] transition-all disabled:opacity-50"
                                 >
                                     {isPaying ? <Activity className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
                                     PAY_WITH_WALLET
                                 </button>
                                 <button 
                                    onClick={handleMoonPay}
                                    className="px-8 h-20 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-[24px] hover:bg-white/10 transition-all"
                                 >
                                     BUY_USDC_ON_MOONPAY
                                 </button>
                             </div>
                             
                             <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">No accounts. No API keys. Just a wallet and a request.</p>
                        </div>
                     )}

                     {showSuccessModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/60">
                             <div className="relative w-full max-w-xl p-1 bg-gradient-to-br from-[#F6851B]/40 via-white/5 to-transparent rounded-[48px] overflow-hidden shadow-[0_0_120px_rgba(246,133,27,0.15)] animate-in zoom-in duration-500">
                                 <div className="bg-[#050505] rounded-[47px] p-12 space-y-10 text-center relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-64 h-64 bg-[#F6851B]/10 blur-[80px] rounded-full -mr-32 -mt-32" />
                                     
                                     <div className="relative mx-auto w-24 h-24 bg-[#F6851B] rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(246,133,27,0.5)]">
                                         <CheckCircle2 className="w-12 h-12 text-black animate-pulse" />
                                         <div className="absolute -bottom-3 px-3 py-1 bg-black border border-[#F6851B]/50 rounded-full">
                                             <span className="text-[7px] font-black text-[#F6851B] uppercase tracking-widest whitespace-nowrap">OWS_X402_VERIFIED</span>
                                         </div>
                                     </div>

                                     <div className="space-y-4">
                                         <h3 className="text-4xl font-black uppercase italic tracking-tighter">Payment Successful</h3>
                                         <p className="text-xl text-white/50 leading-relaxed">
                                             Audit for <span className="text-white font-bold">{post.title}</span> is now unlocked.
                                         </p>
                                     </div>

                                     <div className="space-y-6 text-left">
                                         <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4 font-mono">
                                             <div className="space-y-1">
                                                 <p className="text-[9px] font-black uppercase text-white/30 tracking-widest">Transaction Signature</p>
                                                                                                   <a 
                                                    href={`https://solscan.io/tx/${lastSignature}?cluster=devnet`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="block text-[11px] text-[#F6851B] break-all border-l-2 border-[#F6851B]/40 pl-4 hover:underline"
                                                  >
                                                    {lastSignature}
                                                  </a>
                                             </div>
                                             <div className="space-y-1">
                                                 <p className="text-[9px] font-black uppercase text-white/30 tracking-widest">Settlement Wallet</p>
                                                 <p className="text-[11px] text-white/60 break-all border-l-2 border-white/20 pl-4">{paymentRequired?.recipient}</p>
                                             </div>
                                         </div>
                                     </div>

                                     <button 
                                        onClick={proceedAfterPayment}
                                        className="w-full h-20 bg-white text-black font-black uppercase text-sm tracking-[0.4em] rounded-[24px] flex items-center justify-center gap-4 hover:bg-[#F6851B] hover:text-white transition-all group"
                                     >
                                         START_STRATEGIC_AUDIT
                                         <Play className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                     </button>

                                     <p className="text-[10px] font-black uppercase tracking-widest text-[#F6851B]/60 animate-pulse">VERIFIED ON SOLANA DEVNET (MPP_X402)</p>
                                 </div>
                             </div>
                        </div>
                     )}

                      {(phase === 'simulating' || phase === 'result') && (
                          <div className="w-full px-4 sm:px-12 space-y-12 pb-24">
                             {phase === 'simulating' && (
                                 <div className="flex items-center justify-between">
                                     <div className="flex items-center gap-3">
                                         <Terminal className="w-4 h-4 text-[#F6851B]" />
                                         <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Multi-Agent Strategic Verification Grid</h3>
                                     </div>
                                     <div className="flex items-center gap-2 px-4 py-1.5 bg-[#F6851B]/10 border border-[#F6851B]/20 rounded-full">
                                         <Info className="w-3.5 h-3.5 text-[#F6851B]" />
                                         <span className="text-[9px] font-bold uppercase tracking-widest text-[#F6851B]">Integrated Colosseum Validation Framework</span>
                                     </div>
                                 </div>
                             )}

                               <div ref={agentsRef} className="w-full">
                                    {phase === 'simulating' && (
                                        <div className="flex flex-col items-start gap-16 animate-in fade-in zoom-in duration-700">
                                            <div className="relative w-full">
                                                <div className="absolute inset-0 bg-white/5 blur-[100px] rounded-full animate-pulse" />
                                                {analysis?.agentReports.map((report, i) => {
                                                    if (i !== activeAgentIndex) return null;
                                                    const meta = getAgentMeta(report.agentName);
                                                    const Icon = meta.icon;
                                                    return (
                                                        <div key={report.agentName} className={clsx("p-12 border-2 rounded-[50px] relative overflow-hidden backdrop-blur-3xl transition-all duration-700", meta.border, "bg-gradient-to-br from-zinc-800 to-zinc-950 shadow-[0_0_80px_rgba(255,255,255,0.1)]")}>
                                                            <div className="absolute top-0 left-0 w-full h-[2px] bg-white shadow-[0_0_30px_white] z-30 animate-[scan_2s_ease-in-out_infinite]" />
                                                            <div className="flex items-center justify-between mb-12">
                                                                <div className={clsx("w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl", meta.bg)}>
                                                                    <Icon className="w-10 h-10" style={{ color: meta.color }} />
                                                                </div>
                                                                <div className="px-6 py-2.5 bg-white/10 border border-white/20 rounded-full flex items-center gap-3">
                                                                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                                                    <span className="text-xs font-black uppercase tracking-[0.3em] text-white">Active_Probe_Scanning</span>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-4 mb-10">
                                                                <h4 className="text-4xl font-black uppercase tracking-tight text-white">{report.agentName}</h4>
                                                                <p className="text-sm font-black text-[#F6851B] uppercase tracking-[0.4em]">{report.specialization}</p>
                                                            </div>
                                                            <div className="space-y-6">
                                                                <div className="flex items-center gap-3 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                                                                    <Terminal className="w-4 h-4" /> NODE_EXECUTION_SEQUENCE_42
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-white/40 animate-[shimmer_1.5s_infinite]" style={{ width: '70%' }} />
                                                                    </div>
                                                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-[#F6851B]/40 animate-[shimmer_2s_infinite]" style={{ width: '40%' }} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-xl w-full">
                                                {analysis?.agentReports.map((report, i) => {
                                                    const meta = getAgentMeta(report.agentName);
                                                    const isActive = i === activeAgentIndex;
                                                    const isDone = i < activeAgentIndex;
                                                    return (
                                                        <div key={report.agentName} className="flex items-center gap-4 flex-shrink-0">
                                                            <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500", isActive ? `${meta.border} ${meta.bg} scale-110 shadow-lg` : isDone ? "border-green-500/40 bg-green-500/10" : "border-white/5 bg-white/5")}>
                                                                {isDone ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <meta.icon className={clsx("w-5 h-5", isActive ? "text-white" : "text-white/20")} />}
                                                            </div>
                                                            {i < 4 && <div className="w-12 h-[1px] bg-white/5 flex-shrink-0" />}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                               </div>

                                 {phase === 'result' && analysis && (
                                    <div className="w-full space-y-16 animate-in fade-in slide-in-from-top-4 duration-1000 pb-32">
                                        
                                        {/* 1. Executive Hero: Success & Key Insight */}
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#F6851B]/10 to-transparent blur-3xl opacity-20" />
                                            <div className="relative p-12 border border-white/10 bg-zinc-900/40 backdrop-blur-3xl rounded-[40px] flex flex-col items-center text-center space-y-8">
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F6851B]">AI Strategic Assessment</p>
                                                    <h2 className="text-6xl font-black tracking-tighter">
                                                        {analysis.result.successRate.toFixed(1)}% <span className="text-white/20">SUCCESS_RATIO</span>
                                                    </h2>
                                                </div>
                                                <div className="max-w-3xl">
                                                    <p className="text-2xl font-bold leading-relaxed text-white italic">
                                                        "{analysis.result.keyInsight}"
                                                    </p>
                                                </div>
                                                <div className="flex flex-wrap justify-center gap-4">
                                                    {analysis.result.hurdles.map((hurdle, i) => (
                                                        <div key={i} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full flex items-center gap-3">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#F6851B]" />
                                                            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{hurdle}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        {/* 2. Unified Strategic Metrics Bar */}
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                            {[
                                                { label: 'Market Field', value: analysis.researchField, color: 'text-white' },
                                                { label: 'Actionability', value: `${analysis.result.actionabilityIndex.toFixed(0)}%`, color: 'text-[#F6851B]' },
                                                { label: 'Crowdedness', value: analysis.result.crowdednessScore, color: analysis.result.crowdednessScore === 'Low' ? 'text-green-400' : 'text-red-400' },
                                                { label: 'Time to Market', value: analysis.result.timeToMarket, color: 'text-white' }
                                            ].map((stat, i) => (
                                                <div key={i} className="p-8 border border-white/5 bg-white/5 rounded-[32px] space-y-2 group hover:border-white/10 transition-all">
                                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">{stat.label}</p>
                                                    <p className={clsx("text-xl font-black uppercase tracking-tight", stat.color)}>{stat.value}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* 3. Auditor Consensus Grid (Simplified) */}
                                        <div className="space-y-8">
                                            <div className="flex items-center gap-4">
                                                <div className="h-[1px] flex-1 bg-white/5" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#F6851B]">Expert_Auditor_Consensus</span>
                                                <div className="h-[1px] flex-1 bg-white/5" />
                                            </div>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {analysis?.agentReports.filter((report) => !leadAgent || report.agentName === leadAgent).map((report) => (
                                                    <div key={report.agentName} className="p-10 border border-white/10 bg-zinc-900/30 rounded-[40px] space-y-6 group hover:border-[#F6851B]/30 transition-all">
                                                        <div className="flex justify-between items-start">
                                                            <div className="space-y-1">
                                                                <h4 className="text-xl font-black uppercase tracking-tight">{report.agentName}</h4>
                                                                <p className="text-[10px] font-bold text-[#F6851B] uppercase tracking-[0.3em] opacity-80">{report.specialization}</p>
                                                            </div>
                                                            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                                                                {getAgentMeta(report.agentName) && React.createElement(getAgentMeta(report.agentName).icon, { className: "w-5 h-5 text-white/40" })}
                                                            </div>
                                                        </div>
                                                        <p className="text-lg leading-relaxed text-white/80 font-medium">"{report.feedback}"</p>
                                                        <div className="pt-6 border-t border-white/5 flex items-center justify-between font-mono">
                                                            <div className="flex items-center gap-3">
                                                                <Terminal className="w-4 h-4 text-white/20" />
                                                                <span className="text-[9px] text-white/40 uppercase tracking-widest">{report.scientificGap ? `GAP: ${report.scientificGap.toUpperCase()}` : 'STATUS: AUDITED'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 4. Detailed Breakdown Sections */}
                                        <div className="space-y-12">
                                            {/* Summary & Market */}
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                                <div className="p-12 border border-white/5 bg-white/[0.02] rounded-[48px] space-y-8">
                                                   <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-white/5 rounded-2xl"><FlaskConical className="w-6 h-6 text-white" /></div>
                                                        <h4 className="text-lg font-bold">Research Core</h4>
                                                   </div>
                                                   <p className="text-lg text-white/60 leading-relaxed">{analysis.summary}</p>
                                                   <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                                                        <p className="text-[10px] text-[#F6851B] font-black uppercase tracking-widest mb-2">Concrete Industry Friction</p>
                                                        <p className="text-sm text-white/80 font-medium">{analysis.result.concreteProblem}</p>
                                                   </div>
                                                </div>

                                                <div className="p-12 border border-blue-500/10 bg-blue-500/[0.02] rounded-[48px] space-y-8">
                                                   <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-blue-500/10 rounded-2xl"><Globe className="w-6 h-6 text-blue-400" /></div>
                                                        <h4 className="text-lg font-bold">Landscape Detail</h4>
                                                   </div>
                                                   <p className="text-lg text-white/60 leading-relaxed">{analysis.result.marketLandscape}</p>
                                                   <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl">
                                                        <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-2">Quantified Impact</p>
                                                        <p className="text-sm text-white/80 font-medium">{analysis.result.quantifiedImpact}</p>
                                                   </div>
                                                </div>
                                            </div>

                                            {/* Revenue & Infrastructure */}
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                                <div className="p-12 border border-emerald-500/10 bg-emerald-500/[0.02] rounded-[48px] space-y-8">
                                                   <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-emerald-500/10 rounded-2xl"><DollarSign className="w-6 h-6 text-emerald-400" /></div>
                                                        <h4 className="text-lg font-bold">Monetization Loop</h4>
                                                   </div>
                                                   <p className="text-lg text-white/60 leading-relaxed font-medium">{analysis.result.revenueModel}</p>
                                                   <div className="flex items-center gap-6 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl">
                                                        <Rocket className="w-8 h-8 text-emerald-400" />
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">GTM Strategy</p>
                                                            <p className="text-sm text-white/80">{analysis.result.gtmStrategy}</p>
                                                        </div>
                                                   </div>
                                                </div>

                                                <div className="p-12 border border-purple-500/10 bg-purple-500/[0.02] rounded-[48px] space-y-8">
                                                   <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-purple-500/10 rounded-2xl"><Zap className="w-6 h-6 text-purple-400" /></div>
                                                        <h4 className="text-lg font-bold">Infrastructural Backbone</h4>
                                                   </div>
                                                   <p className="text-lg text-white/60 leading-relaxed font-medium">{analysis.result.whySolana}</p>
                                                   <div className="flex items-center gap-6 p-6 bg-purple-500/10 border border-purple-500/20 rounded-3xl">
                                                        <Target className="w-8 h-8 text-purple-400" />
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest">Founder Alignment</p>
                                                            <p className="text-sm text-white/80">{analysis.result.founderMarketFit}</p>
                                                        </div>
                                                   </div>
                                                </div>
                                            </div>

                                            {/* Risk Assessment (Standardized Blocks) */}
                                            <div className="p-12 border border-red-500/10 bg-red-500/[0.02] rounded-[48px] space-y-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-red-500/10 rounded-2xl"><AlertTriangle className="w-6 h-6 text-red-400" /></div>
                                                    <h4 className="text-lg font-bold">Multi-Vector Risk Audit</h4>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                    {[
                                                        { label: 'Technical', value: analysis.result.risks.technical },
                                                        { label: 'Regulatory', value: analysis.result.risks.regulatory },
                                                        { label: 'Market', value: analysis.result.risks.market },
                                                        { label: 'Execution', value: analysis.result.risks.execution }
                                                    ].map((risk, i) => (
                                                        <div key={i} className="p-6 border border-white/5 bg-white/5 rounded-3xl space-y-3">
                                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">{risk.label}</p>
                                                            <p className="text-xs font-bold text-white/70 leading-relaxed">{risk.value}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                           </div>
                       )}
                </section>

                <aside className="w-[450px] border-l border-white/5 bg-[#050505] flex flex-col z-10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
                    <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Terminal className="w-5 h-5 text-[#F6851B]" />
                            <h3 className="text-xs font-black text-white">Simulation Stream</h3>
                        </div>
                    </div>
                    <div ref={logsRef} className="flex-1 p-8 space-y-4 overflow-y-auto font-mono scrollbar-hide">
                        {analysis?.steps.map((step, i) => (
                            <div key={step.id} className={clsx("p-6 rounded-2xl border transition-all duration-700", i < currentStepIndex ? "border-green-500/20 bg-green-500/5 text-green-400/80" : i === currentStepIndex ? "border-[#F6851B]/40 bg-[#F6851B]/10 text-white" : "border-white/5 text-white/5")}>
                                <div className="flex items-center gap-4 mb-2">
                                    <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px]", i < currentStepIndex ? "bg-green-500/10" : i === currentStepIndex ? "bg-[#F6851B] text-black" : "bg-white/5")}>{i + 1}</div>
                                    <span className="text-[11px] font-bold uppercase tracking-widest">{step.title}</span>
                                </div>
                                {i === currentStepIndex && <p className="mt-4 text-[10px] text-white/80 border-l-2 border-[#F6851B]/40 pl-4">{step.description}</p>}
                            </div>
                        ))}
                    </div>
                    {phase === 'result' && (
                        <div className="p-8 bg-[#F6851B] text-black">
                            <div className="flex justify-between mb-8">
                                <div className="text-center flex-1"><p className="text-[9px] opacity-40">Impact</p><p className="text-4xl font-black">{analysis?.result.impactScore.toFixed(2)}%</p></div>
                                <div className="text-center flex-1"><p className="text-[9px] opacity-40">Success</p><p className="text-4xl font-black">{analysis?.result.successRate.toFixed(2)}%</p></div>
                            </div>
                            <button onClick={onBack} className="w-full h-16 bg-black text-white rounded-2xl font-black text-xs tracking-[0.4em] flex items-center justify-center gap-6 group hover:gap-8 transition-all">
                                <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" /> TERMINATE_SESSION
                            </button>
                        </div>
                    )}
                </aside>
            </main>

            <style>{`
                @keyframes shimmer { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
                @keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
                @keyframes scan { 0% { top: 0; opacity: 0.5; } 50% { top: 100%; opacity: 1; } 100% { top: 0; opacity: 0.5; } }
            `}</style>
        </div>
    );
};

export default SimulatePage;
