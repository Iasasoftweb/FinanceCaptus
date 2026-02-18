import React, { useState, useEffect } from "react";
import axios from "axios";
import { Allcompanies } from "../../data/Companies/AllCompanies";
import PaginationItem from "../../components/Pagination/PaginatedItems.tsx";
import { createTheme, Pagination, ThemeProvider } from "@mui/material";
import TitleTop from "../../components/TitleTop/TItleTop.tsx";
import {
  PiMapPinArea,
  PiMapPinAreaFill,
  PiMapPinAreaLight,
} from "react-icons/pi";
import { BsBuildings } from "react-icons/bs";
import { Form, InputGroup, Table } from "react-bootstrap";
import { IoIosSearch } from "react-icons/io";
import Swal from "sweetalert2";
import { TbRefresh } from "react-icons/tb";
import { Link } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import { FormCompany } from "./FormCompany.tsx";

const Company = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [Data, setData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [idCompany, setIdCompany] = useState(0);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [selectData, setSelectData] = useState(null);

  const PER_PAGE = 8;
  const countpage = Math.ceil(companies.length / PER_PAGE);
  const _DATA = PaginationItem(Data, PER_PAGE);

  const handlePageChance = (p) => {
    setPage(p);
    _DATA.jump(p);
  };
  const URI = "http://localhost:8000/Company/";

  const datosCompanies = () => {
    try {
      setTimeout(() => {
        Allcompanies().then((allcompanies) => {
          setData(allcompanies);
          setTotalItems(allcompanies.length);
          setIsLoading(false);
          setCompanies(allcompanies);
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
    setIdCompany(rowData.id);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const ShowZonas = () => {
    setSearch("");
    datosCompanies();
  };

  useEffect(() => {
    datosCompanies();
  }, []);

  useEffect(() => {
    setModoEdicion(modoEdicion);
  }, [modoEdicion]);

  const filtrar = (filtro) => {
    const resultados = companies.filter((elementos) => {
      if (
        elementos.company
          .toString()
          .toLowerCase()
          .includes(filtro.toLowerCase()) ||
        elementos.id.toString().toLowerCase().includes(filtro.toLowerCase())
      ) {
        return elementos;
      }
    });

    setCompanies(resultados);
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
  };

  return (
    <>
      <TitleTop
        titulos={"Compañias"}
        subtitulos={"Manenimiento de Compañias"}
        btnVisible={false}
        btnLabel={"Refrescar"}
        visibleEstado={false}
        estado="Show"
        icon={
          <BsBuildings className="fs-1  border-1 rounded-circle p-2 text-info" />
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
                  placeholder="Buscar Campañias"
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
                    <td className="clFont fw-semibold">ID</td>
                    <td className="clFont fw-semibold">Nombre de Rutas</td>
                    <td className="clFont fw-semibold">Nombre Contacto</td>
                    <td className="clFont fw-semibold">Telefono</td>
                    <td className="clFont fw-semibold">Opciones</td>
                  </tr>
                </thead>
                <tbody>
                  {_DATA.currentData().map((item) => (
                    <tr key={item.id}>
                      <td className="clFont">{item.id}</td>
                      <td style={{ width: "250px" }} className="clFont">
                        {item.company}
                      </td>
                      <td className="clFont">{item.nombrecontacto}</td>
                      <td className="clFont">{item.telefono}</td>
                      <td className="text-center px-4">
                        <Link to="">
                          <AiOutlineDelete
                            className="me-4 text-danger"
                            onClick={() => DeleteRow(item.id)}
                          />
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
                    Total de registros creadas : {totalItems}
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
              + Nueva Campañia
            </button>
          </div>
          {openModal && (
            <FormCompany
              ModoEdicion={modoEdicion}
              idCompany={idCompany}
              open={openModal}
              handleClose={handleCloseModal}
              initialData={selectData}
            />
          )}
        </div>
      </main>
    </>
  );
};

export default Company;

const theme = createTheme({
  palette: {
    secundary: {
      main: "#0EB582",
    },
  },
});
