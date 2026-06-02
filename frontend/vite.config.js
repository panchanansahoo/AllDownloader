import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'VidDrop Premium',
        short_name: 'VidDrop',
        description: 'Premium Social Media Downloader',
        theme_color: '#4f46e5',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/3172/3172554.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:4000'
    }
  }
});

