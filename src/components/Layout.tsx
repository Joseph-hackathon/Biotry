import React, { useState } from 'react';
import {
    Microscope, LayoutDashboard, Globe, User, Search,
    Bell, Plus, Activity, Menu, X, FlaskConical, BookOpen,
    Copy, Check
} from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { useAppContext } from '../context/AppContext';
import { useSolana } from '../context/useSolana';
import { SolanaNetwork } from '../context/SolanaContext';
import { Globe as GlobeIcon, Network as NetworkIcon } from 'lucide-react';
import { truncateAddress } from '../utils/address';

interface LayoutProps { children: React.ReactNode; currentView: string; }


const Layout: React.FC<LayoutProps> = ({ children, currentView }) => {
    const { authenticated, login, logout, user, connectWallet, linkWallet } = usePrivy();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { searchQuery, setSearchQuery } = useAppContext();
    const { network, setNetwork, solanaAddress, showSystemModal } = useSolana();
    const activeAddress = solanaAddress || '';
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!activeAddress) return;
        navigator.clipboard.writeText(activeAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleNetworkChange = () => {
        const networks: SolanaNetwork[] = ['devnet', 'mainnet-beta', 'localhost'];
        const nextIndex = (networks.indexOf(network) + 1) % networks.length;
        setNetwork(networks[nextIndex]);
    };

    const navItems = [
        { id: 'journal', label: 'Biotry Journal', icon: BookOpen, path: '/journal' },
        { id: 'analytics', label: 'Analytics Hub', icon: LayoutDashboard, path: '/analytics' },
        { id: 'studio', label: 'Research Studio', icon: FlaskConical, path: '/studio' },
        { id: 'profile', label: 'Profile', icon: User, path: '/profile', requiresAuth: true },
    ];

    const isActive = (id: string) => currentView === id;

    return (
        <div className="flex h-screen bg-illustration-bg text-black font-soft overflow-hidden">
            {/* ── Sidebar ── */}
            <aside className={clsx(
                'transition-all duration-300 flex flex-col z-40 shrink-0 border-r-3 border-black bg-white',
                sidebarOpen ? 'w-64' : 'w-20'
            )}>
                {/* Logo Row */}
                <div className="h-16 flex items-center justify-between px-4 border-b-3 border-black shrink-0">
                    {sidebarOpen && (
                        <button onClick={() => navigate('/')} className="flex items-center gap-2.5 transition-transform hover:-translate-y-0.5 group">
                            <div className="w-9 h-9 bg-accent-softPurple border-3 border-black flex items-center justify-center shrink-0 shadow-flat-sm group-hover:shadow-flat transition-all">
                                <Microscope className="w-5 h-5 text-accent-purple" />
                            </div>
                            <span className="text-xl font-display font-black tracking-tight text-black">
                                BIOTRY<span className="text-accent-purple">.</span>
                            </span>
                        </button>
                    )}
                    {!sidebarOpen && (
                        <button onClick={() => navigate('/')} className="w-9 h-9 bg-accent-softPurple border-3 border-black flex items-center justify-center mx-auto shadow-flat-sm hover:shadow-flat transition-all">
                            <Microscope className="w-5 h-5 text-accent-purple" />
                        </button>
                    )}
                </div>

                {/* Expand/Collapse button */}
                <div className="p-4 border-b-3 border-black flex justify-center">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-full py-2 bg-white border-3 border-black shadow-flat-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex justify-center"
                    >
                        {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
                    {sidebarOpen && (
                        <p className="text-[11px] font-header font-black text-gray-400 uppercase tracking-[0.2em] px-2 mb-4">Core Operating System</p>
                    )}
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => item.requiresAuth && !authenticated ? login() : navigate(item.path)}
                            className={clsx(
                                'nav-link',
                                !sidebarOpen && 'justify-center px-0',
                                isActive(item.id) && 'active'
                            )}
                            title={!sidebarOpen ? item.label : undefined}
                        >
                            <item.icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                            {sidebarOpen && <span>{item.label}</span>}
                            {sidebarOpen && isActive(item.id) && (
                                <div className="ml-auto w-2 h-2 bg-accent-pink border-2 border-black" />
                            )}
                        </button>
                    ))}
                </div>

                {/* User Footer */}
                <div className="p-4 border-t-3 border-black bg-accent-softPink">
                    {authenticated ? (
                        <div className="flex flex-col gap-2">
                            {activeAddress ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 border-3 border-black bg-white overflow-hidden shrink-0 shadow-flat-sm">
                                        <img
                                            src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${activeAddress || 'default'}`}
                                            className="w-full h-full object-cover"
                                            alt="User"
                                        />
                                    </div>
                                    {sidebarOpen && (
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between group/copy">
                                                <p className="text-[11px] font-header font-black truncate uppercase text-black leading-tight">
                                                    {truncateAddress(activeAddress)}
                                                </p>
                                                <button
                                                    onClick={handleCopy}
                                                    className="opacity-0 group-hover/copy:opacity-100 transition-opacity p-1 hover:bg-black/5 rounded"
                                                    title="Copy Address"
                                                >
                                                    {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-black/40" />}
                                                </button>
                                            </div>
                                            <button onClick={logout} className="text-[10px] font-header font-black text-accent-pink uppercase hover:underline">Disconnect</button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <p className="text-[10px] font-header font-black text-black/40 uppercase tracking-widest text-center">No Wallet Selected</p>
                                    {/* FIX: Check if we already have a linked Solana account to avoid SIWS 400 'limit reached' error */}
                                    {user?.linkedAccounts?.find(a => a.type === 'wallet' && (a as any).chainType === 'solana') ? (
                                        <button
                                            onClick={() => connectWallet()}
                                            className="btn-illu-primary w-full py-2 flex items-center justify-center gap-2"
                                        >
                                            <Activity className="w-4 h-4" /> {sidebarOpen ? 'CONNECT WALLET' : ''}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => linkWallet()}
                                            className="btn-illu-primary w-full py-2 flex items-center justify-center gap-2"
                                        >
                                            <Activity className="w-4 h-4" /> {sidebarOpen ? 'LINK WALLET' : ''}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={login}
                            className={clsx(
                                'btn-illu-primary w-full shadow-flat-sm',
                                !sidebarOpen && 'px-0 flex justify-center'
                            )}
                        >
                            {sidebarOpen ? 'Connect Node' : <Activity className="w-4 h-4" />}
                        </button>
                    )}
                </div>
            </aside>

            {/* ── Main Content ── */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-illustration-bg">
                {/* Top Header */}
                <header className="h-16 border-b-3 border-black flex items-center justify-between px-6 shrink-0 z-30 bg-white shadow-sm">
                    <div className="flex-1 max-w-md relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="SEARCH RESEARCH GRAPH..."
                            className="illu-input pl-11 py-2.5 rounded-none"
                        />
                    </div>

                    <div className="flex items-center gap-4 ml-6">
                        {/* Network Switcher */}
                        <button
                            onClick={handleNetworkChange}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 border-3 border-black font-header font-black text-[10px] uppercase tracking-widest transition-all shadow-flat-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
                                network === 'devnet' ? "bg-accent-softPurple text-accent-purple" :
                                    network === 'mainnet-beta' ? "bg-accent-softPink text-accent-pink" : "bg-gray-100 text-black"
                            )}
                        >
                            <NetworkIcon className="w-3.5 h-3.5" />
                            {network === 'mainnet-beta' ? 'Mainnet' : network}
                        </button>

                        <button
                            onClick={() => navigate('/studio')}
                            className="btn-illu-primary flex items-center gap-2 px-6 shadow-flat-sm py-2"
                        >
                            <Plus className="w-5 h-5" /> NEW POST
                        </button>
                        <button
                            onClick={() => showSystemModal({
                                type: 'info',
                                title: 'Notifications',
                                message: 'The notifications system is currently being integrated.'
                            })}
                            className="w-10 h-10 flex items-center justify-center border-3 border-black bg-white shadow-flat-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                        >
                            <Bell className="w-5 h-5 text-black" />
                        </button>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
                    <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-8">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
