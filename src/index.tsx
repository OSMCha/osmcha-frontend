import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router";
import { Toaster } from "sonner";
import { queryClient } from "./query/client";

import "./assets/index.css";

import { App } from "./app";

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
