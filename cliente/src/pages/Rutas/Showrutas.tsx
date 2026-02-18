import  React from "react";
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

  const PER_PAGE = 8;
  const countpage = Math.ceil(zonasd.length / PER_PAGE);
  const _DATA = PaginationItem(zonas, PER_PAGE);

  //   const navigate = useNavigate();

  const handlePageChance = (p) => {
    setPage(p);
    _DATA.jump(p);
  };
  const URI = "http://localhost:8000/zonas/";
  const datoszonas = () => {
    try {
      setTimeout(() => {
        Allzonas().then((allzonas) => {
          setData(allzonas);
          setTotalItems(allzonas.length);
          setIsLoading(false);
          setZonas(allzonas);
        }),
          10000;
      });
    } catch (error) {
      console.error("Error de Coneccion", error);
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

  const filtrar = (filtro) => {
    const resultados = zonasd.filter((elementos) => {
      if (
        elementos.nombrerutas
          .toString()
          .toLowerCase()
          .includes(filtro.toLowerCase()) ||
        elementos.id.toString().toLowerCase().includes(filtro.toLowerCase())
      ) {
        return elementos;
      }
    });

    setZonas(resultados);
  };

  const searcher = (e) => {
    setSearch(e.target.value);
    filtrar(e.target.value);
  };

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
 

  }

  return (
    <div>
      <TitleTop
        titulos={"Rutas"}
        subtitulos={"Manenimiento de Rutas"}
        btnVisible={false}
        btnLabel={"Refrescar"}
        visibleEstado={false}
        estado="Show"
        icon={
          <PiMapPinAreaLight className="fs-1  border-1 rounded-circle p-2 text-info" />
        }
      />

      <main className="shadow-sm">
        <div className="row bg-light p-4 ">
          <div className="d-flex justify-content-center mb-4 ">
            <div className="">
              <InputGroup className="">
                <InputGroup.Text id="search">
                  <IoIosSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  className="clFont"
                  id="search"
                  placeholder="Buscar Rutas"
                  value={search}
                  onChange={searcher}
                />
              </InputGroup>
            </div>

            <div className="mx-2">
              <button
                className="btn btn-warning clFont text-dark"
                onClick={ShowZonas}
              >
                {" "}
                <TbRefresh />
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-center">
            <br />
            {isLoading ? (
              <PiMapPinArea className="fs-1 hv-100 text-center" />
            ) : (
              //   <h6 className=" text-black-50 text-center hv-100">Cargando...</h6>
              <Table striped bordered hover className=" w-auto">
                <thead>
                  <tr>
                    <td>
                      <PiMapPinAreaFill className="text-info fs-5" />
                    </td>
                    <td className="clFont fw-semibold">Nombre de Rutas</td>
                    <td className="clFont fw-semibold">Opciones</td>
                  </tr>
                </thead>
                <tbody>
                  {_DATA.currentData().map((item) => (
                    <tr key={item.id}>
                      <td>
                        {" "}
                        {item.estado === 1 ? (
                          <PiMapPinAreaFill className="text-info fs-5" />
                        ) : (
                          <PiMapPinAreaFill className="text-black text-opacity-50 fs-5" />
                        )}
                      </td>
                      <td style={{ width: "250px" }} className="clFont">
                        {item.nombrerutas}
                      </td>
                      <td className="text-center px-4">
                        <Link to="">
                          <AiOutlineDelete className="me-4 text-danger" onClick={()=>DeleteRow(item.id)}/>
                        </Link>

                        <Link to="" key={item.id}>
                          <CiEdit
                            className="text-primary"
                            onClick={() => handleOpenModal(item)}
                          />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>

          <div className="d-flex justify-content-center mb-5">
            <ThemeProvider theme={theme}>
              <div className="d-flex align-items-center ">
                <Pagination
                  count={countpage}
                  size="large"
                  page={page}
                  color="standard"
                  onChange={handlePageChance}
                />

                <div>
                  <p className="clFont m-auto">
                    Total de rutas creadas : {totalItems}
                  </p>
                </div>
              </div>
            </ThemeProvider>
          </div>

          <div className="d-flex justify-content-center mb-5">
            <button
              className="btn btn-info text-white shadow-lg border-2 clFont"
              onClick={() => InsertarZonas()}
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
