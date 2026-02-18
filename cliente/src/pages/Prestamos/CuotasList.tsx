import React, { useEffect, useState, useRef } from "react";
import Modal from "@mui/material/Modal";
import Logo from "../../components/Brand/Brand.tsx";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import { SiMeteor } from "react-icons/si";
import { useForm, Controller, useWatch } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import TipoAmortizacion from "../../data/Apis/TipoAmortizacion.json";
import Frecuencias from "../../data/Apis/Modalidad.json";
import { PiCalculatorThin, PiPercentLight } from "react-icons/pi";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AiOutlineCalculator } from "react-icons/ai";
import CalculoInteres from "./CalculoInteres.tsx";
import FindPng from "../../assets/img/finder.png";
import BeatLoader from "react-spinners/BeatLoader";
import TablaAmortiza from "./TablaAmortiza.tsx";
import limpiarMonto from "../../components/stuff/LimpiarMonto.tsx";
import { BsPrinter } from "react-icons/bs";
import { transform } from "framer-motion";
import MButton from "../../components/stuff/MButton.tsx";
import { CiSaveDown1 } from "react-icons/ci";
import { MdOutlineCancel, MdOutlineSaveAlt } from "react-icons/md";
import FindEmpresas from "../../components/general/FindEmpresas.tsx";

