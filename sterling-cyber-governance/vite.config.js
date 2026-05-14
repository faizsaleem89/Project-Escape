import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  root: 'client',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
    },
  },
  server: {
    port: 3003,
    host: '0.0.0.0',
    allowedHosts: ['*'],
    middlewareMode: false,
  },
  preview: {
    port: 3003,
    host: '0.0.0.0',
    allowedHosts: ['*'],
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  }
})
