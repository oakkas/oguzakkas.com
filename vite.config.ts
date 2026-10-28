import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      // The main page, and the printable résumé served at /resume
      input: {
        main: path.resolve(__dirname, 'index.html'),
        resume: path.resolve(__dirname, 'resume.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
