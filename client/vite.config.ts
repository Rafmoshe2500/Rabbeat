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
    https: {
        key: fs.readFileSync('/home/cs128/ssc/key.pem'),
        cert: fs.readFileSync('/home/cs128/ssc/cert.pem')
    },
    host: '0.0.0.0',
    port: 443
  }
})