const CuotasList = ({
  open,
  handleClose,
  varcapital,
  varinteres,
  varcuota,
  varTcuota,
  vartipoamotiza,
  varfrecuencia,
  fechaPrimerPago,
  isView,
  varSeguro,
  modo,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(open);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [amortiza, setAmotiza] = useState(vartipoamotiza);
  const [Frecuencia, setFrecuencia] = useState(varfrecuencia);
  const [vCuota, setCuota] = useState(varTcuota);
  const [Interes, setInteres] = useState(0.0);
  const [Calcular, setCalcular] = useState(false);
  const [vfechaPrimerPago, setFechaPrimerPago] = useState(fechaPrimerPago);
  const [montoCuota, setMontoCuota] = useState(varcuota);
  const [capitalValue, setCapitalValue] = useState(varcapital);
  const [Tabla, setTabla] = useState([]);
  const [isHabilitar, setIsHabilitar] = useState(false);
  const [Capital, setCapital] = useState(0.0);
  const [Seguro, setSeguro] = useState(0.0);

  const [EmpValores, setEmpValores] = useState({
    seguro: 0,
    gastolegal: 0,
    interesdefault: 0,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    control,
  } = useForm({
    defaultValues: {
      capital: 0.0,
      mcuota: 0.0,
      tcuota: 13,
      interes: 0.0,
      mora: 0.0,
      gastoslegal: 0.0,
      seguro: 0.0,
      comision: 0.0,
      tipoamortizacion: "",
      Frecuencia: "SEMANAL",
      
    },
  });

  const MMInteres = useWatch({ control, name: "interes" });
  const TCuotas = useWatch({ control, name: "mcuota" });

  const CloseModal = () => {
    isModalOpen(false);
  };
  const handleEmpresa = (datos) => {
    console.log(datos);
  };

  useEffect(()=>{
    setSeguro(EmpValores.seguro)
    setInteres(EmpValores.interesdefecto)
    setFechaPrimerPago(dayjs(new Date()))
  }, [EmpValores])

  const HandleArmortiza = (e) => {
    setAmotiza(e.target.value);
  };

  const HandleFrecuencia = (e) => {
    setFrecuencia(e.target.value);
  };

  const HandleCuota = (e) => {
    setCuota(e.target.value);
  };
  const HandleInteres = (e) => {
    setInteres(e.target.value);
  };

  const HandleFechaPrimer = (date) => {
    setFechaPrimerPago(date);
  };
  const HandleMontoCuota = (e) => {
    setMontoCuota(e.target.value);
  };

  const HandleSeguro = (e) => {
    setSeguro(e.target.value);
  };
  const CalculadoraInteres = () => {
    const resultado = CalculoInteres(
      limpiarMonto(capitalValue),
      vCuota,
      montoCuota,
      amortiza,
      Frecuencia
    );

    setInteres(resultado.toFixed(2));
  };

  const GetCalculadora = () => {
    CalculadoraInteres();
    setCalcular(true);
  };

  const HandleMontoCapital = (e) => {
    setCapitalValue(e.target.value);
  };

  const LimpiarVariables = () => {
    setCuota("");
    setMontoCuota("");
    setInteres("");
    setCapitalValue("");
    setAmotiza("");
    setFrecuencia("");
  };

  const GuardarCambios = () => {
    setIsModalOpen(false);
  };

  const HandleCapital = (e) => {
    const mm = e.target.value;
    console.log(TCuotas, MMInteres);

    if (amortiza === "Cuota Fija") {
      const mmCuota = limpiarMonto(mm) * (MMInteres / 100);
      console.log(mmCuota);
      setValue("mcuota", mmCuota);
      setMontoCuota(mmCuota);
    }
    console.log(e.target.value);
    setCapitalValue(e.target.value);
  };

  return (
    <>
     <FindEmpresas onUpdate={(valores) => setEmpValores(valores)} />
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
            left: "60%",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "10px",
              zIndex: "9000",
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
              {isView ? null : (
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
              )}
            </div>
          </div>
          <div className="p-2 bg-dark-subtle">
            <span className="text-info fw-bold">Calculadora</span>
          </div>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form>
              <div className="row p-3">
                <div className="col-sm-6 col-md-4 p-2 ">
                  <br />
                  <br />
                  <div className="row">
                    <div className="col-sm-12 col-md-12 mb-3 ">
                      <Controller
                        name="capital"
                        control={control}
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
                            decimalScale={2}
                            allowNegative={false}
                            value={capitalValue}
                            disabled={isHabilitar}
                            onChange={HandleCapital}
                            onValueChange={(values) => {
                              field.onChange(values.floatValue || 0.0); // Actualiza el valor en react-hook-form
                            }}
                            InputLabelProps={{ style: { fontSize: "0.9rem" } }}
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

                    <div className="col-sm-12 col-md-12">
                      <TextField
                        label="Amortización *"
                        select
                        value={amortiza}
                        fullWidth
                        disabled={isHabilitar}
                        onChange={HandleArmortiza}
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

                  <div className="row mt-3">
                    <div className="col-sm-12 col-md-6">
                      <TextField
                        // {...register("frecuencia", {
                        //   required: "Este campo es obligatorio",
                        // })}
                        label="Frecuencia *"
                        select
                        value={Frecuencia}
                        fullWidth
                        disabled={isHabilitar}
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
                    </div>
                    <div className="col-sm-12 col-md-6">
                      <TextField
                        label="Cuotas"
                        variant="outlined"
                        value={vCuota}
                        onChange={HandleCuota}
                        fullWidth
                        disabled={isHabilitar}
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
                  </div>

                  <div className="row mt-3">
                    <div className="col-sm-6 col-md-6">
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
                            disabled={isHabilitar}
                            thousandSeparator=","
                            decimalSeparator="."
                            prefix=""
                            value={Interes}
                            onChange={HandleInteres}
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

                            //   className="clFont"
                          />
                        )}
                      />
                    </div>

                    <div className="col-sm-6 col-md-6">
                      <DatePicker
                        label="Fecha Primer Pago"
                        value={vfechaPrimerPago}
                        onChange={HandleFechaPrimer}
                        disabled={isHabilitar}
                        format="DD/MM/YYYY"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                            fontSize: "0.8em",
                            width: "100%",
                            color: "GrayText",
                          },
                        }}
                      />
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-sm-6 col-md-6 p-2 ">
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
                            value={Seguro}
                            prefix="DOP "
                            fixedDecimalScale
                            decimalScale={2}
                            allowNegative={false}
                            disabled={true}
                            onChange={HandleSeguro}
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
                    <div className="col-sm-6 col-md-6 p-2">
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
                            value={montoCuota}
                            prefix="DOP "
                            fixedDecimalScale
                            decimalScale={2}
                            allowNegative={false}
                            // disabled={!capitalValue}
                            onChange={HandleMontoCuota}
                            disabled={isHabilitar}
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
                                    onClick={() => CalculadoraInteres()}
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
                  </div>
                  <br />
                  <div className="d-flex justify-content-between align-items-center">
                    <MButton
                      color={"#4682b4"}
                      text={"Calcular"}
                      variant={"contained"}
                      icon={<PiCalculatorThin />}
                      onClick={() => GetCalculadora()}
                    />
                  </div>
                </div>
                {Calcular ? (
                  <div className="col-sm-6 col-md-8 p-2">
                    <div className="d-flex justify-content-between align-content-center">
                      <p className="text-info ">Amortización</p>

                      <MButton
                        color={"#0097B2"}
                        text={"Imprimir"}
                        variant={"contained"}
                        icon={<BsPrinter />}
                      />
                    </div>

                    <div
                      className=" overflow-x-scroll"
                      style={{ height: "450px", overflowY: "auto" }}
                    >
                      <TablaAmortiza
                        fechainicio={vfechaPrimerPago}
                        tc={vCuota}
                        mc={limpiarMonto(montoCuota)}
                        loan={Number(Interes).toFixed(2)}
                        ccapital={limpiarMonto(capitalValue)}
                        tipo={amortiza}
                        fre={Frecuencia}
                        Seguro={Seguro}
                        modo={modo}
                      />
                    </div>

                    <div className="row mt-2 mx-2">
                      <div className="col-sm-6 col-md-12 ">
                        <div className="d-flex justify-content-end align-items-center">
                          {/* <MButton
                            color={"#0097B2"}
                            text={"Guardar Cambios"}
                            variant={"contained"}
                            icon={<MdOutlineSaveAlt />}
                          />
                    
                          <MButton
                            color={"#f08080"}
                            text={"Cancelar Cambios"}
                            variant={"contained"}
                            icon={<MdOutlineCancel />}
                            onClick={handleClose}
                          /> */}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="col-sm-6 col-md-8">
                    <div className="d-flex flex-column justify-content-center h-100 align-items-center">
                      <BeatLoader
                        color="#008080"
                        size={15}
                        className="text-center"
                      />
                      {/* <img src={FindPng} alt="Imagen Find" width={150} /> */}
                      <span className="clFont mt-4">
                        No se han geranerado tabla de amortizacion
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </LocalizationProvider>
        </Box>
      </Modal>
    </>
  );
};

export default CuotasList;
