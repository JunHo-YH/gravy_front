import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          console.log('🔄 Vite 프록시 rewrite:', path, '->', path.replace(/^\/api/, ''));
          return path.replace(/^\/api/, '');
        },
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('❌ Vite 프록시 에러:', err);
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('➡️ Vite 프록시 요청:', req.method, req.url, '->', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('⬅️ Vite 프록시 응답:', req.url, proxyRes.statusCode);
          });
        }
      }
    }
  }
});
