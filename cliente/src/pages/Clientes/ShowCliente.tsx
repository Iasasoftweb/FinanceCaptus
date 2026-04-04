import * as React from "react";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import "./clientes.css";
import TitleTop from "../../components/TitleTop/TItleTop";
import { LuUsers } from "react-icons/lu";
import { AiOutlineCamera, AiOutlineDelete } from "react-icons/ai";
import Table from "react-bootstrap/Table";
import { CiEdit } from "react-icons/ci";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { TbRefresh } from "react-icons/tb";
import { IoIosSearch } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import AllClient from "../../data/clientes/AllClentes.tsx";
import { Avatar, Pagination, Button } from "@mui/material";
import PaginationItem from "../../components/Pagination/PaginatedItems.tsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Modalpopup from "../../components/Modalpopup/Modalpopup.tsx";
import ClienteDo from "./ClientesDoc.tsx";
import { LiaFileUploadSolid } from "react-icons/lia";
import { useAuth } from "../../components/Roles/AuthProvider.tsx";
import { FaRoute } from "react-icons/fa";
import { TfiPrinter } from "react-icons/tfi";
import { VscGoToSearch } from "react-icons/vsc";
import ListadoClientes from "./Printer/ListadoClientes.tsx";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";

const ShowClientes = () => {
  const [clients, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [clienteDatos, setClienteData] = useState([]);
  const [isModalpopupOpen, setIsModalpopupOpen] = useState(false);
  const [idCliente, setClienteID] = useState(0);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [tipoModal, setTipoModal] = useState(true);
  const [isModalDoc, setIsModalDoc] = useState(false);
  const [dataDoc, setDataDoc] = useState([]);
  const [reload, setReload] = useState(false);
  const [isPrintListado, setIsPrintListado] = useState(false);
  const [Estado, setEstado] = useState("1");

  const PER_PAGE = 8;
  const countpage = Math.ceil(clienteDatos.length / PER_PAGE);
  const _DATA = PaginationItem(clients, PER_PAGE);

  const navigate = useNavigate();

  const handlePageChance = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  const URIs = "http://localhost:5000/clientes/";
  const UrisImg = "http://localhost:5000/uploads/";

  useEffect(() => {
    setModoEdicion(modoEdicion);
  }, [modoEdicion]);

  const FormInsert = () => {
    navigate("/Clientes/Create/");
  };

  const datosCliente = () => {
    try {
      setTimeout(() => {
        AllClient().then((allClientes) => {
          setClientes(allClientes);
          setClienteData(allClientes);
          setTotalItems(allClientes.length);
          setIsLoading(false);
          console.log(allClientes);
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

  const CaptureDnI = (rowData) => {
    setClienteID(rowData.id);
    setTipoModal(true);
    setIsModalDoc(true);
    setDataDoc(rowData);
  };

  const handleCloseModal = () => {
    setIsModalDoc(false);
  };

  const CapturaPhoto = (id) => {
    setClienteID(id);
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
  };
  const { role } = useAuth();
  const handlePrint = () => {
    localStorage.setItem("estadoCliente", Estado);
    navigate("/printer/Container");
  };

  return (
    <div>
      <TitleTop
        titulos={"Clientes"}
        subtitulos={"Manenimiento de Clientes"}
        btnVisible={false}
        btnLabel={"Refrescar"}
        visibleEstado={false}
        estado="Show"
        icon={
          <LuUsers
            className="border-1 rounded-circle p-2 text-info"
            style={{ fontSize: 50 }}
          />
        }
      />

      <br />

      <main className="shadow-sm">
        <div className="row bg-light ">
          <div className="col-md-12 col-sm-12">
            <br />
            <div
              className=" d-flex justify-content-between w-100 mb-2"
              style={{ backgroundColor: "gainsboro" }}
            >
              <div className="m-2 d-flex align-content-center">
                <div className="d-flex p-3">
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
                </div>

                <div className="mx-1 p-3">
                  <button
                    className="clFont p-2 d-flex align-items-center"
                    onClick={ShowClients}
                  >
                    <TbRefresh className="me-2 fs-5" />
                    Refresh
                  </button>
                </div>
                <div className="p-3">
                  <div
                    className="btn btn-success clFont p-2 d-flex align-items-center"
                    onClick={handlePrint}
                  >
                    <TfiPrinter className="me-2" /> Imprimir Reporte{" "}
                  </div>
                </div>

                <div className="p-3">
                  <PDFDownloadLink
                    document={<ListadoClientes />}
                    fileName="Listdo_Clintes_Activos.pdf"
                  >
                    <div
                      className="btn btn- clFont p-2 d-flex align-items-center"
                      // onClick={handlePrint}
                      //style={{backgroundColor:"#1e90ff"}}
                    >
                      <TfiPrinter className="me-2" /> Descargar Reporte{" "}
                    </div>
                  </PDFDownloadLink>
                </div>
              </div>

              <div className="d-flex justify-content-center align-items-center">
                {role === "ADMINISTRADOR" || role === "SUPERVISOR" ? (
                  <AiOutlinePlus
                    className="text-white  rounded-circle p-1 m-3 shadow"
                    style={{
                      fontSize: "3rem",
                      backgroundColor: "lightcoral",
                      cursor: "pointer",
                    }}
                    onClick={() => FormInsert()}
                  />
                ) : (
                  <AiOutlinePlus
                    className="text-secundary  rounded-circle p-1 m-3 shadow"
                    style={{ fontSize: "3rem", backgroundColor: "GrayText" }}
                  />
                )}
              </div>
            </div>

            {isLoading ? (
              <h6 className=" text-black-50 text-center hv-100">Cargando...</h6>
            ) : (
              <div>
                <Table striped bordered hover>
                  <thead>
                    <tr className="clFont text-center ">
                      <th className="clFont" style={{ width: 50 }}>
                        Id
                      </th>
                      <th className="clFont text-center">
                        {" "}
                        <AiOutlineCamera className="fs-5" />{" "}
                      </th>
                      <th className="clFont" style={{ width: 125 }}>
                        Dni
                      </th>
                      <th className="clFont">Nombres</th>
                      <th className="clFont">Sector</th>
                      <th className="clFont" style={{ width: 115 }}>
                        Telefonos
                      </th>
                      <th className="clFont">Nombre de Ruta</th>
                      <th className="clFont">Estado</th>
                      <th className="clFont text-wrap ">Prestamos Activos</th>

                      <th className="clFont" style={{ width: 100 }}>
                        Documentos
                      </th>
                      <th className="clFont">Prestamos</th>
                      <th className="clFont">Accion</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {_DATA.currentData().map((item) => (
                      <tr key={item.id}>
                        <td className="clFont align-middle">{item.id}</td>
                        <td className="clFont align-middle justify-content-center" width={50}>
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
                          {item.nombres} <br />
                          {item.apellidos}
                          <br />
                          <span className="fw-bold">Apodo : </span>
                          <span>{item.apodo}</span>
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
                        <td className="clFont align-middle">
                          {item.estado === 1 ? (
                            <p
                              className="rounded-1 text-center w-100 shadow text-white p-1"
                              style={{ backgroundColor: "lightcoral" }}
                            >
                              {" "}
                              Activo
                            </p>
                          ) : (
                            <p
                              className="text-white rounded-1 text-center shadow p-1"
                              style={{ backgroundColor: "slategray" }}
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
                          <p
                            className="text-white rounded-1 text-center w-100 shadow p-1"
                            style={{ backgroundColor: "cornflowerblue" }}
                          >
                            1
                          </p>
                        </td>

                        <td className="text-center align-middle">
                          {role === "ADMINISTRADOR" ||
                          role === "OPERADOR" ||
                          role === "SUPERVISOR" ? (
                            <Link to="">
                              <LiaFileUploadSolid
                                className="me-3 text-primary fs-3"
                                onClick={() => CaptureDnI(item)}
                              />
                            </Link>
                          ) : (
                            <LiaFileUploadSolid
                              className="me-3 fs-3"
                              style={{ color: "GrayText", cursor: "pointer" }}
                            />
                          )}
                        </td>
                        <td
                          className="clFont text-center align-middle"
                          style={{ width: "150px" }}
                        >
                          {" "}
                          <p
                            className="text-center text-white p-1 rounded-3"
                            style={{ backgroundColor: "cornflowerblue" }}
                          >
                            <VscGoToSearch className="fs-5" /> Consultar
                          </p>{" "}
                        </td>

                        <td className="text-center align-middle">
                          {role === "ADMINISTRADOR" ? (
                            <Link to="">
                              <AiOutlineDelete
                                className="text-danger me-4 fs-4"
                                onClick={() => deleteClientes(item.id)}
                              />
                            </Link>
                          ) : (
                            <AiOutlineDelete
                              className="me-4 fs-4"
                              style={{ color: "GrayText" }}
                            />
                          )}

                          {role === "ADMINISTRADOR" ? (
                            <Link
                              key={item.id}
                              to={`/clientes/edit/${item.id}`}
                            >
                              <CiEdit className="text-primary fs-4" />

                              {isModalpopupOpen && (
                                <Modalpopup
                                  closeModal={closeModalpopup}
                                  ModoEdicion={modoEdicion}
                                  id={idCliente}
                                  tipo={tipoModal}
                                  //    onSave={handleRoload}
                                />
                              )}
                            </Link>
                          ) : (
                            <CiEdit
                              className="fs-5"
                              style={{ color: "GrayText" }}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

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
          Id={idCliente}
          open={isModalDoc}
          handleClose={handleCloseModal}
          dataInitial={dataDoc}
        />
      )}
    </div>
    //
  );
};

export default ShowClientes;

const theme = createTheme({
  palette: {
    secundary: {
      main: "#0EB582",
    },
  },
});
