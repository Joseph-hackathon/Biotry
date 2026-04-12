import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
    ],
    define: {
        'global': 'window',
    },
    resolve: {
        alias: {
            // Redirect the entire broken SDK to a stable local mock (cross-platform)
            '@coinbase/wallet-sdk': path.resolve(__dirname, './src/utils/mock-coinbase-sdk.js'),
        }
    },
    optimizeDeps: {
        // Exclude from optimization as we are using a local mock
        exclude: ['@coinbase/wallet-sdk'] 
    },
    build: {
        commonjsOptions: {
            transformMixedEsModules: true,
        },
        rollupOptions: {
            // No externalization; bundle our local mock instead
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
