import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/stand-by-me/', // HARUS sama persis dengan nama repository GitHub-mu
  plugins: [
    react(),
    tailwindcss(),
  ],
})
