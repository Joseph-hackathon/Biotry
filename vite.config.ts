import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        strictPort: true,
        proxy: {
            '/api-colosseum': {
                target: 'https://copilot.colosseum.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api-colosseum/, '')
            }
        }
    },
})
