import React from 'react';
import { CheckCircle2, XCircle, ExternalLink, X, FlaskConical, Activity, User, ShieldCheck } from 'lucide-react';
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

const CATEGORY_MAP: Record<TransactionCategory, { label: string; icon: any; color: string; bg: string }> = {
    DAO_JOIN: { label: 'DAO MEMBERSHIP', icon: User, color: 'text-accent-purple', bg: 'bg-accent-softPurple' },
    UPVOTE: { label: 'RESEARCH UPVOTE', icon: Activity, color: 'text-accent-pink', bg: 'bg-accent-softPink' },
    PUBLISH: { label: 'RESEARCH PUBLISH', icon: FlaskConical, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    DAO_INIT: { label: 'DAO INITIALIZATION', icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' },
    GENERIC: { label: 'INTERACTION', icon: Activity, color: 'text-gray-600', bg: 'bg-gray-100' },
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
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white border-4 border-black shadow-flat animate-in fade-in zoom-in duration-300">
                {/* Header Decoration */}
                <div className={clsx("h-2 border-b-4 border-black", status === 'success' ? 'bg-green-400' : 'bg-accent-pink')} />

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-gray-100 border-2 border-transparent hover:border-black transition-all"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 space-y-8">
                    {/* Status Icon & Label */}
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className={clsx(
                            "w-20 h-20 border-4 border-black flex items-center justify-center rotate-3 shadow-flat-sm",
                            status === 'success' ? 'bg-green-100' : 'bg-accent-softPink'
                        )}>
                            {status === 'success' ? (
                                <CheckCircle2 className="w-10 h-10 text-green-600 -rotate-3" />
                            ) : (
                                <XCircle className="w-10 h-10 text-accent-pink -rotate-3" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-3xl font-display font-black uppercase tracking-tight">
                                {status === 'success' ? 'TRANSACTION COMPLETE' : 'TRANSACTION FAILED'}
                            </h2>
                            <p className="text-[11px] font-header font-black text-black/40 uppercase tracking-widest">
                                {status === 'success' ? 'ON-CHAIN STATE UPDATED SUCCESSFULLY' : 'COULD NOT COMPLETE REQUEST'}
                            </p>
                        </div>
                    </div>

                    {/* Category Card */}
                    <div className="border-3 border-black p-4 flex items-center gap-4 bg-gray-50 shadow-flat-xs">
                        <div className={clsx("w-12 h-12 border-3 border-black flex items-center justify-center shrink-0", config.bg)}>
                            <Icon className={clsx("w-6 h-6", config.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-header font-black text-black/40 uppercase tracking-widest leading-none mb-1">CATEGORY</p>
                            <p className="text-sm font-header font-black text-black uppercase tracking-tight truncate">
                                {config.label}
                            </p>
                        </div>
                    </div>

                    {message && (
                        <p className="text-xs font-header font-black text-black/70 leading-relaxed text-center uppercase">
                            {message}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="space-y-3 pt-2">
                        {txId && status === 'success' && (
                            <a
                                href={`https://explorer.solana.com/tx/${txId}?cluster=${cluster}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-illu-primary w-full py-4 flex items-center justify-center gap-3 bg-accent-purple text-white mb-2"
                            >
                                <ExternalLink className="w-5 h-5" />
                                VIEW ON EXPLORER
                            </a>
                        )}
                        <button
                            onClick={onClose}
                            className="btn-illu-outline w-full py-4 uppercase"
                        >
                            CLOSE WINDOW
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionModal;
