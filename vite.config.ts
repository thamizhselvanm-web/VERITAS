import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/twilio-api': {
        target: 'https://api.twilio.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/twilio-api/, '')
      }
    }
  }
});
