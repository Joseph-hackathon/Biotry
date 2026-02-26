import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SocialProviders } from './components/providers/SocialProviders'
import { AppProvider } from './context/AppContext'
import App from './App'
import './index.css'

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
