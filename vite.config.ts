import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],

    define: {
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV || mode),
    },

    server: {
      port: 3000,
      host: '127.0.0.1',
      open: false,
    },

    build: {
      outDir: 'build',
      sourcemap: mode !== 'production',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-redux', 'redux'],
            'maplibre-vendor': ['maplibre-gl', '@osmcha/maplibre-adiff-viewer'],
            'router-vendor': ['react-router', 'react-router-dom', 'react-router-redux'],
          },
        },
      },
    },

    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: [],
    },
  };
});
