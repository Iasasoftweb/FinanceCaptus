import { useState, useEffect } from "react";
import { Menu } from "antd";
import { VscDashboard } from "react-icons/vsc";
import "./layout.css";
import { MdOutlineCategory } from "react-icons/md";
import { LiaToolsSolid } from "react-icons/lia";
import { PiBuildingsLight } from "react-icons/pi";

import { GrConfigure, GrShieldSecurity } from "react-icons/gr";
import { PiUsers } from "react-icons/pi";
import { BsPiggyBank } from "react-icons/bs";
import { PiCashRegisterLight } from "react-icons/pi";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { GrMoney } from "react-icons/gr";
import { PiCalculatorLight } from "react-icons/pi";
import { PiMapPinArea } from "react-icons/pi";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../components/Roles/AuthProvider.tsx";
import TablaAmortiza from "../pages/Prestamos/TablaAmortiza.tsx";
import CuotasList from "../pages/Prestamos/CuotasList.tsx";
import FindEmpresas from "../components/general/FindEmpresas.tsx";


const MenuList = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [DataEmpresa, setDataEmpresa] = useState([``]);
  const [isCalculadora, setIsCalculadora] = useState(false);

  const { role } = useAuth();

  const Calculadora = () => {
    setIsCalculadora(true);
  };

  const handleModalCuotas = () => {
    setIsCalculadora(false);
  };

  return (
    <div >
      {isCalculadora && (
        <CuotasList
          idPrestamos={0}
          open={true}
          handleClose={handleModalCuotas}
          varcapital={0.0}
          varinteres={parseFloat(localStorage.getItem("interesDefault"))}
          varcuota={0.0}
          varTcuota={13}
          vartipoamotiza={"Cuota Fija"}
          varfrecuencia={"SEMANAL"}
          fechaPrimerPago={null}
          isView={false}
          varSeguro={0.0}
          modo={"Calculadora"}
        />
      )}

      <hr
        style={{
          borderTop: 2,
          backgroundColor: "#0097b2",
          height: 4,
          marginTop: 1,
        }}
      />

      <Menu
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
      
      >
        <Menu.Item
          key="dashboard"
          icon={<VscDashboard className="fs-4" />}
          className="text-white"
          disabled={
            !(
              role === "ADMINISTRADOR" ||
              role === "SUPERVISOR" ||
              role === "OPERADOR"
            )
          }
        >
          {role === "ADMINISTRADOR" ||
          role === "SUPERVISOR" ||
          role === "OPERADOR" ? (
            <Link to={"/"} className=" text-decoration-none mx-1">
              {" "}
              Dashboard{" "}
            </Link>
          ) : (
            <span className="mx-1">Dashboard</span>
          )}
        </Menu.Item>

        <Menu.Item
          key="clientes"
          icon={<PiUsers className="fs-4" />}
          className="text-white"
          disabled={!(role === "ADMINISTRADOR" || role === "SUPERVISOR")}
        >
          {role === "ADMINISTRADOR" || role === "SUPERVISOR" ? (
            <Link to={"/showclientes"} className="text-decoration-none mx-1">
              Clientes
            </Link>
          ) : (
            <span className="mx-1">Clientes</span>
          )}
        </Menu.Item>

        <Menu.Item
          key="prestamos"
          icon={<BsPiggyBank className="fs-4" />}
          className="text-white"
          disabled={
            !(
              role === "ADMINISTRADOR" ||
              role === "SUPERVISOR" ||
              role === "OPERADOR"
            )
          }
        >
          {role === "ADMINISTRADOR" || role === "SUPERVISOR" ? (
            <Link to={"/prestamos"} className="text-decoration-none mx-1">
              Préstamos
            </Link>
          ) : (
            <span className="mx-1">Préstamos</span>
          )}
        </Menu.Item>

        <Menu.Item
          key="pagos"
          icon={<PiCashRegisterLight className="fs-4" />}
          className="text-white"
          disabled={false}
        >
          {role === "ADMINISTRADOR" ||
          role === "SUPERVISOR" ||
          role === "OPERADOR" ? (
            <Link to={"/"} className="text-decoration-none mx-1">
              Pagos
            </Link>
          ) : (
            <span className="mx-1">Pagos</span>
          )}
        </Menu.Item>

        <Menu.Item
          key="estadocuenta"
          icon={<HiOutlineClipboardDocumentList className="fs-4" />}
          className="text-white"
          disabled={
            !(
              role === "ADMINISTRADOR" ||
              role === "SUPERVISOR" ||
              role === "OPERADOR"
            )
          }
        >
          {role === "ADMINISTRADOR" ||
          role === "SUPERVISOR" ||
          role === "OPERADOR" ? (
            <Link to={"/"} className="text-decoration-none mx-1">
              Estado de Cuenta
            </Link>
          ) : (
            <span className="mx-1">Estado de Cuenta</span>
          )}
        </Menu.Item>

        <Menu.Item
          key="gastos"
          icon={<GrMoney className="fs-4" />}
          className="text-white"
          disabled={
            !(
              role === "ADMINISTRADOR" ||
              role === "SUPERVISOR" ||
              role === "OPERADOR"
            )
          }
        >
          {role === "ADMINISTRADOR" ||
          role === "SUPERVISOR" ||
          role === "OPERADOR" ? (
            <Link to={"/"} className="text-decoration-none mx-1">
              Gastos
            </Link>
          ) : (
            <span className="mx-1">Gastos</span>
          )}
        </Menu.Item>
        <Menu.Item
          key="calculadora"
          icon={<GrMoney className="fs-4" />}
          className="text-white"
          disabled={
            !(
              role === "ADMINISTRADOR" ||
              role === "SUPERVISOR" ||
              role === "OPERADOR"
            )
          }
        >
          {role === "ADMINISTRADOR" ||
          role === "SUPERVISOR" ||
          role === "OPERADOR" ? (
            <Link
              to={"/"}
              className="text-decoration-none mx-1"
              onClick={Calculadora}
            >
              Calculadora
            </Link>
          ) : (
            <span className="mx-1">Calculadora</span>
          )}
        </Menu.Item>

        <Menu.Item
          key="reportes"
          icon={<PiCalculatorLight className="fs-4" />}
          className="text-white"
          disabled={!(role === "ADMINISTRADOR" || role === "SUPERVISOR")}
        >
          {role === "ADMINISTRADOR" || role === "SUPERVISOR" ? (
            <Link to={"/"} className="text-decoration-none mx-1">
              Reportes
            </Link>
          ) : (
            <span className="mx-1">Reportes</span>
          )}
        </Menu.Item>

        <Menu.SubMenu
          key="seguridad"
          icon={<GrShieldSecurity className="fs-4" />}
          title="Seguridad"
        >
          <Menu.Item
            key="usuario"
            icon={<PiUsers className="fs-4" />}
            className="text-white"
            disabled={!(role === "ADMINISTRADOR")}
          >
            {role === "ADMINISTRADOR" ? (
              <Link to={"/usuarios"} className="text-decoration-none mx-1">
                Usaurios
              </Link>
            ) : (
              <span className="mx-1">Usuarios</span>
            )}
          </Menu.Item>

          <Menu.Item
            key="roles"
            icon={<MdOutlineCategory className="fs-4" />}
            className="text-white"
            disabled={!(role === "ADMINISTRADOR")}
          >
            {role === "ADMINISTRADOR" ? (
              <Link to={"/"} className="text-decoration-none mx-1">
                Roles
              </Link>
            ) : (
              <span className="mx-1">Roles</span>
            )}
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu
          key="Configuración"
          icon={<LiaToolsSolid className="fs-4" />}
          title="Configuración"
        >
          <Menu.Item
            key="empresas"
            icon={<GrConfigure className="fs-4" />}
            className="text-white"
            disabled={!(role === "ADMINISTRADOR")}
          >
            {role === "ADMINISTRADOR" ? (
              <Link to={"/empresa"} className="text-decoration-none mx-1">
                Configuración
              </Link>
            ) : (
              <span className="mx-1"> Configuración</span>
            )}
          </Menu.Item>
          <Menu.Item
            key="company"
            icon={<PiBuildingsLight className="fs-4" />}
            className="text-white"
            disabled={!(role === "ADMINISTRADOR")}
          >
            {role === "ADMINISTRADOR" ? (
              <Link to={"/company"} className="text-decoration-none mx-1">
                Compañias
              </Link>
            ) : (
              <span className="mx-1">Compañias</span>
            )}
          </Menu.Item>

          <Menu.Item
            key="rutas"
            icon={<PiMapPinArea className="fs-4" />}
            className="text-white"
            disabled={!(role === "ADMINISTRADOR")}
          >
            {role === "ADMINISTRADOR" ? (
              <Link to={"/rutas"} className="text-decoration-none mx-1">
                Rutas
              </Link>
            ) : (
              <span className="mx-1">rutas</span>
            )}
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </div>
  );
};

export default MenuList;
