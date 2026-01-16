import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const plugins = [react()];
  if (process.env.ANALYZE) {
    plugins.push(visualizer({ open: true }));
  }

  return {
    plugins,

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
      sourcemap: true,
    },

    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: [],
    },
  };
});
