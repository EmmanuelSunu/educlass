
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'aa9fe1da-5102-47de-b816-788dbadc67cc-00-2sv19g3oirbd.riker.replit.dev',
      '.replit.dev',
      'localhost'
    ]
  }
})
