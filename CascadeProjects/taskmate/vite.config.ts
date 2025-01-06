import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Listen on all addresses
    strictPort: true, // Don't try other ports if 5173 is taken
    watch: {
      usePolling: true, // Use polling for better file system events
      interval: 100, // Check for changes every 100ms
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
