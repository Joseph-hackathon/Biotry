import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        'global': 'window', // Fixes module resolution for various wallet SDKs
    },
    resolve: {
        alias: {
            '@coinbase/wallet-sdk/dist/sign/walletlink/relay/ui/components/Snackbar/Snackbar.js': '/src/utils/mock-snackbar.js',
            '@coinbase/wallet-sdk': '@coinbase/wallet-sdk/dist/index.js',
        }
    },
    optimizeDeps: {
        exclude: ['@coinbase/wallet-sdk'] 
    },
    build: {
        commonjsOptions: {
            transformMixedEsModules: true,
        },
        rollupOptions: {
            external: ['@coinbase/wallet-sdk'],
            output: {
                globals: {
                    '@coinbase/wallet-sdk': 'CoinbaseWalletSDK'
                }
            }
        }
    },
    server: {
        port: 5173,
        strictPort: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true
            },
            '/api-colosseum': {
                target: 'https://api.colosseum.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api-colosseum/, '')
            }
        }
    },
})
