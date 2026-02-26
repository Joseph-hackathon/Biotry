import React from 'react';
import { X, Info, CheckCircle2, AlertTriangle, AlertCircle, LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

export type SystemModalType = 'info' | 'success' | 'warning' | 'error';

interface SystemModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: SystemModalType;
    title: string;
    message: string;
}

const TYPE_CONFIG: Record<SystemModalType, { icon: LucideIcon; color: string; bg: string; border: string }> = {
    info: { icon: Info, color: 'text-accent-purple', bg: 'bg-accent-softPurple', border: 'border-accent-purple' },
    success: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-500' },
    warning: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-500' },
    error: { icon: AlertCircle, color: 'text-accent-pink', bg: 'bg-accent-softPink', border: 'border-accent-pink' },
};

const SystemModal: React.FC<SystemModalProps> = ({
    isOpen,
    onClose,
    type,
    title,
    message
}) => {
    if (!isOpen) return null;

    const config = TYPE_CONFIG[type];
    const Icon = config.icon;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative w-full max-w-sm bg-white border-4 border-black shadow-flat animate-in fade-in zoom-in duration-200">
                {/* Accent Bar */}
                <div className={clsx("h-2 border-b-4 border-black", config.bg.replace('bg-', 'bg-').split(' ')[0])} />

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-1.5 hover:bg-gray-100 border-2 border-transparent hover:border-black transition-all"
                >
                    <X className="w-4 h-4 text-black" />
                </button>

                <div className="p-8 pb-10 space-y-6">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className={clsx(
                            "w-16 h-16 border-4 border-black flex items-center justify-center rotate-3 shadow-flat-sm",
                            config.bg
                        )}>
                            <Icon className={clsx("w-8 h-8 -rotate-3", config.color)} />
                        </div>
                    </div>

                    {/* Text */}
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-display font-black uppercase tracking-tight text-black">
                            {title}
                        </h2>
                        <p className="text-[10px] font-header font-black text-black/50 uppercase leading-relaxed tracking-widest">
                            {message}
                        </p>
                    </div>

                    {/* Action */}
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-black text-white border-3 border-black text-[10px] font-header font-black uppercase tracking-[0.2em] shadow-flat-sm hover:shadow-flat active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                    >
                        ACKNOWLEDGE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SystemModal;
