import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import {
  Box,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import { AiOutlineCalculator } from "react-icons/ai";
import { useForm, Controller, useWatch } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { SiMeteor } from "react-icons/si";
import Logo from "../../components/Brand/Brand.tsx";
import { RiUserLine } from "react-icons/ri";
import axios from "axios";
import FechaCorta from "../../components/stuff/fechaCorta.tsx";
import { CiCalendarDate } from "react-icons/ci";
import {
  PiIdentificationCardThin,
  PiMapPinLineThin,
  PiPercentLight,
} from "react-icons/pi";
import TipoAmortizacion from "../../data/Apis/TipoAmortizacion.json";
import Frecuencias from "../../data/Apis/Modalidad.json";
import { NumericFormat } from "react-number-format";
import "./PrestamosForm.css";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LuMessageSquareMore, LuUserRoundCheck } from "react-icons/lu";
import limpiarMonto from "../../components/stuff/LimpiarMonto.tsx";
import Swal from "sweetalert2";
import CalcularInteres from "./CalculoInteres.tsx";
import { LiaMapMarkedAltSolid } from "react-icons/lia";
import {
  MdOutlineCancel,
  MdOutlinePhoneInTalk,
  MdOutlineSaveAlt,
} from "react-icons/md";
import CuotasList from "./CuotasList.tsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MButton from "../../components/stuff/MButton.tsx";
import getAmortizaData from "./getAmortizaCuotaFija.tsx";
import useDataUsuario from "../../hooks/useDataUsuario.tsx";
import useCompany from "../../hooks/useCompany.tsx";
import useCobrador from "../../hooks/useCobrador.tsx";
import { GrDeploy } from "react-icons/gr";


interface PrestamosFormProps {
  ModoEdicion: boolean;
  idCliente: number;
  open: boolean;
  handleClose: () => void;
}

