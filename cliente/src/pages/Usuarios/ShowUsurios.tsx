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
import { AiOutlinePlus, AiOutlineUserDelete } from "react-icons/ai";
import DisableUser from "./DisableUser.tsx";
import Updatepass from "./UpdatepassUser.tsx";

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

  const UriImg = "http://localhost:8000/uploadusers/";

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    _DATA.jump(newPage);
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
    setReload(prev => !prev); // Cambia el estado de reload
  };

  const PER_PAGE = 6;
  const countpage = Math.ceil(getUsuarios.length / PER_PAGE);
  const _DATA = PaginationItem(getUsuarios, PER_PAGE);

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

  const filtrar = (filtro) => {
    console.log(filtro);
    const resultados = dataUser.filter((elementos) => {
      if (
        elementos.usuario
          .toString()
          .toLowerCase()
          .includes(filtro.toLowerCase()) ||
        elementos.id.toString().toLowerCase().includes(filtro.toLowerCase()) ||
        elementos.nombreusuario
          .toString()
          .toLowerCase()
          .includes(filtro.toLowerCase())
      ) {
        return elementos;
      }
    });

    setGetUsuarios(resultados);
  };

  const ShowUsuarios = () => {
    getData();
    setSearch("");
  };

  const searcher = (e) => {
    setSearch(e.target.value);
    filtrar(e.target.value);
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
        />
      )}

      {isModalPass && (
        <Updatepass
          Id={idUsuario}
          open={isEdit}
          dataInitial={getUser}
          handleClose={handleCloseModalPass}
        />
      )}

      <TitleTop
        titulos={"Usuarios"}
        subtitulos={"Manenimiento de usuarios del sistema"}
        btnVisible={false}
        btnLabel={"Refrescar"}
        visibleEstado={false}
        estado="Show"
        icon={
          <TbUsers className="fs-1  border-1 rounded-circle p-2 text-info" />
        }
      />

      <div className="d-flex justify-content-center">
        <Paper className="mt-4 w-75">
          <div className="d-flex justify-content-between align-content-center mb-4">
            <div className="d-flex">
              <div className="m-3">
                <InputGroup className="">
                  <InputGroup.Text id="search">
                    <IoIosSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    className="clFont"
                    id="search"
                    placeholder="Buscar Usuarios"
                    value={search}
                    onChange={searcher}
                  />
                </InputGroup>
              </div>

              <div className="mx-2 m-3">
                <button className="btn btn-info clFont" onClick={ShowUsuarios}>
                  <TbRefresh className="mx-2" /> Refrescar
                </button>
              </div>
            </div>

            <div className="">
              <Link to="">
                <AiOutlinePlus
                  className="text-white  rounded-circle p-1 m-3 shadow"
                  style={{ fontSize: "3rem", backgroundColor: "lightcoral" }}
                  onClick={handleCrear}
                />
              </Link>
            </div>
          </div>
          <TableContainer>
            <Table sx={{ minWidth: 300 }} aria-label="caption table">
              <TableHead>
                <TableRow>
                  <TableCell> Avata </TableCell>
                  <TableCell> Nombre Usuario </TableCell>
                  <TableCell> Perfil </TableCell>
                  <TableCell> Opciones </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {_DATA.currentData().map((item) => (
                  <TableRow key={item.id} hover tabIndex={-1}>
                    <TableCell>
                      {" "}
                      <Avatar
                        src={`${UriImg}${item.avata}`}
                        sx={{ width: 40, height: 40 }}
                      />
                    </TableCell>
                    <TableCell className="clFont">
                      {item.nombreusuario}
                    </TableCell>
                    <TableCell className="clFont">
                      {item.tbrole.nombre}
                    </TableCell>
                    <TableCell>
                      {" "}
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <br />
            <div className="d-flex justify-content-center align-content-center m-2">
              <Stack>
                <Pagination
                  count={countpage}
                  variant="outlined"
                  showFirstButton
                  showLastButton
                  onChange={handleChangePage}
                  page={page}
                  color={"primary"}
                />
              </Stack>

              <div className="clFont d-flex align-items-center mx-4">
                {" "}
                Total de Registro : {getUsuarios.length}
              </div>
            </div>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
}

export default ShowUsuarios;
