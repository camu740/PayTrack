import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'pdf-utils': ['jspdf', 'date-fns'],
          'charts': ['recharts']
        }
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',
      css: true
    }
  }
})
