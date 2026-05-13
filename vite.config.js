import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 重要:GitHub Pages 部署在子路徑 /facebookbot/,所以 base 要設定
// 如果要部署到 Vercel/Netlify,把 base 改回 '/'
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
