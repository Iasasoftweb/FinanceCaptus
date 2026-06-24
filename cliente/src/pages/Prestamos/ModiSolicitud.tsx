import React, { useEffect, useState } from "react";
import { MisColores } from "../../components/stuff/MisColores";
import {
  Calendar,
  ClipboardPen,
  HandCoins,
  Info,
  Landmark,
  Save,
  X,
} from "lucide-react";
import { InputField } from "../../components/stuff/InputField";
import Frecuencias from "../../data/Apis/Modalidad.json";
import getAmortizaData from "./getAmortizaCuotaFija";
import axios from "axios";
import limpiarMonto from "../../components/stuff/LimpiarMonto";
import { safeFixed } from "../../components/UtilsStuff";

const ModiSolicitud = ({ dataInicial, onClose }) => {
  const miData = dataInicial;

  const [fechaInicial, setFechaInicial] = useState("");
  const [totalCuotas, setTotalCuotas] = useState("");
  const [frecuencia, setFrecuencia] = useState("");
  const [montoPrestado, setMontoPrestado] = useState("");
  const [tasaInteres, setTasaInteres] = useState("");
  const [montoCuota, setMontoCuota] = useState("");

  const formatCurrency = (value) => {
    if (!value) return "";

    if (value.endsWith("."))
      return `$${parseFloat(value).toLocaleString("es-DO")}.`;

    const sections = value.split(".");
    const intPart = parseFloat(sections[0]) || 0;

    // Formateamos la parte entera con comas
    let formatted = `$${intPart.toLocaleString("es-DO")}`;

    // Si tiene decimales, se los acoplamos al final (limitado a 2 dígitos)
    if (sections[1] !== undefined) {
      formatted += "." + sections[1].slice(0, 2);
    }

    return formatted;
  };

  useEffect(() => {
    if (dataInicial) {
      console.log(miData);
      setFechaInicial(miData.fechaprimer || "");
      setTotalCuotas(miData.tcuota || "");
      setFrecuencia(miData.frecuencia || "");
      setMontoPrestado(miData.capital || "");
      setTasaInteres(safeFixed(miData.interes,3) || "");
      setMontoCuota(miData.mcuota || "");
    }
  }, [dataInicial]);

  const handleMontoPrestado = (val) => {
    const cleanValue = val.replace(/[^0-9.]/g, "");
    const parts = cleanValue.split(".");
    const finalValue = parts[0] + (parts.length > 1 ? "." + parts[1] : "");
    console.log(finalValue);
    setMontoPrestado(finalValue ? formatCurrency(finalValue) : "");
  };


   const handleMontoCuota = (val) => {
    const cleanValue = val.replace(/[^0-9.]/g, "");
    const parts = cleanValue.split(".");
    const finalValue = parts[0] + (parts.length > 1 ? "." + parts[1] : "");
    console.log(finalValue);
    setMontoCuota(finalValue ? formatCurrency(finalValue) : "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ fechaInicial, totalCuotas, frecuencia });

    try {
      // 1. Mapeamos la nueva data combinando lo que el usuario modificó en los inputs
      const tablaAmortizacion = getAmortizaData({
        fechainicio: fechaInicial, // <-- Nuevo Estado
        tc: Number(totalCuotas), // <-- Nuevo Estado (Convertido a número)
        fre: frecuencia, // <-- Nuevo Estado
        mc: limpiarMonto(montoCuota),
        loan: Number(tasaInteres),
        ccapital: limpiarMonto(montoPrestado),
        tipo: dataInicial.tipoamortizacion, // Mantiene el original
        seguro: dataInicial.seguro, // Mantiene el original
      });


      const datosModificados = {
        fechaprimer: fechaInicial, // <-- Nuevo Estado
        tcuota: limpiarMonto(totalCuotas), // <-- Nuevo Estado (Convertido a número)
        frecuencia: frecuencia, // <-- Nuevo Estado
        mcuota: limpiarMonto(montoCuota),
        interes: Number(tasaInteres),
        capital: limpiarMonto(montoPrestado),

      }

      if (tablaAmortizacion.length > 0) {
        const idPrestamo = dataInicial.id; // Asegúrate de tener el ID del préstamo actual

        // 2. CRÍTICO: Primero eliminamos las cuotas viejas para evitar duplicados
        // Ajusta esta URL según cómo manejes los DELETE en tu API de Express/Node
        await axios.delete(`${import.meta.env.VITE_API_URL}/cuotas/cuotas/${idPrestamo}`);

        // 3. Insertamos las nuevas cuotas recalculadas
        await axios.post(
          `${import.meta.env.VITE_API_URL}/cuotas/`,
          tablaAmortizacion.map((cuota) => ({
            idprestamo: idPrestamo,
            ...cuota,
          })),
        );


             await axios.put(`${import.meta.env.VITE_API_URL}/prestamos/${idPrestamo}`, datosModificados);
        



        alert("¡Solicitud y cuotas modificadas con éxito!");
        onClose(); // Cerrar modal
      }
    } catch (error) {
      console.error("Error al recalcular o guardar las cuotas:", error);
      alert("Hubo un error al procesar la modificación.");
    }
  };
  return (
    <div
      className="modal-dialog modal-dialog modal-dialog-centered modal-dialog-scrollable"
      style={{ maxWidth: "850px", width: "90%" }}
    >
      <div className="modal-content w-100">
        <div className="modal-header">
          <div className="d-flex align-items-center gap-3">
            <div
              className="p-2 rounded-3 text-white d-flex align-items-center justify-content-center shadow-sm"
              style={{
                backgroundColor: MisColores.headerBlue,
                width: "45px",
                height: "45px",
              }}
            >
              <ClipboardPen />
            </div>

            <div className="">
              <h4 className="mb-0 lh-1 text-start">Solicitud</h4>
              <span className="text-muted">Modificacion de Solicitud</span>
            </div>
          </div>
          <button
            type="button"
            className="btn-close"
            style={{ fontSize: "0.9em" }}
            onClick={onClose}
          ></button>
        </div>
        <div className="modal-body text-start">
          <form onSubmit={handleSubmit} className="row g-3">
            <InputField
              label={"Fecha de Inicio"}
              col={"col-md-4"}
              icon={Calendar}
            >
              <input
                type="date"
                className="form-control border-0 shadow-none"
                style={{ fontSize: "0.8em" }}
                value={fechaInicial}
                onChange={(e) => setFechaInicial(e.target.value)}
              />
            </InputField>

            <InputField
              label={"Cantidad de Cuota"}
              col={"col-md-4"}
              icon={Calendar}
            >
              <input
                type="number"
                className="form-control border-0 shadow-none"
                style={{ fontSize: "0.8em" }}
                value={totalCuotas}
                onChange={(e) => setTotalCuotas(e.target.value)}
              />
            </InputField>

            <InputField label="Frecuencia" icon={Info} col="col-md-4" readonly>
              <select
                className="form-select border-0 shadow-none"
                style={{ fontSize: "0.8em" }}
                value={frecuencia}
                onChange={(e) => setFrecuencia(e.target.value)}
                disabled={true}
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
              label={"Monto Prestado"}
              col={"col-md-4"}
              icon={HandCoins}
            >
              <input
                type="text"
                className="form-control border-0 shadow-none clFont"
                placeholder="0.00"
                value={montoPrestado}
                onChange={(e) => handleMontoPrestado(e.target.value)}
              />
            </InputField>

            <InputField label={"Tasa Interes"} col={"col-md-4"} icon={Landmark}>
              <input
                type="text"
                className="form-control border-0 shadow-none clFont"
                value={tasaInteres}
                onChange={(e) => setTasaInteres(e.target.value)}
              />
            </InputField>

            <InputField
              label={"Monto Cuota"}
              col={"col-md-4"}
              icon={HandCoins}
            >
              <input
                type="text"
                className="form-control border-0 shadow-none clFont"
                placeholder="0.00"
                value={montoCuota}
                onChange={(e) => handleMontoCuota(e.target.value)}
              />
            </InputField>

            <div className=" modal-footer mt-3">
              <div className="row">
                <div className=" col-12">
                  <div className="d-flex justify-content-end p-3 w-100 shadow-sm rounded-3 mx-auto mt-3 bg-white border-1">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4 fw-bold shadow-sm me-2"
                      style={{ borderRadius: "8px", fontSize: "0.8em" }}
                      onClick={onClose}
                    >
                      <X size={18} className="me-2" /> CANCELAR
                    </button>
                    <button
                      type="submit"
                      className="btn text-white px-5 fw-bold shadow-sm border-0 d-flex align-items-center  text-uppercase border-start border-danger border-3"
                      style={{
                        backgroundColor: MisColores.teal,
                        borderRadius: "8px",
                        fontSize: "0.8em",
                      }}
                    >
                      <Save size={18} className="me-2" /> Modificar Prestamos
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModiSolicitud;
