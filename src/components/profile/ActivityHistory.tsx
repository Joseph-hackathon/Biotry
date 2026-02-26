import React from 'react';
import { Activity, Clock, ExternalLink } from 'lucide-react';
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-display font-black uppercase tracking-tight text-black flex items-center gap-3">
                    <Activity className="w-6 h-6" /> RECENT ACTIVITY
                </h3>
                <button
                    onClick={onRefresh}
                    disabled={isLoading}
                    className="text-[10px] font-header font-black text-accent-purple uppercase tracking-widest hover:underline disabled:opacity-50"
                >
                    {isLoading ? 'SYNCING...' : 'REFRESH HISTORY'}
                </button>
            </div>

            <div className="illustration-card bg-white p-0 overflow-hidden relative">
                {history.length > 0 ? (
                    <>
                        <div className="divide-y-2 divide-black/5">
                            {history.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((sig) => (
                                <div key={sig.signature} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={clsx(
                                            "w-10 h-10 border-3 border-black flex items-center justify-center rotate-3",
                                            sig.err ? "bg-accent-softPink" : "bg-green-100"
                                        )}>
                                            <Activity className={clsx("w-5 h-5", sig.err ? "text-accent-pink" : "text-green-600")} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-header font-black text-black uppercase tracking-tight">
                                                {sig.err ? 'Failed Transaction' : (sig.category?.replace('_', ' ') || 'Interaction')}
                                            </p>
                                            <p className="text-[10px] font-header font-black text-black/30 uppercase flex items-center gap-1.5 mt-0.5">
                                                <Clock className="w-3 h-3" /> {sig.blockTime ? new Date(sig.blockTime * 1000).toLocaleString() : 'Pending...'}
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={`https://explorer.solana.com/tx/${sig.signature}?cluster=devnet`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 border-3 border-black bg-white flex items-center justify-center shadow-flat-xs hover:bg-accent-purple hover:text-white transition-all group"
                                    >
                                        <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    </a>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {history.length > itemsPerPage && (
                            <div className="p-4 bg-gray-50 border-t-2 border-black/5 flex items-center justify-end gap-2">
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.ceil(history.length / itemsPerPage) }).map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentPage(idx + 1)}
                                            className={clsx(
                                                "w-8 h-8 flex items-center justify-center font-header font-black text-[10px] border-2 transition-all",
                                                currentPage === idx + 1
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white text-black border-black/10 hover:border-black"
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
                    <div className="py-16 text-center space-y-4">
                        <div className="w-16 h-16 bg-gray-50 border-3 border-dashed border-black mx-auto flex items-center justify-center">
                            <Activity className="w-8 h-8 text-black/10" />
                        </div>
                        <p className="text-[11px] font-header font-black text-black/30 uppercase tracking-[0.2em]">
                            {isLoading ? 'FETCHING TRANSACTIONS...' : 'NO RECENT ON-CHAIN ACTIVITY FOUND.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityHistory;
