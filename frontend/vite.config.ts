import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
  build: {
    outDir: '../public/frontend',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: './index.html',
    },
  },
})