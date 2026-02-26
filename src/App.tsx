import React, { useState, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import PostCard from './components/PostCard';
import PostDetail from './components/PostDetail';
import LandingPage from './components/LandingPage';
import ResearchEditor from './components/ResearchEditor';
import DeSciDashboard from './components/DeSciDashboard';
import ProfileView from './components/ProfileView';
import JournalView from './components/JournalView';
import { Globe, Network as NetworkIcon } from 'lucide-react';
import { SolanaProvider } from './context/SolanaContext';
import { useAppContext } from './context/AppContext';
import type { Post } from './types';

type FilterType = 'Trending' | 'Latest' | 'Following' | 'Cited';


function App() {
    const location = useLocation();
    const navigate = useNavigate();
    const { proposals: posts } = useAppContext();

    const currentView = location.pathname.split('/')[1] as string;

    const PostDetailWrapper = () => {
        const id = location.pathname.split('/').pop();
        const post = posts.find((p: Post) => p.id === id);
        if (!post) return <Navigate to="/journal" />;
        return <PostDetail post={post} onBack={() => navigate('/journal')} />;
    };

    return (
        <SolanaProvider>
            <Routes>
                <Route path="/" element={<LandingPage onLaunch={() => navigate('/journal')} />} />
                <Route
                    path="/*"
                    element={
                        <Layout currentView={currentView}>
                            <Routes>
                                <Route path="journal" element={<JournalView />} />
                                <Route path="studio" element={<ResearchEditor />} />
                                <Route path="analytics" element={<DeSciDashboard />} />
                                <Route path="profile" element={<ProfileView />} />
                                <Route path="node/:id" element={<PostDetailWrapper />} />
                                <Route path="*" element={<Navigate to="/journal" />} />
                            </Routes>
                        </Layout>
                    }
                />
            </Routes>
        </SolanaProvider>
    );
}

export default App;
