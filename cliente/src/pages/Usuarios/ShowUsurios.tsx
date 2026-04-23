import React, { useEffect, useState } from "react";
import TitleTop from "../../components/TitleTop/TItleTop";
import { TbUsers } from "react-icons/tb";
import { Allusuarios } from "../../data/usuarios/usuariosData";
import { LuKeyRound } from "react-icons/lu";
import Form from "react-bootstrap/Form";
import { InputGroup } from "react-bootstrap";
import { IoIosSearch } from "react-icons/io";
import { TbRefresh } from "react-icons/tb";

import {
  Avatar,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";

import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";
import PaginationItem from "../../components/Pagination/PaginatedItems.tsx";
import ModalUsuario from "./ModalUsuario.tsx";
import {
  AiOutlineDelete,
  AiOutlinePlus,
  AiOutlineUserDelete,
} from "react-icons/ai";
import DisableUser from "./DisableUser.tsx";
import Updatepass from "./UpdatepassUser.tsx";
import { MisColores } from "../../components/stuff/MisColores.tsx";
import {
  Ban,
  Building,
  Check,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  Search,
  X,
} from "lucide-react";
import { CiEdit } from "react-icons/ci";
import { EmptyState } from "../../components/stuff/EmptyState.tsx";

function ShowUsuarios() {
  const [getUsuarios, setGetUsuarios] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idUsuario, setIdUsuario] = useState(0);
  const [getUser, setGetUser] = useState([]);
  const [search, setSearch] = useState("");
  const [dataUser, setDataUser] = useState([]);
  const [isModalEstado, setIsModalEstado] = useState(false);
  const [isModalPass, setIsModalPass] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [reload, setReload] = useState(false);

  const UriImg = "http://localhost:5000/uploadusers/";

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  //   _DATA.jump(ne

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filtrar = dataUser.filter(
    (items) =>
      items.usuario.toLowerCase().includes(search.toLowerCase()) ||
      items.nombreusuario.toLowerCase().includes(search.toLowerCase()),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsuarios = filtrar.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtrar.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getData = async () => {
    try {
      Allusuarios().then((allusuarios) => {
        setGetUsuarios(allusuarios);
        setDataUser(allusuarios);
        console.log(allusuarios);
      });
    } catch (error) {
      console.error("Error de Coneccion", error);
    }
  };

  // const actualizarUsuarios = (UsuariosActualizado) => {
  //   setUsuarios((user) =>
  //     getData.map((user) =>
  //       user.id === UsuariosActualizado.id ? UsuariosActualizado : user
  //     )
  //   );
  // };

  useEffect(() => {
    getData();
  }, [reload]);

  const handleReload = () => {
    setReload((prev) => !prev); // Cambia el estado de reload
  };

  
  const handleEstado = (rowData) => {
    setIsModalEstado(true);
    setIsModalOpen(false);
    setIdUsuario(rowData.id);
    setGetUser(rowData);
    setIsEdit(true);
  };

  const handlePass = (rowData) => {
    setIsModalPass(true);
    setIsModalOpen(false);
    setIdUsuario(rowData.id);
    setGetUser(rowData);
    setIsEdit(true);
  };

  const handleEdit = (rowData) => {
    setIsModalOpen(!isModalOpen);
    setIdUsuario(rowData.id);
    setIsModalEstado(false);
    setIsEdit(true);
    if (rowData.zonas) {
      const zonasSeleccionadas = rowData.zonas.split(", ").map((zona) => ({
        value: zona.trim(),
        label: zona.trim(),
      }));
      const respuestaActualizada = { ...rowData, zonas: zonasSeleccionadas };
      setGetUser(respuestaActualizada);
    } else {
      setGetUser(rowData);
    }
  };

  const handleCrear = () => {
    setIsModalOpen(!isModalOpen);
    setIdUsuario(0);
    setIsModalEstado(false);
    setIsEdit(false);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseModalEstado = () => {
    setIsModalEstado(false);
  };

  const handleCloseModalPass = () => {
    setIsModalPass(false);
  };

 

  const ShowUsuarios = () => {
    getData();
    setSearch("");
  };

  const searcher = (e) => {
    setSearch(e.target.value);
    // filtrar(e.target.value);
  };

  return (
    <div>
      {isModalOpen && (
        <ModalUsuario
          Id={idUsuario}
          open={isModalOpen}
          dataInitial={getUser}
          handleClose={handleCloseModal}
          edit={isEdit}
          onSave={handleReload}
        />
      )}

      {isModalEstado && (
        <DisableUser
          Id={idUsuario}
          open={isEdit}
          dataInitial={getUser}
          handleClose={handleCloseModalEstado}
          onSave={handleReload}
        />
      )}

      {isModalPass && (
        <Updatepass
          Id={idUsuario}
          open={isEdit}
          dataInitial={getUser}
          handleClose={handleCloseModalPass}
          onSave={handleReload}
        />
      )}

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
            <Building size={20} />
          </div>
          <div>
            <h2
              className="fw-bold mb-0"
              style={{ color: "#2c3e50", fontSize: "1.5rem" }}
            >
              Usuarios
            </h2>
            <p className="text-muted mb-0 small">Listado de Usuarios</p>
          </div>
        </div>
        <button className="btn btn-light rounded-circle p-2 text-secondary hover:bg-danger hover:text-white transition-all">
          <X size={20} />
        </button>
      </div>

      <br />
      <div className="d-flex justify-content-md-end mt-5 mt-md-0 mb-4 ">
        <div className="input-group shadow-sm" style={{ maxWidth: "300px" }}>
          <span className="input-group-text bg-white border-end-0">
            <Search size={16} className="text-muted" />
          </span>
          <input
            id="search"
            type="text"
            className="form-control border-start-0 shadow-none"
            placeholder="Buscar Usuarios..."
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
          onClick={getData}
        >
          <RefreshCcw size={18} />
          <span className="d-none d-sm-inline font-weight-bold">Refresh</span>
        </button>
      </div>
      <div className="d-flex justify-content-center">
        <div className="d-flex justify-content-between align-content-center mb-4">
         
        </div>

        {currentUsuarios.length > 0 ? (
          <table className="table table-hover align-middle mb-0">
            <thead style={{ backgroundColor: "#f1f4f6" }}>
              <tr className="border-bottom text-uppercase">
                <th className="py-3 text-secondary small fw-bold">ID</th>
                <th className="py-3 text-secondary small fw-bold">Avata</th>
                <th className="py-3 text-secondary small fw-bold">
                  Nombre de Usuario
                </th>
                <th className="py-3 text-secondary small fw-bold">Perfil</th>

                <th className="py-3 text-secondary small fw-bold">Activo</th>

                <th className="text-center py-3 text-secondary small fw-bold">
                  Opciones
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsuarios.map((item) => (
                <tr key={item.id} className="border-bottom">
                  <td className="clFont">{item.id}</td>
                  <td style={{ width: "250px" }} className="clFont">
                   <div
  className="rounded-circle bg-dark-subtle d-flex align-items-center justify-content-center border border-2 border-white shadow-sm overflow-hidden"
  style={{ width: "50px", height: "50px", position: "relative" }}
>
                      {item.avata ? (
                        
                          <img
                            src={`${UriImg}${item.avata}`}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover", // Esto asegura que la imagen llene el círculo sin deformarse
                            }}
                            className="mb-0"
                          />
                        
                      ) : (
                        
                          <h5
                            className="mb-0 "
                            style={{
                              lineHeight: 1, // Evita que el interlineado desvíe la letra hacia abajo
        fontSize: "1.2rem"// Esto asegura que la imagen llene el círculo sin deformarse
                            }}
                          >
                            {item.nombreusuario.charAt(0)}
                          </h5>
                        
                      )}
                    </div>

                    
                  </td>
                  <td className="clFont">{item.nombreusuario}</td>
                  <td className="clFont">{item.tbrole.nombre}</td>
                  <td className="clFont">
                    {item.estado === 1 ? (
                      <Check size={16} color={MisColores.headerBlue} />
                    ) : (
                      <Ban size={16} color={MisColores.actionRed} />
                    )}
                  </td>
                  <td className="text-center px-4">
                    <FaRegEdit
                      className="fs-4  text-success mx-2"
                      onClick={() => handleEdit(item)}
                    />
                    <AiOutlineUserDelete
                      className="fs-4 text-danger mx-2"
                      onClick={() => handleEstado(item)}
                    />
                    <LuKeyRound
                      className="fs-4 text-primary mx-2"
                      onClick={() => handlePass(item)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState
            title="No hay Campañias registradas en este listado aún."
            subtitle="En cuanto se cree una nueva Campañias, aparecerá aquí."
          />
        )}
      </div>
      {currentUsuarios.length === 0 ? (
        <div></div>
      ) : (
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center bg-white p-3 rounded-3 shadow-sm mt-4 border mb-3">
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
      <div className="d-flex justify-content-center mb-5">
        <button
          className="btn text-white shadow-lg border-2 clFont"
          onClick={() => handleCrear()}
          style={{ backgroundColor: MisColores.headerBlue }}
        >
          {" "}
          + Nuevo Usuario
        </button>
      </div>
    </div>
  );
}

export default ShowUsuarios;
