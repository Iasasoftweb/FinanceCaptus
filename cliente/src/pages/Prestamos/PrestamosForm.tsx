import React, { useEffect, useMemo, useState } from "react";
import Modal from "@mui/material/Modal";
import "../../App.css";
import { Alert, Box } from "@mui/material";

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
  Briefcase,
  Info,
  X,
  Save,
  CreditCard,
  List,
  Map,
  HandCoins,
} from "lucide-react";
import { SectionTitle } from "../../components/stuff/SectionTitle.tsx";
import { InputField } from "../../components/stuff/InputField.tsx";
// import { FieldBinaryOutlined } from "@ant-design/icons";
import {
  calcularTasaNewtonRaphson,
  calculateFrenchCuota,
  solveRateForFrench,
} from "../../components/Prestamos/CalculoTasaEfectiva.tsx";
import { useEmpresa } from "../../hooks/useEmpresas.tsx";
import { MisColores } from "../../components/stuff/MisColores.tsx";
import { formatter } from "../../components/stuff/Formatter.tsx";
import {
  calcularCuotaFrancesa,
  calcularTasaEquivalente,
} from "../../components/Prestamos/CalculoCuotaFrancesa.tsx";
import { calc } from "antd/es/theme/internal";
import { calcularCreditoDinamico } from "../../hooks/useTasasCompuestas.tsx";

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
  const [fecha, setFecha] = useState(dayjs());
  const [fechaPrimerPago, setFechaPrimerPato] = useState(dayjs());

  const [idCompany, setIdCompany] = useState(0);
  const [ruta, setRuta] = useState("");
  const [gastosLegales, setgastosLegales] = useState(0);
  const [Gestor, setGestor] = useState(0);

  const [Cobrador, setCobrador] = useState(0);
  const [isModalCuotas, setIsModalCuotas] = useState(false);
  const [capital, setCapital] = useState(0.0);
  const [isTablas, setIsTablas] = useState(true);
  const [Seguro, setSeguro] = useState(0.0);
  const [Referencia, setReferencia] = useState("");
  const [comision, setComision] = useState(0);
  const [montoPrestar, setMontoPrestar] = useState(0);
  const [coDeudorNombre, setCoDeudorNombre] = useState("");
  const [coDeudorIdentificador, setcoDeudorIdentificador] = useState("");
  const [coDeudorDireccion, setcoDeudorDireccion] = useState("");
  const [coDeudorTelefono, setcoDeudorTelefono] = useState("");
  const [TabValue, setTabValue] = useState("1");
  const { dataUser } = useDataUsuario();
  const { dataCompany } = useCompany();
  const { dataCobrador } = useCobrador();
  const [situacion, setSituacion] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  // Parámetros de simulación en el modal (dinámicos y editables por el usuario)

  const { data: DataEmpresa, isLoading } = useEmpresa();

  const URI = `${import.meta.env.VITE_API_URL}/prestamos/`;

  const [calcMethod, setCalcMethod] = useState("french"); // Por defecto 'french' (Cuota Fija / Francés)
  const [calcCapital, setCalcCapital] = useState(50000); // Capital editable en el modal
  const [calcRate, setCalcRate] = useState(DataEmpresa?.interesdefecto); // Tasa de interés editable
  const [calcTerm, setCalcTerm] = useState(13); // Cantidad de cuotas editable
  const [calcStartDate, setCalcStartDate] = useState("");
  const [customCuotaValue, setCustomCuotaValue] = useState(5000); // Cuota forzada manual o cuota objetivo

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
      interes: calcRate.toFixed(5) || "0.0000",
      capital: 0.0,
      montoprestar: 0.0,
      frecuencia: "SEMANAL",
      mcuota: 0.0,
      cuotaspagadas: 0,
      capitalpendiente: 0.0,
      balancependiente: 0.0,
      fechaprimer: new Date().toISOString().split("T")[0],
      fechaultimopago: new Date(),
      mora: 0.0,
      gastoslegal: limpiarMonto(gastosLegales) || 0,
      comision: limpiarMonto(comision) || 0,
      seguro: limpiarMonto(Seguro) || 0,
      tcuota: calcTerm,
      situacion: "EVALUACION",
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
  const Mcomision = useWatch({ control, name: "comision" });
  const Mgastolegal = useWatch({ control, name: "gastoslegal" });
  const Mseguro = useWatch({ control, name: "seguro" });

  const datosCreditos = calcularCreditoDinamico(
    capitalValue,
    DataEmpresa?.interesdefecto || 0,
    Frecuencia,
    TCuotas,
  );

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

        setValue("interes", resultado.toFixed(2) );
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
    console.log(e.target.value);
    setCobrador(e.target.value);
  };

  const ClienteData = async () => {
    try {
      await axios
        .get(`${import.meta.env.VITE_API_URL}/clientes/${idCliente}`)
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
    p;

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

  const HandleFechaPrimer = (e) => {
    setFechaPrimerPato(dayjs(e.target.value));
    console.log(dayjs(e.target.value));
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

  const handleFecha = (e) => {
    setFecha(e.target.value);
  };

  const HandleFrecuencia = (e) => {
    setFrecuencia(e.target.value);
  };

  const HandleCapital = (e) => {
    setCapital(e.target.value);
  };

  const handleMontoPrestar = (e) => {
    console.log(e.target.value);
    setMontoPrestar(e.target.value);
  };

  useEffect(() => {
    ClienteData();
    setValue("gastoslegal", DataEmpresa.gastolegal);
    const usaMora = DataEmpresa?.aplicarmora === "SI";
    const valorMora = usaMora ? (DataEmpresa.modoporcentaje ?? 0) : 0;
    setValue("mora", valorMora);
    setValue("seguro", DataEmpresa?.seguro);
    setValue("capital", 0.0);
    setValue("interes", "0.0000");
  }, [idCliente, DataEmpresa]);

  useEffect(() => {
    const monto = capitalValue || 0;
    const interesDefecto = DataEmpresa?.interesdefecto;

    const capital1 = monto;

    const n = parseFloat(TCuotas);
    const p = parseFloat(Mcuota.toString().replace(/[^0-9.-]/g, ""));

    setValue("montoprestar", monto);
    //setValue("mcuota", (monto / interesDefecto))

    if (amortiza === "Cuota Fija" && capital1 > 0 && n > 0 && p > 0) {
      if (p * n > capital1) {
        const tasaResultante = calcularTasaNewtonRaphson(capital1, n, p);
        const tasaPorcentaje = tasaResultante * 100;
        setValue("interes", tasaPorcentaje.toFixed(5));
      } else {
        setValue("interes", "0.0000");
      }
    }
  }, [
    capital,
    TCuotas,
    Mcuota,
    amortiza,
    Frecuencia,
    capitalValue,
    Mseguro,
    Mcomision,
    Mgastolegal,
  ]);

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
        montoprestar: montoPrestar,
        montointeres: capitalValue * (Number(MMInteres) / 100),
        frecuencia: Frecuencia,
        mcuota: Mcuota,
        cuotaspagas: 0,
        capitalpendiente: capitalValue,
        balancependiente: 0,
        fecha: dayjs(fecha),
        fechaprimer: dayjs(fechaPrimerPago),
        fechaultimopago: null,
        mora: 0.0,
        gastoslegal: data.gastoslegal,
        comision: limpiarMonto(comision),
        seguro: data.seguro,
        idcobrador: Cobrador,
        tcuota: TCuotas,
        situacion: "EVALUACION",
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
            `${import.meta.env.VITE_API_URL}/cuotas/`,
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

  const openAmortizationModal = (client) => {
    setSelectedClient(client);
    setCalcCapital(client.montoCapital); // Inicializamos el capital con el de la solicitud
    setCalcRate(client.interesRate);
    setCalcTerm(client.mcuota);
    setCustomCuotaValue(client.montoCuota);
    setCalcMethod("french"); // 'french' representa la cuota fija basada en amortización real
    const today = new Date().toISOString().substring(0, 10);
    setCalcStartDate(today);
    setIsModalOpen(true);
  };

  const HandleProcesarAmortizacion = () => {
    setIsTablas(false);
    setTabValue("1");
  };

  // --- MANEJADORES DE ENTRADAS CON CÁLCULO BIDIRECCIONAL ---
  const handleCapitalChange = (val) => {
    console.log(val);
    const cap = parseFloat(val) || 0;
    console.log(calcTerm);
    setCalcCapital(cap);
    // Recalcular la cuota correspondiente manteniendo la tasa fija
    const calculatedCuota = calculateFrenchCuota(
      cap,
      parseInt(calcTerm) || 1,
      calcRate,
    );
    console.log(calcRate);
    setCustomCuotaValue(parseFloat(calculatedCuota.toFixed(2)));
  };

  const handleTermChange = (val) => {
    const term = parseInt(val) || 1;
    setCalcTerm(term);
    // Recalcular la cuota correspondiente manteniendo la tasa fija
    const calculatedCuota = calculateFrenchCuota(
      parseFloat(calcCapital) || 0,
      term,
      calcRate,
    );
    setCustomCuotaValue(parseFloat(calculatedCuota.toFixed(2)));
  };

  const handleRateChange = (val) => {
    const rate = parseFloat(val) || 0;
    setCalcRate(rate);
    // Recalcular la cuota que resulta de esta tasa bajo método francés
    const calculatedCuota = calculateFrenchCuota(
      parseFloat(calcCapital) || 0,
      parseInt(calcTerm) || 1,
      rate,
    );
    setCustomCuotaValue(parseFloat(calculatedCuota.toFixed(2)));
  };

  const handleCuotaDesiredChange = (val) => {
    const cuota = parseFloat(val) || 0;
    setCustomCuotaValue(cuota);
    // Si estamos en método francés, calculamos automáticamente la tasa requerida
    if (calcMethod === "french") {
      const solvedRate = solveRateForFrench(
        parseFloat(calcCapital) || 0,
        parseInt(calcTerm) || 1,
        cuota,
      );
      setCalcRate(solvedRate);
    }
  };

  const handleMethodChange = (method) => {
    setCalcMethod(method);
    if (method === "french") {
      // Sincronizar tasa actual con la cuota actual
      const calculatedCuota = calculateFrenchCuota(
        parseFloat(calcCapital) || 0,
        parseInt(calcTerm) || 1,
        calcRate,
      );
      setCustomCuotaValue(parseFloat(calculatedCuota.toFixed(2)));
    }
  };

  // --- MOTOR DE CÁLCULO DE LA TABLA DE AMORTIZACIÓN (Sincronizado con Estados) ---
  const amortizationSchedule = useMemo(() => {
    if (!selectedClient)
      return {
        rows: [],
        totalPrincipal: 0,
        totalInteres: 0,
        totalPagar: 0,
        cuotaLabel: "$0.00",
      };

    const capital = parseFloat(calcCapital) || 0;
    const term = parseInt(calcTerm) || 1;
    const rate = parseFloat(calcRate) || 0;
    const freq = selectedClient.frecuencia;
    const baseDate = calcStartDate
      ? new Date(calcStartDate + "T00:00:00")
      : new Date();

    let rows = [];
    let totalPrincipal = 0;
    let totalInteres = 0;
    let totalPagar = 0;
    let balancePendiente = capital;
    let cuotaLabel = "";

    const calcularSiguienteFecha = (fecha, index, frecuencia) => {
      let resultado = new Date(fecha);
      if (frecuencia === "SEMANAL") {
        resultado.setDate(fecha.getDate() + 7 * index);
      } else if (frecuencia === "QUINCENAL") {
        resultado.setDate(fecha.getDate() + 15 * index);
      } else if (frecuencia === "MENSUAL") {
        resultado.setMonth(fecha.getMonth() + index);
      } else {
        resultado.setDate(fecha.getDate() + 30 * index);
      }
      return resultado;
    };

    // 1. MÉTODO FRANCÉS (CUOTA FIJA SOBRE SALDOS INSOLUTOS)
    if (calcMethod === "french") {
      const r = rate / 100; // Tasa de interés periódica (Ej: semanal)
      let cuotaCalculada = 0;

      if (r > 0) {
        cuotaCalculada = (capital * r) / (1 - Math.pow(1 + r, -term));
      } else {
        cuotaCalculada = capital / term;
      }

      cuotaLabel = formatter.format(cuotaCalculada);

      for (let i = 1; i <= term; i++) {
        const fechaPago = calcularSiguienteFecha(baseDate, i, freq);
        const interesCuota = balancePendiente * r;
        let capitalCuota = cuotaCalculada - interesCuota;

        // Ajuste milimétrico en la última cuota para liquidar balance por decimales
        if (i === term) {
          capitalCuota = balancePendiente;
          cuotaCalculada = capitalCuota + interesCuota;
        }

        balancePendiente -= capitalCuota;
        totalInteres += interesCuota;
        totalPrincipal += capitalCuota;

        rows.push({
          numero: i,
          fecha: fechaPago,
          capital: capitalCuota,
          interes: interesCuota,
          cuota: cuotaCalculada,
          balance: Math.max(0, balancePendiente),
        });
      }
      totalPagar = totalPrincipal + totalInteres;

      // 2. MÉTODO FLAT DIRECTO (Cuota Fija Forzada con Interés Uniforme)
    } else if (calcMethod === "flat_manual") {
      const cuotaFija = parseFloat(customCuotaValue) || capital / term;
      const totalAPagar = cuotaFija * term;
      const interesTotal = totalAPagar - capital;
      const interesPorCuota = interesTotal / term;
      const capitalPorCuota = capital / term;

      totalInteres = interesTotal;
      totalPrincipal = capital;
      totalPagar = totalAPagar;
      cuotaLabel = formatter.format(cuotaFija);

      for (let i = 1; i <= term; i++) {
        const fechaPago = calcularSiguienteFecha(baseDate, i, freq);
        balancePendiente -= capitalPorCuota;
        rows.push({
          numero: i,
          fecha: fechaPago,
          capital: capitalPorCuota,
          interes: interesPorCuota,
          cuota: cuotaFija,
          balance: Math.max(0, balancePendiente),
        });
      }

      // 3. MÉTODO ALEMÁN (Amortización de Capital Fijo, Cuota Variable Descendente)
    } else if (calcMethod === "german") {
      const capitalFijo = capital / term;
      const r = rate / 100;

      for (let i = 1; i <= term; i++) {
        const fechaPago = calcularSiguienteFecha(baseDate, i, freq);
        const interesCuota = balancePendiente * r;
        const cuotaTotal = capitalFijo + interesCuota;
        balancePendiente -= capitalFijo;

        totalInteres += interesCuota;
        totalPrincipal += capitalFijo;

        rows.push({
          numero: i,
          fecha: fechaPago,
          capital: capitalFijo,
          interes: interesCuota,
          cuota: cuotaTotal,
          balance: Math.max(0, balancePendiente),
        });
      }
      totalPagar = totalPrincipal + totalInteres;
      cuotaLabel = `${formatter.format(rows[0]?.cuota || 0)} (Var. Descendente)`;
    }

    return { rows, totalPrincipal, totalInteres, totalPagar, cuotaLabel };
  }, [
    selectedClient,
    calcMethod,
    calcCapital,
    calcRate,
    calcTerm,
    calcStartDate,
    customCuotaValue,
  ]);

  const copyAmortizationToClipboard = () => {
    let text =
      "Cuota\tFecha de Pago\tCapital Amortizado\tIntereses\tMonto Cuota\tBalance Restante\n";
    amortizationSchedule.rows.forEach((row) => {
      text += `${row.numero}\t${row.fecha.toLocaleDateString("es-DO", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}\t${formatter.format(row.capital)}\t${formatter.format(row.interes)}\t${formatter.format(row.cuota)}\t${formatter.format(row.balance)}\n`;
    });

    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);

    Alert("Plan de pagos copiado al portapapeles con éxito.");
  };

  return (
    <div
      className="container-fluid p-2 overflow-hidden"
      style={{
        backgroundColor: MisColores.bgGray,
        fontFamily: "Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        overflowY: "auto",
        maxHeight: "100vh",
      }}
    >
      <div className="col-md-12">
        <div
          className="card shadow-sm rounded-3 mx-auto w-100 hadow-sm mx-auto w-100 "
          style={{ maxWidth: "1100px" }}
        >
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
                  onChange={handleFecha}
                />
              </InputField>

              <InputField
                label="Amortización"
                icon={Info}
                required
                col="col-md-3"
              >
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

              <InputField
                label="Frecuencia"
                icon={Info}
                required
                col="col-md-3"
              >
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

              <InputField
                label="Monto Capital"
                icon={DollarSign}
                required
                col="col-md-3"
              >
                <Controller
                  name="capital"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "El monto es obligatorio",
                    min: { value: 1, message: "El monto debe ser mayor a 0" },
                  }}
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
                        onChange={(e) => handleCapitalChange(e.target.value)}
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

              <InputField
                label="Monto a Prestar"
                icon={DollarSign}
                required
                col="col-md-3"
              >
                <Controller
                  name="montoprestar"
                  control={control}
                  rules={{
                    required: "El monto es obligatorio",
                    min: { value: 1, message: "El monto debe ser mayor a 0" },
                  }}
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
                        className="form-control border-0 shadow-none fw-bold bg-success-subtle"
                        placeholder="DOP 0.00"
                        style={{ fontSize: "0.8em" }}
                        onValueChange={(values) => {
                          setMontoPrestar(values.floatValue || 0);
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
                label="Mora"
                icon={Percent}
                required
                col="col-md-3"
                readOnly
              >
                <Controller
                  name="mora"
                  control={control}
                  render={({ field: { onChange, value, name, ref } }) => (
                    <NumericFormat
                      name={name}
                      getInputRef={ref}
                      value={value}
                      thousandSeparator={true}
                      decimalScale={2}
                      fixedDecimalScale={true}
                      readOnly
                      className="form-control border-0 shadow-none fw-bold bg-success-subtle"
                      placeholder="0.00"
                      onValueChange={(values) => {
                        // Actualiza el formulario (esto es ligero y no pierde el foco)
                        onChange(values.floatValue || 0);
                      }}
                      style={{ fontSize: "0.8em" }}
                      disabled={DataEmpresa.aplicarmora ? false : true}
                    />
                  )}
                />
              </InputField>

              <InputField
                label="Gastos Legales"
                icon={Percent}
                required
                col="col-md-3"
              >
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
                      className="form-control border-0 shadow-none fw-bold bg-success-subtle"
                      placeholder="DOP 0.00"
                      onValueChange={(values) => {
                        setgastosLegales(values.floatValue || 0);
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
                      className="form-control border-0 shadow-none fw-bold bg-success-subtle"
                      placeholder="DOP 0.00"
                      onValueChange={(values) => {
                        console.log(values.floatValue);
                        // Actualiza el formulario (esto es ligero y no pierde el foco)
                        setSeguro(values.floatValue || 0);
                        onChange(values.floatValue || 0);
                      }}
                      style={{ fontSize: "0.8em" }}
                    />
                  )}
                />
              </InputField>

              <InputField
                label="Otros Cargos"
                icon={Percent}
                required
                col="col-md-3"
              >
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
                        setComision(values.floatValue || 0); // Actualiza el formulario (esto es ligero y no pierde el foco)
                        onChange(values.floatValue || 0);
                      }}
                      style={{ fontSize: "0.8em" }}
                    />
                  )}
                />
              </InputField>

              <InputField label="Cuotas" icon={List} required col="col-md-3">
                <div>
                  <input
                    type="number"
                    placeholder="0"
                    {...register("tcuota", {
                      required: "El número de cuotas es obligatorio",
                      min: { value: 1, message: "Mínimo 1 cuota" },
                    })}
                    className="form-control border-0 shadow-none"
                    style={{ fontSize: "0.8em" }}
                  />
                </div>

                {errors.tcuota && (
                  <span
                    className="text-danger ps-2"
                    style={{ fontSize: "0.7em" }}
                  >
                    {errors.tcuota.message}
                  </span>
                )}
              </InputField>

              <InputField
                label="Monto de Cuota"
                icon={DollarSign}
                required
                col="col-md-3"
              >
                <Controller
                  name="mcuota"
                  control={control}
                  rules={{
                    required: "El monto es obligatorio",
                    min: { value: 1, message: "El monto debe ser mayor a 0" },
                  }}
                  render={({
                    field: { onChange, name, ref },
                    fieldState: { error },
                  }) => (
                    <>
                      <NumericFormat
                        name={name}
                        getInputRef={ref}
                        value={datosCreditos.montoCuota || ""}
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
                label="Tasa Interes (%)"
                icon={Percent}
                readOnly
                required
                col="col-md-3"
              >
                <input
                  type="text"
                  value={datosCreditos.tasaFrecuenciaPorcentaje}
                  {...register("interes")}
                  className="form-control border-0 shadow-none bg-warning-subtle fw-bold text-dark"
                />
              </InputField>

              <InputField
                label="Fecha Primer Pago"
                icon={Calendar}
                required
                col="col-md-3"
              >
                <input
                  type="date"
                  className="form-control border-0 shadow-none"
                  style={{ fontSize: "0.8em" }}
                  {...register("fechaprimer")}
                  onChange={HandleFechaPrimer}
                />
              </InputField>

              <InputField
                label="Compañía"
                icon={Briefcase}
                required
                col="col-md-3"
              >
                <select
                  name="compania"
                  onChange={HandleCompany}
                  className="form-select border-0 shadow-none"
                  style={{ fontSize: "0.8em" }}
                >
                  <option value="" disabled selected>
                    Seleccione un Compañia
                  </option>
                  {dataCompany.map((items) => (
                    <option value={items.id} key={items.id}>
                      {items.company}
                    </option>
                  ))}
                </select>
              </InputField>

              <SectionTitle title="Otros" />
              <InputField
                label="Nombre de Ruta"
                icon={Map}
                readOnly
                col="col-md-3"
              >
                <input
                  type="text"
                  value={ruta}
                  readOnly
                  className="form-control border-0 shadow-none bg-info-subtle fw-bold text-primary"
                  style={{ fontSize: "0.8em" }}
                />
              </InputField>

              <InputField
                label="Gestor"
                icon={Briefcase}
                required
                col="col-md-3"
              >
                <select
                  name="idgestor"
                  onChange={HandleGestor}
                  className="form-select border-0 shadow-none"
                  style={{ fontSize: "0.8em" }}
                >
                  <option value="" disabled selected>
                    Seleccione un gestor...
                  </option>
                  {dataUser.map((items) => (
                    <option value={items.id} key={items.id}>
                      {items.nombreusuario}
                    </option>
                  ))}
                </select>
              </InputField>

              <InputField
                label="Cobrador"
                icon={Briefcase}
                required
                col="col-md-3"
              >
                <select
                  name="idcobrador"
                  onChange={HandleCobrador}
                  className="form-select border-0 shadow-none"
                  style={{ fontSize: "0.8em" }}
                >
                  <option value="" disabled selected>
                    Seleccione un cobrador...
                  </option>
                  {dataCobrador.map((items) => (
                    <option value={items.id} key={items.id}>
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
              <InputField
                label="Identificación"
                icon={CreditCard}
                col="col-md-3"
              >
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

              <div className="row">
                <div className=" col-12">
                  <div className="d-flex justify-content-end p-3 w-100 shadow-sm rounded-3 mx-auto mt-3 bg-white border-1">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4 fw-bold shadow-sm me-2"
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
                        backgroundColor: MisColores.teal,
                        borderRadius: "8px",
                        fontSize: "0.8em",
                      }}
                      disabled={!isTablas}
                    >
                      <Save size={18} className="me-2" /> INSERTAR PRÉSTAMOS
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </LocalizationProvider>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default PrestamosForm;
