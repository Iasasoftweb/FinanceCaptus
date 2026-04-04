import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FieldValues, useForm } from "react-hook-form";
import { styled, createTheme } from "@mui/material/styles";
import "./clientes.css";

import {
  Box,
  Button,
  Modal,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";

import { SlDocs } from "react-icons/sl";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";
import { VscSaveAs } from "react-icons/vsc";
import Swal from "sweetalert2";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { CiFileOff, CiImageOff, CiImageOn } from "react-icons/ci";
import FileViewer from "../../components/general/FilePreview";
import { Link } from "react-router-dom";
import { TiCloudStorageOutline } from "react-icons/ti";
import {useAuth} from "../../components/Roles/AuthProvider.tsx"

const ClienteDo = ({ Id, open, handleClose, dataInitial }) => {
  const {
    register,
    setFocus,
    handleSubmit,
    setValue,

    formState: { errors, isSubmitting },
    reset,
  } = useForm({ defaultValues: { idcliente: Id } });

  const [clienteData, setClienteData] = useState([]);
  const [tIems, setItems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [ModoEdit, setModoEdit] = useState(false);
  const [idDoc, setIdDoc] = useState(0);
  const [allDoc, setAllDoc] = useState([]);
  const [filet, setFile] = useState("");
  const [isDisable, setIsDisable] = useState(true);
  const [isDisableInsertar, setIsDisableInsertar] = useState(false);
  const [getDoc, setGetDoc] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
    
  const { role } = useAuth();
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //===============================================

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const URI = "http://localhost:5000/clienteDoc/";
  const UrisImgDelete = "http://localhost:5000/clienteDoc/deleteimagen/";
  const UriImg = "http://localhost:5000/uploadDocs/";
  const [selectedFileId, setSelectedFileId] = useState(null);

  const clearField = () => {
    setValue("descripcion", "");
  };

  const delImg = async (img: string) => {
    console.log(img);
    try {
      await axios.delete(`${UrisImgDelete}${img}`);
      console.log(" Imagen Elimnada :" + img);
    } catch (error) {
      console.error("No se pudo eliminar el archivos");
    }
  };

  const refresh = () => {
    try {
      axios.get(`${URI}${Id}`).then((xdata) => {
        setClienteData(xdata.data);
        console.log(xdata.data);
      });
    } catch (error) {
      console.error("Error en consulta :", error);
    }
  };

  const Datos = async () => {
    try {
     await axios.get(`${URI}${Id}`).then((xdata) => {
        setClienteData(xdata.data);
        console.log(xdata.data);
        setFile(xdata.data);
      });
    } catch (error) {
      console.error("Error en consulta :", error);
    }
  };

  useEffect(() => {
    Datos();
    
  }, []);

  const handleInputChange = (e) => {
    const upperCaseValue = e.target.value.toUpperCase();
    setValue(e.target.name, upperCaseValue, { shouldValidate: true });
  };

  const closeModal = () => {
    handleClose();
    reset();
  };
  useEffect(() => {
    if (!isDisable) {
      console.log(isDisable);
      setFocus("descripcion");
    }
  }, [setFocus, isDisable]);

  const handleEdit = (dataRow) => {
    reset(dataRow);
    setIdDoc(dataRow.id);
    setModoEdit(true);
    setIsDisable(false);
    setIsDisableInsertar(true);
    setFile(dataRow.img);
    console.log(dataRow.img);
  };

  const handleInsert = () => {
    setIsDisableInsertar(true);
    setIsDisable(false);
    setModoEdit(false);
  };

  const deleteRow = (id) => {
    Swal.fire({
      title: "Esta seguro?",
      text: "No prodras revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminalo!",
      customClass: {
        popup: "custom-swal-popup", // Clase personalizada
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${URI}${id}`);
          refresh();
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
            customClass: {
              popup: "custom-swal-popup", // Clase personalizada
            },
          });
        }
      }
    });
  };
  const onSubmit = async (data: FieldValues) => {
   
    try {
      if (ModoEdit) {
        console.log(data);
        axios.put(`${URI}${idDoc}`, data);
        Swal.fire({
          position: "top-end",
          icon: "success",
          html: '<p style="color: gray; font-weight: normal;">Registro Actualizado</p>',
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: "custom-swal-popup", // Clase personalizada
          },
        });
      } else {
        const respond = await axios.post(URI, data);
        console.log(respond);

        Swal.fire({
          position: "top-end",
          icon: "success",
          html: '<p style="color: gray; font-weight: normal;">Nuevo Documento Insertado</p>',
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: "custom-swal-popup", // Clase personalizada
          },
        });
      }

      refresh();
      clearField();
      setIsDisable(true);
      setModoEdit(false);
      setIsDisableInsertar(false);
    } catch (error) {
      console.error(error);
    }
  };

  const cargaNameImg = (newName) => {
    setValue("img", newName);
  };

  const upImg = async (fileOriginal) => {
    console.log(filet);

    if (filet) {
      delImg(filet);
    }

    setGetDoc(fileOriginal.id);

    const formatdata = new FormData();
    formatdata.append("img", fileOriginal);

    try {
      const res = await axios.post(
        "http://localhost:8000/uploadDoc/",
        formatdata
      );
      cargaNameImg(res.data.fileName);
    } catch (err) {
      console.log(err);
    }
  };

  const isPdf = (fileName) => {
    return fileName.endsWith(".pdf");
  };

  const isImage = (fileName) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", "gif"];
    return imageExtensions.some((ext) => fileName.endsWith(ext));
  };

  const FilePrev = (value) => {
    if (value) {
      console.log(value);
      setSelectedFileId(value);
    } else {
      setSelectedFileId(null);
    }

  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        style={{ zIndex: 1200 }}
        BackdropProps={{
          timeout: 500, // Duración de la transición del backdrop
          onClick: (event) => {
            event.stopPropagation(); // Evitar que el clic cierre el modal (si lo deseas)
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 1000,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
          }}
        >
          <div className="row">
            <div className="d-flex p-2  justify-content-between align-items-center">
              <div className="p-2">
                <div className="d-flex justify-content-between">
                  <div>
                    <SlDocs className="IconsTitle text-success fs-2" />
                  </div>
                  <div>
                    <h5 className="cFont d-flex lh-2 mb-0 text-black">
                      Documentos Adicionales
                    </h5>
                    <p className="d-flex lh- clFont mb-0 text-black-50">
                      Cliente :
                      <strong>
                        {dataInitial.nombres} {dataInitial.apellidos}
                      </strong>
                    </p>
                    {/* <hr style={{ borderColor: 'blue', borderWidth: '3px', width: '95%' }}  className="m-auto"/> */}
                  </div>
                </div>
                      
              </div>

              <div>
                <IoIosCloseCircleOutline
                  className="text-black-50 fs-3"
                  onClick={closeModal}
                />
              </div>
              
            </div>
            
            <div className="col-md-6 " >
            
              <br />
              <div className=" border-1 border-dark-subtle rounded-2">
                <form
                  action=""
                  className="p-4 clFont"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <TextField {...register("idcliente")} hidden={true} />

                  <TextField
                    disabled={isDisable}
                    label="Descipcion"
                    fullWidth
                    margin="normal"
                    {...register("descripcion", {
                      required: "Este campo es obligatorio",
                    })}
                    onChange={handleInputChange}
                    className=" form-control"
                    variant="outlined"
                  />
                  {errors.descripcion && (
                    <p className="text-red-500 clFont">
                      {" "}
                      {errors.descripcion.message}{" "}
                    </p>
                  )}
                  <br />
                  <br />
                  <div className="d-flex justify-content-center">
                    <Button
                      sx={{
                        ml: 3,
                        background: "#0097B2",
                        "&:hover": { background: "#59A5B3" },
                      }}
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<TiCloudStorageOutline />}
                      className="clFont text-white"
                      disabled={isDisable}
                    >
                      Subir Archivo
                      <VisuallyHiddenInput
                        type="file"
                        onChange={(event) => upImg(event.target.files[0])}
                      />
                    </Button>

                    <Button
                      sx={{
                        ml: 3,
                        background: "#0097B2",
                        "&:hover": { background: "#59A5B3" },
                      }}
                      startIcon={<VscSaveAs />}
                      className="clFont text-white"
                      type="submit"
                      disabled={isDisable}
                      variant="contained"
                    >
                      Guardar
                    </Button>
                  </div>
                </form>
              </div>
              <div className="d-flex justify-content-center mt-4">
                <Button
                  sx={{
                    ml: 3,
                    background: "#0097B2",
                    "&:hover": { background: "#59A5B3" },
                  }}
                  startIcon={<IoIosAddCircleOutline />}
                  className="clFont text-white"
                  onClick={handleInsert}
                  disabled={isDisableInsertar}
                  variant="contained"
                >
                  Insertar Nuevo Documento
                </Button>
              </div>
              <Paper className="mt-4">
                <TableContainer>
                  <Table sx={{ minWidth: 300 }} aria-label="caption table">
                    <TableHead>
                      <TableRow>
                        <TableCell> </TableCell>
                        <TableCell> Descripcion </TableCell>
                        <TableCell> Opciones </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {clienteData
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              {!item.img ? (
                                <Link to="">
                                    <CiImageOff className="fs-4 text-black-50" onClick={() => FilePrev(item.img)} />
                                </Link> 
                                
                              ) : (
                                <Link to="">
                                  <CiImageOn
                                    className="fs-4 text-info"
                                    onClick={() => FilePrev(item.img)}
                                  />
                                </Link>
                              )}
                            </TableCell>
                            <TableCell className="clFont">
                              {item.descripcion}
                            </TableCell>
                            <TableCell>
                              {" "}
                             {(role ==="ADMINISTRADOR" || role ==="SUPERVISOR") ?  
                             <FaRegEdit
                                className="fs-5  text-success"
                                onClick={() => handleEdit(item)}
                              />  :
                              
                              <FaRegEdit
                                className="fs-5 "
                                style={{color:"GrayText", cursor:"pointer"}}
                              />
                              
                              } 
                              {(role ==="ADMINISTRADOR" || role ==="SUPERVISOR") ? 
                              
                              <RiDeleteBin2Line
                                className="fs-5 text-danger mx-2"
                                onClick={() => deleteRow(item.id)}
                              />
                              : 
                              
                              <RiDeleteBin2Line
                                className="fs-5 mx-2"
                                style={{color:"GrayText", cursor:"pointer"}}
                              />
                              }
                              
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  <br />
                  <div className="d-flex justify-content-center align-content-center">
                    <TablePagination
                      sx={{
                        display: "flex",
                        justifyContent: "center", // Alinear al centro
                        alignItems: "center",
                      }}
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={clienteData.length}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      labelRowsPerPage="Registros Por Pag."
                    />
                  </div>
                </TableContainer>
              </Paper>
            </div>

            <div className="col-md-6 p-3">
              {selectedFileId ? (
                <FileViewer fieldID={selectedFileId} Uri={UriImg} />
              ) : (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <CiFileOff style={{ fontSize: "300px", color: "gray" }} />
                </div>
              )}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ClienteDo;
