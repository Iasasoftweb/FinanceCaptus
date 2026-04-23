import ReactDOM from "react-dom/client";
import MainHome from "./MainHome.tsx";
import "leaflet/dist/leaflet.css";


import { AuthProvider } from "./components/Roles/AuthProvider.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './index.css'

import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
      <MainHome />
    </BrowserRouter>
  </AuthProvider>,
  
);
