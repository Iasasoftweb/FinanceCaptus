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
import { ArrowLeftFromLine, Building, User2, X } from "lucide-react";

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
  const URIs = "http://localhost:5000/tipodocs/";
  const URIs2 = "http://localhost:5000/clientes/";
  const UrisImg = "http://localhost:5000/uploads/";
  const UrisImgDelete = "http://localhost:5000/clientes/deleteimagen/imagen/";
  const URIrutas = "http://localhost:5000/zonas/";
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
      estado: 'Activo',
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
        .get(`http://localhost:5000/jce/${formattedDNInormal}`)
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
      console.log(newNombre || newApellidos);
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

  const UriImgContainer = "http://localhost:5000/uploads/clientes/avata/";
  useEffect(() => {
    if (ModoEdicion && idCliente) {
      axios
        .get(`http://localhost:5000/clientes/${idCliente}`)
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
          "http://localhost:5000/clientes/uploaduser",
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
          `http://localhost:5000/clientes/${idCliente}`,
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
          `http://localhost:5000/clientes/buscar-dni/${data.dni}`,
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
        "http://localhost:5000/uploaduser/",
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
        //  style={{ zIndex: 1900 }}
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
            className="border-1 border-light-subtle "
            onKeyDown={handleKeyDown}
          >
            <div className=" d-flex justify-content-between align-items-center ">
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
                  style={{ cursor:"pointer"}}
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
                <span className="bg-warning-subtle p-2 rounded-4 fw-semibold animar-resalte" style={{ fontSize:"0.8em"}}><ArrowLeftFromLine size={18} className="mx-1" />Click para seleccionar Imagen</span>
              </div>

             

              
            </div>
            <div className="mt-2 mx-4">
              <span className="fs-6 fw-medium text-info">Datos Personales</span>
            </div>
            <div className="mx-4">
              <div className="row ">
                <div className="col-12 col-sm-6 col-md-4  p-2 ">
                  <div className="">
                    <TextField
                      {...register("tipo_dni", {
                        required: "Este campo es obligatorio",
                      })}
                      label="Documento de Identificacion"
                      select
                      value={tipodoc}
                      fullWidth
                      onChange={handleTipoDoc}
                      InputLabelProps={{ style: { fontSize: "0.9em" } }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          fontSize: "12px", // Controla el radio de borde
                          width: "100%",
                          color: "GrayText",
                        },
                      }}
                    >
                      {tipoDocs.map((options) => (
                        <MenuItem key={options.id} value={options.id}>
                          <span className="clFont">{options.tipodoc}</span>
                        </MenuItem>
                      ))}
                    </TextField>
                    {errors.tipo_dni && (
                      <p className="errorColor"> {errors.tipo_dni.message} </p>
                    )}
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-md-4  p-2 ">
                  <div>
                    <TextField
                      label="Nomero de Documento *"
                      fullWidth
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
                      InputLabelProps={{ style: { fontSize: "0.9em" } }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <span>
                              <IconButton
                                onClick={() => {
                                  const dniValue = watch("dni"); // Obtiene el valor actual del campo "dni"
                                  buscarPersonas(`${dniValue}`);
                                }}
                              >
                                {isLoading ? (
                                  <BeatLoader color="#008080" size={15} />
                                ) : (
                                  <IoIosSearch
                                    className="fs-3"
                                    style={{ color: "#008080" }}
                                  />
                                )}
                              </IconButton>
                            </span>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          fontSize: "12px", // Controla el radio de borde
                          width: "100%",
                          color: "GrayText",
                        },
                      }}
                    />
                    {errors.dni && (
                      <p className="errorColor">{errors.dni.message}</p>
                    )}
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-md-4  p-2 ">
                  <div className="">
                    <TextField
                      label="Nombres *"
                      fullWidth
                      value={valorNombre}
                      onInput={handleInputChangeNombres}
                      {...register("nombres", {
                        required: "Este Campo es Obligado",
                      })}
                      InputLabelProps={{ style: { fontSize: "0.9em" } }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          fontSize: "12px", // Controla el radio de borde
                          width: "100%",
                          color: "GrayText",
                        },
                      }}
                    />
                    {errors.nombres && (
                      <p className="errorColor"> {errors.nombres.message} </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="row ">
                <div className="col-12 col-sm-6 col-md-4  p-2 ">
                  <div className="">
                    <TextField
                      label="Apellidos *"
                      fullWidth
                      value={valorApellidos}
                      onInput={handleInputChangeApellidos}
                      {...register("apellidos", {
                        required: "Este campo es obligatorio",
                      })}
                      InputLabelProps={{ style: { fontSize: "0.9em" } }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          fontSize: "12px", // Controla el radio de borde
                          width: "100%",
                          color: "GrayText",
                        },
                      }}
                    />

                    {errors.apellidos && (
                      <p className="errorColor"> {errors.apellidos.message} </p>
                    )}
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-md-4  p-2 ">
                  <TextField
                    label="Apodo "
                    fullWidth
                    onInput={handleInputChange}
                    {...register("apodo")}
                    InputLabelProps={{ style: { fontSize: "0.9em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                        color: "GrayText",
                      },
                    }}
                    className="clFont"
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-4  p-2 ">
                  <TextField
                    label="Estado Civil"
                    fullWidth
                    {...register("estadocivil")}
                    InputLabelProps={{ style: { fontSize: "0.9em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                        color: "GrayText",
                      },
                    }}
                    select
                    onChange={handleEstdoCivil}
                    value={estadoCivil}
                  >
                    <MenuItem className="clFont" value="SOLTERO">
                      SOLTERO
                    </MenuItem>
                    <MenuItem className="clFont" value="CASADA">
                      CASADO
                    </MenuItem>
                    <MenuItem className="clFont" value="CASADA">
                      UNION LIBRE
                    </MenuItem>
                  </TextField>
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-sm-6 col-md-2  p-2 ">
                  <TextField
                    label="Sexo"
                    {...register("sexo")}
                    fullWidth
                    select
                    InputLabelProps={{ style: { fontSize: "0.9em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                        color: "GrayText",
                      },
                    }}
                    value={Sexo}
                    onChange={handleSexo}
                  >
                    <MenuItem value="M" className="clFont">
                      MASCULINO
                    </MenuItem>
                    <MenuItem value="F" className="clFont">
                      FEMENINO
                    </MenuItem>
                  </TextField>
                </div>
                <div className="col-12 col-sm-6 col-md-3  p-2 ">
                  <TextField
                    label="Fecha de Nacimiento"
                    type="Date"
                    value={FechaNac}
                    fullWidth
                    onChange={handleFechaNac}
                    InputLabelProps={{
                      style: { fontSize: "0.9em" },
                      shrink: true,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                        color: "GrayText",
                      },
                    }}
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-3  p-2 ">
                  <TextField
                    label="Escolaridad"
                    {...register("escolaridad")}
                    value={Escolaridad}
                    onChange={handleEscolaridad}
                    select
                    fullWidth
                    InputLabelProps={{
                      style: { fontSize: "0.9em" },
                      shrink: true,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                        color: "GrayText",
                      },
                    }}
                  >
                    <MenuItem className="clFont" value="PRIMARIA">
                      PRIMARIA
                    </MenuItem>
                    <MenuItem className="clFont" value="BACHILLER">
                      BACHILLER
                    </MenuItem>
                    <MenuItem className="clFont" value="UNIVERSITARIO">
                      UNIVERSITARIO
                    </MenuItem>
                    <MenuItem className="clFont" value="NINGUNO">
                      NINGUNO
                    </MenuItem>
                  </TextField>
                </div>
                <div className="col-12 col-sm-6 col-md-4  p-2 ">
                  <TextField
                    label="Nacionalidad"
                    fullWidth
                    {...register("nacionalidad")}
                    select
                    InputLabelProps={{ style: { fontSize: "0.9em" } }}
                    value={Nacionalidad}
                    onChange={handleNacionalidad}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                        color: "GrayText",
                      },
                    }}
                  >
                    {Paises.map((paises) => (
                      <MenuItem
                        value={paises.name}
                        key={paises.id}
                        className="clFont"
                      >
                        {" "}
                        {paises.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </div>
              <div className="mt-2 mx-1">
                <span className="fs-6 fw-medium text-info">Contacto</span>
              </div>
              <div className="row">
                <div className="col-12 col-sm-6 col-md-5  p-2 ">
                  <TextField
                    label="Direccion *"
                    {...register("direccion", { required: "Campo requerido" })}
                    fullWidth
                    onInput={handleInputChange}
                    InputLabelProps={{
                      style: { fontSize: "0.9em" },
                      shrink: true,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                        color: "GrayText",
                      },
                    }}
                  />
                  {errors.direccion && (
                    <p className="errorColor"> {errors.direccion.message} </p>
                  )}
                </div>
                <div className="col-12 col-sm-6 col-md-3  p-2 ">
                  <TextField
                    label="Ciudad"
                    fullWidth
                    {...register("ciudad")}
                    select
                    InputLabelProps={{ style: { fontSize: "0.9em" } }}
                    value={Ciudad}
                    onChange={handleCiudad}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                        color: "GrayText",
                      },
                    }}
                  >
                    {Provincias.map((provincia) => (
                      <MenuItem
                        value={provincia.name}
                        key={provincia.code}
                        className="clFont"
                      >
                        {" "}
                        {provincia.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className="col-12 col-sm-6 col-md-2  p-2 ">
                  <TextField
                    label="Telefono 1 *"
                    {...register("telefono1", { required: "Campo requerido" })}
                    fullWidth
                    InputLabelProps={{ style: { fontSize: "0.9em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                        color: "GrayText",
                      },
                    }}
                    onChange={handleTelefono1Change}
                  />
                  {errors.telefono1 && (
                    <p className="errorColor">{errors.telefono1.message}</p>
                  )}
                </div>
                <div className="col-12 col-sm-6 col-md-2  p-2 ">
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
                        color: "GrayText",
                      },
                    }}
                    onChange={handleTelefono2Change}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-sm-6 col-md-6  p-2 ">
                  <TextField
                    label="Referencia"
                    {...register("referencia")}
                    fullWidth
                    onInput={handleInputChange}
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                        color: "GrayText",
                      },
                    }}
                    // onChange={handleTelefono2Change}
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-6  p-2 ">
                  <TextField
                    label="@ Email"
                    {...register("email")}
                    fullWidth
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                        color: "GrayText",
                      },
                    }}
                    // onChange={handleTelefono2Change}
                  />
                </div>
              </div>
              <div className="mt-2 mx-1">
                <span className="fs-6 fw-medium text-info">Datos Laboral</span>
              </div>
              <div className="row">
                <div className="col-12 col-sm-6 col-md-3  p-2 ">
                  <TextField
                    label="Ocupacion"
                    {...register("ocupacion")}
                    onInput={handleInputChange}
                    fullWidth
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                        color: "GrayText",
                      },
                    }}
                  >
                    {" "}
                  </TextField>
                </div>
                <div className="col-12 col-sm-6 col-md-3  p-2 ">
                  <TextField
                    label="Telefono del Tabajo"
                    {...register("telefonotrabajo")}
                    fullWidth
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                        color: "GrayText",
                      },
                    }}
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-3  p-2 ">
                  <TextField
                    label="Fecha Ingreso Trabajo"
                    type="Date"
                    value={FechaTranajo}
                    fullWidth
                    onChange={handleFechaIngresoTrabajo}
                    InputLabelProps={{
                      style: { fontSize: "0.9em" },
                      shrink: true,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                        color: "GrayText",
                      },
                    }}
                  />
                </div>
                <div className="col-12 col-sm-6 col-md-3  p-2 ">
                  <Controller
                    name="sueldo"
                    control={control}
                    render={({ field }) => (
                      <NumericFormat
                        {...field}
                        customInput={TextField} // Usa TextField de Material-UI
                        label="Sueldo"
                        variant="outlined"
                        fullWidth
                        thousandSeparator=","
                        decimalSeparator="."
                        prefix="DOP "
                        fixedDecimalScale
                        decimalScale={2}
                        allowNegative={false}
                        onValueChange={(values) => {
                          field.onChange(values.floatValue || 0.0); // Actualiza el valor en react-hook-form
                        }}
                        InputLabelProps={{ style: { fontSize: "0.8rem" } }}
                        InputProps={{
                          style: {
                            fontSize: "0.8rem",
                            borderRadius: "10px",
                            color: "GrayText",
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
              </div>
              <div className="row">
                <div className="col-12 col-sm-6 col-md-4  p-2 ">
                  <TextField
                    label="Tipo de Vivienda"
                    {...register("vivienda")}
                    select
                    fullWidth
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                        color: "GrayText",
                      },
                    }}
                    value={Viviendas}
                    onChange={handleViviendas}
                  >
                    <MenuItem value="ALQUILADA" className="clFont">
                      ALQUILADA
                    </MenuItem>
                    <MenuItem value="PROPIA" className="clFont">
                      PROPIA
                    </MenuItem>
                    <MenuItem value="PRESTADO" className="clFont">
                      PRESTADA
                    </MenuItem>
                  </TextField>
                </div>
                <div className="col-12 col-sm-6 col-md-4  p-2 ">
                  <TextField
                    label="Ruta Asignada"
                    {...register("idrutas", { required: "Campo requerido" })}
                    select
                    fullWidth
                    InputLabelProps={{ style: { fontSize: "0.8em" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                        color: "GrayText",
                      },
                    }}
                    onChange={handleIdRutas}
                    value={idRutas}
                  >
                    {Rutas.map((itemruta) => (
                      <MenuItem
                        value={itemruta.id}
                        key={itemruta.id}
                        className="clFont"
                      >
                        {itemruta.nombrerutas}
                      </MenuItem>
                    ))}
                  </TextField>
                  {errors.idrutas && (
                    <p className="errorColor">{errors.idrutas.message}</p>
                  )}
                </div>
                <div className="col-12 col-sm-6 col-md-4  p-2 ">
                  <Controller
                    name="limitecredito"
                    control={control}
                    render={({ field }) => (
                      <NumericFormat
                        {...field}
                        customInput={TextField} // Usa TextField de Material-UI
                        label="Limite Credito"
                        variant="outlined"
                        fullWidth
                        thousandSeparator=","
                        decimalSeparator="."
                        prefix="DOP "
                        fixedDecimalScale
                        decimalScale={2}
                        allowNegative={false}
                        onValueChange={(values) => {
                          field.onChange(values.floatValue || 0.0); // Actualiza el valor en react-hook-form
                        }}
                        InputLabelProps={{ style: { fontSize: "0.8rem" } }}
                        InputProps={{
                          style: {
                            fontSize: "0.8rem",
                            borderRadius: "10px",
                            color: "GrayText",
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
              </div>
            </div>
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
