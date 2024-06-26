import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  build: {
    outDir: './docs'
  },
  server: {
    host: '0.0.0.0',
    port: 5174
  },
  base: 'https://igvdev.github.io/telegram-miniapp-test/'
});
