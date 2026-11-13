import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Served from https://bhavana123456.github.io/portfolio/ on GitHub Pages
  base: '/portfolio/',
})
