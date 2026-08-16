import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        dashboard: 'http://localhost:3001/assets/remoteEntry.js',
        users: 'http://localhost:3002/assets/remoteEntry.js',
        finance: 'http://localhost:3003/assets/remoteEntry.js',
        operations: 'http://localhost:3004/assets/remoteEntry.js',
        inventory: 'http://localhost:3005/assets/remoteEntry.js',
        reports: 'http://localhost:3006/assets/remoteEntry.js',
        analytics: 'http://localhost:3007/assets/remoteEntry.js',
        systemHealth: 'http://localhost:3008/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    })
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
});
