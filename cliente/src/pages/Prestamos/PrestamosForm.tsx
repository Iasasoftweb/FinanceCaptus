import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import "../../App.css";
import {
  Box,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";

import { useForm, Controller, useWatch } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import axios from "axios";
import FechaCorta from "../../components/stuff/fechaCorta.tsx";
import TipoAmortizacion from "../../data/Apis/TipoAmortizacion.json";
import Frecuencias from "../../data/Apis/Modalidad.json";
import { NumericFormat } from "react-number-format";
import "./PrestamosForm.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import limpiarMonto from "../../components/stuff/LimpiarMonto.tsx";
import Swal from "sweetalert2";
import CalcularInteres from "./CalculoInteres.tsx";
import CuotasList from "./CuotasList.tsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getAmortizaData from "./getAmortizaCuotaFija.tsx";
import useDataUsuario from "../../hooks/useDataUsuario.tsx";
import useCompany from "../../hooks/useCompany.tsx";
import useCobrador from "../../hooks/useCobrador.tsx";
import {
  User,
  Calendar,
  DollarSign,
  Percent,
  MapPin,
  Phone,
  ShieldCheck,
  Briefcase,
  Info,
  X,
  Save,
  Rocket,
  ChevronDown,
  CreditCard,
  Plus,
  RefreshCcw,
  List,
  Map,
  Home,
  HandCoins,
  Users,
} from "lucide-react";
import { SectionTitle } from "../../components/stuff/SectionTitle.tsx";
import { InputField } from "../../components/stuff/InputField.tsx";
// import { FieldBinaryOutlined } from "@ant-design/icons";
import { calcularTasaNewtonRaphson } from "../../components/Prestamos/CalculoTasaEfectiva.tsx";
import { MisColores } from "../../components/stuff/MisColores.tsx";

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

  const colors = {
    headerBlue: "#4A7BB7",
    teal: "#008B8B",
    actionRed: "#E5534B",
    bgGray: "#F8F9FA",
    borderGray: "#E2E8F0",
  };

  console.log(dataCobrador);
  const URI = "http://localhost:5000/prestamos/";
  const URICuotas = "http://localhost:5000/cuotas/";
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
      fecha: new Date().toISOString().split("T")[0],
      interes: localStorage.getItem("interesDefault"),
      capital: 0.0,
      frecuencia: "SEMANAL",
      mcuota: 0.0,
      cuotaspagadas: 0,
      capitalpendiente: 0.0,
      balancependiente: 0.0,
      fechaprimer: new Date().toISOString().split("T")[0],
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
          Frecuencia,
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

  const HandleCobrador = (e) => {
    setCobrador(e.target.value);
  };

  const ClienteData = async () => {
    try {
      await axios
        .get(`http://localhost:5000/clientes/${idCliente}`)
        .then((respuesta) => {
          setClienteData(respuesta.data);
          setCedulaCliente(respuesta.data.dni);

          setNombreCliente(
            respuesta.data.nombres + " " + respuesta.data.apellidos,
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
      "$1-$2-$3",
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
    console.log(date);
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
    setCapital(e.target.value);
  };

  useEffect(() => {
    const fechaActual = FechaCorta(new Date());

    ClienteData();

    setValue("capital", 0.0);
    setValue("interes", "0.0000");
  }, [idCliente]);

  useEffect(() => {
    const capital1 = parseFloat(capital.toString().replace(/[^0-9.-]/g, ""));
    const n = parseFloat(TCuotas);
    const p = parseFloat(Mcuota.toString().replace(/[^0-9.-]/g, ""));

    if (amortiza === "Cuota Fija" && capital1 > 0 && n > 0 && p > 0) {
      if (p * n > capital1) {
        // El cálculo de Newton-Raphson devuelve la tasa del PERIODO.
        // Si el usuario cambia la frecuencia, la tasa del periodo se mantiene
        // matemáticamente correcta para esa estructura de pagos.
        const tasaResultante = calcularTasaNewtonRaphson(capital1, n, p);
        const tasaPorcentaje = tasaResultante * 100;

        setValue("interes", tasaPorcentaje.toFixed(5));
      } else {
        setValue("interes", "0.0000");
      }
    }
  }, [capital, TCuotas, Mcuota, amortiza, Frecuencia]);

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
            "http://localhost:5000/cuotas/",
            tablaAmortizacion.map((cuota) => ({
              idprestamo: nuevoPrestamoID,
              ...cuota,
            })),
          );
        }
      }

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
    <div
      className="container-fluid min-vh-100 p-4"
      style={{
        backgroundColor: colors.bgGray,
        fontFamily: "Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      }}
    >
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
              xs: "690px",
              sm: "645px",
              md: "845px",
              lg: "865px",
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
          <div
            className="card border-0 shadow-sm rounded-3 overflow-hidden mx-auto w-100"
            style={{ maxWidth: "1100px" }}
          >
            <div className="card-header border-bottom bg-white p-4 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="p-2 rounded-3 text-white d-flex align-items-center justify-content-center shadow-sm"
                  style={{
                    backgroundColor: colors.headerBlue,
                    width: "45px",
                    height: "45px",
                  }}
                >
                  <HandCoins size={20} />
                </div>
                <div>
                  <h2
                    className="fw-bold mb-0"
                    style={{ color: "#2c3e50", fontSize: "1.5rem" }}
                  >
                    Nuevo Préstamo
                  </h2>
                  <p className="text-muted mb-0 small">
                    Finance Cactus - Gestión de Cartera
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

            <div className="card-body p-2">
              <SectionTitle title="Datos del Préstamo" />
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="row g-3 mx-2"
                onKeyDown={handleKeyDown}
              >
                <InputField
                  label="Número de Cédula"
                  icon={CreditCard}
                  readOnly
                  required
                  col="col-md-3"
                >
                  <input
                    type="text"
                    value={cedulaCliente}
                    readOnly
                    className="form-control border-0 shadow-none bg-info-subtle"
                    onChange={handleDNIChange}
                    style={{ fontSize: "0.8em" }}
                  />
                </InputField>

                <InputField
                  label="Nombre del Cliente"
                  icon={User}
                  readOnly
                  required
                  col="col-md-3"
                >
                  <input
                    type="text"
                    value={nombreCliente}
                    readOnly
                    className="form-control border-0 shadow-none bg-info-subtle"
                    onChange={handleDNIChange}
                    style={{ fontSize: "0.8em" }}
                  />
                </InputField>

                <InputField label="Fecha" icon={Calendar} required col="col-md-3">
                  <input
                    type="date"
                    className="form-control border-0 shadow-none"
                    style={{ fontSize: "0.8em" }}
                    {...register("fecha")}
                  />
                </InputField>

                <InputField label="Amortización" icon={Info} required col="col-md-3">
                  <select
                    className="form-select border-0 shadow-none"
                    style={{ fontSize: "0.8em" }}
                    {...register("tipoamortizacion")}
                    onChange={HandleAmortiza}
                  >
                    <option value="">Seleccione un tipo...</option>
                    {TipoAmortizacion.map((item) => (
                      <option key={item.id} value={item.tipo}>
                        {item.tipo}
                      </option>
                    ))}
                  </select>
                </InputField>

                <InputField label="Frecuencia" icon={Info} required col="col-md-3">
                  <select
                    className="form-select border-0 shadow-none"
                    style={{ fontSize: "0.8em" }}
                    {...register("frecuencia")}
                    onChange={HandleFrecuencia}
                  >
                    <option value="">Seleccione un tipo...</option>
                    {Frecuencias.map((items) => (
                      <option key={items.id} value={items.tipo}>
                        {items.tipo}
                      </option>
                    ))}
                  </select>
                </InputField>

                <InputField label="Monto a Prestar" icon={DollarSign} required col="col-md-3">
                  <Controller
                    name="capital"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, name, ref } }) => (
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
                        onChange={HandleCapital}
                        onValueChange={(values) => {
                          // Actualiza el formulario (esto es ligero y no pierde el foco)
                          onChange(values.floatValue || 0);
                        }}
                        style={{ fontSize: "0.8em" }}
                      />
                    )}
                  />
                </InputField>

                <InputField label="Cuotas" icon={List} required col="col-md-3">
                  <input
                    type="number"
                    placeholder="0"
                    {...register("tcuota")}
                    className="form-control border-0 shadow-none"
                    style={{ fontSize: "0.8em" }}
                  />
                </InputField>

                <InputField label="Monto de Cuota" icon={DollarSign} required col="col-md-3">
                  <Controller
                    name="mcuota"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, name, ref } }) => (
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
                        onValueChange={(values) => {
                          // Actualiza el formulario (esto es ligero y no pierde el foco)
                          onChange(values.floatValue || 0);
                        }}
                        style={{ fontSize: "0.8em" }}
                      />
                    )}
                  />
                </InputField>

                <InputField
                  label="Taza Interes (%)"
                  icon={Percent}
                  readOnly
                  required
                  col="col-md-3"
                >
                  <input
                    type="text"
                    value={MMInteres}
                    {...register("interes")}
                    className="form-control border-0 shadow-none bg-warning-subtle fw-bold text-dark"
                  />
                </InputField>

                <InputField label="Fecha Primer Pago" icon={Calendar} required col="col-md-3">
                  <input
                    type="date"
                    className="form-control border-0 shadow-none"
                    style={{ fontSize: "0.8em" }}
                    {...register("fechaprimer")}
                  />
                </InputField>

                <InputField label="Compañía" icon={Briefcase} required col="col-md-3">
                  <select
                    name="compania"
                    onChange={HandleCompany}
                    className="form-select border-0 shadow-none"
                    style={{ fontSize: "0.8em" }}
                  >
                    {dataCompany.map((items) => (
                      <option value="Finance Cactus Azua" key={items.id}>
                        {items.company}
                      </option>
                    ))}
                  </select>
                </InputField>

                <InputField label="Nombre de Ruta" icon={Map} readOnly col="col-md-3">
                  <input
                    type="text"
                    value={ruta}
                    readOnly
                    className="form-control border-0 shadow-none bg-info-subtle fw-bold text-primary"
                    style={{ fontSize: "0.8em" }}
                  />
                </InputField>

                <SectionTitle title="Otros" />

                <InputField label="Mora" icon={Percent} required col="col-md-3">
                  <Controller
                    name="mora"
                    control={control}
                    render={({ field: { onChange, value, name, ref } }) => (
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
                        onValueChange={(values) => {
                          // Actualiza el formulario (esto es ligero y no pierde el foco)
                          onChange(values.floatValue || 0);
                        }}
                        style={{ fontSize: "0.8em" }}
                      />
                    )}
                  />
                </InputField>

                <InputField label="Gastos Legales" icon={Percent} required col="col-md-3">
                  <Controller
                    name="gastoslegal"
                    control={control}
                    render={({ field: { onChange, value, name, ref } }) => (
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
                        onValueChange={(values) => {
                          // Actualiza el formulario (esto es ligero y no pierde el foco)
                          onChange(values.floatValue || 0);
                        }}
                        style={{ fontSize: "0.8em" }}
                      />
                    )}
                  />
                </InputField>

                <InputField label="Seguro" icon={Percent} required col="col-md-3">
                  <Controller
                    name="seguro"
                    control={control}
                    render={({ field: { onChange, value, name, ref } }) => (
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
                        onValueChange={(values) => {
                          // Actualiza el formulario (esto es ligero y no pierde el foco)
                          onChange(values.floatValue || 0);
                        }}
                        style={{ fontSize: "0.8em" }}
                      />
                    )}
                  />
                </InputField>

                <InputField label="Comisión" icon={Percent} required col="col-md-3">
                  <Controller
                    name="comision"
                    control={control}
                    render={({ field: { onChange, value, name, ref } }) => (
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
                        onValueChange={(values) => {
                          // Actualiza el formulario (esto es ligero y no pierde el foco)
                          onChange(values.floatValue || 0);
                        }}
                        style={{ fontSize: "0.8em" }}
                      />
                    )}
                  />
                </InputField>

                <InputField label="Gestor" icon={Briefcase} required col="col-md-3">
                  <select
                    name="idgestor"
                    onChange={HandleGestor}
                    className="form-select border-0 shadow-none"
                    style={{ fontSize: "0.8em" }}
                  >
                    {dataUser.map((items) => (
                      <option value="Finance Cactus Azua" key={items.id}>
                        {items.nombreusuario}
                      </option>
                    ))}
                  </select>
                </InputField>

                <InputField label="Cobrador" icon={Briefcase} required col="col-md-3">
                  <select
                    name="idcobrador"
                    onChange={HandleCobrador}
                    className="form-select border-0 shadow-none"
                    style={{ fontSize: "0.8em" }}
                  >
                    {dataCobrador.map((items) => (
                      <option value="Finance Cactus Azua" key={items.id}>
                        {items.nombreusuario}
                      </option>
                    ))}
                  </select>
                </InputField>

                <InputField label="Referencia" icon={User} col="col-md-3">
                  <input
                    type="text"
                    {...register("referencia")}
                    onChange={HandleReferencia}
                    className="form-control border-0 shadow-none"
                    style={{ fontSize: "0.8em" }}
                  />
                </InputField>

                <SectionTitle title="Co-Deudor" />
                <InputField label="Nombres" icon={User} col="col-md-3">
                  <input
                    type="text"
                    value={coDeudorNombre}
                    onChange={HandleCoDedudorNombre}
                    className="form-control border-0 shadow-none"
                    {...register("codeudornombre")}
                    style={{ fontSize: "0.8em" }}
                  />
                </InputField>
                <InputField label="Identificación" icon={CreditCard} col="col-md-3">
                  <input
                    type="text"
                    value={coDeudorIdentificador}
                    onChange={HandleCoDedudorIdentificador}
                    className="form-control border-0 shadow-none"
                    {...register("codeudoridentificador")}
                  />
                </InputField>
                <InputField label="Telefono" icon={Phone} col="col-md-3">
                  <input
                    type="text"
                    value={coDeudorTelefono}
                    onChange={HandleCoDedudorTelefono}
                    className="form-control border-0 shadow-none"
                    {...register("codeudortelefono")}
                   
                  />
                </InputField>
                <InputField label="Dirección" icon={MapPin} col="col-md-3">
                  <input
                    type="text"
                    name="coDireccion"
                    value={coDeudorDireccion}
                    onChange={handleInputUppercase}
                    className="form-control border-0 shadow-none"
                    
                  />
                </InputField>

                <div className="col-12 mt-1 border-top pt-2 d-flex justify-content-end gap-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4 fw-bold shadow-sm"
                    style={{ borderRadius: "8px", fontSize: "0.8em" }}
                    disabled={!isTablas}
                    onClick={CloseModal}
                  >
                    <X size={18} className="me-2" /> CANCELAR
                  </button>
                  <button
                    type="submit"
                    className="btn text-white px-5 fw-bold shadow-sm border-0 d-flex align-items-center"
                    style={{
                      backgroundColor: colors.teal,
                      borderRadius: "8px",
                      fontSize: "0.8em",
                    }}
                    disabled={!isTablas}
                  >
                    <Save size={18} className="me-2" /> INSERTAR PRÉSTAMOS
                  </button>
                </div>
              </form>
            </LocalizationProvider>
          </div>
        </Box>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default PrestamosForm;
