import { react, useState, useEffect } from "react";
import Nav from "../components/dashboard/Nav.tsx";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Layout, Button, theme, Menu } from "antd";
import "./layout.css";
import Logo from "../../src/components/Brand/Brand.tsx";
import MenuList from "./MenuList.tsx"
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { AiOutlineMenuFold } from "react-icons/ai";
import NavAvatar from "../components/Menutop/NavAvatat.tsx";
import NavNotificaciones from "../components/Menutop/NavNotificaciones.tsx";
import NavMensajes from "../components/Menutop/NavMensajaes.tsx";
import { SiMeteor } from "react-icons/si";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { VscGraph, VscGraphLine } from "react-icons/vsc";
import { TbChartInfographic } from "react-icons/tb";
import { MdOutlineAutoGraph } from "react-icons/md";
import { useAppContext } from "../context/AppContext.tsx";
//import 'react-pro-sidebar/dist/css/styles.css';

function HomeLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [Dash, setDash] = useState("Cobros");
  const isDashboard = location.pathname ==='/'
  
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { Header, Sider, Content, Footer } = Layout;

  const handleDash = (e) => {
    setDash(e.target.value);
  };

  // useEffect(() => {
  //   setIsDash(true);
  // }, []);

  return (
    <div className="">
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={300}
          breakpoint="md"
          // collapsedWidth="0"
          onBreakpoint={(broken) => {
            // Detecta si se alcanza el punto de interrupción
            setCollapsed(broken); // Cambia el estado según el breakpoint
          }}
        >
          {!collapsed ? (
            <div className="d-flex justify-content-center align-content-center p-4">
              <SiMeteor className="fs-1 text-white me-2" /> <Logo fs={25} />
            </div>
          ) : (
            <div className="d-flex justify-content-center align-content-center p-4">
              <SiMeteor className="fs-1 text-white" />
            </div>
          )}
          <MenuList />
        </Sider>
        {/* />        */}
        <Layout>
          <Header
            style={{ padding: 0, backgroundColor: "whitesmoke" }}
            className="shadow"
          >
            <div className="d-flex justify-content-between align-content-center m-2">
              <div className="d-flex">
                <Button
                  type="text"
                  icon={
                    collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />
                  }
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    fontSize: "25px",
                    width: 30,
                    height: 50,
                    color: "GrayText",
                  }}
                />

                <div className="d-flex mx-3" style={{ width: "200px" }}>
                  {/* {isDashboard && (
                    <TextField
                      label="DashBoard"
                      fullWidth
                      select
                      value={Dash}
                      onChange={handleDash}
                      InputLabelProps={{
                        style: { fontSize: "1em", color: "GrayText" },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          fontSize: "12px", // Controla el radio de borde
                          width: "100%",
                          color: "GrayText",

                          "& fieldset": {
                            borderColor: "whitesmoke",
                            color: "GrayText",
                          },

                          "&.Mui-focused fieldset": {
                            borderColor: "GrayText", // Borde al enfocar
                          },
                        },
                      }}
                    >
                      <MenuItem value="Cobros">
                        <VscGraphLine className="mx-3" />
                        <span className="clFont">Cobros</span>
                      </MenuItem>
                      <MenuItem value="Resumen">
                        <VscGraph className="mx-3" />
                        <span className="clFont">Resumen</span>
                      </MenuItem>
                      <MenuItem value="Administracion">
                        <TbChartInfographic className="mx-3" />
                        <span className="clFont">Administracion</span>
                      </MenuItem>
                      <MenuItem value="Financiamiento">
                        <MdOutlineAutoGraph className="mx-3" />
                        <span className="clFont">Financiamiento</span>
                      </MenuItem>
                    </TextField>
                  )} */}
                </div>
              </div>

              <div className="d-flex">
                <NavNotificaciones />
                <NavMensajes />
                <NavAvatar />
              </div>
            </div>
          </Header>
          <Content
            style={{
              margin: "10px",
              padding: 1,
              minHeight: 1100,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center", fontSize: 12 }} className="">
            Todos los derechos reservados ©{new Date().getFullYear()} Creado por
            IasaSoft
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
}

export default HomeLayout;
