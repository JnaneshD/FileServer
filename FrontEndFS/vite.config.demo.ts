import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Demo configuration for GitHub Pages - uses mock data
export default defineConfig({
  base: '/FileServer/', // GitHub Pages uses repo name as base path
  plugins: [react()],
  define: {
    'import.meta.env.VITE_USE_MOCK': JSON.stringify('true')
  },
  build: {
    outDir: '../docs',
    emptyOutDir: true
  }
})
