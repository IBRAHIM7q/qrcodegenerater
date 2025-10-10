import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3008,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3009',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      'node:fs': 'node:fs'
    }
  },
  build: {
    rollupOptions: {
      external: ['node:fs', 'node:path', 'node:url', 'node:buffer', 'node:stream', 'node:util', 'node:os']
    }
  }
});