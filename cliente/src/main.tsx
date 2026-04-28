import ReactDOM from "react-dom/client";
import MainHome from "./MainHome.tsx";
import "leaflet/dist/leaflet.css";


import { AuthProvider } from "./components/Roles/AuthProvider.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './index.css'

import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Evita que recargue datos cada vez que cambias de pestaña
      retry: 1, // Si falla, reintenta una vez
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
    <QueryClientProvider client={queryClient}>
       <MainHome />
    </QueryClientProvider>
      
    </BrowserRouter>
  </AuthProvider>,
  
);