const PrestamosForm: React.FC<PrestamosFormProps> = ({
  ModoEdicion,
  idCliente,
  open,
  handleClose,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(open);
  const [PrestamoID, setPrestamoID] = useState("");
  const [clientesData, setClienteData] = useState([]);
  const [nombreCliente, setNombreCliente] = useState("");
  const [cedulaCliente, setCedulaCliente] = useState("");
  const [amortiza, setAmortiza] = useState("Cuota Fija");
  const [Frecuencia, setFrecuencia] = useState("SEMANAL");
  const [fechaPrimerPago, setFechaPrimerPato] = useState(dayjs());

  const [idCompany, setIdCompany] = useState("");
  const [ruta, setRuta] = useState("");
  const [gastosLegales, setgastosLegales] = useState(0);
  const [Gestor, setGestor] = useState("");

  const [Cobrador, setCobrador] = useState("");
  const [isModalCuotas, setIsModalCuotas] = useState(false);
  const [idPresta, setIdPresta] = useState(0);
  const [capital, setCapital] = useState(0.0);
  const [isTablas, setIsTablas] = useState(true);
  const [Seguro, setSeguro] = useState(0.0);
  const [Referencia, setReferencia] = useState("");
  const [comision, setComision] = useState(0);
  const [coDeudorNombre, setCoDeudorNombre] = useState("");
  const [coDeudorIdentificador, setcoDeudorIdentificador] = useState("");
  const [coDeudorDireccion, setcoDeudorDireccion] = useState("");
  const [coDeudorTelefono, setcoDeudorTelefono] = useState("");
  const [TabValue, setTabValue] = useState("1");
  const [isTabDisabled, setIsTabDisabled] = useState(false);
  const { dataUser } = useDataUsuario();
  const { dataCompany, IdDataCompany } = useCompany();
  const { dataCobrador } = useCobrador();

  const URI = "http://localhost:8000/prestamos/";
  const URICuotas = "http://localhost:8000/cuotas/";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    control,
  } = useForm({
    defaultValues: {
      idclientes: idCliente,
      tipoamortizacion: amortiza,
      referencia: Referencia,
      interes: localStorage.getItem("interesDefault"),
      capital: 0.0,
      frecuencia: "SEMANAL",
      mcuota: 0.0,
      cuotaspagadas: 0,
      capitalpendiente: 0.0,
      balancependiente: 0.0,
      fecha: new Date(),
      fechaprimer: new Date(),
      fechaultimopago: new Date(),
      mora: 0.0,
      gastoslegal: gastosLegales,
      comision: comision,
      seguro: 0.0,
      tcuota: 0,
      codeudornombre: coDeudorNombre,
      codeudoridentificador: coDeudorIdentificador,
      codeudordireccion: coDeudorDireccion,
      codeudortelefono: coDeudorTelefono,
    },
  });
  const capitalValue = useWatch({ control, name: "capital" });
  const TCuotas = useWatch({ control, name: "tcuota" });
  const Mcuota = useWatch({ control, name: "mcuota" });
  const MMInteres = useWatch({ control, name: "interes" });

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const calculadoraInteres = () => {
    console.log(Mcuota * TCuotas);
    console.log(Mcuota * TCuotas);
    if (Mcuota * TCuotas >= capitalValue) {
      if (TCuotas > 0) {
        const resultado = CalcularInteres(
          capitalValue,
          TCuotas,
          Mcuota,
          amortiza,
          Frecuencia
        );

        setValue("interes", resultado.toFixed(2));
      } else {
        toast.error("No has intrudicido la cantidad de Cuota");
        setValue("interes", 0.0);
      }
    } else {
      toast.error(" El monto de la cuota no es permitida ");
      setValue("interes", 0.0);
    }
  };

 

  const handleCalculoInteres = () => {
  // console.log( Taza );
  };

  const CalcularMontoCuota = () => {
    if (capitalValue) {
      let cc = limpiarMonto(capitalValue) * (MMInteres / 100);
      setValue("mcuota", cc);
    } else {
      toast.error("No has introducido el Monto Capital");
    }
  };

  const HandleCobrador = (e) => {
    setCobrador(e.target.value);
  };

  const ClienteData = async () => {
    try {
      await axios
        .get(`http://localhost:8000/clientes/${idCliente}`)
        .then((respuesta) => {
          setClienteData(respuesta.data);
          setCedulaCliente(respuesta.data.dni);

          setNombreCliente(
            respuesta.data.nombres + " " + respuesta.data.apellidos
          );
          setRuta(respuesta.data.tbzona.nombrerutas);
        });
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los datos del cliente");
    }
  };

  const CloseModal = () => {
    handleClose();
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Previene el comportamiento predeterminado de la tecla Enter
    }
  };

  const formatDNI = (value) => {
    const cleanedValue = value.replace(/\D/g, "");
    const formatedValue = cleanedValue.replace(
      /(\d{3})(\d{7})(\d{1})/,
      "$1-$2-$3"
    );

    return formatedValue;
  };

  const handleInputUppercase = (event) => {
    const upperCaseValue = event.target.value.toUpperCase();
    /// setValorNombre(upperCaseValue);
    setValue(event.target.name, upperCaseValue, { shouldValidate: true });
  };

  const formatDateToDisplay = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const HandleFechaPrimer = (date) => {
    setFechaPrimerPato(date);
  };

  const HandleReferencia = (e) => {
    const upperCaseValue = e.target.value.toUpperCase();
    setReferencia(upperCaseValue);
    setValue("referencia", upperCaseValue, { shouldValidate: true });
  };

  const HandleCoDedudorNombre = (e) => {
    const upperCaseValue = e.target.value.toUpperCase();
    setCoDeudorNombre(upperCaseValue);
    setValue("codeudornombre", upperCaseValue, { shouldValidate: true });
  };

  const HandleCoDedudorIdentificador = (e) => {
    const upperCaseValue = e.target.value;
    setcoDeudorIdentificador(upperCaseValue);
  };

  const HandleCoDedudorDireccion = (e) => {
    const upperCaseValue = e.target.value.toUpperCase();
    setcoDeudorDireccion(upperCaseValue);
    setValue("codeudordireccion", upperCaseValue, { shouldValidate: true });
  };
  const HandleCoDedudorTelefono = (e) => {
    const upperCaseValue = e.target.value;
    setcoDeudorTelefono(upperCaseValue);
  };

  const HandleGestor = (e) => {
    setGestor(e.target.value);
  };

  const handleDNIChange = (event) => {
    const formattedDNI = formatDNI(event.target.value);
    console.log(formattedDNI);
    setValue("idclientes", formattedDNI);
  };
  const HandleCompany = (e) => {
    setIdCompany(e.target.value);
  };
  const HandleAmortiza = (e) => {
    setAmortiza(e.target.value);
  };

  const HandleFrecuencia = (e) => {
    setFrecuencia(e.target.value);
  };

  const HandleCapital = (e) => {
    //     const mm = e.target.value;
    //     console.log(TCuotas, MMInteres);
    //
    //     if (amortiza === "Cuota Fija") {
    //       const mmCuota = limpiarMonto(mm) * (MMInteres / 100);
    //       console.log(mmCuota);
    //       setValue("mcuota", mmCuota);
    //     }
    setCapital(e.target.value);
  };

  useEffect(() => {
    const fechaActual = FechaCorta(new Date());
    ClienteData();
    setValue("fecha", fechaActual);
    setValue("capital", 0.0);
  }, [idCliente]);

  const handleModalCuotas = () => {
    setIsModalCuotas(false);
  };

  const HanledGastosLegales = (e) => {
    setgastosLegales(e.target.value);
  };
  const HandleComision = (e) => {
    setComision(e.target.value);
  };

  const handleSeguro = (e) => {
    setSeguro(e.target.value);
  };

  const onSubmit = async (data: FieldValues) => {
    const requestData = [
      {
        idclientes: idCliente,
        tipoamortizacion: amortiza,
        referencia: Referencia,
        interes: MMInteres,
        capital: capitalValue,
        montointeres: capitalValue * (Number(MMInteres) / 100),
        frecuencia: Frecuencia,
        mcuota: Mcuota,
        cuotaspagas: 0,
        capitalpendiente: capitalValue,
        balancependiente: 0,
        fecha: dayjs(new Date()),
        fechaprimer: dayjs(fechaPrimerPago),
        fechaultimopago: null,
        mora: 0.0,
        gastoslegal: limpiarMonto(gastosLegales),
        comision: limpiarMonto(comision),
        seguro: limpiarMonto(Seguro),
        idcobrador: Cobrador,
        tcuota: TCuotas,
        idcompany: idCompany,
        idnotario: 1,
        idinstitucion: idCompany,
        idgestor: Gestor,
        codeudornombre: coDeudorNombre,
        codeudoridentificador: coDeudorIdentificador,
        codeudortelefono: coDeudorTelefono,
        codeudordireccion: coDeudorDireccion,
      },
    ];

    try {
      const response = await axios.post(URI, requestData, {
        headers: { "Content-type": "application/json" },
      });

      console.log("Respuesta completa:", response.data);
      const nuevoPrestamoID = response.data.data.id;
      console.log(nuevoPrestamoID);
      if (!nuevoPrestamoID) {
        console.error("No se recibió ID en la respuesta:", response);
        toast.error("No se pudo obtener el ID del préstamo");
        return;
      }

      Swal.fire({
        position: "center",
        icon: "success",
        html: `<p style="color: gray; font-weight: normal;">Prestamo No: ${nuevoPrestamoID} se ha guardado exitosamente </p>`,
        showConfirmButton: false,
        timer: 2000,
      });

      setPrestamoID(nuevoPrestamoID);
      if (!ModoEdicion) {
        console.log(response.data.data.fechaprimer);

        const tablaAmortizacion = getAmortizaData({
          fechainicio: response.data.data.fechaprimer,
          tc: response.data.data.tcuota,
          mc: response.data.data.mcuota,
          loan: response.data.data.interes,
          ccapital: response.data.data.capital,
          tipo: response.data.data.tipoamortizacion,
          fre: response.data.data.frecuencia,
          seguro: response.data.data.seguro,
        });

        if (tablaAmortizacion.length > 0) {
          await axios.post(
            "http://localhost:8000/cuotas/",
            tablaAmortizacion.map((cuota) => ({
              idprestamo: nuevoPrestamoID,
              ...cuota,
            }))
          );
        }
      }

      // console.log(tablaAmortizacion);
      // console.log(totales);

      reset();
      handleClose();
    } catch (error) {
      toast.error("Prestamos no pudo ser guardado");
      console.error("Error al enviar los datos:", error);

      if (axios.isAxiosError(error)) {
        toast.error(`Error: ${error.response?.data?.message || error.message}`);
      }
    }
  };
  const HandleProcesarAmortizacion = () => {
    setIsTablas(false);
    setTabValue("1");
  };

  return (
    <div>
      {isModalCuotas && (
        <CuotasList
          idPrestamos={idPresta}
          open={true}
          handleClose={handleModalCuotas}
          varcapital={capitalValue}
          varinteres={MMInteres}
          varcuota={Mcuota}
          varTcuota={TCuotas}
          vartipoamotiza={amortiza}
          varfrecuencia={Frecuencia}
          fechaPrimerPago={fechaPrimerPago}
          isView={isTablas}
          varSeguro={Seguro}
        />
      )}

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
              xs: "650px",
              sm: "600px",
              md: "800px",
              lg: "820px",
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
          <div className="  bg-secondary p-2 d-flex justify-content-between align-content-center">
            <div className="d-flex">
              <SiMeteor className="fs-1 text-white me-2" /> <Logo fs={20} />
            </div>

            <div>
              <div className="p-1 rounded-circle border" onClick={handleClose}>
                <span
                  className="p-2 text-white fs-6"
                  style={{ cursor: "pointer" }}
                >
                  X
                </span>
              </div>
            </div>
          </div>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="border-1 border-light-subtle "
              onKeyDown={handleKeyDown}
            >
              <div className="row mx-1 mt-2 text-center">
                {!ModoEdicion ? (
                  <span className="clFont text-secundary fs-5">
                    Nuevo Préstamo
                  </span>
                ) : (
                  <span className="clFont text-secundary fs-5">
                    Editando Préstamo
                  </span>
                )}
              </div>

              <div className="row mx-2">
                <div className="bg-success bg-opacity-10 rounded-2">
                  <span className="fs-6 fw-medium text-info">
                    Datos del Préstamo
                  </span>
                </div>
                <div className="col-sm-6 col-md-2 p-2 ">
                  <TextField
                    label="Numero de Cédula *"
                    fullWidth
                    value={cedulaCliente}
                    disabled={true}
                    onChange={handleDNIChange}
                    InputLabelProps={{ style: { fontSize: "1em" } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <span>
                            <PiIdentificationCardThin className="fs-5 text-info" />
                          </span>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px",
                        width: "100%",
                        color: "GrayText",
                        backgroundColor: "honeydew",
                      },
                    }}
                  />
                </div>
                <div className="col-sm-6 col-md-4 p-2 ">
                  <TextField
                    label="Nombre del Cliente"
                    fullWidth
                    disabled={true}
                    value={nombreCliente}
                    InputLabelProps={{ style: { fontSize: "1em" } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <span>
                            <RiUserLine className="fs-5 text-info" />
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
                        backgroundColor: "honeydew",
                      },
                    }}
                  />
                </div>
                <div className="col-sm-6 col-md-3 p-2 ">
                  <TextField
                    label="Fecha"
                    fullWidth
                    disabled={true}
                    {...register("fecha")}
                    InputLabelProps={{ style: { fontSize: "1em" } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <span>
                            <CiCalendarDate className="fs-5 text-info" />
                          </span>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px", // Controla el radio de borde
                        width: "100%",
                        backgroundColor: "honeydew",
                      },
                    }}
                  />
                </div>
                <div className="col-sm-6 col-md-3 p-2 ">
                  <TextField
                    {...register("tipoamortizacion")}
                    label="Amortización *"
                    select
                    value={amortiza}
                    fullWidth
                    onChange={HandleAmortiza}
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
                    {TipoAmortizacion.map((items) => (
                      <MenuItem key={items.id} value={items.tipo}>
                        <span className="clFont">{items.tipo}</span>
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </div>
              <div className="row mx-2">
                <div className="col-sm-6 col-md-3 p-2 ">
                  <TextField
                    {...register("frecuencia")}
                    label="Frecuencia *"
                    select
                    value={Frecuencia}
                    fullWidth
                    onChange={HandleFrecuencia}
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
                    {Frecuencias.map((items) => (
                      <MenuItem key={items.id} value={items.tipo}>
                        <span className="clFont">{items.tipo}</span>
                      </MenuItem>
                    ))}
                  </TextField>
                  {errors.frecuencia && (
                    <p className="errorColor"> {errors.frecuencia.message} </p>
                  )}
                </div>
                <div className="col-sm-6 col-md-2 p-2 ">
                  <Controller
                    name="capital"
                    control={control}
                    rules={{
                      required: "Este campo es obligatorio",
                      min: 0,
                    }}
                    render={({ field }) => (
                      <NumericFormat
                        {...field}
                        customInput={TextField} // Usa TextField de Material-UI
                        label="Monto a Prestar"
                        variant="outlined"
                        fullWidth
                        thousandSeparator=","
                        decimalSeparator="."
                        prefix="DOP "
                        fixedDecimalScale
                        value={capital}
                        onChange={HandleCapital}
                        decimalScale={2}
                        allowNegative={false}
                        error={!!errors.capital}
                        helperText={errors.capital?.message}
                        onValueChange={(values) => {
                          field.onChange(values.floatValue || 0.0); // Actualiza el valor en react-hook-form
                        }}
                        InputLabelProps={{ style: { fontSize: "0.9rem" } }}
                        InputProps={{
                          style: {
                            fontSize: "0.8rem",
                            borderRadius: "10px",
                            color: "GrayText",
                          },
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
                <div className="col-sm-6 col-md-2 p-2 ">
                  <TextField
                    label="Cuotas"
                    variant="outlined"
                    {...register("tcuota")}
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
                  ></TextField>
                </div>
                <div className="col-sm-6 col-md-2 p-2 ">
                  <Controller
                    name="mcuota"
                    control={control}
                    render={({ field }) => (
                      <NumericFormat
                        {...field}
                        customInput={TextField} // Usa TextField de Material-UI
                        label="Monto Cuota"
                        variant="outlined"
                        fullWidth
                        thousandSeparator=","
                        decimalSeparator="."
                        prefix="DOP "
                        fixedDecimalScale
                        decimalScale={2}
                        allowNegative={false}
                        disabled={!capitalValue}
                        onValueChange={(values) => {
                          field.onChange(values.floatValue || 0.0); // Actualiza el valor en react-hook-form
                        }}
                        InputLabelProps={{ style: { fontSize: "0.9rem" } }}
                        InputProps={{
                          style: capitalValue
                            ? {
                                fontSize: "0.8rem",
                                borderRadius: "10px",
                                color: "GrayText",
                                backgroundColor: "white",
                              } // Cambia el tamaño de letra
                            : {
                                fontSize: "0.8rem",
                                borderRadius: "10px",
                                color: "GrayText",
                                backgroundColor: "honeydew",
                              },

                          endAdornment: capitalValue ? (
                            <InputAdornment position="end">
                              <button
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                                type="button"
                                onClick={() => calculadoraInteres()}
                              >
                                <AiOutlineCalculator className="fs-5 text-info" />
                              </button>
                            </InputAdornment>
                          ) : null,
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
                <div className="col-sm-6 col-md-1 p-2 ">
                  <Tooltip title="Calculo de Interes  " arrow>
                    <div
                      className="text-center rounded-4 p-2 mt-1"
                      style={{ background: "#187bcd", cursor: "pointer" }}
                      onClick={handleCalculoInteres}
                    >
                      <span
                        className="text-center text-white"
                        style={{ fontSize: "0.9em" }}
                      >
                        <GrDeploy />
                      </span>
                    </div>
                  </Tooltip>
                </div>
                <div className="col-sm-6 col-md-2 p-2 ">
                  <Controller
                    name="interes"
                    control={control}
                    render={({ field }) => (
                      <NumericFormat
                        {...field}
                        customInput={TextField} // Usa TextField de Material-UI
                        label="Taza Interes"
                        variant="outlined"
                        fullWidth
                        thousandSeparator=","
                        decimalSeparator="."
                        prefix=""
                        fixedDecimalScale
                        decimalScale={2}
                        allowNegative={false}
                        className="no-background"
                        onValueChange={(values) => {
                          field.onChange(values.floatValue || 0.0); // Actualiza el valor en react-hook-form
                        }}
                        InputLabelProps={{
                          style: {
                            fontSize: "0.9rem",
                            backgroundColor: "white",
                          },
                        }}
                        InputProps={{
                          style: {
                            fontSize: "0.8rem",
                            borderRadius: "10px",
                            color: "GrayText",
                          },

                          startAdornment: (
                            <InputAdornment position="start">
                              <span>
                                <PiPercentLight className="fs-5 text-info" />
                              </span>
                            </InputAdornment>
                          ),

                          endAdornment: capitalValue ? (
                            <InputAdornment position="end">
                              <button
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                                type="button"
                                onClick={() => CalcularMontoCuota()}
                              >
                                <AiOutlineCalculator className="fs-5 text-info" />
                              </button>
                            </InputAdornment>
                          ) : null,
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            fontSize: "12px",
                            width: "100%",
                          },
                        }}

                        //   className="clFont"
                      />
                    )}
                  />
                </div>
              </div>
              <div className="row mx-2">
                <div className="col-sm-6 col-md-3 p-2 ">
                  <DatePicker
                    label="Fecha Primer Pago"
                    {...register("fechaprimer")}
                    value={fechaPrimerPago}
                    onChange={HandleFechaPrimer}
                    format="DD/MM/YYYY"
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
                <div className="col-sm-6 col-md-6 p-2 ">
                  <TextField
                    {...register("idcompany", {
                      required: "Este campo es obligatorio",
                    })}
                    label="Nombre de la Compañia *"
                    select
                    value={idCompany}
                    fullWidth
                    onChange={HandleCompany}
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
                    {dataCompany.map((items) => (
                      <MenuItem key={items.id} value={items.id}>
                        <span className="clFont">{items.company}</span>
                      </MenuItem>
                    ))}
                  </TextField>
                  {errors.idcompany && (
                    <p className="errorColor"> {errors.idcompany.message} </p>
                  )}
                </div>
                <div className="col-sm-6 col-md-3 p-2 ">
                  <TextField
                    label="Nombre de la Ruta"
                    fullWidth
                    value={ruta}
                    disabled={true}
                    InputLabelProps={{ style: { fontSize: "1em" } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <span>
                            <PiMapPinLineThin className="fs-5 text-info" />
                          </span>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "12px",
                        width: "100%",
                        color: "GrayText",
                        backgroundColor: "honeydew",
                      },
                    }}
                  />
                </div>
              </div>
              <div className="row mx-2">
                <div className="bg-success bg-opacity-10 rounded-2">
                  <span className="fs-6 fw-medium text-info ">Otros</span>
                </div>
                <div className="col-sm-6 col-md-3 p-2 ">
                  <Controller
                    name="mora"
                    control={control}
                    render={({ field }) => (
                      <NumericFormat
                        {...field}
                        customInput={TextField} // Usa TextField de Material-UI
                        label="Mora"
                        variant="outlined"
                        fullWidth
                        thousandSeparator=","
                        decimalSeparator="."
                        prefix=""
                        fixedDecimalScale
                        decimalScale={2}
                        allowNegative={false}
                        className="no-background"
                        onValueChange={(values) => {
                          field.onChange(values.floatValue || 0.0); // Actualiza el valor en react-hook-form
                        }}
                        InputLabelProps={{
                          style: {
                            fontSize: "0.9rem",
                            backgroundColor: "white",
                          },
                        }}
                        InputProps={{
                          style: {
                            fontSize: "0.8rem",
                            borderRadius: "10px",
                            color: "GrayText",
                          },

                          startAdornment: (
                            <InputAdornment position="start">
                              <span>
                                <PiPercentLight className="fs-5 text-info" />
                              </span>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            fontSize: "12px",
                            width: "100%",
                          },
                        }}
                      />
                    )}
                  />
                </div>
                <div className="col-sm-6 col-md-3 p-2 ">
                  <Controller
                    name="gastoslegal"
                    control={control}
                    render={({ field }) => (
                      <NumericFormat
                        {...field}
                        customInput={TextField} // Usa TextField de Material-UI
                        label="Gastos Legales"
                        variant="outlined"
                        fullWidth
                        thousandSeparator=","
                        decimalSeparator="."
                        prefix="DOP "
                        value={gastosLegales}
                        onChange={HanledGastosLegales}
                        fixedDecimalScale
                        decimalScale={2}
                        allowNegative={false}
                        onValueChange={(values) => {
                          field.onChange(values.floatValue || 0.0); // Actualiza el valor en react-hook-form
                        }}
                        InputLabelProps={{ style: { fontSize: "1rem" } }}
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
                <div className="col-sm-6 col-md-3 p-2 ">
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
                        value={Seguro}
                        onChange={handleSeguro}
                        allowNegative={false}
                        onValueChange={(values) => {
                          field.onChange(values.floatValue || 0.0); // Actualiza el valor en react-hook-form
                        }}
                        InputLabelProps={{ style: { fontSize: "1rem" } }}
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
                <div className="col-sm-6 col-md-3 p-2 ">
                  <Controller
                    name="comision"
                    control={control}
                    render={({ field }) => (
                      <NumericFormat
                        {...field}
                        customInput={TextField} // Usa TextField de Material-UI
                        label="Comisión"
                        variant="outlined"
                        fullWidth
                        thousandSeparator=","
                        decimalSeparator="."
                        prefix=""
                        fixedDecimalScale
                        decimalScale={2}
                        allowNegative={false}
                        className="no-background"
                        value={comision}
                        onChange={HandleComision}
                        onValueChange={(values) => {
                          field.onChange(values.floatValue || 0.0); // Actualiza el valor en react-hook-form
                        }}
                        InputLabelProps={{
                          style: {
                            fontSize: "0.9rem",
                            backgroundColor: "white",
                          },
                        }}
                        InputProps={{
                          style: {
                            fontSize: "0.8rem",
                            borderRadius: "10px",
                            color: "GrayText",
                          },
                          startAdornment: (
                            <InputAdornment position="start">
                              <span>
                                <PiPercentLight className="fs-5 text-info" />
                              </span>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            fontSize: "12px",
                            width: "100%",
                          },
                        }}
                        //   className="clFont"
                      />
                    )}
                  />
                </div>
              </div>
              <div className="row mx-2">
                <div className="col-sm-6 col-md-4 p-2 ">
                  <TextField
                    {...register("idgestor", {
                      required: "Este campo es obligatorio",
                    })}
                    label="Gestor *"
                    select
                    value={Gestor}
                    fullWidth
                    onChange={HandleGestor}
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
                    {dataUser.map((items) => (
                      <MenuItem key={items.id} value={items.id}>
                        <span className="clFont">{items.nombreusuario}</span>
                      </MenuItem>
                    ))}
                  </TextField>
                  {errors.idgestor && (
                    <p className="errorColor"> {errors.idgestor.message} </p>
                  )}
                </div>

                <div className="col-sm-6 col-md-4 p-2 ">
                  <TextField
                    {...register("idcobrador", {
                      required: "Este campo es obligatorio",
                    })}
                    label="Cobrador *"
                    select
                    value={Cobrador}
                    fullWidth
                    onChange={HandleCobrador}
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
                    {dataCobrador.map((items) => (
                      <MenuItem key={items.id} value={items.id}>
                        <span className="clFont">{items.nombreusuario}</span>
                      </MenuItem>
                    ))}
                  </TextField>
                  {errors.idcobrador && (
                    <p className="errorColor"> {errors.idcobrador.message} </p>
                  )}
                </div>

                <div className="col-sm-6 col-md-4 p-2 ">
                  <TextField
                    label="Referencia"
                    fullWidth
                    {...register("referencia")}
                    onChange={HandleReferencia}
                    InputLabelProps={{ style: { fontSize: "1em" } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <span>
                            <LuMessageSquareMore className="fs-5 text-info" />
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
                        // backgroundColor: "honeydew",
                      },
                    }}
                  />
                </div>
              </div>

              <div className="row mx-2">
                <div className=" bg-success bg-opacity-10 rounded-2">
                  <span className="fs-6 fw-medium text-info">Co-Deudor</span>
                </div>
                <div className="col-sm-6 col-md-4 p-2 ">
                  <TextField
                    label="Nombres"
                    fullWidth
                    disabled={false}
                    {...register("codeudornombre")}
                    onChange={HandleCoDedudorNombre}
                    value={coDeudorNombre}
                    InputLabelProps={{ style: { fontSize: "0.9em" } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <span>
                            <LuUserRoundCheck className="fs-5 text-info" />
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
                </div>
                <div className="col-sm-6 col-md-2 p-2 ">
                  <TextField
                    label="Numero Identificador"
                    fullWidth
                    disabled={false}
                    {...register("codeudoridentificador")}
                    value={coDeudorIdentificador}
                    onChange={HandleCoDedudorIdentificador}
                    InputLabelProps={{ style: { fontSize: "0.9em" } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <span>
                            <PiIdentificationCardThin className="fs-5 text-info" />
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
                </div>
                <div className="col-sm-6 col-md-2 p-2 ">
                  <TextField
                    label="Telefono"
                    fullWidth
                    disabled={false}
                    {...register("codeudortelefono")}
                    value={coDeudorTelefono}
                    onChange={HandleCoDedudorTelefono}
                    InputLabelProps={{ style: { fontSize: "0.9em" } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <span>
                            <MdOutlinePhoneInTalk className="fs-5 text-info" />
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
                </div>
                <div className="col-sm-6 col-md-4 p-2 ">
                  <TextField
                    label="Direccion Co-Deudor"
                    fullWidth
                    disabled={false}
                    {...register("codeudordireccion")}
                    onChange={handleInputUppercase}
                    InputLabelProps={{ style: { fontSize: "0.9em" } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <span>
                            <LiaMapMarkedAltSolid className="fs-5 text-info" />
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
                </div>

                <hr />
                <br />
                <div className="p-2 d-flex justify-content-between">
                  <div>
                    {/* <MButton
                          color="#0097B2"
                          text="Calculadora"
                          variant="contained"
                          icon={<PiTableLight />}
                          onClick={() => viewAmortiza()}
                        /> */}
                  </div>
                  <div>
                    <MButton
                      color="#0097B2"
                      text="Insertar Prestamos"
                      variant="contained"
                      icon={<MdOutlineSaveAlt />}
                      type="submit"
                      disabled={!isTablas}
                    />
                    <MButton
                      color="#f08080"
                      text="Cancelar"
                      variant="contained"
                      icon={<MdOutlineCancel />}
                      disabled={!isTablas}
                      onClick={CloseModal}
                    />
                  </div>
                </div>
              </div>
              {/* {tablaAmortizacion && (
                    <div className="row h-75">
                      <h2>Tabla Amortizacion</h2>
                    </div>
                  )} */}
            </form>
          </LocalizationProvider>

          {/* <TabContext value={TabValue}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChangeTab}
                aria-label="lab API tabs example"

              > 
                <Tab label="Prestamos" value="1" className="clFont" disabled={isTabDisabled}/>
                <Tab label="Amortizacion" value="2" className="clFont" disabled={!isTabDisabled} />
                
              </TabList>
            </Box>
            <TabPanel value="1">
              
            </TabPanel>
            <TabPanel value="2">
            <div className="bg-success bg-opacity-10 rounded-2">
                      <span className="fs-6 fw-medium text-info">
                        Tabla de Amortizacion
                      </span>
                    </div>
                    <div  className=" overflow-x-scroll"
                      style={{ height: "450px", overflowY: "auto" }}>
                        <TablaAmortiza
                            fechainicio={fechaPrimerPago}
                            tc={TCuotas}
                            mc={limpiarMonto(Mcuota)}
                            loan={Number(MMInteres).toFixed(2)}
                            ccapital={capitalValue}
                            tipo={amortiza}
                            fre={Frecuencia}
                            Seguro={Seguro}
                          />
                    </div>
                    <div className="p-2">
                      <MButton text="Procesar Amortizacion" icon={<IoCheckmarkDoneOutline />} type="normal" variant="contained" color="#0097B2" onClick={HandleProcesarAmortizacion}  />
                      
                    </div>
                
            </TabPanel>
            
          </TabContext> */}
        </Box>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default PrestamosForm;
