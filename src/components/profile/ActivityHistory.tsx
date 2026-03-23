import React from 'react';
import { Activity, Clock, ExternalLink, Hash, CheckCircle2, XCircle, Terminal } from 'lucide-react';
import { clsx } from 'clsx';

interface ActivityHistoryProps {
    history: any[];
    currentPage: number;
    itemsPerPage: number;
    setCurrentPage: (page: number) => void;
    isLoading: boolean;
    onRefresh: () => void;
}

const ActivityHistory: React.FC<ActivityHistoryProps> = ({
    history,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    isLoading,
    onRefresh
}) => {
    return (
        <div className="space-y-8 animate-in mt-2 fade-in slide-in-from-bottom-10 duration-700">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                        <Terminal className="w-5 h-5 text-[#F6851B]" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold uppercase tracking-tight text-white flex items-center gap-3">
                            NETWORK ACTIVITY LOG
                        </h3>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Live On-Chain Interaction Stream</p>
                    </div>
                </div>
                <button
                    onClick={onRefresh}
                    disabled={isLoading}
                    className="h-10 px-5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-[#F6851B] hover:border-[#F6851B] disabled:opacity-50 transition-all flex items-center gap-2 group"
                >
                    <Activity className={clsx("w-3.5 h-3.5", isLoading && "animate-pulse")} />
                    {isLoading ? 'SYNCING_BUFFER...' : 'REFRESH_HISTORY'}
                </button>
            </div>

            <div className="glass-panel overflow-hidden p-0 relative bg-black/40 border border-white/5 rounded-[32px] shadow-2xl">
                {history.length > 0 ? (
                    <>
                        <div className="divide-y divide-white/5">
                            {history.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((sig) => (
                                <div key={sig.signature} className="p-6 flex items-center justify-between hover:bg-white/5 transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className={clsx(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500",
                                            sig.err ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-green-500/10 border-green-500/20 text-green-400"
                                        )}>
                                            {sig.err ? <XCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white uppercase tracking-tight">
                                                {sig.err ? 'TERMINATED_PROCESS' : (sig.category?.replace('_', ' ') || 'NETWORK_INTERACTION')}
                                            </p>
                                            <div className="flex items-center gap-4 mt-1.5">
                                                <p className="text-[9px] font-bold text-white/30 uppercase flex items-center gap-2 tracking-[0.1em]">
                                                    <Clock className="w-3.5 h-3.5" /> {sig.blockTime ? new Date(sig.blockTime * 1000).toLocaleString() : 'PENDING_TX...'}
                                                </p>
                                                <div className="w-[1px] h-3 bg-white/5" />
                                                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                                                    <Hash className="w-3.5 h-3.5" /> {sig.signature.slice(0, 12)}...
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <a
                                        href={`https://explorer.solana.com/tx/${sig.signature}?cluster=devnet`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/30 hover:text-[#F6851B] hover:bg-[#F6851B]/10 hover:border-[#F6851B]/30 transition-all"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {history.length > itemsPerPage && (
                            <div className="p-6 bg-white/5 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Viewing page {currentPage} of {Math.ceil(history.length / itemsPerPage)}</span>
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: Math.ceil(history.length / itemsPerPage) }).map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentPage(idx + 1)}
                                            className={clsx(
                                                "w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold border transition-all",
                                                currentPage === idx + 1
                                                    ? "bg-[#F6851B] border-[#F6851B] text-white shadow-[0_0_20px_rgba(246,133,27,0.3)]"
                                                    : "bg-white/5 text-white/40 border-white/5 hover:border-white/20"
                                            )}
                                        >
                                            {idx + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-24 text-center space-y-6">
                        <div className="w-20 h-20 bg-white/5 border border-dashed border-white/10 rounded-3xl mx-auto flex items-center justify-center animate-pulse">
                            <Activity className="w-8 h-8 text-white/10" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.4em]">
                                {isLoading ? 'FETCHING_TX_BUFFER...' : 'NO_LOGS_IDENTIFIED'}
                            </p>
                            <p className="text-[9px] uppercase tracking-widest text-white/10 font-bold">Awaiting On-Chain Execution Activity</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityHistory;
