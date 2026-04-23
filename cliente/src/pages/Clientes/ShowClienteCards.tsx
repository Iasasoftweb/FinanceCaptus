import axios from "axios";
import { useState, useEffect, useRef, Suspense, lazy } from "react";
import "./clientes.css";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import AllClient from "../../data/clientes/AllClentes.tsx";
import PaginationItem from "../../components/Pagination/PaginatedItems.tsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ClienteDo from "./ClientesDoc.tsx";
import { useAuth } from "../../components/Roles/AuthProvider.tsx";

import ClienteForm from "./ClienteForm.tsx";

import BeatLoader from "react-spinners/BeatLoader";
import PrestamosForm from "../Prestamos/PrestamosForm.tsx";
import useGeClient from "../../hooks/useGetCliente.tsx";
import useDataPrestamos from "../../hooks/useDataPrestamos.tsx";
import {
  Search,
  RefreshCcw,
  Printer,
  Download,
  LayoutGrid,
  List,
  Plus,
  Trash2,
  Edit3,
  Phone,
  MapPin,
  Wallet,
  User,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Files,
  X,
  Navigation,
} from "lucide-react";

import { toast, ToastContainer } from "react-toastify";
import { MisColores } from "../../components/stuff/MisColores.tsx";
import { EmptyState } from "../../components/stuff/EmptyState.tsx";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

