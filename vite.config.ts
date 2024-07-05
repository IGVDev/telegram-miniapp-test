import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  build: {
    outDir: './docs',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser']
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5174
  },
  base: 'https://igvdev.github.io/telegram-miniapp-test/',
  optimizeDeps: {
    include: ['phaser'] 
  },
  resolve: {
    alias: {
      'phaser': 'phaser/dist/phaser.js' 
    }
  }
})