import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, Wallet, Info } from 'lucide-react';
import { clsx } from 'clsx';

interface InputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (value: string) => void;
    title: string;
    message: string;
    placeholder?: string;
    defaultValue?: string;
}

const InputModal: React.FC<InputModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    placeholder = "0.0",
    defaultValue = ""
}) => {
    const [value, setValue] = useState(defaultValue);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setValue(defaultValue);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, defaultValue]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(value);
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleConfirm();
        if (e.key === 'Escape') onClose();
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative w-full max-w-sm glass-panel p-0 overflow-hidden border border-white/10 shadow-3xl animate-in fade-in zoom-in duration-300 rounded-[40px] bg-[#0B0E11]/90">
                {/* Accent Bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#F6851B] to-purple-500" />

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group z-20"
                >
                    <X className="w-4 h-4 text-white/30 group-hover:text-white" />
                </button>

                <div className="p-8 space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="w-14 h-14 rounded-2xl bg-[#F6851B]/10 border border-[#F6851B]/20 flex items-center justify-center mx-auto mb-4">
                            <Wallet className="w-6 h-6 text-[#F6851B]" />
                        </div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">
                            {title}
                        </h2>
                        <div className="flex items-center justify-center gap-2">
                             <Info className="w-3 h-3 text-white/20" />
                             <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">
                                {message}
                            </p>
                        </div>
                    </div>

                    {/* Input Field */}
                    <div className="relative group">
                        <input
                            ref={inputRef}
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            className="w-full h-20 bg-white/5 border border-white/10 rounded-3xl px-8 text-3xl font-bold text-white placeholder:text-white/10 focus:outline-none focus:border-[#F6851B]/50 transition-all text-center tabular-nums"
                        />
                        <div className="absolute inset-0 rounded-3xl bg-[#F6851B]/5 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity -z-10" />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleConfirm}
                            className="btn-metamask h-16 w-full flex items-center justify-center text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95 px-8"
                        >
                            Confirm Deposit
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                        <button
                            onClick={onClose}
                            className="h-14 w-full flex items-center justify-center text-[9px] font-bold text-white/20 border border-white/5 rounded-2xl hover:bg-white/5 hover:text-white transition-all uppercase tracking-widest"
                        >
                            Cancel_Transaction
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InputModal;
