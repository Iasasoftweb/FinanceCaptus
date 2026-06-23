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
import { MisColores } from "../../components/stuff/MisColores.tsx";
import { InputField } from "../../components/stuff/InputField.tsx";
import {
  Rocket,
  X,
  Building2,
  User,
  Building,
  Mail,
  User2,
  MapPinHouse,
  Phone,
  MapPlus,
  MapPinSearch,
  ClockCheck,
  Percent,
} from "lucide-react";
import { SectionTitle } from "../../components/stuff/SectionTitle.tsx";

const MyEmpresa = ({ open }) => {
  const [isModalOpen, setIsModalOpen] = useState(open);
  const [isData, setIsData] = useState([]);
  const [Idempresas, setIdempresas] = useState([]);
  const [tipoN, setTipoN] = useState("");
  const [vpais, setVpais] = useState("");
  const [isAplicaMora, setIsAplicaMora] = useState("false");
  const [isImprimilo, setIsimprimelogo] = useState("");
  const UriImg = `${import.meta.env.VITE_API_URL}/uploads/clientes/empresa/`;
  const URIEmpresas = `${import.meta.env.VITE_API_URL}/empresas/estado/`;
  const UriMoneda = `${import.meta.env.VITE_API_URL}/moneda/`;
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
      aplicarmora: "false",
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
        `${import.meta.env.VITE_API_URL}/uploadEmpresa/`,
        formatdata,
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
    await axios.put(`${import.meta.env.VITE_API_URL}/empresas/${Idempresas}`, data);
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
    <div
      className="container-fluid min-vh-100 p-4"
      style={{
        backgroundColor: MisColores.bgGray,
        fontFamily: "Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      }}
    >
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
              xs: "710px",
              sm: "660px",
              md: "860px",
              lg: "880px",
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
                <Building2 size={20} />
              </div>
              <div>
                <h5 className="fw-bold mb-0" style={{ color: "#2c3e50" }}>
                  Mi Empresa
                </h5>
                <p className="text-muted mb-0 " style={{ fontSize: "0.8em" }}>
                  Configuración de Empresa
                </p>
              </div>
            </div>
            <button className="btn btn-light rounded-circle p-2 text-secondary">
              <X size={20} onClick={handleClose} />
            </button>
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
                      sx={{ width: 80, height: 80, bgcolor: "cadetblue" }}
                      onClick={handleImageClick}
                    />
                  )}

                  <FaCamera onClick={handleImageClick} className="hover-icon" />
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <span className="" style={{ fontSize: "0.7em" }}>
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
            <SectionTitle title="Datos Generales" />

            <form onSubmit={handleSubmit(onSubmit)} className="row g-2">
              <InputField
                label="Nombre de la Empresa"
                icon={Building}
                requerid
                col="col-md-4"
              >
                <input
                  type="text"
                  {...register("empresa", {
                    required: "Este campo es obligatorio",
                  })}
                  className="form-control border-0 shadow-none"
                  style={{ fontSize: "0.8em" }}
                />
              </InputField>
              {errors.empresa && (
                <span className="text-danger clFont">
                  {errors.empresa.message}
                </span>
              )}

              <InputField
                label="Correo Empresarial"
                icon={Mail}
                requerid
                col="col-md-4"
              >
                <input
                  type="text"
                  {...register("correo")}
                  className="form-control border-0 shadow-none"
                  style={{ fontSize: "0.8em" }}
                />
              </InputField>

              <InputField
                label="Numero RNC / Cedula"
                icon={Mail}
                col="col-md-4"
              >
                <input
                  type="text"
                  {...register("rnc")}
                  className="form-control border-0 shadow-none"
                  style={{ fontSize: "0.8em" }}
                />
              </InputField>
              <InputField
                label="Nombre del Gerente"
                icon={User2}
                col="col-md-4"
              >
                <input
                  type="text"
                  {...register("gerente")}
                  className="form-control border-0 shadow-none"
                  style={{ fontSize: "0.8em" }}
                />
              </InputField>

              <InputField label="Dreccion" icon={MapPinHouse} col="col-md-8">
                <input
                  type="text"
                  {...register("direccion")}
                  className="form-control border-0 shadow-none"
                  style={{ fontSize: "0.8em" }}
                />
              </InputField>

              <InputField label="Telefono 1 " icon={Phone} col="col-md-4">
                <input
                  type="text"
                  {...register("telefono1")}
                  className="form-control border-0 shadow-none"
                  style={{ fontSize: "0.8em" }}
                />
              </InputField>

              <InputField label="Telefono 2" icon={Phone} col="col-md-4">
                <input
                  type="text"
                  {...register("telefono2")}
                  className="form-control border-0 shadow-none"
                  style={{ fontSize: "0.8em" }}
                />
              </InputField>

              <InputField label="Wathsapp" icon={Phone} col="col-md-4">
                <input
                  type="text"
                  {...register("whatsapp")}
                  className="form-control border-0 shadow-none"
                  style={{ fontSize: "0.8em" }}
                />
              </InputField>

              <InputField label="Pais" icon={MapPlus} col="col-md-4">
                <select
                  {...register("pais")}
                  className="form-control border-0 shadow-none"
                  style={{ fontSize: "0.8em" }}
                  value={vpais}
                  onChange={handlePais}
                >
                  <option value="">Seleccione un país</option>
                  {Pais &&
                    Pais.map((item) => (
                      <option key={item.id} value={item.name}>
                        <span className="clFont">{item.name}</span>
                      </option>
                    ))}
                </select>
              </InputField>
              <InputField label="Tipo de Moneda" icon={MapPlus} col="col-md-2">
                <select
                  {...register("tipomoneda")}
                  className="form-control border-0 shadow-none"
                  style={{ fontSize: "0.8em" }}
                  value={tipoMoneda}
                  onChange={handleMoneda}
                >
                  <option value="">Seleccione un tipo de moneda</option>
                  {moneda &&
                    moneda.map((item) => (
                      <option key={item.id} value={item.tipomoneda}>
                        <span className="clFont">{item.tipomoneda}</span>
                      </option>
                    ))}
                </select>
              </InputField>

              <InputField label="Latitud" icon={MapPinSearch} col="col-md-3">
                <input
                  type="text"
                  {...register("latitud")}
                  className="form-control border-0 shadow-none"
                  style={{ fontSize: "0.8em" }}
                />
              </InputField>

              <InputField label="Longitud" icon={MapPinSearch} col="col-md-3">
                <input
                  type="text"
                  {...register("longitud")}
                  className="form-control border-0 shadow-none"
                  style={{ fontSize: "0.8em" }}
                />
              </InputField>

              <SectionTitle title="Opciones de Negocios" />

              <InputField
                label="Aplicar Mora?"
                icon={ClockCheck}
                col="col-md-3"
              >
                <select
                  {...register("aplicarmora")}
                  className="form-control border-0 shadow-none"
                  style={{ fontSize: "0.8em" }}
                  value={isAplicaMora}
                  onChange={handleMora}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </InputField>
              <InputField
                label="Imprimir Logo?"
                icon={ClockCheck}
                col="col-md-3"
              >
                <select
                  {...register("imprimirlogo")}
                  className="form-control border-0 shadow-none"
                  style={{ fontSize: "0.8em" }}
                  value={isImprimilo}
                  onChange={handleLogo}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </InputField>

              <InputField label="Porcentaje Mora" icon={Percent} col="col-md-3">
                <input
                  type="text"
                  {...register("modoporcentaje")}
                  className="form-control border-0 shadow-none"
                  style={{ fontSize: "0.8em" }}
                />
              </InputField>

              <InputField
                label="Interes por Defecto"
                icon={Percent}
                col="col-md-3"
              >
                <input
                  type="text"
                  {...register("interesdefecto")}
                  className="form-control border-0 shadow-none"
                  style={{ fontSize: "0.8em" }}
                />
              </InputField>

              <InputField label="Gasto Legal" icon={Percent} col="col-md-3">
                <Controller
                  name="gastolegal"
                  control={control}
                  render={({
                    field: { onChange, value, name, ref },
                    fieldState: { error },
                  }) => (
                    <>
                      <NumericFormat
                        name={name}
                        getInputRef={ref}
                        value={value}
                        thousandSeparator={true}
                        prefix={"DOP "}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        className="form-control border-0 shadow-none fw-bold "
                        placeholder="DOP 0.00"
                        style={{ fontSize: "0.8em" }}
                        
                        onValueChange={(values) => {
                          setGastoLegal(values.floatValue || 0);
                          onChange(values.floatValue || 0);
                        }}
                      />

                      {error && (
                        <span
                          className="text-danger ps-2"
                          style={{ fontSize: "0.7em" }}
                        >
                          {error.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </InputField>

               <InputField label="Seguro" icon={Percent} col="col-md-3">
                <Controller
                  name="seguro"
                  control={control}
                  render={({
                    field: { onChange, value, name, ref },
                    fieldState: { error },
                  }) => (
                    <>
                      <NumericFormat
                        name={name}
                        getInputRef={ref}
                        value={value}
                        thousandSeparator={true}
                        prefix={"DOP "}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        className="form-control border-0 shadow-none fw-bold "
                        placeholder="DOP 0.00"
                        style={{ fontSize: "0.8em" }}
                        
                        onValueChange={(values) => {
                          setSeguro(values.floatValue || 0);
                          onChange(values.floatValue || 0);
                        }}
                      />

                      {error && (
                        <span
                          className="text-danger ps-2"
                          style={{ fontSize: "0.7em" }}
                        >
                          {error.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </InputField>

               <InputField
                label="Prorroga Mora (Dias)"
                icon={ClockCheck}
                col="col-md-3"
              >
                <input
                  type="text"
                  {...register("prorrogamora")}
                  className="form-control border-0 shadow-none"
                  style={{ fontSize: "0.8em" }}
                />
              </InputField>

              <InputField
                label="Prorroga Pago Cuota"
                icon={ClockCheck}
                col="col-md-3"
              >
                <input
                  type="text"
                  {...register("prorrogacuota")}
                  className="form-control border-0 shadow-none"
                  style={{ fontSize: "0.8em" }}
                />
              </InputField>

             

              <div className="mt-1 d-flex justify-content-center p-1 " style={{ width: "100%" , gap: "10px", backgroundColor: MisColores.bgGray}}>
               
                <button
                  className="btn, border-1 p-2 rounded-3 border-light me-4"
                  style={{ fontSize: "0.8em", backgroundColor: MisColores.bgGray }}
                  onClick={handleClose}
                >
                  {" "}
                  Cancelar
                </button>

                 <button
                  className=" btn me-3 text-white"
                  style={{
                    fontSize: "0.8em",
                    backgroundColor: MisColores.headerBlue,
                  }}
                  type="submit"
                >
                  {" "}
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default MyEmpresa;
