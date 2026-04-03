import React, { useState } from 'react';
import { Microscope, Check, Copy, Activity, Shield, AlertCircle, Info, User, ChevronDown, Wallet, ExternalLink, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import { truncateAddress } from '../../utils/address';

interface ProfileHeroProps {
    activeAddress: string;
    balance: number | null;
    availableWallets: any[];
    setActiveAddress: (address: string) => void;
    refreshBalance: () => void;
    logout: () => void;
    navigate: (path: string) => void;
    protocolStatus: 'checking' | 'initialized' | 'not-initialized';
    hasProfile: boolean;
    memberProfile: any;
    programReady: boolean;
}

const ProfileHero: React.FC<ProfileHeroProps> = ({
    activeAddress,
    balance,
    availableWallets,
    setActiveAddress,
    refreshBalance,
    logout,
    navigate,
    protocolStatus,
    hasProfile,
    memberProfile,
    programReady
}) => {
    const [copied, setCopied] = useState(false);
    const [showWalletSelector, setShowWalletSelector] = useState(false);

    const handleCopy = () => {
        if (!activeAddress) return;
        navigator.clipboard.writeText(activeAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="glass-panel overflow-hidden p-0 relative bg-black/40 border border-white/5 shadow-2xl rounded-[32px]">
            {/* Banner with modern gradient / mesh */}
            <div className="h-44 relative overflow-hidden bg-gradient-to-br from-[#7C3AED]/20 via-[#F6851B]/5 to-transparent border-b border-white/5">
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none opacity-10">
                    <img src="/biotry-logo.png" alt="Biotry" className="w-80 h-80 object-contain -rotate-12 blur-sm" />
                </div>
                {/* Glow blobs */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#F6851B]/10 rounded-full blur-[100px]" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#7C3AED]/10 rounded-full blur-[100px]" />
            </div>

            <div className="px-10 pb-10">
                {/* Avatar & Actions */}
                <div className="flex items-center justify-between -mt-14 mb-8 relative z-10">
                    <div className="w-28 h-28 bg-[#0B0E11] border-4 border-white/10 rounded-3xl shadow-2xl overflow-hidden p-1 group hover:border-[#F6851B]/50 transition-all duration-500">
                        <img
                            src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${activeAddress || 'default'}`}
                            className="w-full h-full object-contain rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-500"
                            alt="Profile"
                        />
                    </div>
                    <div className="mt-14 flex items-center gap-4">
                        {availableWallets.length > 1 && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowWalletSelector(!showWalletSelector)}
                                    className="h-11 px-6 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white hover:border-[#F6851B] transition-all flex items-center gap-3"
                                >
                                    <Wallet className="w-4 h-4" />
                                    Switch Wallet
                                    <ChevronDown className={clsx("w-3.5 h-3.5 transition-transform", showWalletSelector && "rotate-180")} />
                                </button>
                                {showWalletSelector && (
                                    <div className="absolute top-12 right-0 w-72 h-auto max-h-64 overflow-y-auto bg-[#0B0E11] border border-white/10 rounded-2xl shadow-2xl z-[100] p-2 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                                        {availableWallets.map(w => (
                                            <button
                                                key={w.address}
                                                onClick={() => {
                                                    setActiveAddress(w.cleanAddress);
                                                    setShowWalletSelector(false);
                                                }}
                                                className={clsx(
                                                    "w-full text-left p-4 rounded-xl text-[10px] font-bold uppercase flex flex-col gap-1.5 transition-all mb-1 last:mb-0",
                                                    activeAddress === w.cleanAddress ? "bg-[#F6851B]/10 border border-[#F6851B]/30 text-[#F6851B]" : "hover:bg-white/5 text-white/50"
                                                )}
                                            >
                                                <span className="flex items-center justify-between">
                                                    {w.walletClientType}
                                                    {activeAddress === w.cleanAddress && <Check className="w-3 h-3" />}
                                                </span>
                                                <span className="text-[9px] opacity-60 font-mono">{truncateAddress(w.cleanAddress)}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        <button onClick={logout} className="h-11 px-6 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-red-400 hover:border-red-400/30 transition-all">
                             Disconnect
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white uppercase">
                                {truncateAddress(activeAddress) || 'Searching...'}
                            </h2>
                            <div className="flex items-center gap-2 flex-wrap">
                                <button
                                    onClick={handleCopy}
                                    className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-[#F6851B] transition-all"
                                    title="Copy Full Address"
                                >
                                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/40" />}
                                </button>

                                <div className={clsx(
                                    "px-3.5 py-1.5 border rounded-lg text-[9px] font-bold uppercase tracking-[0.2em] shadow-xl",
                                    programReady ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                                )}>
                                    {programReady ? 'Sync_Stable' : 'Initializing_Node'}
                                </div>

                                {protocolStatus === 'initialized' && (
                                    <div className="px-3.5 py-1.5 bg-[#F6851B]/10 border border-[#F6851B]/20 text-[#F6851B] rounded-lg text-[9px] font-bold uppercase tracking-[0.2em] shadow-xl flex items-center gap-1.5">
                                        <Shield className="w-3 h-3" /> NETWORK ACTIVE
                                    </div>
                                )}
                                
                                {hasProfile && (
                                    <div className="px-3.5 py-1.5 bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#A78BFA] rounded-lg text-[9px] font-bold uppercase tracking-[0.2em] shadow-xl flex items-center gap-1.5">
                                        <User className="w-3 h-3" /> @{memberProfile?.username || 'Core'}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Scientific Reputation</p>
                                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F6851B] to-[#7C3AED] leading-none uppercase">Core Researcher v2</p>
                            </div>
                            <div className="w-[1px] h-10 bg-white/5" />
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Network Balance</p>
                                <p className="text-2xl font-bold text-white leading-none uppercase">{balance !== null ? `${balance.toFixed(4)} SOL` : '0.0000 SOL'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button 
                            onClick={refreshBalance} 
                            className="h-14 px-8 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:bg-white/10 transition-all group"
                        >
                            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> REFRESH
                        </button>
                        <button 
                            onClick={() => navigate('/studio')} 
                            className="btn-metamask h-14 px-10 text-xs shadow-2xl"
                        >
                            + NEW RESEARCH NODE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHero;
