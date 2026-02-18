import React, { useState, useEffect, useRef } from "react";
import { FieldValue, useForm, Constroller, Controller } from "react-hook-form";
import {
  Box,
  Modal,
  TextField,
  MenuItem,
  Avatar,
  Button,
  containerClasses,
} from "@mui/material";
import { SiMeteor } from "react-icons/si";
import Logo from "../../components/Brand/Brand.tsx";
import { useNavigate, Link } from "react-router-dom";
import tipoNegocios from "../../data/Apis/tipoNegocio.json";
import Pais from "../../data/Apis/Paises.json";
import { GrImage } from "react-icons/gr";
import axios from "axios";
import { resetWarned } from "antd/es/_util/warning";
import type { FieldValues } from "react-hook-form";
import Swal from "sweetalert2";
import Select from "react-select";
import { TiCloudStorageOutline } from "react-icons/ti";
import { Theme, styled } from "@mui/material/styles";
import { FaCamera } from "react-icons/fa";
import "./myEmpresas.css";
import { NumericFormat } from "react-number-format";
import limpiarMonto from "../../components/stuff/LimpiarMonto.tsx";

const MyEmpresa = ({ open }) => {
  const [isModalOpen, setIsModalOpen] = useState(open);
  const [isData, setIsData] = useState([]);
  const [Idempresas, setIdempresas] = useState([]);
  const [tipoN, setTipoN] = useState("");
  const [vpais, setVpais] = useState("");
  const [isAplicaMora, setIsAplicaMora] = useState("");
  const [isImprimilo, setIsimprimelogo] = useState("");
  const UriImg = "http://localhost:8000/uploadEmpresa/";
  const URIEmpresas = "http://localhost:8000/empresas/estado/";
  const UriMoneda = "http://localhost:8000/moneda/";
  const navigate = useNavigate();
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [MoraDefault, setMoraDefault] = useState(0);
  const [Seguro, setSeguro] = useState(0.0);
  const [GastoLegal, setGastoLegal] = useState(0.0);
  const [tipoMoneda, setTipoMoneda] = useState("");
  const [moneda, setMoneda] = useState([]);

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

  const handleFileRef = useRef(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      isactivo: "true",
      pais: "",
      seguro: 0.0,
      gastolegal: 0.0,
      prorrogamora: 0,
      prorrogacuota: 0,
    },
  });

  const cargaNameImg = (newName) => {
    setValue("logoempresa", newName);
  };

  const getData = async () => {
    try {
      const datosEmpresa = await axios.get(`${URIEmpresas}`);

      const getEmpresas = datosEmpresa?.data.data || datosEmpresa.data;
   
      setIsData(getEmpresas);
      reset(datosEmpresa.data[0]);
      setIdempresas(getEmpresas[0].id);
      setTipoN(getEmpresas[0].tiponegocio);
      setVpais(getEmpresas[0].pais);
      setIsAplicaMora(getEmpresas[0].aplicarmora);
      setIsimprimelogo(getEmpresas[0].imprimirlogo);
      setSelectedFileId(getEmpresas[0].logoempresa);
      setGastoLegal(getEmpresas[0].gastolegal);
      setSeguro(getEmpresas[0].seguro);
      setTipoMoneda(getEmpresas[0].tipomoneda);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  const upImg = async (fileOriginal) => {
    const formatdata = new FormData();
    formatdata.append("logoempresa", fileOriginal);

    try {
      const res = await axios.post(
        "http://localhost:8000/uploadEmpresa/",
        formatdata
      );
      console.log(res.data.fileName);
      cargaNameImg(res.data.fileName);
      setSelectedFileId(res.data.fileName);
    } catch (err) {
      console.log(err);
      setSelectedFileId(null);
    }
  };

  const GetMoneda = async () => {
    try {
      const result = await axios.get(`${UriMoneda}`);
      setMoneda(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsModalOpen(open);
    getData();
    GetMoneda();

  }, [open]);

  const handletiponegocio = (e) => {
    setTipoN(e.target.value);
  };

  const handlePais = (event) => {
    setVpais(event.target.value);
  };

  const handleMoneda = (e) => {
    setTipoMoneda(e.target.value);
  };
  const handleMora = (event) => {
    setIsAplicaMora(event.target.value);
  };
  const handleLogo = (event) => {
    setIsimprimelogo(event.target.value);
  };

  const handleGastolegal = (e) => {
    setGastoLegal(e.target.value);
  };

  const handleSeguro = (e) => {
    setSeguro(e.target.value);
  };

  const handleMoraDefault = (e) => {
    setMoraDefault(e.target.value);
  };

  const handleImageClick = () => {
    handleFileRef.current.click();
  };

  const onSubmit = async (data: FieldValues) => {
    await axios.put(`http://localhost:8000/empresas/${Idempresas}`, data);
    Swal.fire({
      position: "center",
      icon: "success",
      html: '<p style="color: gray; font-weight: normal;">Empresa Actualizada.</p>',
      showConfirmButton: false,
      timer: 2000,
    });
    handleClose();
  };

  return (
    <div className="vh-100">
      <Modal
        open={isModalOpen}
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
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "10px",
            },

            maxHeight: {
              xs: "650px",
              sm: "600px",
              md: "800px",
              lg: "820px",
            },
            transform: "translate(-50%, -50%)",
            width: {
              xs: "90%", // 90% del ancho en pantallas extra pequeñas
              sm: "80%", // 80% del ancho en pantallas pequeñas
              md: 600, // 600px en pantallas medianas
              lg: 800, // 800px en pantallas grandes
            },
            bgcolor: "background.paper",
            boxShadow: 24,
          }}
        >
          <div className="  bg-secondary p-2 d-flex justify-content-between align-content-center">
            <div className="d-flex">
              <SiMeteor className="fs-1 text-white me-2" /> <Logo fs={20} />
            </div>
            <div>
              <Link to="/">
                <div
                  className="p-1 rounded-circle border"
                  onClick={handleClose}
                >
                  <span
                    className="p-2 text-white fs-6"
                    style={{ cursor: "pointer" }}
                  >
                    X
                  </span>
                </div>
              </Link>
            </div>
          </div>

          <div className=" bg-body-secondary p-2">
            <span className=" fw-medium fs-6">Empresas </span>
          </div>

          <div className="p-4 ">
            <div className="justify-content-center align-items-center mb-2">
              <div
                className="text-center d-flex justify-content-center mb-2"
                style={{ cursor: "pointer" }}
              >
                <div style={{ position: "relative", display: "inline-block" }}>
                  {selectedFileId ? (
                    <img
                      src={`${UriImg}${selectedFileId}`}
                      style={{ width: "200px", height: "auto" }}
                      onClick={handleImageClick}
                      alt="Selected"
                    ></img>
                  ) : (
                    <Avatar
                      sx={{ width: 125, height: 125, bgcolor: "cadetblue" }}
                      onClick={handleImageClick}
                    />
                  )}

                  <FaCamera onClick={handleImageClick} className="hover-icon" />
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <span className="clFont text-primary">
                  Click en imgen para Subir Imagen
                </span>
              </div>
              <div className="text-center">
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
                  disabled={false}
                  ref={handleFileRef}
                  hidden
                >
                  Subir Avata
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(event) => upImg(event.target.files[0])}
                  />
                </Button>
              </div>
            </div>
            <span className="fs-6 fw-medium text-info">Datos de empresa</span>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-3">
                <div className="col-12 col-sm-6 col-md-4  mt-4">
                  <TextField
                    label="Nombre de la Empresa"
                    {...register("empresa", {
                      required: "Este campo es obligatorio",
                    })}
                    fullWidth
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                      },
                    }}
                  />

                  {errors.empresa && (
                    <span className="text-danger clFont">
                      {errors.empresa.message}
                    </span>
                  )}
                </div>
                <div className="col-12 col-sm-6 col-md-4  mt-4">
                  <TextField
                    label="Correo Empresarial"
                    {...register("correo")}
                    fullWidth
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                      },
                    }}
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-4 mt-4">
                  <TextField
                    label="Numero RNC"
                    fullWidth
                    {...register("rnc")}
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                      },
                    }}
                  />
                </div>
              </div>

              <div className="row g-3 mt-1">
                <div className="col-12 col-sm-6 col-md-4  mt-4">
                  <TextField
                    label="Direccion"
                    {...register("direccion", {
                      required: "Este campo es obligatorio",
                    })}
                    fullWidth
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                      },
                    }}
                  />
                  {errors.direccion && (
                    <p className="text-danger clFont">
                      {" "}
                      {errors.direccion.message}{" "}
                    </p>
                  )}
                </div>
                <div className="col-12 col-sm-6 col-md-4  mt-4">
                  <TextField
                    label="Nombre del Gerente"
                    {...register("gerente", {
                      required: "Este campo es obligatorio",
                    })}
                    fullWidth
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                      },
                    }}
                  />
                  {errors.gerente && (
                    <p className="text-danger clFont">
                      {" "}
                      {errors.gerente.message}{" "}
                    </p>
                  )}
                </div>
                <div className="col-12 col-sm-6 col-md-4  mt-4">
                  <TextField
                    label="Tipo de Negocio"
                    {...register("tiponegocio", {
                      required: "Este campo es obligatorio",
                    })}
                    fullWidth
                    select
                    value={tipoN}
                    onChange={handletiponegocio}
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                      },
                    }}
                  >
                    {tipoNegocios.map((item) => (
                      <MenuItem key={item.id} value={item.tipo}>
                        <span className="clFont">{item.tipo}</span>
                      </MenuItem>
                    ))}
                  </TextField>
                  {errors.tiponegocio && (
                    <p className="text-danger clFont">
                      {" "}
                      {errors.tiponegocio.message}{" "}
                    </p>
                  )}
                </div>
              </div>
              <div className="row g-3 mt-1">
                <div className="col-12 col-sm-6 col-md-4  mt-4">
                  <TextField
                    label="Telefono 1"
                    {...register("telefono1", {
                      required: "Este campo es obligatorio",
                    })}
                    fullWidth
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                      },
                    }}
                  />
                  {errors.telefono1 && (
                    <p className="text-danger clFont">
                      {" "}
                      {errors.telefono1.message}{" "}
                    </p>
                  )}
                </div>
                <div className="col-12 col-sm-6 col-md-4  mt-4">
                  <TextField
                    label="Telefono 2"
                    {...register("telefono2")}
                    fullWidth
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                      },
                    }}
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-4  mt-4">
                  <TextField
                    label="Wathsapp"
                    {...register("wathsapp", {
                      required: "Este campo es obligatorio",
                    })}
                    fullWidth
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                      },
                    }}
                  />
                  {errors.wathsapp && (
                    <p className="text-danger clFont">
                      {" "}
                      {errors.wathsapp.message}{" "}
                    </p>
                  )}
                </div>
              </div>
              <div className="row g-3 mt-1">
                <div className="col-12 col-sm-6 col-md-3  mt-4">
                  <TextField
                    label="Pais"
                    {...register("pais", {
                      required: "Este campo es obligatorio",
                    })}
                    fullWidth
                    select
                    value={vpais}
                    onChange={handlePais}
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                      },
                    }}
                  >
                    {Pais.map((item) => (
                      <MenuItem key={item.id} value={item.name}>
                        <span className="clFont">{item.name}</span>
                      </MenuItem>
                    ))}
                  </TextField>
                  {errors.pais && (
                    <p className="text-danger clFont">
                      {" "}
                      {errors.pais.message}{" "}
                    </p>
                  )}
                </div>

                <div className="col-12 col-sm-6 col-md-3  mt-4">
                  <TextField
                    label="Tipo de Moneda"
                    {...register("tipomoneda", {
                      required: "Este campo es obligatorio",
                    })}
                    fullWidth
                    select
                    value={tipoMoneda}
                    onChange={handleMoneda}
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                      },
                    }}
                  >
                    {moneda.map((item) => (
                      <MenuItem key={item.id} value={item.tipomoneda}>
                        <span className="clFont">{item.tipomoneda}</span>
                      </MenuItem>
                    ))}
                  </TextField>
                  {errors.pais && (
                    <p className="text-danger clFont">
                      {" "}
                      {errors.tipomoneda.message}{" "}
                    </p>
                  )}
                </div>

                <div className="col-12 col-sm-6 col-md-3  mt-4">
                  <TextField
                    label="Longitud"
                    {...register("longitud")}
                    fullWidth
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                      },
                    }}
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-3  mt-4">
                  <TextField
                    label="Latitud"
                    {...register("latitud")}
                    fullWidth
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                      },
                    }}
                  />
                </div>
              </div>

              <div className="mt-4">
                <span className="fs-6 fw-medium text-info">
                  Opciones de Negocio
                </span>
              </div>

              <div className="row g-3 mt-1">
                <div className="col-12 col-sm-6 col-md-3  mt-4">
                  <TextField
                    label="Aplicar Mora ?"
                    {...register("aplicarmora")}
                    fullWidth
                    select
                    value={isAplicaMora}
                    onChange={handleMora}
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                      },
                    }}
                  >
                    <MenuItem value="SI">
                      <span className="clFont">Si</span>
                    </MenuItem>
                    <MenuItem value="NO">
                      <span className="clFont">No</span>
                    </MenuItem>
                  </TextField>
                </div>
                <div className="col-12 col-sm-6 col-md-3  mt-4">
                  <TextField
                    label="Imprimir Logo?"
                    {...register("imprimirlogo")}
                    fullWidth
                    select
                    value={isImprimilo}
                    onChange={handleLogo}
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                      },
                    }}
                  >
                    <MenuItem value="SI">
                      <span className="clFont">Si</span>
                    </MenuItem>
                    <MenuItem value="NO">
                      <span className="clFont">No</span>
                    </MenuItem>
                  </TextField>
                </div>
                <div className="col-12 col-sm-6 col-md-3 mt-4">
                  <TextField
                    label="Porcentaje Mora"
                    {...register("modoporcentaje")}
                    fullWidth
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                      },
                    }}
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-3  mt-4">
                  <TextField
                    label="Interes por Defecto"
                    {...register("interesdefecto")}
                    fullWidth
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                      },
                    }}
                  />
                </div>
              </div>

              <div className="row g-3 mt-1">
                <div className="col-12 col-sm-6 col-md-3  mt-4">
                  <Controller
                    name="gastolegal"
                    control={control}
                    render={({ field }) => (
                      <NumericFormat
                        {...field}
                        customInput={TextField} // Usa TextField de Material-UI
                        label="Gasto Legal"
                        variant="outlined"
                        fullWidth
                        thousandSeparator=","
                        decimalSeparator="."
                        prefix="DOP "
                        fixedDecimalScale
                        decimalScale={2}
                        allowNegative={false}
                        value={GastoLegal}
                        onChange={handleGastolegal}
                        // disabled={!capitalValue}

                        onValueChange={(values) => {
                          field.onChange(values.floatValue || 0.0); // Actualiza el valor en react-hook-form
                        }}
                        InputLabelProps={{ style: { fontSize: "0.9rem" } }}
                        InputProps={{
                          style: {
                            fontSize: "0.8rem",
                            borderRadius: "10px",
                            color: "GrayText",
                            backgroundColor: "white",
                          }, // Cambia el tamaño de letra
                        }}
                        sx={{
                          "& input::placeholde": {
                            fontSize: "0.8rem", // Cambia el tamaño de letra del placeholder
                            color: "GrayText", // Opcional: color del placeholder
                          },
                        }}
                        className="clFont"
                      />
                    )}
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-3  mt-4">
                  <Controller
                    name="seguro"
                    control={control}
                    render={({ field }) => (
                      <NumericFormat
                        {...field}
                        customInput={TextField} // Usa TextField de Material-UI
                        label="Seguro"
                        variant="outlined"
                        fullWidth
                        thousandSeparator=","
                        decimalSeparator="."
                        prefix="DOP "
                        fixedDecimalScale
                        decimalScale={2}
                        allowNegative={false}
                        value={Seguro}
                        onChange={handleSeguro}
                        onValueChange={(values) => {
                          field.onChange(values.floatValue || 0.0); // Actualiza el valor en react-hook-form
                        }}
                        InputLabelProps={{ style: { fontSize: "0.9rem" } }}
                        InputProps={{
                          style: {
                            fontSize: "0.8rem",
                            borderRadius: "10px",
                            color: "GrayText",
                            backgroundColor: "white",
                          }, // Cambia el tamaño de letra
                        }}
                        sx={{
                          "& input::placeholde": {
                            fontSize: "0.8rem", // Cambia el tamaño de letra del placeholder
                            color: "GrayText", // Opcional: color del placeholder
                          },
                        }}
                        className="clFont"
                      />
                    )}
                  />
                </div>

                <div className="col-12 col-sm-6 col-md-3  mt-4">
                  <TextField
                    label="Prorroga Mora (Dias)"
                    {...register("prorrogamora")}
                    fullWidth
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                      },
                    }}
                  />
                </div>

                <div className="col-12 col-sm-6 col-md-3  mt-4">
                  <TextField
                    label="Prorroga Pago Cuota"
                    {...register("prorrogacuota")}
                    fullWidth
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                      },
                    }}
                  />
                </div>
              </div>

              <div className="mt-5 d-flex justify-content-center">
                <Button
                  variant="contained"
                  className="me-3 bg-info text-white"
                  style={{ fontSize: "0.8em" }}
                  type="submit"
                >
                  {" "}
                  Guardar
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  sx={{
                    borderColor: "#20b2aa",
                    color: "GrayText",
                    fontSize: "0.8em",
                  }}
                >
                  {" "}
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default MyEmpresa;
