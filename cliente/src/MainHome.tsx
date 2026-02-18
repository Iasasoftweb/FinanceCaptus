import React, { useEffect, useState } from "react";
import App from "./App.tsx";
import Login from "./pages/Login/Login.tsx";
import Home from "./components/dashboard/Dashboard.tsx";
import { Navigate } from "react-router-dom";

function parseJwt(token: string | null) {
  if (!token) return null;
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

function MainHome() {
  const [tokenExistAndStillValid, setTokenExistAndStillValid] = useState(false);
  const handleSuccessfulLogin = (token: string) => {
    localStorage.setItem("token", token);
    setTokenExistAndStillValid(true); // Actualiza el estado para renderizar App
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Verifica si el token existe antes de procesarlo

    if (token) {
      const parsedToken = parseJwt(token);

      if (parsedToken && parsedToken.exp * 1000 > Date.now()) {
        setTokenExistAndStillValid(true);
      } else {
        // Si el token no es válido o ha expirado, lo eliminamos del localStorage
        localStorage.removeItem("token");
      }
    }
  }, []); // Este useEffect solo se ejecuta una vez cuando el componente se monta

  return <div>{tokenExistAndStillValid ? <App /> : <Login />}</div>;

}

export default MainHome;
