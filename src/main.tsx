import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Buffer } from 'buffer'

import { SocialProviders } from './components/providers/SocialProviders'
import { UIProvider } from './context/UIContext'
import { SolanaProvider } from './context/SolanaContext'
import { AppProvider } from './context/AppContext'
import App from './App'
import './index.css'

// Polyfill Buffer for Solana/Anchor
if (typeof window !== 'undefined') {
    window.Buffer = window.Buffer || Buffer
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <SocialProviders>
            <UIProvider>
                <SolanaProvider>
                    <AppProvider>
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </AppProvider>
                </SolanaProvider>
            </UIProvider>
        </SocialProviders>
    </React.StrictMode>,
)
