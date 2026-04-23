import React from "react";
import { useEffect, useState } from "react";
import "./showrutas.css";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import TitleTop from "../../components/TitleTop/TItleTop";
import {
  PiMapPinArea,
  PiMapPinAreaFill,
  PiMapPinAreaLight,
} from "react-icons/pi";
import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { Allzonas } from "../../data/zonas/zonasdata";
import PaginationItem from "../../components/Pagination/PaginatedItems.tsx";
import { Pagination } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { InputGroup } from "react-bootstrap";
import { IoIosSearch } from "react-icons/io";
import { TbRefresh } from "react-icons/tb";
import { FormRutas } from "./FormRutas.tsx";
import { Link } from "react-router-dom";
import { MisColores } from "../../components/stuff/MisColores.tsx";
import { Ban, Building, Check, ChevronLeft, ChevronRight, MapPin, RefreshCcw, Search, X } from "lucide-react";
import { EmptyState } from "../../components/stuff/EmptyState.tsx";

function Showrutas() {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [zonasd, setData] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [idZona, setIdZona] = useState(0);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [selectData, setSelectData] = useState(null);



  
const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filtrar = zonasd.filter((items) =>
    items.nombrerutas.toLowerCase().includes(search.toLowerCase()),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRutas = filtrar.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtrar.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };


  const URI = "http://localhost:5000/zonas/";


  const Allzonas = async () =>{
   try {
     const response  = await axios.get(URI);
     return response.data
   } catch (error) {
    console.error("Error en Allzonas:", error);
    return []; // Devolver array vacío en caso de error
   }
  }

  const datoszonas = async () => {
  setIsLoading(true); 
  try {
    // 2. Obtenemos los datos
    const allzonas = await Allzonas(); 

    // 3. Simulamos un pequeño retraso para que se vea el efecto de carga
    
      setData(allzonas);
      setZonas(allzonas);
      setTotalItems(allzonas.length);
      
      // 4. Quitamos la carga DESPUÉS de setear los datos
      setIsLoading(false); 
    

  } catch (error) {
    console.error("Error de Conexión", error);
    setIsLoading(false); // También quitamos la carga si hay error
  }
};


  const handleOpenModal = (rowData) => {
    setSelectData(rowData);
    setOpenModal(true);
    setModoEdicion(true);
    setIdZona(rowData.id);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  
  const ShowZonas = () => {
    setSearch("");
    datoszonas();
  };

  
  useEffect(() => {
    datoszonas();

  }, []);

  useEffect(() => {
    setModoEdicion(modoEdicion);
  }, [modoEdicion]);


  const InsertarZonas = () => {
    setModoEdicion(false);
    setSelectData(null);
    setOpenModal(true);
  };
  const DeleteRow = (id) => {
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
          await axios.delete(`${URI}${id}`);
          ShowZonas();
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

  return (
    <div>
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
            <MapPin size={20} />
          </div>
          <div>
            <h2
              className="fw-bold mb-0"
              style={{ color: "#2c3e50", fontSize: "1.5rem" }}
            >
              Rutas
            </h2>
            <p className="text-muted mb-0 small">Mantenimiento de Rutas</p>
          </div>
        </div>
        <button
          className="btn btn-light rounded-circle p-2 text-secondary hover:bg-danger hover:text-white transition-all"
          // onClick={handleClose}
        >
          <X size={20} />
        </button>
      </div>

      <main className="shadow-sm">
        <div className="row bg-light p-4 ">


           <div className="d-flex justify-content-md-end mt-3 mt-md-0 ">
                      <div
                        className="input-group shadow-sm"
                        style={{ maxWidth: "300px" }}
                      >
                        <span className="input-group-text bg-white border-end-0">
                          <Search size={16} className="text-muted" />
                        </span>
                        <input
                          id="search"
                          type="text"
                          className="form-control border-start-0 shadow-none"
                          placeholder="Buscar Rutas..."
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
                        onClick={ShowZonas}
                      >
                        <RefreshCcw size={18} />
                        <span className="d-none d-sm-inline font-weight-bold">
                          Refresh
                        </span>
                      </button>
                    </div>
          

          <div className="d-flex justify-content-center">
            <br />
            {isLoading ? (
              // <PiMapPinArea className="fs-1 hv-100 text-center" />

              <EmptyState
               
                title="No hay rutas registradas en este listado aún."
                subtitle="En cuanto se cree una nueva rutas, aparecerá aquí."
              />
            ) : (
              //   <h6 className=" text-black-50 text-center hv-100">Cargando...</h6>
              <table className="table table-hover align-middle mb-0">
                <thead style={{ backgroundColor: "#f1f4f6" }}>
                  <tr  className="border-bottom text-uppercase">
                    <th className="py-3 text-secondary small fw-bold"> 
                      id
                    </th>
                    <th className="clFont fw-semibold">Nombre de Rutas</th>
                    <th className="clFont fw-semibold">Activo</th>
                    <th className="clFont fw-semibold">Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRutas.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.id}
                      </td>
                      <td  className="clFont">
                        {item.nombrerutas}
                      </td>

                      <td className="clFont">
                        {item.estado === 1 ? (
                          <Check size={25} color={MisColores.headerBlue} />
                        ) : (
                          <Ban size={25} color={MisColores.actionRed} />
                        )}
                      </td>
                      <td className="text-center px-4">
                        <Link to="">
                          <AiOutlineDelete size={25}
                            className="me-4 text-danger"
                            onClick={() => DeleteRow(item.id)}
                          />
                        </Link>

                        <Link to="" key={item.id}>
                          <CiEdit size={25}
                            className="text-primary"
                            onClick={() => handleOpenModal(item)}
                          />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center bg-white p-3 rounded-3 shadow-sm mt-4 border mb-3">
              <div className="text-muted small mb-3 mb-sm-0">
                Mostrando registros del <b>{indexOfFirstItem + 1}</b> al{" "}
                <b>{Math.min(indexOfLastItem, filtrar.length)}</b> de un total
                de <b>{filtrar.length}</b>
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
                            currentPage === index + 1
                              ? MisColores.headerBlue
                              : "",
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

        

          <div className="d-flex justify-content-center mb-5">
            <button
              className="btn text-white shadow-lg border-2 clFont"
              onClick={() => InsertarZonas()}
              style={{backgroundColor: MisColores.headerBlue}}
            >
              {" "}
              + Nueva Ruta
            </button>
          </div>
          {openModal && (
            <FormRutas
              ModoEdicion={modoEdicion}
              idRutas={idZona}
              open={openModal}
              handleClose={handleCloseModal}
              initialData={selectData}
              updateList={datoszonas}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default Showrutas;

const theme = createTheme({
  palette: {
    secundary: {
      main: "#0EB582",
    },
  },
});
