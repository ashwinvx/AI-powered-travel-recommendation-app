import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API requests to the Express server
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Your Express server port
        changeOrigin: true, // Changes the origin header to match the target
        // Optional: If you need to rewrite the path on the server side
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
