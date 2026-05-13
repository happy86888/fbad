import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 部署到 Vercel/Netlify 等根目錄主機:base 用 '/'
// 部署到 GitHub Pages 子路徑:改成 base: '/repo-name/'
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
