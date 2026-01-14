import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    define: {
      "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV || mode),
    },

    server: {
      port: 3000,
      host: "127.0.0.1",
      open: false,
    },

    build: {
      outDir: "build",
      sourcemap: mode !== "production",
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom"],
            "maplibre-vendor": ["maplibre-gl", "@osmcha/maplibre-adiff-viewer"],
            "router-vendor": ["react-router", "react-router-dom"],
          },
        },
      },
    },

    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: [],
    },
  };
});
