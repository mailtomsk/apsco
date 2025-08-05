import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5686,       // 👈 Your desired port number
    strictPort: true  // 👈 Optional: Vite will fail if port is already in use
  }
});
