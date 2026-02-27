import React, { useState } from 'react';
import { Microscope, Check, Copy, Activity, Shield, AlertCircle, Info, User } from 'lucide-react';
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
    daoStatus: 'checking' | 'initialized' | 'not-initialized';
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
    daoStatus,
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
        <div className="illustration-card overflow-hidden p-0 relative bg-white">
            {/* Banner */}
            <div className="h-40 relative overflow-hidden bg-accent-softPurple border-b-3 border-black">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none opacity-20">
                    <img src="/biotry-logo.png" alt="Biotry Background" className="w-64 h-64 object-contain -rotate-12 opacity-80" />
                </div>
            </div>

            <div className="px-8 pb-8">
                {/* Avatar */}
                <div className="flex items-center justify-between -mt-12 mb-6 relative z-10">
                    <div className="w-24 h-24 bg-white border-4 border-black shadow-flat overflow-hidden">
                        <img
                            src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${activeAddress || 'default'}`}
                            className="w-full h-full object-contain"
                            alt="Profile"
                        />
                    </div>
                    <div className="mt-12 flex gap-3">
                        {availableWallets.length > 1 && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowWalletSelector(!showWalletSelector)}
                                    className="px-4 py-2 border-3 border-black bg-white text-[10px] font-header font-black uppercase tracking-widest hover:bg-gray-50 flex items-center gap-2 shadow-flat-sm"
                                >
                                    Switch Wallet ({availableWallets.length})
                                </button>
                                {showWalletSelector && (
                                    <div className="absolute top-full right-0 mt-2 w-64 bg-white border-3 border-black shadow-flat z-50">
                                        {availableWallets.map(w => (
                                            <button
                                                key={w.address}
                                                onClick={() => {
                                                    setActiveAddress(w.cleanAddress);
                                                    setShowWalletSelector(false);
                                                }}
                                                className={clsx(
                                                    "w-full text-left px-4 py-3 border-b-2 border-black last:border-b-0 text-[10px] font-header font-black uppercase flex flex-col gap-1 transition-colors",
                                                    activeAddress === w.cleanAddress ? "bg-accent-softPurple" : "hover:bg-gray-50"
                                                )}
                                            >
                                                <span className="flex items-center justify-between">
                                                    {w.walletClientType}
                                                    {activeAddress === w.cleanAddress && <Check className="w-3 h-3 text-accent-purple" />}
                                                </span>
                                                <span className="text-[9px] text-black/50">{truncateAddress(w.cleanAddress)}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        <button onClick={logout} className="px-4 py-2 border-3 border-black bg-white text-[10px] font-header font-black uppercase tracking-widest hover:bg-accent-softPink shadow-flat-sm">
                            Logout
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <h2 className="text-4xl font-display font-black uppercase tracking-tight text-black">
                                {truncateAddress(activeAddress) || 'Searching...'}
                            </h2>
                            <div className="flex items-center gap-2 flex-wrap">
                                <button
                                    onClick={handleCopy}
                                    className="p-2 border-3 border-black bg-white hover:bg-accent-softPurple shadow-flat-sm hover:shadow-none transition-all"
                                    title="Copy Full Address"
                                >
                                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-black" />}
                                </button>

                                <div className={clsx(
                                    "px-3 py-1 border-3 border-black text-[10px] font-header font-black uppercase tracking-widest shadow-flat-sm shrink-0",
                                    programReady ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                )}>
                                    {programReady ? 'Program Ready' : (activeAddress ? 'Initializing...' : 'No Address')}
                                </div>

                                <div className="px-3 py-1 bg-accent-softPink border-3 border-black text-[10px] font-header font-black uppercase tracking-widest shadow-flat-sm shrink-0">
                                    {availableWallets.find(w => w.cleanAddress === activeAddress)?.walletClientType?.toUpperCase() || 'EXTERNAL'}
                                </div>

                                {daoStatus === 'initialized' ? (
                                    <div className="px-3 py-1 bg-green-100 text-green-700 border-3 border-green-700 text-[10px] font-header font-black uppercase tracking-widest shadow-flat-xs shrink-0 flex items-center gap-1">
                                        <Shield className="w-3 h-3" /> DAO ACTIVE
                                    </div>
                                ) : daoStatus === 'not-initialized' ? (
                                    <div className="px-3 py-1 bg-amber-100 text-amber-700 border-3 border-amber-700 text-[10px] font-header font-black uppercase tracking-widest shadow-flat-xs shrink-0 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> DAO SETUP REQUIRED
                                    </div>
                                ) : null}
                                {hasProfile ? (
                                    <div className="px-3 py-1 bg-indigo-100 text-indigo-700 border-3 border-indigo-700 text-[10px] font-header font-black uppercase tracking-widest shadow-flat-xs shrink-0 flex items-center gap-1">
                                        <User className="w-3 h-3" /> @{memberProfile?.username || 'Member'}
                                    </div>
                                ) : (
                                    <div className="px-3 py-1 bg-purple-100 text-purple-700 border-3 border-purple-700 text-[10px] font-header font-black uppercase tracking-widest shadow-flat-xs shrink-0 flex items-center gap-1">
                                        <Info className="w-3 h-3" /> PROFILE MISSING
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="text-[11px] font-header font-black text-accent-purple uppercase tracking-[0.3em]">
                            CORE RESEARCHER • {balance !== null ? `${balance.toFixed(4)} SOL` : 'LOADING BALANCE...'}
                        </p>
                    </div>
                    <div className="flex gap-4 scroll-mt-20">
                        <button onClick={refreshBalance} className="btn-illu-outline px-6 py-3 shrink-0 flex items-center gap-2">
                            <Activity className="w-4 h-4" /> REFRESH
                        </button>
                        <button onClick={() => navigate('/studio')} className="btn-illu-primary px-8 py-3 shrink-0">
                            + NEW RESEARCH
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHero;
