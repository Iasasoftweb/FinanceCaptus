import * as React from "react";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import "./clientes.css";
import TitleTop from "../../components/TitleTop/TItleTop.tsx";
import { LuUsers } from "react-icons/lu";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { TbRefresh } from "react-icons/tb";
import { IoIosSearch } from "react-icons/io";
import {
  AiOutlineCamera,
  AiOutlineDelete,
  AiOutlinePlus,
} from "react-icons/ai";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import AllClient from "../../data/clientes/AllClentes.tsx";
import {
  Avatar,
  Pagination,
  Button,
  Card,
  CardContent,
  Typography,
  CardHeader,
  CardActions,
  ListItemIcon,
  Table,
} from "@mui/material";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import PaginationItem from "../../components/Pagination/PaginatedItems.tsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ClienteDo from "./ClientesDoc.tsx";
import { useAuth } from "../../components/Roles/AuthProvider.tsx";
import { TfiPrinter } from "react-icons/tfi";
import ListadoClientes from "./Printer/ListadoClientes.tsx";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import {
  LiaCloudUploadAltSolid,
  LiaFileUploadSolid,
  LiaMapMarkedAltSolid,
} from "react-icons/lia";
import { FiPhoneCall } from "react-icons/fi";
import { CiEdit, CiSquareInfo } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { PiUploadSimpleFill } from "react-icons/pi";
import { GiTakeMyMoney } from "react-icons/gi";
import ClienteForm from "./ClienteForm.tsx";
import { GoDownload } from "react-icons/go";
import { MdGridView } from "react-icons/md";
import { RxListBullet } from "react-icons/rx";
import { FaRoute } from "react-icons/fa";
import { VscGoToSearch } from "react-icons/vsc";
import BeatLoader from "react-spinners/BeatLoader";
import PrestamosForm from "../Prestamos/PrestamosForm.tsx";
import useGeClient from "../../hooks/useGetCliente.tsx";
import useDataPrestamos from "../../hooks/useDataPrestamos.tsx";

const ITEM_HEIGHT = 48;
const menuOptions = [
  "Editar",
  "Eliminar",
  "Documentos",
  "Crear Prestamos",
  "Consultar",
];

