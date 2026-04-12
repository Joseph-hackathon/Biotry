import React, { useState } from 'react';
import {
    LayoutDashboard, User, Search,
    Bell, Plus, Activity, Menu, X, FlaskConical, BookOpen,
    Copy, Check, ChevronRight, Wallet, Globe, ShieldCheck
} from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { useAppContext } from '../context/AppContext';
import { useSolana } from '../context/SolanaContext';
import { useUI } from '../context/UIContext';
import { truncateAddress } from '../utils/address';

interface LayoutProps { children: React.ReactNode; currentView: string; }

const Layout: React.FC<LayoutProps> = ({ children, currentView }) => {
    const { authenticated, login, logout, user, connectWallet, linkWallet } = usePrivy();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { searchQuery, setSearchQuery } = useAppContext();
    const { network, setNetwork, solanaAddress } = useSolana();
    const { showSystemModal } = useUI();
    const activeAddress = solanaAddress || '';
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!activeAddress) return;
        navigator.clipboard.writeText(activeAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const navItems = React.useMemo(() => [
        { id: 'journal', label: 'Journal', icon: BookOpen, path: '/journal' },
        { id: 'analytics', label: 'Analytics', icon: LayoutDashboard, path: '/analytics' },
        { id: 'studio', label: 'Research Studio', icon: FlaskConical, path: '/studio' },
        { id: 'profile', label: 'Profile', icon: User, path: '/profile', requiresAuth: true },
    ], []);

    const isActive = (id: string) => currentView === id;

    return (
        <div className="flex h-screen bg-[#030303] text-white font-sans overflow-hiddenSelection">
            {/* ── Sidebar ── */}
            <aside className={clsx(
                'transition-all duration-500 flex flex-col z-40 shrink-0 border-r border-white/5 bg-[#0B0E11]/80 backdrop-blur-2xl box-border',
                sidebarOpen ? 'w-72' : 'w-24'
            )}>
                {/* Logo Row */}
                <div className="h-20 flex items-center px-6 shrink-0">
                    <button onClick={() => navigate('/')} className="flex items-center gap-3.5 transition-all hover:opacity-80 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#F6851B] to-[#FFAB5E] rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(246,133,27,0.2)] group-hover:scale-105 transition-transform p-1.5">
                            <img src="/biotry-logo.png" alt="Biotry" className="w-full h-full object-contain brightness-0 invert" />
                        </div>
                        {sidebarOpen && (
                            <span className="text-2xl font-bold tracking-tighter text-white">
                                BIOTRY<span className="text-[#F6851B]">.</span>
                            </span>
                        )}
                    </button>
                </div>

                {/* Navigation Section */}
                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto no-scrollbar">
                    {sidebarOpen && (
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.25em] px-4 mb-6">Discovery Engine</p>
                    )}
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => item.requiresAuth && !authenticated ? login() : navigate(item.path)}
                            className={clsx(
                                'nav-item group',
                                !sidebarOpen && 'justify-center px-0 h-14 w-14 mx-auto',
                                isActive(item.id) && 'active'
                            )}
                            title={!sidebarOpen ? item.label : undefined}
                        >
                            <item.icon className={clsx(
                                "w-5 h-5 shrink-0 transition-all group-hover:scale-110",
                                isActive(item.id) ? "text-[#F6851B]" : "text-white/40 group-hover:text-white"
                            )} />
                            {sidebarOpen && <span className="font-semibold tracking-tight">{item.label}</span>}
                            {sidebarOpen && isActive(item.id) && (
                                <ChevronRight className="ml-auto w-4 h-4 text-[#F6851B]" />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Sidebar Collapse Toggle */}
                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-full h-12 glass-panel rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 group"
                    >
                        {sidebarOpen ? (
                             <>
                                <X className="w-4 h-4 text-white/40 group-hover:text-white" />
                                <span className="text-xs font-bold text-white/40 group-hover:text-white uppercase tracking-widest">Collapse</span>
                             </>
                        ) : (
                            <Menu className="w-5 h-5 text-white/40 group-hover:text-white" />
                        )}
                    </button>
                </div>
            </aside>

            {/* ── Main Dashboard Content ── */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Background Glow */}
                <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-[#F6851B]/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

                {/* Top Sticky Header */}
                <header className="h-20 px-8 flex items-center justify-between shrink-0 z-30 bg-[#030303]/40 backdrop-blur-md border-b border-white/5">
                    <div className="flex-1 max-w-xl relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#F6851B] transition-colors pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search Research Nodes, Agents, and Graphs..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm font-medium focus:bg-white/10 focus:border-[#F6851B]/50 focus:ring-4 focus:ring-[#F6851B]/10 outline-none transition-all placeholder:text-white/20"
                        />
                    </div>

                    <div className="flex items-center gap-6 ml-10">
                        {/* Network/Status Pills */}
                        <div className="hidden lg:flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-2 py-1.5 backdrop-blur-sm">
                             <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                                 <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                 <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{network}</span>
                             </div>
                             <button
                                 onClick={() => showSystemModal({
                                     type: 'info',
                                     title: 'Shield Status',
                                     message: 'On-chain shield is active. All interactions are signed via Privy/Solana.'
                                 })}
                                 className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all"
                             >
                                 <ShieldCheck className="w-4 h-4 text-blue-400" />
                             </button>
                        </div>

                        {authenticated ? (
                            <div className="flex items-center gap-4 py-1.5 pl-1.5 pr-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group">
                                <div className="w-9 h-9 rounded-xl border border-white/10 overflow-hidden shadow-2xl transition-transform group-hover:scale-105">
                                    <img
                                        src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${activeAddress || 'default'}`}
                                        className="w-full h-full object-cover"
                                        alt="User"
                                    />
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-[11px] font-bold text-white uppercase tracking-tight leading-none mb-0.5">{truncateAddress(activeAddress)}</p>
                                    <button onClick={logout} className="text-[9px] font-bold text-[#F6851B] uppercase tracking-widest hover:underline">Logout</button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={login}
                                className="btn-metamask h-11 px-6 shadow-2xl"
                            >
                                <Wallet className="w-4 h-4" />
                                CONNECT WALLET
                            </button>
                        )}
                        
                        <button
                            onClick={() => navigate('/studio')}
                            className="w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-[#F6851B] hover:border-[#F6851B] hover:text-white transition-all text-white/60 shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Content Container */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                    <div className="max-w-[1400px] mx-auto px-8 md:px-12 py-10">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
