import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled']
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost',
        changeOrigin: true,
      }
    }
  },
})

