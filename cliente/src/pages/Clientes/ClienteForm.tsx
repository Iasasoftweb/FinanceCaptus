import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import React, { useState, useEffect, useRef } from "react";
import Provincias from "../../data/Apis/Provincias.json";
import Paises from "../../data/Apis/Paises.json";
import { MdOutlineSaveAlt } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import type { FieldValues } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
//import JCE from "../../data/Apis/DataJCE.json";
import {
  Avatar,
  Box,
  Button,
  createTheme,
  IconButton,
  InputAdornment,
  MenuItem,
  Modal,
  styled,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import CurrencyInput from "react-currency-input-field";
import TitleTop from "../../components/TitleTop/TItleTop";
import { LiaUserEditSolid } from "react-icons/lia";
import { Tabs, Tab } from "react-bootstrap";
import { SiMeteor } from "react-icons/si";
import Logo from "../../components/Brand/Brand.tsx";
import { NumericFormat } from "react-number-format";
import CurrencyTextField from "../../components/stuff/InputMoney.tsx";
import { TbBorderRadius } from "react-icons/tb";
import { IoIosSearch } from "react-icons/io";
import BeatLoader from "react-spinners/BeatLoader";
import { MisColores } from "../../components/stuff/MisColores.tsx";
import {
  ArrowLeftFromLine,
  Building,
  Building2,
  Calendar,
  DollarSign,
  FileUser,
  Funnel,
  GraduationCap,
  House,
  IdCard,
  MailPlus,
  MapPinHouse,
  MessageCircleCheck,
  Phone,
  Route,
  TrafficCone,
  User,
  User2,
  VenusAndMars,
  X,
} from "lucide-react";
import { SectionTitle } from "../../components/stuff/SectionTitle.tsx";
import { InputField } from "../../components/stuff/InputField.tsx";

type FormValues = {
  sueldo: number;
  limitecredito: number; // El campo que almacenará el valor en formato de moneda
};

const StyledTextField = styled(TextField)({
  "&::placeholder": {
    fontSize: "16px", // Aquí defines el tamaño de la letra del placeholder
  },
});

const ClienteForm = ({
  ModoEdicion,
  idCliente,
  open,
  handleClose,
  updateList,
}) => {
  const [dataCliente, setDataCliente] = useState([]);
  const [tipoDocs, setTipoDocs] = useState([]);
  const [filet, setFile] = useState("");
  const [preview, setPreview] = useState(null);
  const [imgFilename, setImgFileName] = useState(null);
  const [Rutas, setGetRutas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(open);
  const URIs = `${import.meta.env.VITE_API_URL}/tipodocs/`;
  const URIs2 = `${import.meta.env.VITE_API_URL}/clientes/`;
  const UrisImg = `${import.meta.env.VITE_API_URL}/uploads/`;
  const UrisImgDelete = `${import.meta.env.VITE_API_URL}/clientes/deleteimagen/imagen/`;
  const URIrutas = `${import.meta.env.VITE_API_URL}/zonas/`;
  const [isLoading, setIsLoading] = useState(false);
  const [dni, setDni] = useState("");
  const [tipodoc, setTipoDoc] = useState("");
  const [estadoCivil, setEstadoCivil] = useState("");
  const [Nacionalidad, setNacionalidad] = useState("");
  const [Ciudad, setCiudad] = useState("");
  const [Sexo, setSexo] = useState("");
  const [FechaNac, setFechaNac] = useState("");
  const [Escolaridad, setEscolaridad] = useState("");
  const [FechaTranajo, setFechaTrabajo] = useState("");
  const [Sueldo, setSueldo] = useState("");
  const [idRutas, setIdRutas] = useState("");
  const [Viviendas, setViviendas] = useState("");
  const [Cedula, setCedula] = useState("");
  const [valorNombre, setValorNombre] = useState("");
  const [valorApellidos, setValorApellidos] = useState("");
  const [newNombre, setNewNombre] = useState("");
  const [newApellidos, setNewApellidos] = useState("");
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [longitud, setLongitud] = useState("18.45310764759655");
  const [latitud, setLatitud] = useState("-70.73452937006576");
  const [SueldoLimite, setSueldoLimite] = useState(0);

  const theme = createTheme({
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiInputBase-input": {
              borderRadius: "10px",

              width: "100%",
              // color: "GrayText",
              fontSize: "0.8rem", // Cambia el tamaño de letra
            },
          },
        },
      },
    },
  });

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const inputFileRef = useRef(null);

  const delImg = async (img) => {
    try {
      await axios.delete(`${UrisImgDelete}${img}`);
      console.log(" Imagen Elimnada :" + img);
    } catch (error) {
      console.error("No se pudo eliminar el archivos");
    }
  };

  const inputFile = () => {
    inputFileRef.current.click();
  };

  useEffect(() => {
    setIsModalOpen(open);
    axios
      .get(URIs)
      .then((response) => {
        setTipoDocs(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [open]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    control,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      tipo_dni: 1,
      fecha_nac: new Date(),
      idrutas: 1,
      estado: "Activo",
      sueldo: 0.0,
      longitud: "-70.123456", // Valor por defecto inicial
      latitud: "18.456789",
    },
  });

  // const changeUpFile = (v) => {
  //   console.log(v)
  //   uploadImagen(v);
  // };

  useEffect(() => {
    axios
      .get(URIrutas)
      .then((responde) => {
        setGetRutas(responde.data);
        console.log(responde.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const prevFOTO = (v1) => {};

  const upFoto = (originalName) => {
    console.log(originalName);
    setValue("imgFOTOS", originalName);
    prevFOTO(originalName);
    setImgFileName(originalName);
    setPreview(originalName);
  };

  const formatCurrency = (value: string): string => {
    const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, "") || "0");
    return numericValue.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const handleSueldo = (event) => {
    setSueldo(event.target.value); // Actualizar estado con valor formateado
  };

  const formatTelefono = (valor) => {
    const soloNumeros = valor.replace(/\D/g, "");
    const formato = soloNumeros.replace(
      /(\d{3})(\d{0,3})(\d{0,4})/,
      "$1-$2-$3",
    );

    return formato;
  };

  const formatDNI = (value) => {
    const cleanedValue = value.replace(/\D/g, "");
    const formatedValue = cleanedValue.replace(
      /(\d{3})(\d{7})(\d{1})/,
      "$1-$2-$3",
    );

    return formatedValue;
  };

  const formatDNI2 = (value) => {
    const cleanedValue = value.replace(/\D/g, "");
    const formatedValue = cleanedValue.replace(
      /(\{3})(\{7})(\{1})/,
      "$1-$2-$3",
    );

    return formatedValue;
  };

  const handleInputChangeNombres = (event) => {
    const upperCaseValue = event.target.value.toUpperCase();
    setValorNombre(upperCaseValue);
    setValue(event.target.name, upperCaseValue, { shouldValidate: true });
  };

  const handleInputLongitud = (event) => {
    setValue("Longitud", "-70.73452937006576", { shouldValidate: true });
  };

  const handleInputLatitud = (event) => {
    setValue("Latitud", "18.45310764759655", { shouldValidate: true });
  };

  const handleInputChangeApellidos = (event) => {
    const upperCaseValue = event.target.value.toUpperCase();
    setValorApellidos(upperCaseValue);
    setValue(event.target.name, upperCaseValue, { shouldValidate: true });
  };
  const handleInputChange = (e) => {
    const upperCaseValue = e.target.value.toUpperCase();
    setValue(e.target.name, upperCaseValue, { shouldValidate: true });
  };

  const buscarPersonas = (event) => {
    const formattedDNInormal = formatDNI2(event);

    if (formattedDNInormal.length == 11) {
      setIsLoading(true);
      axios
        .get(`${import.meta.env.VITE_API_URL}/jce/${formattedDNInormal}`)
        .then((personas) => {
          setNewNombre(personas.data.nombres);
          setNewApellidos(
            personas.data.apellido1 + " " + personas.data.appelido2,
          );
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No se encontró ninguna persona con esa cédula.",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El formato es incorrecto..",
      });
      console.log("No se encontró ninguna persona con esa cédula."); // Mensaje si no se encuentra
    }
  };

  useEffect(() => {
    if (newNombre) {
      setValorNombre(newNombre);
      setValue("nombres", newNombre);

      setValorApellidos(newApellidos);
      
    } else {
      setValorNombre("");
      setValue("nombres", "");
    }
  }, [newNombre, newApellidos, setValue]);

  const handleDNIChange = (event) => {
    const formattedDNI = formatDNI(event.target.value);
    console.log(event.target.value);

    setValue("dni", formattedDNI);
  };

  const handleTelefono1Change = (event) => {
    const formattedTelefono = formatTelefono(event.target.value);
    setValue("telefono1", formattedTelefono);
  };

  const handleTelefono2Change = (event) => {
    const formattedTelefono = formatTelefono(event.target.value);
    setValue("telefono2", formattedTelefono);
  };

  const handleTelefono3Change = (event) => {
    const formattedTelefono = formatTelefono(event.target.value);
    setValue("telefonotrabajo", formattedTelefono);
  };

  const UriImgContainer = `${import.meta.env.VITE_API_URL}/uploads/clientes/avata/`;
  useEffect(() => {
    if (ModoEdicion && idCliente) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/clientes/${idCliente}`)
        .then((response) => {
          setNewNombre(response.data.nombres);
          setNewApellidos(response.data.apellidos);
          setDataCliente(response.data);
          reset(response.data);
          setFile(response.data.imgFOTOS);
          if (response.data.imgFOTOS && response.data.imgFOTOS !== "") {
            setPreview(`${UriImgContainer}${response.data.imgFOTOS}`);
          } else {
            setPreview(null); // O una imagen por defecto
          }
          setTipoDoc(response.data.tipo_dni);
          setEstadoCivil(response.data.estadocivil);
          setNacionalidad(response.data.nacionalidad);
          setCiudad(response.data.ciudad);
          setSexo(response.data.sexo);
          setFechaNac(response.data.fecha_nac);
          setEscolaridad(response.data.escolaridad);
          setFechaTrabajo(response.data.fechaingresotrabajo);
          setIdRutas(response.data.idrutas);
          setViviendas(response.data.vivienda);
          setLongitud(response.data.longitud);
          setLatitud(response.data.latitud);
          reset(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [ModoEdicion, idCliente, reset]);

  const onSubmit = async (data: FieldValues) => {
    try {
      let finalFileName = data.imgFOTOS; // Valor por defecto (el que ya tiene o el del input)

      // --- LOGICA DE SUBIDA DE IMAGEN ---
      // Si seleccionaste un archivo nuevo (fileToUpload es el estado que guarda el archivo binario)
      if (fileToUpload) {
        const formData = new FormData();
        console.log(fileToUpload);
        // ESTE NOMBRE "avatar" debe ser igual al del backend .single("avatar")
        formData.append("avatar", fileToUpload);

        const resImg = await axios.post(
          `${import.meta.env.VITE_API_URL}/clientes/uploaduser`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        // Ahora resImg.data.filename tendrá el nombre real (ej: avatar171338...jpg)
        finalFileName = resImg.data.filename;
      }

      // Actualizamos el objeto data con el nombre real de la imagen antes de enviar a la DB
      const datosParaEnviar = { ...data, imgFOTOS: finalFileName };

      if (ModoEdicion) {
        // --- MODO EDICIÓN ---
        await axios.put(
          `${import.meta.env.VITE_API_URL}/clientes/${idCliente}`,
          datosParaEnviar,
        );

        Swal.fire({
          position: "center",
          icon: "success",
          html: '<p style="color: gray; font-weight: normal;">Cliente Actualizado.</p>',
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        // --- MODO CREACIÓN ---
        // 1. Validar DNI duplicado

        const findDni = await axios.get(
          `${import.meta.env.VITE_API_URL}/clientes/buscar-dni/${data.dni}`,
        );

        if (findDni.data) {
          return Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Este cliente ya está creado.",
          });
        }

        // 2. Guardar nuevo cliente
        await axios.post(URIs2, datosParaEnviar);

        Swal.fire({
          position: "top-end",
          icon: "success",
          html: '<p style="color: gray; font-weight: normal;">Cliente Guardado.</p>',
          showConfirmButton: false,
          timer: 2000,
        });
      }

      // --- FINALIZACIÓN ---
      reset();
      setPreview(null); // Limpiamos la previsualización
      setFileToUpload(null); // Limpiamos el archivo pendiente

      CloseModal();

      // Cerramos el modal
    } catch (error) {
      console.error("Error en el registro:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al procesar la solicitud.",
      });
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Previene el comportamiento predeterminado de la tecla Enter
    }
  };

  const CloseModal = () => {
    handleClose();
    updateList();
  };
  const handleEstdoCivil = (e) => {
    setEstadoCivil(e.target.value);
  };

  const handleSexo = (e) => {
    setSexo(e.target.value);
  };

  const handleNacionalidad = (e) => {
    setNacionalidad(e.target.value);
  };
  const handleCiudad = (e) => {
    setCiudad(e.target.value);
  };

  const handleEscolaridad = (e) => {
    setEscolaridad(e.target.value);
  };
  const handleFechaIngresoTrabajo = (e) => {
    setFechaTrabajo(e.target.value);
  };
  const handleFechaNac = (e) => {
    setFechaNac(e.target.value);
  };
  const handleTipoDoc = (e) => {
    setTipoDoc(e.target.value);
  };

  const handleViviendas = (e) => {
    setViviendas(e.target.value);
  };

  const handleIdRutas = (e) => {
    setIdRutas(e.target.value);
  };
  const handleDni = (e) => {
    setDni(e.target.value);
  };

  const changeUpFile = async (file) => {
    if (!file) return;

    const formData = new FormData();
    // "avatar" o "file" debe coincidir con lo que Multer espera en el backend
    formData.append("avatar", file);

    try {
      const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/uploaduser/` ,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      // Si el backend te devuelve el nuevo nombre del archivo, lo guardas en el form
      setValue("imgFOTOS", res.data.filename);
      console.log("Subida exitosa");
    } catch (error) {
      console.error("Error al subir imagen:", error);
    }
  };

  return (
    <div className="row p-2">
      <Modal
        open={isModalOpen}
        onClose={CloseModal}
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
              xs: "700px",
              sm: "650px",
              md: "850px",
              lg: "870px",
            },
            transform: "translate(-50%, -50%)",
            width: {
              xs: "90%", // 90% del ancho en pantallas extra pequeñas
              sm: "80%", // 80% del ancho en pantallas pequeñas
              md: 800, // 600px en pantallas medianas
              lg: 1000, // 800px en pantallas grandes
            },
            bgcolor: "background.paper",
            boxShadow: 24,
          }}
        >
          <div className="card-header border-bottom bg-white p-3 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <div
                className="p-2 rounded-3 text-white d-flex align-items-center justify-content-center shadow-sm"
                style={{
                  backgroundColor: MisColores.headerBlue,
                  width: "45px",
                  height: "45px",
                }}
              >
                <User2 size={20} />
              </div>
              <div>
                <h2
                  className="fw-bold mb-0"
                  style={{ color: "#2c3e50", fontSize: "1.5rem" }}
                >
                  Clientes
                </h2>
                <p className="text-muted mb-0 small">
                  {ModoEdicion
                    ? "Editando Cliente"
                    : "Insertando nuevo cliente"}
                </p>
              </div>
            </div>
            <button
              className="btn btn-light rounded-circle p-2 text-secondary hover:bg-danger hover:text-white transition-all"
              onClick={handleClose}
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="border-1 border-light-subtle row g-3 mx-2"
            onKeyDown={handleKeyDown}
          >
            <div className=" d-flex justify-content-between align-items-center mb-0 ">
              <div className="d-flex align-items-center">
                <input
                  type="file"
                  ref={inputFileRef}
                  style={{ display: "none" }}
                  accept=".jpg, .jpeg, .png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFileToUpload(file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />

                <div
                  className="d-flex justify-content-center p-1 mx-3 "
                  onClick={() => inputFileRef.current.click()}
                  style={{ cursor: "pointer" }}
                >
                  {preview ? (
                    <Avatar
                      src={preview}
                      sx={{
                        width: 100,
                        height: 100,
                        objectFit: "contain",
                        backgroundColor: MisColores.bgGray,
                      }}
                    >
                      {newNombre ? newNombre.charAt(0).toUpperCase() : "C"}
                    </Avatar>
                  ) : (
                    <div
                      className="rounded-circle bg-dark-subtle d-inline-flex align-items-center justify-content-center border border-2 border-white shadow-sm"
                      style={{
                        width: "75px",
                        height: "75px",
                        backgroundColor: MisColores.grayMute,
                      }}
                    >
                      <div className="text-center">
                        {" "}
                        <h5 className="mb-0 text-muted fs-3 fw-semibold">
                          {newNombre && newApellidos
                            ? `${newNombre.charAt(0).toUpperCase()}${newApellidos.charAt(0).toUpperCase()}`
                            : "?"}
                        </h5>
                      </div>
                    </div>
                  )}
                </div>
                <span
                  className="bg-warning-subtle p-2 rounded-4 fw-semibold animar-resalte"
                  style={{ fontSize: "0.8em" }}
                >
                  <ArrowLeftFromLine size={18} className="mx-1" />
                  Click para seleccionar Imagen
                </span>
              </div>
            </div>

            <div className="card-body ">
              <SectionTitle title="Datos Personales" />
            </div>

            <InputField
              label="Número de Cédula"
              readOnly
              required
              icon={IdCard}
              
              col="col-md-3"

            >
              <select
                className="form-control form-control-sm clFont"
                {...register("tipo_dni", {
                  required: "Este campo es obligatorio",
                })}
                value={tipodoc}
                onChange={handleTipoDoc}
              >
                <option value="">Seleccione...</option>
                {tipoDocs.map((options) => (
                  <option key={options.id} value={options.id}>
                    <span className="clFont">{options.tipodoc}</span>
                  </option>
                ))}
              </select>
            </InputField>

            <InputField
              label="Número de Cédula"
              icon={IdCard}
              endIcon={Funnel}
              onEndIconClick={() => buscarPersonas(watch("dni"))}
              col="col-md-3"
              required
              error={errors.dni?.message}
            >
              <input
                type="text"
                className="form-control form-control-sm clFont"
                {...register("dni", {
                  required: "Este campo es obligatorio",
                  minLength: {
                    value: 13,
                    message: "El DNI no debe tener menos 13 caracateres",
                  },
                  maxLength: {
                    value: 13,
                    message: "El DNI no debe tener mas de 13 caracteres",
                  },
                })}
                onChange={handleDNIChange}
                value={watch("dni")}
              />
            </InputField>

            <InputField
              label="Nombres"
              icon={User2}
              col="col-md-3"
              required
              error={errors.nombres?.message}
            >
              <input
                type="text"
                className="form-control form-control-sm clFont"
                {...register("nombres", {
                  required: "Este campo es obligatorio",
                })}
                onInput={handleInputChangeNombres}
              />
            </InputField>

            <InputField
              label="Apellidos"
              icon={User2}
              col="col-md-3"
              required
              error={errors.apellidos?.message}
            >
              <input
                type="text"
                className="form-control form-control-sm clFont"
                {...register("apellidos", {
                  required: "Este campo es obligatorio",
                })}
                onInput={handleInputChangeApellidos}
              />
            </InputField>

            <InputField label="Apodo" icon={User} col="col-md-3">
              <input
                type="text"
                className="form-control form-control-sm clFont"
                {...register("apodo")}
                onInput={handleInputChange}
              />
            </InputField>

            <InputField label="Estado Civil" icon={FileUser} col="col-md-3">
              <select
                className="form-control form-control-sm clFont"
                {...register("estadocivil")}
                onChange={handleEstdoCivil}
              >
                <option value="">Seleccione...</option>
                <option value="SOLTERO">Soltero</option>
                <option value="CASADA">Casado</option>
                <option value="UNIONLIBRE">Unión Libre</option>
              </select>
            </InputField>

            <InputField label="Sexo" icon={VenusAndMars} col="col-md-3">
              <select
                className="form-control form-control-sm clFont"
                {...register("sexo")}
                value={Sexo}
                onChange={handleSexo}
              >
                <option value="">Seleccione...</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </InputField>

            <InputField label="Fecha" icon={Calendar} required col="col-md-3">
              <input
                type="date"
                className="form-control border-0 shadow-none clFont"
                style={{ fontSize: "0.8em" }}
                {...register("fecha_nac")}
                onChange={handleFechaNac}
                value={FechaNac}
              />
            </InputField>

            <InputField label="Escolaridad" icon={GraduationCap} col="col-md-3">
              <select
                className="form-control border-0 shadow-none clFont"
                style={{ fontSize: "0.8em" }}
                {...register("escolaridad")}
                value={Escolaridad}
                onChange={handleEscolaridad}
              >
                <option value="">Seleccione...</option>
                <option value="PRIMARIA">Primaria</option>
                <option value="SECUNDARIA">Secundaria</option>
                <option value="SUPERIOR">Superior</option>
                <option value="NINGUNO">Ninguno</option>
              </select>
            </InputField>

            <InputField label="Nacionalidad" icon={MapPinHouse} col="col-md-3">
              <select
                className="form-control border-0 shadow-none clFont"
                style={{ fontSize: "0.8em" }}
                {...register("nacionalidad")}
                value={Nacionalidad}
                onChange={handleNacionalidad}
              >
                <option value="">Seleccione...</option>
                {Paises.map((paises) => (
                  <option
                    value={paises.name}
                    key={paises.id}
                    className="clFont"
                  >
                    {" "}
                    {paises.name}
                  </option>
                ))}
              </select>
            </InputField>

            <InputField
              label="Teléfono 1"
              icon={Phone}
              col="col-md-3"
              required
              error={errors.telefono1?.message}
            >
              <input
                type="text"
                className="form-control border-0 shadow-none clFont"
                {...register("telefono1", { required: "Campo requerido" })}
                onChange={handleTelefono1Change}
              />
            </InputField>

            <InputField label="Teléfono 1" icon={Phone} col="col-md-3">
              <input
                type="text"
                className="form-control border-0 shadow-none clFont"
                {...register("telefono2")}
                onChange={handleTelefono2Change}
              />
            </InputField>

            <InputField label="Ciudad" icon={Building2} col="col-md-3">
              <select
                className="form-control border-0 shadow-none clFont"
                style={{ fontSize: "0.8em" }}
                {...register("ciudad", { required: "Campo requerido" })}
                value={Ciudad}
                onChange={handleCiudad}
              >
                <option value="">Seleccione...</option>
                {Provincias.map((provincias) => (
                  <option
                    value={provincias.name}
                    key={provincias.id}
                    className="clFont"
                  >
                    {" "}
                    {provincias.name}
                  </option>
                ))}
              </select>
            </InputField>

            <InputField
              label="Dirección"
              icon={Building}
              col="col-md-9"
              error={errors.direccion?.message}
              required
            >
              <input
                type="text"
                className="form-control border-0 shadow-none clFont"
                style={{ fontSize: "0.8em" }}
                {...register("direccion", { required: "Campo requerido" })}
                onInput={handleInputChange}
              />
            </InputField>

            <InputField
              label="Referencia"
              icon={MessageCircleCheck}
              col="col-md-6"
            >
              <input
                type="text"
                className="form-control border-0 shadow-none clFont"
                style={{ fontSize: "0.8em" }}
                {...register("referencia")}
                onInput={handleInputChange}
              />
            </InputField>

            <InputField label="@ Email" icon={MailPlus} col="col-md-6">
              <input
                type="email"
                className="form-control border-0 shadow-none clFont"
                style={{ fontSize: "0.8em" }}
                {...register("email")}
                onInput={handleInputChange}
              />
            </InputField>

            <div className="card-body ">
              <SectionTitle title="Otros Datos" />
            </div>

            <InputField label="Ocupación" icon={TrafficCone} col="col-md-3">
              <input
                type="text"
                className="form-control border-0 shadow-none clFont"
                {...register("ocupacion")}
                onInput={handleInputChange}
              />
            </InputField>

            <InputField label="Telefono de Trabajo" icon={Phone} col="col-md-3">
              <input
                type="text"
                className="form-control border-0 shadow-none clFont"
                {...register("telefonotrabajo")}
                onChange={handleTelefono3Change}
              />
            </InputField>

            <InputField
              label="Fecha de Ingreso al Trabajo"
              icon={Calendar}
              required
              col="col-md-3"
            >
              <input
                type="date"
                className="form-control border-0 shadow-none clFont"
                style={{ fontSize: "0.8em" }}
                {...register("fechaingresotrabajo")}
                value={FechaTranajo}
                onChange={handleFechaIngresoTrabajo}
              />
            </InputField>


            <InputField label="Sueldo" icon={DollarSign} col="col-md-3">
                  <Controller
                    name="sueldo"
                    control={control}
                    defaultValue=""
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
                          className="form-control border-0 shadow-none fw-bold"
                          placeholder="DOP 0.00"
                          onChange={(e) => handleSueldoChange(e.target.value)}
                          onValueChange={(values) => {
                            // Actualiza el formulario (esto es ligero y no pierde el foco)
                            onChange(values.floatValue || 0);
                          }}
                          style={{ fontSize: "0.8em" }}
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

                <InputField label="Tipo de Vivienda" icon={House} col="col-md-3">
                  <select
                    className="form-control border-0 shadow-none clFont"
                    style={{ fontSize: "0.8em" }}
                    {...register("vivienda")}
                    value={Viviendas}
                    onChange={handleViviendas}
                  >
                    <option value="">Seleccione...</option>
                    <option value="ALQUILADA">Alquilada</option>
                    <option value="PROPIA">Propia </option>
                    <option value="PRESTADA">Prestada</option>
                  </select>
                </InputField>

                <InputField label="Rutas" icon={Route} col="col-md-3" requerido error={errors.idrutas?.message}>
                   <select className="form-control border-0 shadow-none clFont"
                     {...register("idrutas", { required: "Campo requerido" })}
                     value={idRutas}
                     onChange={handleIdRutas} 
                    style={{ fontSize: "0.8em" }}>
                     <option value="">Seleccione...</option>
                      {Rutas.map((itemruta) => (
                      <option
                        value={itemruta.id}
                        key={itemruta.id}
                        className="clFont"
                      >
                        {itemruta.nombrerutas}
                      </option>
                    ))}
                   </select>
                 </InputField>


                 <InputField label="Límite de Crédito" icon={DollarSign} col="col-md-3" requerido error={errors.limitecredito?.message}>
                  <Controller
                    name="limitecredito"
                    control={control}
                    defaultValue=""
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
                          className="form-control border-0 shadow-none fw-bold"
                          placeholder="DOP 0.00"
                          onChange={(e) => handleLimiteCreditoChange(e.target.value)}
                          onValueChange={(values) => {
                            // Actualiza el formulario (esto es ligero y no pierde el foco)
                            onChange(values.floatValue || 0);
                          }}
                          style={{ fontSize: "0.8em" }}
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

            
            <div className=" bg-body-secondary d-flex justify-content-center align-items-center p-3 ">
              <div className=" d-flex justify-content-end p-2">
                <button
                  className="btn btn-primary clFont text-white p-2 mx-2"
                  type="submit"
                  //  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  <MdOutlineSaveAlt />
                  {!ModoEdicion ? "Insertar" : "Guardar Cambios"}
                </button>
                <button
                  className="btn btn-success clFont text-white p-2"
                  onClick={handleClose}
                  type="button"
                >
                  <MdOutlineCancel />
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default ClienteForm;