// Componente para re-centrar el mapa cuando cambian las coordenadas
function RecenterMap({ lat, lng }) {
  const map = useMap();
  map.setView([lat, lng], 15);
  return null;
}

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
  const { DataCliente } = useGeClient(idRow);
  const [viewMode, setViewMode] = useState("list");

  const [openMapa, setOpenMapa] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const { DataPrestamos } = useDataPrestamos();
  const open = Boolean(anchorEl);

  //Estado de Paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleClickMenu = (event, ClientID) => {
    setAnchorEl(event.currentTarget);
    setIdClient(ClientID);
  };

  const MapClienteLazy = lazy(
    () => import("../../components/Maps/MapCliente.tsx"),
  );

  const navigate = useNavigate();

  const handleRol = () => {
    toast.warning("Esta opcion no esta habilitado en tu perfil");
  };

  const URIs = "http://localhost:5000/clientes/";
  const UrisImg = "http://localhost:5000/uploads/clientes/avata/";

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
        (AllClient().then((allClientes) => {
          setClientes(allClientes);
          setClienteData(allClientes);
          setTotalItems(allClientes.length);
          setIsLoading(false);
        }),
          10000);
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

  // Lógica de Filtrado por búsqueda
  const filtrar = clienteDatos.filter(
    (cliente) =>
      cliente.nombres.toLowerCase().includes(search.toLowerCase()) ||
      cliente.dni.includes(search),
  );

  // Lógica de Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClientes = filtrar.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtrar.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const deleteClientes = async (id) => {
    if (role === "ADMINISTRADOR") {
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
    } else {
      handleRol();
    }
  };

  const { role } = useAuth();

  const handleEdit = (id) => {
    if (role === "ADMINISTRADOR") {
      setIsModalOpen(true);
      setIsModalEdit(true);
      setIsCurrentClient(id);
    } else {
      handleRol();
    }
  };

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

  const handleVerMapa = (cliente) => {
    setClienteSeleccionado(cliente); // Guardamos el objeto completo del cliente
    setOpenMapa(true); // Abrimos el modal
  };

  return (
    <div
      className="container-fluid min-vh-100 p-4"
      style={{ backgroundColor: MisColores.bgGray }}
    >
      {isModalOpen && (
        <ClienteForm
          ModoEdicion={isModalEdit}
          idCliente={isCurrentClient}
          open={true}
          handleClose={HandleMenuClose}
          updateList={datosCliente}
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

      <Dialog
        open={openMapa}
        onClose={() => setOpenMapa(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="fw-bold">Ubicación del Cliente</DialogTitle>
        <DialogContent dividers>
          {/* 2. El Suspense evita que el error detenga el renderizado del Modal */}
          {openMapa && clienteSeleccionado && (
            <Suspense
              fallback={<div className="text-center p-5">Cargando Mapa...</div>}
            >
              <MapClienteLazy
                lat={clienteSeleccionado.latitud}
                lng={clienteSeleccionado.longitud}
                nombre={clienteSeleccionado.nombres}
              />
            </Suspense>
          )}
        </DialogContent>
      </Dialog>

      <div className="row align-items-center mb-4">
        <div className="col-md-6 d-flex align-items-center">
          <div
            className="p-3 rounded-3 me-3 shadow-sm text-white d-flex align-items-center justify-center"
            style={{
              backgroundColor: `${MisColores.headerBlue}`,
              width: "56px",
              height: "56px",
            }}
          >
            <User size={24} />
          </div>
          <div>
            <h2
              className="fw-bold mb-0"
              style={{ color: "#2c3e50", fontSize: "1.5rem" }}
            >
              Clientes
            </h2>
            <p className="text-muted mb-0 small">
              Mantenimiento y Gestión de Cartera
            </p>
          </div>
        </div>
        <div className="col-md-6 d-flex justify-content-md-end mt-3 mt-md-0 gap-2">
          <div className="input-group shadow-sm" style={{ maxWidth: "300px" }}>
            <span className="input-group-text bg-white border-end-0">
              <Search size={16} className="text-muted" />
            </span>
            <input
              id="search"
              type="text"
              className="form-control border-start-0 shadow-none"
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // Reiniciar a página 1 al buscar
              }}
            />
          </div>
          <button
            className="btn text-white d-flex align-items-center gap-2 shadow-sm border-0 "
            style={{ backgroundColor: MisColores.buscarOrange }}
            onClick={ShowClients}
          >
            <RefreshCcw size={18} />
            <span className="d-none d-sm-inline font-weight-bold">Refresh</span>
          </button>
        </div>
      </div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div className="d-flex gap-2">
          <button
            className="btn text-white d-flex align-items-center gap-2 shadow-sm fw-medium px-3 mx-3 border-0"
            style={{
              backgroundColor: MisColores.headerBlue,
              borderColor: MisColores.headerBlue,
            }}
          >
            <Printer size={16} /> Imprimir Reporte
          </button>
          <button
            className="btn text-white d-flex align-items-center gap-2 shadow-sm fw-medium px-3 border-0"
            style={{
              backgroundColor: MisColores.teal,
              borderColor: MisColores.teal,
            }}
          >
            <Download size={16} /> Descargar Reporte
          </button>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="btn-group bg-white p-1 rounded shadow-sm border">
            <button
              className={`btn btn-sm ${viewMode === "list" ? "btn-secondary" : "btn-white text-muted border-0"}`}
              onClick={() => setViewMode("list")}
            >
              <List size={20} />
            </button>
            <button
              className={`btn btn-sm ${viewMode === "grid" ? "btn-secondary" : "btn-white text-muted border-0"}`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid size={20} />
            </button>
          </div>

          <button
            className="btn rounded-circle shadow-lg text-white d-flex align-items-center justify-center border-0 "
            style={{
              backgroundColor: MisColores.actionRed,
              width: "48px",
              height: "48px",
            }}
          >
            <Plus size={24} onClick={FormInsert} />
          </button>
        </div>
      </div>
      {currentClientes.length > 0 ? (
        <div className="row g-4 mb-5">
          {viewMode === "list" ? (
            <div className="col-12">
              <div className="card border-0 shadow-sm rounded-3 overflow-hidden w-100">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead style={{ backgroundColor: "#f1f4f6" }}>
                      <tr className="border-bottom text-uppercase">
                        <th className="text-center py-3 text-secondary small fw-bold">
                          Foto
                        </th>
                        <th className="py-3 text-secondary small fw-bold">
                          Dni
                        </th>
                        <th className="py-3 text-secondary small fw-bold">
                          Nombres
                        </th>
                        <th className="py-3 text-secondary small fw-bold">
                          Ciudad
                        </th>
                        <th className="py-3 text-secondary small fw-bold">
                          Teléfonos
                        </th>
                        <th className="py-3 text-secondary small fw-bold">
                          Ruta
                        </th>

                        <th className="text-center py-3 text-secondary small fw-bold">
                          Estado
                        </th>
                        <th className="text-center py-3 text-secondary small fw-bold">
                          Préstamos
                        </th>
                        <th className="text-center py-3 text-secondary small fw-bold">
                          Docs
                        </th>
                        <th className="text-center py-3 text-secondary small fw-bold">
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {currentClientes.map((cliente) => {
                        const { resultTotal } = prestamosInf(cliente.id);
                        return (
                          <tr key={cliente.id} className="border-bottom">
                            <td className="text-center">
                              <div
                                className="rounded-circle bg-light d-inline-flex align-items-center justify-center border border-2 border-white shadow-sm"
                                style={{ width: "40px", height: "40px" }}
                              >
                                {cliente.imgFOTOS ? (
                                  <img
                                    src={`${UrisImg}${cliente.imgFOTOS}`}
                                    alt=""
                                    style={{ width: "40px", height: "40px" }}
                                  />
                                ) : (
                                  //  <User size={18} className="text-muted w-100" />
                                  <div className="w-100">
                                    <h5 className="mb-0  text-muted fs-6">
                                      {cliente.nombres.charAt(0)}
                                      {cliente.apellidos.charAt(0)}
                                    </h5>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="text-muted small">{cliente.dni}</td>
                            <td className="fw-bold text-dark small">
                              {cliente.nombres} {cliente.apellidos}
                            </td>
                            <td className="text-muted small">
                              {cliente.ciudad}
                            </td>
                            <td className="text-muted small">
                              {cliente.telefono1}
                            </td>
                            <td>
                              <div className="d-flex align-items-center text-primary fw-medium small">
                                <MapPin size={12} className="me-1" />{" "}
                                {cliente.tbzona.nombrerutas}
                              </div>
                            </td>

                            <td className="text-center">
                              <span
                                className="badge rounded-1 px-3 py-2 fw-bold shadow-sm text-white"
                                style={{
                                  backgroundColor:
                                    cliente.estado === "ACTIVO"
                                      ? MisColores.teal
                                      : "#95a5a6",
                                  fontSize: "9px",
                                }}
                              >
                                {cliente.estado.toUpperCase()}
                              </span>
                            </td>
                            <td className="text-center align-middle">
                              <span
                                className="badge rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  backgroundColor: MisColores.lightTeal,
                                  fontSize: "11px",
                                  lineHeight: "1", // Ayuda a que el texto no se desplace hacia abajo
                                  padding: "0", // Elimina paddings internos que puedan empujar el número
                                }}
                              >
                                {resultTotal}
                              </span>
                            </td>
                            <td className="text-center">
                              {role === "ADMINISTRADOR" ||
                              role === "OPERADOR" ||
                              role === "SUPERVISOR" ? (
                                <button className="btn btn-outline-secondary btn-sm border-0 text-success btn-edit-custom">
                                  <Link
                                    to=""
                                    className=" text-decoration-none text-reset"
                                  >
                                    {" "}
                                    <Files
                                      size={20}
                                      onClick={() => CaptureDnI(cliente.id)}
                                    />{" "}
                                  </Link>
                                </button>
                              ) : (
                                <button
                                  className="btn btn-outline-secondary btn-sm border-0 text-secondary text-muted btn-edit-custom"
                                  onClick={handleRol}
                                >
                                  <Files size={18} />{" "}
                                </button>
                              )}
                            </td>
                            <td className="text-center">
                              <div className="d-flex justify-content-center gap-2">
                                <button
                                  className="btn btn-sm text-white px-3 py-2 shadow-sm border-0 d-flex flex-column align-items-center justify-center"
                                  style={{
                                    backgroundColor: MisColores.actionRed,
                                    minWidth: "105px",
                                    lineHeight: "1.2",
                                  }}
                                  onClick={() =>
                                    HandlInserPrestamos(cliente.id)
                                  }
                                >
                                  <PlusCircle size={12} className="mb-1" />
                                  <span
                                    style={{
                                      fontSize: "9px",
                                      fontWeight: "800",
                                    }}
                                  >
                                    CREAR PRÉSTAMOS
                                  </span>
                                </button>
                                <button
                                  className="btn btn-outline-secondary btn-sm border-0 text-info btn-edit-custom"
                                  onClick={() => handleVerMapa(cliente)}
                                >
                                  <MapPin size={20} />
                                </button>
                                <button
                                  className="btn btn-outline-secondary border-0 p-2 btn-edit-custom"
                                  onClick={() => handleEdit(cliente.id)}
                                >
                                  <Edit3
                                    size={16}
                                    style={{ color: MisColores.teal }}
                                  />
                                </button>
                                <button
                                  className="btn btn-outline-danger border-0 p-2 btn-edit-custom"
                                  onClick={() => deleteClientes(cliente.id)}
                                >
                                  <Trash2
                                    size={16}
                                    style={{ color: MisColores.actionRed }}
                                  />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            // Vista de Cards */

            currentClientes.map((cliente) => (
              <div key={cliente.id} className="col-12 col-md-6 col-xl-3 mb-4">
                <div
                  className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden border-top border-4"
                  style={{ borderTopColor: MisColores.headerBlue }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-3 p-3 me-3 text-white shadow-sm d-flex align-items-center justify-center"
                          style={{
                            width: "48px",
                            height: "48px",
                            backgroundColor: MisColores.headerBlue,
                          }}
                        >
                          <h5 className="mb-0 fw-bold">
                            {cliente.nombres.charAt(0)}
                          </h5>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0 text-dark">
                            {cliente.nombres} {cliente.apellidos}
                          </h6>
                          <small className="text-muted">{cliente.dni}</small>
                        </div>
                      </div>
                      <span
                        className="badge rounded-pill fw-bold text-center p-2"
                        style={{
                          backgroundColor: MisColores.teal,
                          fontSize: "9px",
                        }}
                      >
                        {cliente.estado}
                      </span>
                    </div>

                    <div className="mb-4 pt-2">
                      <div className="d-flex align-items-center text-muted mb-2 small">
                        <Phone size={14} className="me-2 text-primary" />{" "}
                        {cliente.telefono1}
                      </div>
                      <div className="d-flex align-items-center text-muted small">
                        <MapPin size={14} className="me-2 text-primary" />{" "}
                        {cliente.tbzona.nombrerutas} • {cliente.sector}
                      </div>
                    </div>

                    <div
                      className="d-flex justify-content-between align-items-center p-3 rounded-3"
                      style={{ backgroundColor: "#f0f4f8" }}
                    >
                      <div className="small fw-medium text-secondary">
                        <Wallet size={16} className="me-2" />
                        Préstamos Activos
                      </div>
                      <span
                        className="badge rounded-pill px-3 py-2 shadow-sm"
                        style={{ backgroundColor: MisColores.lightTeal }}
                      >
                        1 {/* {resultTotal} */}
                      </span>
                    </div>
                  </div>
                  <div className="card-footer bg-white border-0 p-3 d-flex gap-2">
                    <button
                      className="btn text-white w-100 fw-bold shadow-sm py-2 d-flex align-items-center justify-content-center"
                      style={{
                        backgroundColor: MisColores.actionRed,
                        fontSize: "11px", // Bajamos un punto para asegurar que el texto no rompa
                        whiteSpace: "nowrap", // Evita que el texto salte de línea
                      }}
                    >
                      <PlusCircle size={16} className="me-2" /> Crear Préstamo
                    </button>

                    <button
                      className="btn btn-outline-secondary border shadow-sm flex-shrink-0"
                      onClick={handleRol}
                    >
                      <Files size={18} />
                    </button>

                    <button className="btn btn-outline-secondary border shadow-sm flex-shrink-0">
                      <MapPin size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          <div
            className=" d-flex justify-content-between w-100  rounded-5"
            style={{ backgroundColor: "" }}
          >
            <div className="m-2 d-flex align-content-center">
              {/* <div className="p-1">
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
                      </div> */}
            </div>

            {/* <div className="d-flex justify-content-center align-items-center">
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
          </div> */}
          </div>
          {/* {isLoading ? (
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
                          onClick={(event) => handleClickMenu(event, items.id)}
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
                      <th className="clFont text-center"> FOTO</th>
                      <th className="clFont text-center" style={{ width: 125 }}>
                        DNI
                      </th>
                      <th className="clFont text-center">NOMBRES</th>
                      <th className="clFont text-center" style={{ width: 125 }}>
                        SECTOR
                      </th>
                      <th className="clFont text-center" style={{ width: 115 }}>
                        TELÉFONOS
                      </th>
                      <th className="clFont text-center">Nombre de Ruta</th>
                      <th className="clFont text-center" style={{ width: 115 }}>
                        ESTADO
                      </th>
                      <th className="clFont text-center ">PRÉSTAMOS</th>

                      <th className="clFont text-center" style={{ width: 100 }}>
                        DOCUMENTOS
                      </th>
                      <th
                        className="clFont text-center"
                        style={{ width: 140 }}
                      ></th>
                      <th className="clFont text-center">ACCIÓN</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {currentClientes.map((item) => {
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
                          <td className="clFont align-middle">{item.dni}</td>
                          <td
                            className="clFont align-middle"
                            style={{ width: "200px" }}
                          >
                            {item.nombres} {item.apellidos}
                          </td>

                          <td className="clFont align-middle">{item.ciudad}</td>
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
                              <GiTakeMyMoney className="fs-5" /> Crear Prestamos
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
        )} */}
        </div>
      ) : (
        <EmptyState
          title="Sin Clientes registradas en este listado aún."
          subtitle="En cuanto se cree una nueva cliente, aparecerá aquí."
        />
      )}

      {currentClientes.length > 0 ? (
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center bg-white p-3 rounded-3 shadow-sm mt-4 border">
          <div className="text-muted small mb-3 mb-sm-0">
            Mostrando registros del <b>{indexOfFirstItem + 1}</b> al{" "}
            <b>{Math.min(indexOfLastItem, filtrar.length)}</b> de un total de{" "}
            <b>{filtrar.length}</b>
          </div>

          <nav aria-label="Page navigation">
            <ul className="pagination pagination-sm mb-0 gap-1">
              {/* Botón Anterior */}
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link border-0 bg-light text-muted rounded shadow-sm d-flex align-items-center justify-content-center"
                  onClick={() => paginate(currentPage - 1)}
                  style={{ width: "32px", height: "32px" }}
                >
                  <ChevronLeft size={16} />
                </button>
              </li>

              {/* Números de página */}
              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                >
                  <button
                    className={`page-link border-0 rounded shadow-sm fw-bold d-flex align-items-center justify-content-center ${currentPage === index + 1 ? "text-white" : "text-muted bg-white"}`}
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor:
                        currentPage === index + 1 ? MisColores.headerBlue : "",
                    }}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              {/* Botón Siguiente */}
              <li
                className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
              >
                <button
                  className="page-link border-0 bg-light text-muted rounded shadow-sm d-flex align-items-center justify-content-center"
                  onClick={() => paginate(currentPage + 1)}
                  style={{ width: "32px", height: "32px" }}
                >
                  <ChevronRight size={16} />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      ) : (
        <></>
      )}

      {isModalDoc && (
        <ClienteDo
          Id={idRow}
          open={isModalDoc}
          handleClose={handleCloseModal}
          dataInitial={DataCliente}
        />
      )}

      <ToastContainer />
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
