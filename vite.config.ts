import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/katex/')) return 'math-rendering';
          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react-runtime';
          const chapter = id.match(/\/content\/ch(\d{2})_/);
          if (chapter) return `pbrt-legacy-${chapter[1]}`;
        },
      },
    },
  },
});
