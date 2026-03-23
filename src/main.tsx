import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SocialProviders } from './components/providers/SocialProviders'
import { AppProvider } from './context/AppContext'
import App from './App'
import './index.css'
import { Buffer } from 'buffer'

// Polyfill Buffer for Solana/Anchor
if (typeof window !== 'undefined') {
    window.Buffer = window.Buffer || Buffer
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <SocialProviders>
            <AppProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </AppProvider>
        </SocialProviders>
    </React.StrictMode>,
)
