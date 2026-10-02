import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Browser calls /api/... and Vite forwards to Express (no CORS fuss in dev).
    proxy: { '/api': 'http://localhost:4000' },
  },
});
