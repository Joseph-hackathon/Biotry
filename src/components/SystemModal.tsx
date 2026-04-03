import React from 'react';
import { X, Info, CheckCircle2, AlertTriangle, AlertCircle, LucideIcon, Zap, ArrowUpRight } from 'lucide-react';
import { clsx } from 'clsx';

export type SystemModalType = 'info' | 'success' | 'warning' | 'error';

interface SystemModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: SystemModalType;
    title: string;
    message: string;
    actionLink?: string;
    actionLabel?: string;
}

const TYPE_CONFIG: Record<SystemModalType, { icon: LucideIcon; color: string; glow: string; border: string }> = {
    info: { icon: Info, color: 'text-[#A78BFA]', glow: 'bg-[#7C3AED]/10', border: 'border-[#7C3AED]/30' },
    success: { icon: CheckCircle2, color: 'text-emerald-500', glow: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    warning: { icon: AlertTriangle, color: 'text-amber-500', glow: 'bg-amber-500/10', border: 'border-amber-500/30' },
    error: { icon: AlertCircle, color: 'text-[#F6851B]', glow: 'bg-[#F6851B]/10', border: 'border-[#F6851B]/30' },
};

const SystemModal: React.FC<SystemModalProps> = ({
    isOpen,
    onClose,
    type,
    title,
    message,
    actionLink,
    actionLabel
}) => {
    if (!isOpen) return null;

    const config = TYPE_CONFIG[type];
    const Icon = config.icon;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative w-full max-w-sm glass-panel p-0 overflow-hidden border border-white/10 shadow-3xl animate-in fade-in zoom-in duration-500 rounded-[40px] bg-[#0B0E11]/90">
                {/* Accent Bar */}
                <div className={clsx("h-1.5 w-full", 
                    type === 'success' ? 'bg-emerald-500' : 
                    type === 'error' ? 'bg-[#F6851B]' : 
                    type === 'warning' ? 'bg-amber-500' : 'bg-[#7C3AED]'
                )} />

                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group z-20"
                >
                    <X className="w-4 h-4 text-white/30 group-hover:text-white" />
                </button>

                <div className="p-10 md:p-12 space-y-8">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className={clsx(
                            "w-20 h-20 rounded-3xl border flex items-center justify-center transition-transform duration-700 hover:rotate-6 shadow-2xl",
                            config.glow,
                            config.border
                        )}>
                            <Icon className={clsx("w-10 h-10", config.color)} />
                        </div>
                    </div>

                    {/* Text */}
                    <div className="text-center space-y-3">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-white uppercase leading-none">
                            {title}
                        </h2>
                        <p className="text-[10px] font-bold text-white/30 uppercase leading-relaxed tracking-[0.3em]">
                            {message}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onClose}
                            className="btn-metamask h-16 w-full flex items-center justify-center text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95 px-8"
                        >
                            <Zap className="w-4 h-4 mr-2" />
                            ACKNOWLEDGE_RECEIPT
                        </button>

                        {actionLink && (
                            <a
                                href={actionLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={onClose}
                                className="w-full h-14 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-bold text-white/40 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                            >
                                {actionLabel || 'VIEW_ON_EXPLORER'}
                                <ArrowUpRight className="w-3 h-3" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemModal;
