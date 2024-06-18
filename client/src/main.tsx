import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { UserProvider } from "./contexts/user-context.tsx";
import "regenerator-runtime/runtime";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <App />
      </UserProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
