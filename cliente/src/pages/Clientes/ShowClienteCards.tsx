import axios from "axios";
import { useState, useEffect, useRef, Suspense, lazy } from "react";
import "./clientes.css";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import AllClient from "../../data/clientes/AllClentes.tsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ClienteDo from "./ClientesDoc.tsx";
import { useAuth } from "../../components/Roles/AuthProvider.tsx";
import ClienteForm from "./ClienteForm.tsx";
import BeatLoader from "react-spinners/BeatLoader";
import PrestamosForm from "../Prestamos/PrestamosForm.tsx";
import useGeClient from "../../hooks/useGetCliente.tsx";
import { useDataPrestamos } from "../../hooks/useDataPrestamos.tsx";
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
  MapPinned,
  MapPlus,
  HandCoins,
} from "lucide-react";

import { toast, ToastContainer } from "react-toastify";
import { MisColores } from "../../components/stuff/MisColores.tsx";
import { EmptyState } from "../../components/stuff/EmptyState.tsx";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import MapCliente from "../../components/Maps/MapCliente.tsx";
import "mapbox-gl/dist/mapbox-gl.css";
import { StyleMap } from "../../components/Maps/StyleMap.tsx";
import { useEmpresa } from "../../hooks/useEmpresas.tsx";
import { InputField } from "../../components/stuff/InputField.tsx";

