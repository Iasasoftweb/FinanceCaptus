import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import MainHome from "./MainHome.tsx";
import "leaflet/dist/leaflet.css";
// import './index.css'

import { AuthProvider } from "./components/Roles/AuthProvider.tsx";

import "./sakai-template/public/themes/bootstrap4-light-blue/theme.css";

import "bootstrap-icons/font/bootstrap-icons.css";

// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.min.js";
import { BrowserRouter } from "react-router-dom";
import Login from "./pages/Login/Login.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
      <MainHome />
    </BrowserRouter>
  </AuthProvider>,
  
);
