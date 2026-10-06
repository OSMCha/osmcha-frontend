import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router";
import { Toaster } from "sonner";
import { queryClient } from "./query/client.ts";

import "./assets/index.css";

import { App } from "./app.tsx";

// MapLibre locates its worker relative to import.meta.url, which breaks when
// Vite pre-bundles maplibre-gl into node_modules/.vite/deps. Have Vite bundle
// the worker itself and point MapLibre at the result.
setWorkerUrl(workerUrl);

const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

const root = createRoot(container);
root.render(
  <QueryClientProvider client={queryClient}>
    <Router>
      <App />
      <Toaster position="top-right" />
    </Router>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
);
