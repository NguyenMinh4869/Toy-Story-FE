import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173, 
    strictPort: true,
    proxy: {
      // Dev-only CORS bypass: call /api/... from the browser
      // and Vite will proxy to the real backend.
      "/api": {
        target: "https://toy-story-xwni.onrender.com",
        changeOrigin: true,
        secure: true,
      },
      // SignalR WebSocket proxy
      "/notificationHub": {
        target: "https://toy-story-xwni.onrender.com",
        changeOrigin: true,
        secure: true,
        ws: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})