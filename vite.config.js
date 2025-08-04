import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/react-mnemonic-game/', // ← must match your repo name
  plugins: [react()],
})