const ShowClienteCards = () => {
  const [clients, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [clienteDatos, setClienteData] = useState([]);
  const [isModalpopupOpen, setIsModalpopupOpen] = useState(false);
  const [idRow, setIdRow] = useState(0);
  const [modoEdicion, setModoEdicion] = useState(false);
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
  const [estiloActual, setEstiloActual] = useState(StyleMap.calles);
  const [addLocation, setAddLocation] = useState(false);
  const [selectCliente, setSelectCliente] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [coordinates, setCoordinates] = useState({ latitud: "", longitud: "" });
  const [notificaciones, setNotificaciones] = useState([]);

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

  const URIs = `${import.meta.env.VITE_API_URL}/clientes/`;
  const UrisImg = `${import.meta.env.VITE_API_URL}/uploads/clientes/avata/`;
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/clientes`;

  const prestamosInf = (id) => {
    const TotaPrestamos = DataPrestamos?.filter((c) => c.idclientes === id);
    const TotalGeneral = TotaPrestamos?.filter((c) => c.estado === "VIGENTE");
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
    // console.log(dataEmpresa)
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
    setIdRow(id);
    setModalType("docs");
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
  const filtrar = clienteDatos?.filter(
    (cliente) =>
      (cliente.nombres || '').toLowerCase().includes(search.toLowerCase()) ||
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

  const showToast = (mensaje, tipo = "success") => {
    const id = Date.now();
    setNotificaciones((prev) => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => {
      setNotificaciones((prev) => prev.filter((n) => n.id !== id));
    }, 4500);
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
    setModalType(null);
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
    if (cliente?.longitud) {
      setOpenMapa(true);
    } else {
      toast.error("No existe coordenada para este cliente");
    }
    // Abrimos el modal
  };

  const handleGetDeviceLocation = () => {
    if (!navigator.geolocation) {
      showToast(
        "Tu navegador o dispositivo no soporta la Geolocalización.",
        "danger",
      );
      return;
    }
    showToast("Capturando coordenadas satelitales...", "info");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitud: position.coords.latitude.toFixed(6),
          longitud: position.coords.longitude.toFixed(6),
        });
        showToast("¡Coordenadas GPS obtenidas con éxito!", "success");
      },
      (error) => {
        showToast(
          "Error al obtener ubicación. Asegúrate de dar permisos de GPS.",
          "warning",
        );
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const handleSaveLocation = async () => {
    if (!selectCliente) return;

    try {
      // Hacemos el fetch PUT a tu endpoint 'updateCliente'
      const response = await fetch(`${API_BASE_URL}/${selectCliente.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitud: coordinates.latitud,
          longitud: coordinates.longitud,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Si Sequelize actualizó el registro en la base de datos con éxito
        setClientes((prev) =>
          prev.map((c) => {
            if (c.id === selectCliente.id) {
              return {
                ...c,
                latitud: coordinates.latitud,
                longitud: coordinates.longitud,
              };
            }
            return c;
          }),
        );
        showToast(
          `Ubicación guardada con éxito en la base de datos para ${selectCliente.nombres} ${selectCliente.apellidos}`,
          "success",
        );
      } else {
        throw new Error(data.message || "Error al guardar en base de datos");
      }
    } catch (error) {
      // Fallback para pruebas en memoria si tu backend Express no está iniciado
      setClientes((prev) =>
        prev.map((c) => {
          if (c.id === selectCliente.id) {
            return {
              ...c,
              latitud: coordinates.latitud,
              longitud: coordinates.longitud,
            };
          }
          return c;
        }),
      );
      showToast(
        "Guardado local temporal. Asegúrate de iniciar tu servidor Node.js.",
        "warning",
      );
    } finally {
      setModalType(null);
      setSelectCliente(null);
    }
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
      <Dialog
        open={openMapa}
        onClose={() => setOpenMapa(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <div className="d-flex align-items-center justify-content-between">
            <div className="col-md-6 d-flex align-items-center">
              <div
                className="p-3 rounded-3 me-3 shadow-sm text-white d-flex align-items-center justify-center"
                style={{
                  backgroundColor: `${MisColores.headerBlue}`,
                  width: "56px",
                  height: "56px",
                }}
              >
                <Navigation size={24} />
              </div>
              <div>
                <h2
                  className="fw-bold mb-0"
                  style={{ color: "#2c3e50", fontSize: "1.2rem" }}
                >
                  {clienteSeleccionado?.nombres}{" "}
                  {clienteSeleccionado?.apellidos}
                </h2>
                <p
                  className="text-muted mb-0 small"
                  style={{ fontSize: "0.6em" }}
                >
                  {clienteSeleccionado?.direccion},{" "}
                  {clienteSeleccionado?.ciudad}
                </p>
                <p
                  className="text-muted mb-0 small"
                  style={{ fontSize: "0.6em" }}
                >
                  Nombre de Rutas :{clienteSeleccionado?.tbzona.nombrerutas}
                </p>
              </div>
            </div>

            <div
              className="btn-group on-absolute top-0 start-0 m-3"
              style={{ zIndex: 10 }}
            >
              <button
                className={`btn btn-sm ${estiloActual === StyleMap.calles ? "btn-primary" : "btn-light"}`}
                onClick={() => setEstiloActual(StyleMap.calles)}
              >
                Mapa
              </button>
              <button
                className={`btn btn-sm ${estiloActual === StyleMap.satelite ? "btn-primary" : "btn-light"}`}
                onClick={() => setEstiloActual(StyleMap.satelite)}
              >
                Satélite
              </button>
              <button
                className={`btn btn-sm ${estiloActual === StyleMap.oscuro ? "btn-primary" : "btn-light"}`}
                onClick={() => setEstiloActual(StyleMap.oscuro)}
              >
                Noche
              </button>

              <button
                className={`btn btn-sm ${estiloActual === StyleMap.Outdoors ? "btn-primary" : "btn-light"}`}
                onClick={() => setEstiloActual(StyleMap.Outdoors)}
              >
                Outdoors
              </button>

              <button
                className={`btn btn-sm ${estiloActual === StyleMap.NavigationDay ? "btn-primary" : "btn-light"}`}
                onClick={() => setEstiloActual(StyleMap.NavigationDay)}
              >
                NavigationDay
              </button>
            </div>
          </div>

          {/* Selector de Estilo (Botones sobre el mapa) */}
        </DialogTitle>

        <DialogContent dividers>
          {openMapa && clienteSeleccionado && (
            <MapCliente
              lat={parseFloat(clienteSeleccionado.latitud)}
              lng={parseFloat(clienteSeleccionado.longitud)}
              nombre={clienteSeleccionado.nombres}
              styleMap={estiloActual}
            />
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
          {/* <span className="input-group-text bg-white border-end-0">
              <Search size={16} className="text-muted" />
            </span> */}
          <InputField col="" icon={Search} label="">
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
              style={{ fontSize: "0.85rem" }}
            />

            <span className="input-group-text bg-white border-start-0 d-flex align-items-center justify-content-center">
              <X
                color="#718096"
                size={18}
                onClick={() => setSearch("")}
                style={{ cursor: "pointer" }}
              />
            </span>
          </InputField>

          <button
            className="btn text-white d-flex align-items-center gap-2 shadow-sm border-0 mt-3 mb-3 "
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
                          Ciudad / Telefono
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
                                className="rounded-circle bg-light d-flex align-items-center justify-content-center border border-2 border-white shadow-sm overflow-hidden"
                                style={{ width: "40px", height: "40px" }}
                              >
                                {cliente.imgFOTOS ? (
                                  <img
                                    src={`${UrisImg}${cliente.imgFOTOS}`}
                                    alt=""
                                    className="w-100 h-100 object-cover"
                                    style={{ display: "block" }}
                                  />
                                ) : (
                                  //  <User size={18} className="text-muted w-100" />
                                  <div className="w-100">
                                    <h6 className="mb-0  text-muted fs-6 fw-bold">
                                      {cliente.nombres.charAt(0)}
                                      {cliente.apellidos.charAt(0)}
                                    </h6>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="text-muted small">{cliente.dni}</td>
                            <td className="fw-bold text-dark small">
                              {cliente.nombres} {cliente.apellidos}
                            </td>
                            <td className="py-3 px-3">
                              <div className="small">
                                <span className="fw-bold text-secondary d-block">
                                  {cliente.ciudad || "N/A"}
                                </span>
                                <span
                                  className="text-muted d-block"
                                  style={{ fontSize: "0.75rem" }}
                                >
                                  {cliente.telefono1}
                                </span>
                              </div>
                            </td>

                            <td>
                              <div className="d-flex align-items-center fw-medium small fw-bold">
                                <MapPin size={12} className="me-1" />{" "}
                                {cliente.tbzona.nombrerutas}
                              </div>
                            </td>

                            <td className="text-center">
                              <span
                                className={`badge rounded-pill text-uppercase px-3 py-1.5 fw-bold 
                                  ${
                                    cliente.estado === "ACTIVO"
                                      ? "bg-success-subtle text-success border border-success-subtle"
                                      : "bg-danger-subtle text-danger border border-danger-subtle"
                                  }`}
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
                                  backgroundColor: MisColores.headerBlue,
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
                                <button className="btn btn-outline-primary btn-sm border-0 rounded-3 p-1 mx-1">
                                  <Link
                                    to=""
                                    className=" text-decoration-none text-reset"
                                  >
                                    {" "}
                                    <Files
                                      size={20}
                                      onClick={() => {
                                        CaptureDnI(cliente.id);
                                        setSelectCliente(cliente);
                                      }}
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
                                  className="btn btn-sm text-white px-3 py-2 shadow-sm border-0 d-flex flex-column align-items-center justify-center rounded-4"
                                  style={{
                                    backgroundColor: MisColores.rojoPastel,
                                    minWidth: "105px",
                                    lineHeight: "1.2",
                                  }}
                                  onClick={() => {
                                    setSelectCliente(cliente);
                                    setModalType("crearPedido");
                                    // HandlInserPrestamos(cliente.id)
                                  }}
                                >
                                  <PlusCircle size={12} className="mb-1" />
                                  <span
                                    style={{
                                      fontSize: "9px",
                                      fontWeight: "800",
                                    }}
                                  >
                                    CREAR SOLICITUD <br />
                                    PRÉSTAMOS
                                  </span>
                                </button>
                                <button
                                  className="btn btn-outline-primary btn-sm border-0 text-primary btn-edit-custom"
                                  onClick={() => handleVerMapa(cliente)}
                                >
                                  <MapPin size={16} />
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectCliente(cliente);
                                    setCoordinates({
                                      latitud: cliente.latitud || "",
                                      longitud: cliente.longitud || "",
                                    });
                                    setModalType("location");
                                  }}
                                  className={`btn btn-sm border-0 rounded-3 p-2 ${
                                    cliente.latitud && cliente.longitud
                                      ? "bg-success-subtle text-success"
                                      : "text-secondary hover-bg-light"
                                  }`}
                                  title="Establecer Geolocalización (Latitud/Longitud)"
                                >
                                  <MapPinned size={16} />
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

            currentClientes.map((cliente) => {
              const { resultTotal } = prestamosInf(cliente.id);

              return (
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
                          {resultTotal}
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
                        onClick={() => {
                          setSelectCliente(cliente);
                          setModalType("crearPedido");
                          // HandlInserPrestamos(cliente.id)
                        }}
                      >
                        <PlusCircle size={16} className="me-2" /> Crear Préstamo
                      </button>

                      <button
                        className="btn btn-outline-secondary border shadow-sm flex-shrink-0"
                        onClick={() => {
                          CaptureDnI(cliente.id);
                          setSelectCliente(cliente);
                        }}
                      >
                        <Files size={18} />
                      </button>

                      <button
                        className="btn btn-outline-secondary border shadow-sm flex-shrink-0"
                        onClick={() => handleVerMapa(cliente)}
                      >
                        <MapPin size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <EmptyState
          title="Sin Clientes registradas en este listado aún."
          subtitle="En cuanto se cree una nueva cliente, aparecerá aquí."
        />
      )}
      {currentClientes.length > 0 && (
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
      )}
      ;
      {/* ================= MODALES DEL SISTEMA (Estilizados con Bootstrap) ================= */}
      {modalType && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{
            backgroundColor: "rgba(33, 37, 41, 0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 1060,
          }}
        >
          {modalType === "docs" &&
            selectCliente &&
            (console.log(selectCliente, "selectCliente en modal") || (
              <ClienteDo
                Id={idRow}
                open={true}
                handleClose={() => setModalType(null)}
                dataInitial={selectCliente}
              />
            ))}

          {modalType === "crearPedido" && selectCliente && (
            <div
              className="card shadow-lg border-0 w-100 animate-in fade-in zoom-in-95 w-100"
              style={{ maxWidth: "1000px", borderRadius: "16px" }}
            >
              <div className="card-header">
                <div className="card-header border-bottom bg-white p-4 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="p-2 rounded-3 text-white d-flex align-items-center justify-content-center shadow-sm"
                      style={{
                        backgroundColor: MisColores.headerBlue,
                        width: "45px",
                        height: "45px",
                      }}
                    >
                      <HandCoins size={20} />
                    </div>
                    <div>
                      <h2
                        className="fw-bold mb-0"
                        style={{ color: "#2c3e50", fontSize: "1.5rem" }}
                      >
                        Nuevo Préstamo
                      </h2>
                      <p className="text-muted mb-0 small">
                        Finance Cactus - Gestión de Cartera
                      </p>
                    </div>
                  </div>
                  <button
                    className="btn btn-light rounded-circle p-2 text-secondary hover:bg-danger hover:text-white transition-all"
                    onClick={() => setModalType(null)}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <PrestamosForm
                ModoEdicion={false}
                idCliente={selectCliente.id}
                open={true}
                handleClose={HandleModalPrestamoClose}
              />
            </div>
          )}

          {/* MODAL: ESTABLECER UBICACIÓN GEOGRÁFICA */}
          {modalType === "location" && selectCliente && (
            <div
              className="card shadow-lg border-0 w-100 animate-in fade-in zoom-in-95"
              style={{ maxWidth: "420px", borderRadius: "16px" }}
            >
              <div
                className="card-header bg-dark text-white p-4 border-0 d-flex align-items-center justify-content-between"
                style={{ borderRadius: "16px 16px 0 0" }}
              >
                <div>
                  <h3 className="h6 fw-bold m-0">Ubicación de Cobro GPS</h3>
                  <p className="small text-success-subtle m-0 mt-1">
                    Cliente: {selectCliente.nombres} {selectCliente.apellidos}
                  </p>
                </div>
                <button
                  onClick={() => setModalType(null)}
                  className="btn-close btn-close-white border-0"
                ></button>
              </div>

              <div className="card-body p-4">
                {/* Botón Inteligente para capturar la ubicación real */}
                <button
                  type="button"
                  onClick={handleGetDeviceLocation}
                  className="btn btn-light border-secondary-subtle text-dark fw-bold w-full p-2.5 mb-3 rounded-3 d-flex align-items-center justify-content-center gap-2"
                  style={{ fontSize: "0.82rem", width: "100%" }}
                >
                  <MapPlus size={18} color={MisColores.rojoPastel} />
                  OBTENER MI UBICACIÓN ACTUAL (GPS)
                </button>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label
                      className="text-uppercase text-muted fw-bold small mb-1"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Latitud
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. 18.4523"
                      value={coordinates.latitud}
                      onChange={(e) =>
                        setCoordinates({
                          ...coordinates,
                          latitud: e.target.value,
                        })
                      }
                      className="form-control fw-bold bg-light"
                    />
                  </div>
                  <div className="col-6">
                    <label
                      className="text-uppercase text-muted fw-bold small mb-1"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Longitud
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. -70.7324"
                      value={coordinates.longitud}
                      onChange={(e) =>
                        setCoordinates({
                          ...coordinates,
                          longitud: e.target.value,
                        })
                      }
                      className="form-control fw-bold bg-light"
                    />
                  </div>
                </div>

                {/* Previsualización en Google Maps si existen coordenadas */}
                {coordinates.latitud && coordinates.longitud && (
                  <div className="bg-success-subtle border border-success-subtle p-3 rounded-3 text-center">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${coordinates.latitud},${coordinates.longitud}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="small fw-bold text-success text-decoration-none d-inline-flex align-items-center gap-2"
                    >
                      <i className="bi bi-box-arrow-up-right"></i>
                      Ver punto exacto en Google Maps
                    </a>
                  </div>
                )}
              </div>

              <div
                className="card-footer bg-light p-3 border-top-0 d-flex justify-content-end gap-2"
                style={{ borderRadius: "0 0 16px 16px" }}
              >
                <button
                  onClick={() => setModalType(null)}
                  className="btn btn-outline-secondary border-0 fw-semibold px-4 rounded-3"
                  style={{ fontSize: "0.9em" }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveLocation}
                  className="btn fw-semibold px-4 rounded-3 text-white"
                  style={{
                    backgroundColor: MisColores.headerBlue,
                    fontSize: "0.9em",
                  }}
                >
                  Guardar Ubicación
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* ================= TOASTS DE ACCIÓN ================= */}
      <div
        className="position-fixed top-0 end-0 p-4"
        style={{
          zIndex: 1080,
          maxWidth: "350px",
          width: "100%",
          pointerEvents: "none",
        }}
      >
        {notificaciones.map((toast) => {
          const config = {
            success: {
              bg: "rgba(209, 250, 229, 0.9)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              text: "#065f46",
              icon: "bi-check-circle-fill",
            },
            danger: {
              bg: "rgba(254, 226, 226, 0.9)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              text: "#991b1b",
              icon: "bi-x-circle-fill",
            },
            warning: {
              bg: "rgba(254, 243, 199, 0.9)",
              border: "1px solid rgba(245, 158, 11, 0.2)",
              text: "#92400e",
              icon: "bi-exclamation-triangle-fill",
            },
            info: {
              bg: "rgba(219, 234, 254, 0.9)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              text: "#1e40af",
              icon: "bi-info-circle-fill",
            },
          };
          const style = config[toast.tipo] || config.success;

          return (
            <div
              key={toast.id}
              className="toast show d-flex align-items-center p-3 border-0 shadow mb-3 pointer-events-auto"
              role="alert"
              style={{
                background: style.bg,
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                color: style.text,
                border: style.border,
                borderRadius: "12px",
              }}
            >
              <i className={`bi ${style.icon} me-2 fs-5`}></i>
              <div className="toast-body p-0 flex-grow-1 small fw-bold">
                {toast.mensaje}
              </div>
              <button
                type="button"
                onClick={() =>
                  setNotificaciones((prev) =>
                    prev.filter((n) => n.id !== toast.id),
                  )
                }
                className="btn-close ms-auto"
                style={{ filter: "contrast(0.5)" }}
              ></button>
            </div>
          );
        })}
      </div>
    </div>
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
