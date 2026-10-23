import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 7173,
    proxy: {
      '/api': {
        target: 'http://10.57.1.245:8000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
