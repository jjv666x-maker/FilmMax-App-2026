import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-d3': ['d3'],
          'vendor-icons': ['lucide-react'],
          'vendor-motion': ['motion'],
          'vendor-sentry': ['@sentry/browser'],
          'vendor-hls': ['hls.js'],
        },
      },
    },
    chunkSizeWarningLimit: 650,
  },
});
