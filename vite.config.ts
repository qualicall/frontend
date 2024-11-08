import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: process.env.PROD === 'true' 
//           ? process.env.VITE_API_URL 
//           : 'http://127.0.0.1:8001',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, '')
//       }
//     }
//   }
// }); 

export default defineConfig({
      plugins: [react()],
      server: {
        proxy: {
      '/api': {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
          }
        }
      }
    }); 