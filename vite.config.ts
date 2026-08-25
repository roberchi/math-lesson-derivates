import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': resolve(__dirname, 'src') } },
  server: {
    host: '0.0.0.0',
    allowedHosts: ['100.68.175.56'],
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: ['100.68.175.56'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          katex: ['katex', 'react-katex'],
          vendor: ['react', 'react-dom', 'react-router-dom', 'zustand'],
          excalidraw: ['@excalidraw/excalidraw'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setupTests.ts'],
  },
});
