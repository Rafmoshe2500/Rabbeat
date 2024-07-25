import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled']
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://193.106.55.125:3000',
        changeOrigin: true,
      }
    }
  },
})
