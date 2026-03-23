import React from 'react';
import { CheckCircle2, XCircle, ExternalLink, X, FlaskConical, Activity, User, ShieldCheck, Zap } from 'lucide-react';
import { clsx } from 'clsx';

export type TransactionCategory = 'DAO_JOIN' | 'UPVOTE' | 'PUBLISH' | 'DAO_INIT' | 'GENERIC';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    status: 'success' | 'error';
    category: TransactionCategory;
    txId?: string;
    message?: string;
    cluster?: string;
}

const CATEGORY_MAP: Record<TransactionCategory, { label: string; icon: any; color: string; glow: string }> = {
    DAO_JOIN: { label: 'DAO MEMBERSHIP', icon: User, color: 'text-[#A78BFA]', glow: 'bg-[#7C3AED]/20' },
    UPVOTE: { label: 'RESEARCH UPVOTE', icon: Activity, color: 'text-[#F6851B]', glow: 'bg-[#F6851B]/20' },
    PUBLISH: { label: 'RESEARCH PUBLISH', icon: FlaskConical, color: 'text-[#F6851B]', glow: 'bg-[#F6851B]/20' },
    DAO_INIT: { label: 'DAO INITIALIZATION', icon: ShieldCheck, color: 'text-[#A78BFA]', glow: 'bg-[#7C3AED]/20' },
    GENERIC: { label: 'INTERACTION', icon: Zap, color: 'text-white/50', glow: 'bg-white/5' },
};

const TransactionModal: React.FC<TransactionModalProps> = ({
    isOpen,
    onClose,
    status,
    category,
    txId,
    message,
    cluster = 'devnet'
}) => {
    if (!isOpen) return null;

    const config = CATEGORY_MAP[category] || CATEGORY_MAP.GENERIC;
    const Icon = config.icon;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative w-full max-w-md glass-panel p-0 overflow-hidden border border-white/10 shadow-3xl animate-in fade-in zoom-in duration-500 rounded-[40px] bg-[#0B0E11]/90">
                {/* Status Gradient Bar */}
                <div className={clsx(
                    "h-1.5 w-full",
                    status === 'success' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-[#F6851B] to-[#7C3AED]'
                )} />

                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group z-20"
                >
                    <X className="w-5 h-5 text-white/30 group-hover:text-white" />
                </button>

                <div className="p-10 md:p-12 space-y-10">
                    {/* Status Icon & Label */}
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="relative">
                            <div className={clsx(
                                "w-24 h-24 rounded-3xl border flex items-center justify-center relative z-10 shadow-2xl transition-transform duration-700 hover:scale-110",
                                status === 'success' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-[#F6851B]/10 border-[#F6851B]/30'
                            )}>
                                {status === 'success' ? (
                                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                ) : (
                                    <XCircle className="w-12 h-12 text-[#F6851B]" />
                                )}
                            </div>
                            {/* Animated Pulse Rings */}
                            <div className={clsx(
                                "absolute inset-0 rounded-3xl animate-ping opacity-20",
                                status === 'success' ? 'bg-emerald-500' : 'bg-[#F6851B]'
                            )} style={{ animationDuration: '3s' }} />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white uppercase leading-none">
                                {status === 'success' ? 'TRANSACTION COMPLETE' : 'TRANSACTION FAILED'}
                            </h2>
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">
                                {status === 'success' ? 'ON-CHAIN STATE SYNCHRONIZED' : 'COULD NOT COMPLETE REQUEST'}
                            </p>
                        </div>
                    </div>

                    {/* Category Card */}
                    <div className="glass-panel p-6 flex items-center gap-6 bg-white/5 border-white/5 rounded-[24px]">
                        <div className={clsx("w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center shrink-0 shadow-xl", config.glow)}>
                            <Icon className={clsx("w-7 h-7", config.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] mb-1.5">PROTOCOL_LAYER</p>
                            <p className="text-sm font-bold text-white uppercase tracking-tight truncate">
                                {config.label}
                            </p>
                        </div>
                    </div>

                    {message && (
                        <div className="bg-red-500/5 border border-red-500/10 p-5 rounded-2xl text-center">
                            <p className="text-[11px] font-bold text-red-500/70 leading-relaxed uppercase tracking-tight">
                                {message}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="grid grid-cols-1 gap-4 pt-2">
                        {txId && status === 'success' && (
                            <a
                                href={`https://explorer.solana.com/tx/${txId}?cluster=${cluster}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-metamask h-16 w-full flex items-center justify-center gap-3 shadow-2xl"
                            >
                                <ExternalLink className="w-5 h-5" />
                                VIEW ON SOLANA EXPLORER
                            </a>
                        )}
                        <button
                            onClick={onClose}
                            className="h-16 w-full bg-white/5 border border-white/10 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all border-dashed"
                        >
                            CLOSE_SESSION
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionModal;
