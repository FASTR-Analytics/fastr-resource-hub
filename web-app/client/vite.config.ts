import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/fastr-theme.css': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/resources': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/handouts-pdf': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../dist/client',
    emptyOutDir: true,
  },
})