const ShowClienteCards = () => {
  const [clients, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [clienteDatos, setClienteData] = useState([]);
  const [isModalpopupOpen, setIsModalpopupOpen] = useState(false);
  const [idRow, setIdRow] = useState(0);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [tipoModal, setTipoModal] = useState(true);
  const [isModalDoc, setIsModalDoc] = useState(false);
  const [reload, setReload] = useState(false);
  const [Estado, setEstado] = useState("1");
  const [idClient, setIdClient] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isModalEdit, setIsModalEdit] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCurrentClient, setIsCurrentClient] = useState(0);
  const [isCardShow, setIsCardShow] = useState(false);
  const [isModalPrestamos, setIsModalPrestamos] = useState(false);
  const [TotaPres, setTotalPres] = useState(0);
  const { DataCliente } = useGeClient(idRow);
  const { DataPrestamos} = useDataPrestamos();
  const open = Boolean(anchorEl);

  const handleClickMenu = (event, ClientID) => {
    setAnchorEl(event.currentTarget);
    setIdClient(ClientID);
  };

  const navigate = useNavigate();

  const handleEdit = (id) => {
    setIsModalOpen(true);
    setIsModalEdit(true);
    setIsCurrentClient(id);
    handleMenuClose();
  };

  const PER_PAGE = 7;
  const countpage = Math.ceil(clienteDatos.length / PER_PAGE);
  const _DATA = PaginationItem(clients, PER_PAGE);

  const handlePageChance = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  const URIs = "http://localhost:5000/clientes/";
  const UrisImg = "http://localhost:5000/uploads/";
  
  const prestamosInf = (id) => {
    const TotaPrestamos = DataPrestamos.filter((c) => c.idclientes === id);
    const TotalGeneral = TotaPrestamos.filter((c) => c.estado === "VIGENTE");
    return {
      resultTotal: TotalGeneral.length,
    };
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setModoEdicion(modoEdicion);
  }, [modoEdicion]);

  const FormInsert = () => {
    setIsModalOpen(true);
    setIsModalEdit(false);
    setIsCurrentClient(0);
    handleMenuClose();
    console.log("entro");
  };

  const datosCliente = () => {
    try {
      setTimeout(() => {
        AllClient().then((allClientes) => {
          setClientes(allClientes);
          setClienteData(allClientes);
          setTotalItems(allClientes.length);
          setIsLoading(false);
        }),
          10000;
      });
    } catch (error) {
      console.error("Error de Coneccion", error);
    }
  };

  const handleReload = () => {
    setReload((prev) => !prev); // Cambia el estado de reload
  };

  useEffect(() => {
    datosCliente();
  
    console.log(idRow);
  }, [reload]);

  const searcher = (e) => {
    setSearch(e.target.value);
    filtrar(e.target.value);
  };

  const ShowClients = () => {
    setSearch("");
    datosCliente();
  };
  const closeModalpopup = () => {
    setIsModalpopupOpen(false);
  };

  const openModalpopup = () => {
    setIsModalpopupOpen(true);
  };

  const CaptureDnI = (id) => {
    // getCliente();
    setIdRow(id);
    setTipoModal(true);
    setIsModalDoc(true);
    handleMenuClose();
    console.log(idRow);
  };

  const handleCloseModal = () => {
    setIsModalDoc(false);
  };

  const CapturaPhoto = (id) => {
    setIdRow(id);
    setTipoModal(false);
    openModalpopup();
  };

  const filtrar = (condicionesFiltrar) => {
    const resultados = clienteDatos.filter((elementos) => {
      if (
        elementos.dni
          .toString()
          .toLowerCase()
          .includes(condicionesFiltrar.toLowerCase()) ||
        elementos.nombres
          .toString()
          .toLowerCase()
          .includes(condicionesFiltrar.toLowerCase()) ||
        elementos.apellidos
          .toString()
          .toLowerCase()
          .includes(condicionesFiltrar.toLowerCase()) ||
        elementos.tbzona.nombrerutas
          .toString()
          .toLowerCase()
          .includes(condicionesFiltrar.toLowerCase())
      ) {
        return elementos;
      }
    });

    setClientes(resultados);
  };

  const deleteClientes = async (id) => {
    Swal.fire({
      title: "Esta seguro?",
      text: "No prodras revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminalo!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${URIs}${id}`);
          ShowClients();
          Swal.fire({
            title: "Eliminado!",
            text: "Registro ha sigo eliminado",
            icon: "success",
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Hubo un problema al eliminar el registro.",
            icon: "error",
          });
        }
      }
    });
    handleMenuClose();
  };
  const { role } = useAuth();
  const handlePrint = () => {
    localStorage.setItem("estadoCliente", Estado);
    navigate("/printer/Container");
  };

  const HandleMenuClose = () => {
    setIsModalOpen(false);
  };
  const HandleModalPrestamoClose = () => {
    setIsModalPrestamos(false);
  };

  const clientShow = (valor) => {
    setIsCardShow(valor);
  };

  function HandlInserPrestamos(id) {
    setIsModalPrestamos(true);
    setIdClient(id);
  }

  return (
    <div>
      {isModalOpen && (
        <ClienteForm
          ModoEdicion={isModalEdit}
          idCliente={isCurrentClient}
          open={true}
          handleClose={HandleMenuClose}
        />
      )}
      {isModalPrestamos && (
        <PrestamosForm
          ModoEdicion={!isModalEdit}
          idCliente={idClient}
          open={true}
          handleClose={HandleModalPrestamoClose}
        />
      )}

      <div className="card card w-100 p-2">
        <div>
          <div className="d-flex justify-content-between align-content-center ">
            <div className="d-flex">
              <div className="me-1">
                <LuUsers
                  className="border-1 rounded-circle p-2 text-info"
                  style={{ fontSize: 50 }}
                />
              </div>
              <div className="lh-1 mt-3">
                <h5 className=" title2">Clientes</h5>
                <span className="title1">Mantenimiento de Clientes</span>
              </div>
            </div>

            <div className="d-flex p-2">
              <InputGroup className="">
                <InputGroup.Text id="search">
                  <IoIosSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  className="clFont"
                  id="search"
                  placeholder="Buscar clientes"
                  value={search}
                  onChange={searcher}
                />
              </InputGroup>
              <div className="mx-3">
                <button
                  className=" p-2 d-flex align-items-center border-0 shadow-2 rounded-3 text-white"
                  onClick={ShowClients}
                  style={{ backgroundColor: "tomato", fontSize: "0.9em" }}
                >
                  <TbRefresh className="me-2 fs-6" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="shadow-sm">
        <div className="row mt-2">
          <div className="col-md-12 col-sm-12">
            <div
              className=" d-flex justify-content-between w-100  rounded-5"
              style={{ backgroundColor: "" }}
            >
              <div className="m-2 d-flex align-content-center">
                <div className="p-1">
                  <div
                    className=" p-2 d-flex align-items-center rounded-3 "
                    onClick={handlePrint}
                    style={{
                      backgroundColor: "#4682b4",
                      cursor: "pointer",
                      color: "white",
                      fontSize: "0.9em",
                    }}
                  >
                    <TfiPrinter className="me-2" /> Imprimir Reporte{" "}
                  </div>
                </div>

                <div className="p-1">
                  <PDFDownloadLink
                    document={<ListadoClientes />}
                    fileName="Listdo_Clintes_Activos.pdf"
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      className=" p-2 d-flex align-items-center rounded-3"
                      style={{
                        backgroundColor: "#008b8b",
                        cursor: "pointer",
                        textDecoration: "none",
                        color: "white",
                        fontSize: "0.9em",
                      }}
                    >
                      <GoDownload className="me-2" /> Descargar Reporte{" "}
                    </div>
                  </PDFDownloadLink>
                </div>
              </div>

              <div className="d-flex justify-content-center align-items-center">
                <div className="me-4">
                  {isCardShow ? (
                    <RxListBullet
                      className="fs-3 text-secondary"
                      onClick={() => clientShow(false)}
                    />
                  ) : (
                    <MdGridView
                      className="fs-3 text-secondary"
                      onClick={() => clientShow(true)}
                    />
                  )}
                </div>

                {role === "ADMINISTRADOR" || role === "SUPERVISOR" ? (
                  <AiOutlinePlus
                    className="text-white  rounded-circle p-2 m-1 shadow"
                    style={{
                      fontSize: "3rem",
                      backgroundColor: "lightcoral",
                      cursor: "pointer",
                    }}
                    onClick={FormInsert}
                  />
                ) : (
                  <AiOutlinePlus
                    className="text-secundary  rounded-circle shadow"
                    style={{ fontSize: "3rem", backgroundColor: "GrayText" }}
                  />
                )}
              </div>
            </div>
            {isLoading ? (
              <BeatLoader color="#008080" size={15} className="text-center" />
            ) : (
              <div>
                {isCardShow ? (
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                    className="p-3"
                  >
                    {_DATA.currentData().map((items) => (
                      <Card
                        key={items.id}
                        sx={{
                          width: 300,
                          lineHeight: 1,
                          height: 110,
                          fontSize: 10,
                        }}
                        className="shadow"
                      >
                        {items.estado === 1 ? (
                          <div
                            className="w-100 p-2 d-flex justify-content-between"
                            style={{ height: 22, backgroundColor: "steelblue" }}
                          >
                            <div className="clFont text-white">Activo</div>
                            <div className="clFont text-white">
                              <LiaMapMarkedAltSolid
                                className=""
                                style={{ fontSize: 10 }}
                              />{" "}
                              {items.tbzona.nombrerutas}{" "}
                            </div>
                          </div>
                        ) : (
                          <div
                            className="w-100 p-2 d-flex justify-content-between"
                            style={{
                              height: 22,
                              backgroundColor: "lightcoral",
                            }}
                          >
                            <div className="clFont text-white">Inactivo</div>
                            <div className="clFont text-white">
                              <LiaMapMarkedAltSolid
                                className=""
                                style={{ fontSize: 10 }}
                              />{" "}
                              {items.tbzona.nombrerutas}{" "}
                            </div>
                          </div>
                        )}

                        <CardHeader
                          avatar={
                            <Avatar
                              aria-label="recipe"
                              sx={{ width: 60, height: 60 }}
                              src={`${UrisImg}${items.imgFOTOS}`}
                            />
                          }
                          action={
                            <IconButton
                              aria-label="settings"
                              onClick={(event) =>
                                handleClickMenu(event, items.id)
                              }
                            >
                              <MoreVertIcon />
                            </IconButton>
                          }
                          title={`${items.nombres} ${items.apellidos}`}
                          subheader={items.dni}
                        />

                        <Menu
                          id="long-menu"
                          MenuListProps={{
                            "aria-labelledby": "long-button",
                          }}
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleMenuClose}
                          slotProps={{
                            paper: {
                              style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: "20ch",
                              },
                            },
                          }}
                        >
                          <MenuItem onClick={() => handleEdit(idClient)}>
                            <ListItemIcon>
                              <CiEdit className="fs-5" />
                            </ListItemIcon>
                            <Typography variant="inherit" className="clFont">
                              Editar
                            </Typography>
                          </MenuItem>

                          {role === "ADMINISTRADOR" ? (
                            <MenuItem onClick={() => deleteClientes(idClient)}>
                              <ListItemIcon>
                                <RiDeleteBin6Line className="fs-5" />
                              </ListItemIcon>
                              <Typography variant="inherit" className="clFont">
                                Eliminar
                              </Typography>
                            </MenuItem>
                          ) : (
                            <MenuItem>
                              <ListItemIcon>
                                <RiDeleteBin6Line className="fs-5" />
                              </ListItemIcon>
                              <Typography variant="inherit" className="clFont">
                                Eliminar
                              </Typography>
                            </MenuItem>
                          )}

                          <MenuItem onClick={() => CaptureDnI(idClient)}>
                            <ListItemIcon>
                              <PiUploadSimpleFill className="fs-5" />
                            </ListItemIcon>
                            <Typography variant="inherit" className="clFont">
                              Documentos
                            </Typography>
                          </MenuItem>

                          <MenuItem onClick={handleMenuClose}>
                            <ListItemIcon>
                              <GiTakeMyMoney className="fs-5" />
                            </ListItemIcon>
                            <Typography variant="inherit" className="clFont">
                              Crear Prestamos
                            </Typography>
                          </MenuItem>
                        </Menu>
                        <CardContent
                          sx={{ justifyItems: "center", padding: 0, margin: 0 }}
                        ></CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <Table className="mi-tabla">
                      <thead>
                        <tr className="clFont text-center ">
                          <th className="clFont text-center">
                            {" "}
                            <AiOutlineCamera className="fs-5" />{" "}
                          </th>
                          <th
                            className="clFont text-center"
                            style={{ width: 125 }}
                          >
                            Dni
                          </th>
                          <th className="clFont text-center">Nombres</th>
                          <th
                            className="clFont text-center"
                            style={{ width: 125 }}
                          >
                            Sector
                          </th>
                          <th
                            className="clFont text-center"
                            style={{ width: 115 }}
                          >
                            Telefonos
                          </th>
                          <th className="clFont text-center">Nombre de Ruta</th>
                          <th
                            className="clFont text-center"
                            style={{ width: 115 }}
                          >
                            Estado
                          </th>
                          <th className="clFont text-center ">
                            Prestamos Activos
                          </th>

                          <th
                            className="clFont text-center"
                            style={{ width: 100 }}
                          >
                            Documentos
                          </th>
                          <th
                            className="clFont text-center"
                            style={{ width: 140 }}
                          >
                            Prestamos
                          </th>
                          <th className="clFont text-center">Accion</th>
                        </tr>
                      </thead>
                      <tbody className="">
                        {_DATA.currentData().map((item) => {
                          const { resultTotal } = prestamosInf(item.id);
                          return (
                            <tr key={item.id}>
                              <td
                                className="clFont align-middle justify-content-center"
                                width={50}
                              >
                                {
                                  <Avatar
                                    src={`${UrisImg}${item.imgFOTOS}`}
                                    sx={{ width: 40, height: 40 }}
                                  />
                                }{" "}
                              </td>
                              <td className="clFont align-middle">
                                {item.dni}
                              </td>
                              <td
                                className="clFont align-middle"
                                style={{ width: "200px" }}
                              >
                                {item.nombres} {item.apellidos}
                              </td>

                              <td className="clFont align-middle">
                                {item.ciudad}
                              </td>
                              <td className="clFont align-middle">
                                {item.telefono1}
                              </td>
                              <td
                                className="clFont align-middle"
                                style={{ width: "150px" }}
                              >
                                <span>
                                  {" "}
                                  <FaRoute className="mx-2 text-primary" />
                                </span>
                                {item.tbzona.nombrerutas}
                              </td>
                              <td className="clFont align-middle p-1">
                                {item.estado === 1 ? (
                                  <p
                                    className="rounded-1 text-center w-100 shadow text-white p-1"
                                    style={{ backgroundColor: "#157394" }}
                                  >
                                    {" "}
                                    Activo
                                  </p>
                                ) : (
                                  <p
                                    className="text-white rounded-1 text-center shadow p-1"
                                    style={{ backgroundColor: "#e17070" }}
                                  >
                                    {" "}
                                    Inactivo
                                  </p>
                                )}
                              </td>
                              <td
                                className=" align-middle clFont"
                                style={{ width: "20px" }}
                              >
                                {" "}
                                <span
                                  className=" text-white rounded-5 text-center p-2 "
                                  style={{ backgroundColor: "#589cb4" }}
                                >
                                  <span className="m-2">{resultTotal}</span>
                                </span>
                              </td>

                              <td className="text-center align-middle">
                                {role === "ADMINISTRADOR" ||
                                role === "OPERADOR" ||
                                role === "SUPERVISOR" ? (
                                  <Link to="">
                                    <LiaCloudUploadAltSolid
                                      className="me-3 text-primary fs-3 align-middle"
                                      onClick={() => CaptureDnI(item.id)}
                                    />
                                  </Link>
                                ) : (
                                  <LiaFileUploadSolid
                                    className="me-3 fs-3 align-middle"
                                    style={{
                                      color: "GrayText",
                                      cursor: "pointer",
                                    }}
                                  />
                                )}
                              </td>
                              <td
                                className="clFont text-center align-middle"
                                style={{ width: "140px" }}
                              >
                                {" "}
                                <div
                                  className="text-center text-white p-1 rounded-3"
                                  style={{ backgroundColor: "#dc4c4c" }}
                                  onClick={() => HandlInserPrestamos(item.id)}
                                >
                                  <GiTakeMyMoney className="fs-5" /> Crear
                                  Prestamos
                                </div>{" "}
                              </td>

                              <td
                                className="text-center align-middle "
                                style={{ width: "300px" }}
                              >
                                {role === "ADMINISTRADOR" ? (
                                  <AiOutlineDelete
                                    className="text-danger  fs-4 m-4"
                                    onClick={() => deleteClientes(item.id)}
                                  />
                                ) : (
                                  <AiOutlineDelete
                                    className="me-4 fs-4"
                                    style={{ color: "GrayText" }}
                                  />
                                )}

                                {role === "ADMINISTRADOR" ? (
                                  <CiEdit
                                    className="text-primary fs-4 me-4"
                                    onClick={() => handleEdit(item.id)}
                                  />
                                ) : (
                                  <CiEdit
                                    className="fs-5"
                                    style={{ color: "GrayText" }}
                                  />
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                )}

                <ThemeProvider theme={theme}>
                  <div className="d-flex align-items-center ">
                    <Pagination
                      count={countpage}
                      size="large"
                      page={page}
                      color="secundary"
                      onChange={handlePageChance}
                    />

                    <div>
                      <p className="clFont m-auto">
                        Total de Clientes : {totalItems}
                      </p>
                    </div>
                  </div>
                </ThemeProvider>
              </div>
            )}
          </div>
        </div>
      </main>
      {isModalDoc && (
        <ClienteDo
          Id={idRow}
          open={isModalDoc}
          handleClose={handleCloseModal}
          dataInitial={DataCliente}
        />
      )}
    </div>
    //
  );
};

export default ShowClienteCards;

const theme = createTheme({
  palette: {
    secundary: {
      main: "#0EB582",
    },
  },
});
