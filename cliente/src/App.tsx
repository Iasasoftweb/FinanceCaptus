import "./App.css";
import React, { useEffect, useState } from "react";
import ShowClients from "./pages/Clientes/ShowCliente";
import ShowClientCards from "./pages/Clientes/ShowClienteCards.tsx";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/dashboard/Nav";
import Sidebar from "./components/dashboard/Sidebar";
import Home from "./components/dashboard/Dashboard.tsx";

import "../src/pages/Dashboard/Dashboard.css";

import EditCliente from "./pages/Clientes/EditCliente";
import CreateCliente from "./pages/Clientes/CreateCliente";
import Showrutas from "./pages/Rutas/Showrutas";
import Logincard from "./components/login/Logincard";
import Logout from "./components/login/logout";
import MainHome from "./MainHome";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./Auth/ProtectedRoute";
import ShowUsuarios from "./pages/Usuarios/ShowUsurios";
import HomeLayout from "./Layout/HomeLayout.tsx";
import ShowPrestamos from "./pages/Prestamos/ShowPrestamos.tsx";
import MyEmpresa from "./pages/Empresas/MyEmpresa.tsx";
import ListadoClientes from "./pages/Clientes/Printer/ListadoClientes.tsx";
import PrinterContainer from "./pages/Clientes/Printer/PrinterContainer.tsx";
import Company from "./pages/Companies/Company.tsx";
import axios from "axios";
import PrestamoDetail from "./pages/Prestamos/PrestamoDetail.tsx";
import ShowPrintPrestamos from "./pages/Prestamos/Pdfs/reportPrestamos.tsx";

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [Empresa, SetEmpresa] = useState([]);
  const [InteresDefault, setInteresDefault] = useState("");

  const GetEmpresa = async () => {
    try {
      const respuesta = await axios.get(`http://localhost:5000/empresas/`);
       
        const getEmpresas = respuesta?.data.data || respuesta.data;
        console.log(getEmpresas[0].interesdefecto)
        SetEmpresa(getEmpresas);
        setInteresDefault(getEmpresas[0].interesdefecto);
        localStorage.setItem(
          "interesDefault",
          getEmpresas[0].interesdefecto
        );
      
        localStorage.setItem("gastolegal", getEmpresas[0].gastolegal);
        localStorage.setItem("seguro", getEmpresas[0].seguro);
        localStorage.setItem("moneda", getEmpresas[0].tipomoneda);
        localStorage.setItem("prorrogamora", getEmpresas[0].prorrogamora)
        localStorage.setItem("prorrogacuota", getEmpresas[0].prorrogacuota)
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetEmpresa();
  }, []);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <>
      <Routes>
        <Route
          path="/printer/Container"
          element={
            <ProtectedRoute>
              {" "}
              <PrinterContainer />
            </ProtectedRoute>
          }
        />

        <Route
          
          element={
            <ProtectedRoute>
              <HomeLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />}></Route> 

          <Route path="/clientes" element={<ShowClients />} />
          <Route path="/showclientes" element={<ShowClientCards />} />
         
          <Route
            path="/clientes/edit/:id"
            element={
              <ProtectedRoute>
                <EditCliente />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes/create/"
            element={
              <ProtectedRoute>
                <CreateCliente />
              </ProtectedRoute>
            }
          />

          <Route path="/empresa" element={<MyEmpresa open={true} />} />
          <Route
            path="rutas"
            element={
              <ProtectedRoute>
                <Showrutas />
              </ProtectedRoute>
            }
          />
          <Route
            path="usuarios"
            element={
              <ProtectedRoute>
                <ShowUsuarios />
              </ProtectedRoute>
            }
          />
          <Route path="/prestamodetail/:id" element={<PrestamoDetail />} />
          <Route path="/prestamos" element={<ShowPrestamos />} />
          <Route path="/company" element={<Company />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
