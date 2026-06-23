import React, { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import { IoCloseCircleOutline } from "react-icons/io5";
import useBalancePendiente from "../Prestamos/balancePendiente.tsx";
import { formatCurrency } from "../../components/UtilsStuff.tsx";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  DollarSign,
  HandCoins,
  Info,
  Printer,
  TrendingUp,
  X,
  History,
  FileText,
  ChevronRight,
  ChevronLeft,
  Clock,
} from "lucide-react";
import { MisColores } from "../../components/stuff/MisColores.tsx";
import { Avatar } from "antd";
import {
  useCuotasPrestamos,
  usePrestamosOne,
} from "../../hooks/useDataPrestamos.tsx";
import { style } from "../Prestamos/Pdfs/style.ts";
import { formatFechaVista, formatFechaVistaLetras } from "../../components/stuff/funcionesDev.tsx";

const PagosCuotas = () => {
  const [ffecha, setFFecha] = useState(new Date());
  const [dataCuotas, setDataCuotas] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fechaHoy = new Date();

  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const itemsPerPage = 8;

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const idprestamo = Number(id);
  const [activeTab, setActiveTab] = useState("amortizacion");

  const UrisImg = `${import.meta.env.VITE_API_URL}/uploads/clientes/avata/`;

  const { data: PrestamoData, isLoading, error } = usePrestamosOne(idprestamo);
  const { data: cuotasPrestamos = [] } = useCuotasPrestamos(idprestamo);

  const filtrar = cuotasPrestamos;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const cuotasDatas = filtrar.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtrar.length / itemsPerPage);

  const getCalculatedStatus = (item) => {
    if (!item) return "PENDIENTE";

    if (item.pagada === "true") return "PAGADA";

    // Normalizamos las fechas para comparar solo año-mes-día
    const dueDate = new Date(item.fechavencimiento);

    // Si la fecha de vencimiento es menor que hoy, está atrazada
    if (dueDate < fechaHoy) {
      return "ATRAZADA";
    }

    return "PENDIENTE";
  };

  const getDiasAtraso = (item) => {
    if (!item || item.pagada === "true") return 0;

    const dueDate = new Date(item.fechavencimiento);
    if (dueDate < fechaHoy) {
      // Diferencia en milisegundos
      const diffTime = fechaHoy - dueDate;
      // Conversión a días
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    return 0;
  };

  const StatusBadge = ({ status }) => {
    const config = {
      PAGADA: {
        bg: "bg-success-subtle",
        text: "text-success",
        icon: <CheckCircle2 size={14} className="me-1" />,
      },
      ATRAZADA: {
        bg: "bg-danger-subtle",
        text: "text-danger",
        icon: <AlertCircle size={14} className="me-1" />,
      },
      PENDIENTE: {
        bg: "bg-warning-subtle",
        text: "text-warning-emphasis",
        icon: <Clock size={14} className="me-1" />,
      },
    };

    const { bg, text, icon } = config[status];

    return (
      <span
        className={`badge rounded-pill border ${bg} ${text} d-inline-flex align-items-center px-3 py-2`}
      >
        {icon}
        {status}
      </span>
    );
  };

  const {
    CuotasPendientes,
    BalancePendiente,
    BalanceMoraPendiente,
    BalanceCapitaPendiente,
    BalanceInteresPendiente,
    CuotasAtrasadas,
    montoCuota,
  } = useBalancePendiente(idprestamo);

  useEffect(() => {
    setFFecha(new Date().toISOString().split("T")[0]);
    setDataCuotas(cuotasPrestamos);
  }, []);

  const CloseModal = () => {
    // handleClose();
  };

  const handleFecha = (e) => {
    setFFecha(e.target.value);
  };

  const handlePrestamos = () => {
    navigate("/prestamos");
  };

  // Datos simulados
  const loanSummary = {
    id: "PR-2024-8842",
    cliente: "Ismael Santos",
    capitalPendiente: 25000,
    interesPendiente: 1193.06,
    moraPendiente: 500,
    totalPendiente: 26693.06,
    cuotasAtraso: 2,
    montoCuota: 3000,
  };

  const circleStyle = {
    width: "24px",
    height: "24px",
    fontSize: "0.75rem",
    lineHeight: "1",
  };

  const circleClasses =
    "text-primary border-light rounded-circle d-inline-flex align-items-center justify-content-center fw-bold bg-light ";

  return (
    <Paper elevation={3} className="p-2" style={{ borderRadius: "10px" }}>
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
            <HandCoins size={20} />
          </div>
          <div>
            <h5 className="fw-bold mb-0" style={{ color: "#2c3e50" }}>
              Detalles del Préstamo
            </h5>
            <p className="text-muted mb-0 " style={{ fontSize: "0.8em" }}>
              Tabla de Amortizacion, Pagos y Detalles del Préstamo
            </p>
          </div>
        </div>
        <button
          className="btn btn-light rounded-circle p-2 text-secondary"
          onClick={() => handlePrestamos()}
        >
          <X size={20} />
        </button>
      </div>

      <header className=" pt-4 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-white shadow-sm rounded-circle p-2 d-flex align-items-center border-0 hover-bg-light">
              <Avatar
                size={70}
                src={`${UrisImg}${PrestamoData?.tcliente.imgFOTOS}`}
              />
            </button>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span
                  className="badge bg-primary-subtle text-primary fw-bold px-2 py-1 rounded-pill"
                  style={{ fontSize: "0.65rem" }}
                >
                  ID: {PrestamoData?.id}
                </span>
                <span
                  className="text-muted small"
                  style={{ fontSize: "0.8em" }}
                >
                  • {PrestamoData?.tcliente?.tbzona?.nombrerutas}
                </span>
              </div>
              <h6 className="fw-black m-0 text-dark d-flex align-items-center gap-2">
                {PrestamoData?.tcliente.nombre_completo}
                <CheckCircle2 size={22} className="text-success" />
              </h6>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-white btn-modern shadow-sm border-0 text-white d-flex align-items-center gap-2 "
              style={{ fontSize: "0.8em", background: MisColores.rojoPastel }}
            >
              <Printer size={18} /> Imprimir
            </button>
            <button
              className="btn btn-primary btn-modern btn-modern-primary d-flex align-items-center gap-2"
              style={{ fontSize: "0.8em", background: MisColores.headerBlue }}
            >
              <DollarSign size={18} /> Procesar Cobro
            </button>
          </div>
        </div>
      </header>

      <section className="row g-3 mb-4">
        {[
          {
            label: "Capital Pendiente",
            val: formatCurrency(BalanceCapitaPendiente),
            icon: TrendingUp,
            color: "primary",
            bg: "primary-subtle",
          },
          {
            label: "Cuotas en Atraso",
            val: CuotasAtrasadas,
            icon: AlertCircle,
            color: "danger",
            bg: "danger-subtle",
            isCount: true,
          },
          {
            label: "Mora Pendiente",
            val: formatCurrency(BalanceMoraPendiente),
            icon: Info,
            color: "warning",
            bg: "warning-subtle",
          },
          {
            label: "Total a Pagar",
            val: formatCurrency(BalancePendiente),
            icon: CheckCircle2,
            color: "success",
            bg: "success-subtle",
          },
        ].map((item, i) => (
          <div key={i} className="col-sm-6 col-lg-3">
            <div className="card card-modern p-3 border border-light-subtle">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span
                  className="text-muted small fw-bold text-uppercase"
                  style={{ fontSize: "0.65rem", letterSpacing: "0.05em" }}
                >
                  {item.label}
                </span>
                <div
                  className={`p-2 rounded-3 bg-${item.bg} text-${item.color}`}
                >
                  <item.icon size={18} />
                </div>
              </div>
              <h3
                className={`fw-bold m-0 ${item.isCount ? "text-danger" : "text-dark"}`}
              >
                {item.isCount ? item.val : `${item.val.toLocaleString()}`}
              </h3>
            </div>
          </div>
        ))}
      </section>
      <section className="row p-3 g-0">
        <div className="card card-modern overflow-hidden">
          <div className="card-header bg-white py-3 px-4 border-bottom-0">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <nav className="nav nav-pills nav-pills-modern">
                <button
                  className={`nav-link ${activeTab === "amortizacion" ? "active" : ""}`}
                  onClick={() => setActiveTab("amortizacion")}
                  style={{ fontSize: "0.8em" }}
                >
                  <Calendar size={16} className="me-2" /> Tabla Amortización
                </button>
                <button
                  className={`nav-link ${activeTab === "pagos" ? "active" : ""}`}
                  onClick={() => setActiveTab("pagos")}
                  style={{ fontSize: "0.8em" }}
                >
                  <History size={16} className="me-2" /> Pagos Realizados
                </button>
              </nav>
              <div className="bg-light px-3 py-2 rounded-3 border d-flex align-items-center gap-2">
                <div
                  className="bg-primary rounded-circle"
                  style={{ width: "8px", height: "8px" }}
                ></div>
                <span
                  className="text-muted fw-semibold"
                  style={{ fontSize: "0.7rem" }}
                >
                  CUOTA: {formatCurrency(montoCuota)}
                </span>
              </div>
            </div>
          </div>

          <div className="card-body p-0">
            {}
            {activeTab === "amortizacion" ? (
              <div className="table-responsive">
                <table className="table table-modern mb-0">
                  <thead>
                    <tr>
                      <th className="ps-4">Cuota</th>
                      <th>Fecha Vencimiento</th>
                      <th className="text-end">Capital</th>
                      <th className="text-end">Interés</th>
                      <th className="text-end">Mora</th>
                      <th className="text-end">Monto Total</th>

                      <th className="text-center">Estado</th>
                      <th className="text-center text-uppercase">
                        Dias Atraso
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cuotasDatas.map((item) => {
                      const diasAtraso = getDiasAtraso(item);
                      return (
                        <tr key={item.id}>
                          <td className="ps-4">
                            <div
                              className="rounded-circle bg-light d-flex align-items-center justify-content-center fw-bold text-primary shadow-sm border-light"
                              style={{
                                width: "32px",
                                height: "32px",
                                fontSize: "12px",
                              }}
                            >
                              {item.numcuota}
                            </div>
                          </td>
                          <td className="fw-semibold text-secondary">
                            {formatFechaVistaLetras(item.fechavencimiento)}
                          </td>
                          <td className="text-end text-muted">
                            {formatCurrency(item.montocapital)}
                          </td>
                          <td className="text-end text-muted">
                            {formatCurrency(item.montointeres)}
                          </td>
                          <td className="text-end fw-bold text-dark">
                            {formatCurrency(item.montomora)}
                          </td>
                          <td className="text-end fw-bold text-dark">
                            {formatCurrency(item.montocuota)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <StatusBadge status={getCalculatedStatus(item)} />
                          </td>
                          <td className="text-center">
                            {diasAtraso > 0 ? (
                              <span className="fw-semibold text-danger" style={{fontSize:"0.9em"}}>
                                {diasAtraso} días
                              </span>
                            ) : (
                              <span className="text-muted opacity-50">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-modern mb-0">
                  <thead>
                    <tr>
                      <th className="ps-4">Fecha Pago</th>
                      <th>Referencia / Recibo</th>
                      <th className="text-end">Monto Cobrado</th>
                      <th className="text-center">Método</th>
                      <th className="text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="ps-4 fw-semibold text-secondary">
                        10 Ene 2024
                      </td>
                      <td>
                        <span className="font-monospace text-muted bg-light px-2 py-1 rounded">
                          REC-00125
                        </span>
                      </td>
                      <td className="text-end fw-bold text-success">
                        $3,000.00
                      </td>
                      <td className="text-center">
                        <span className="badge bg-white text-dark border px-3 py-2 rounded-3">
                          Efectivo
                        </span>
                      </td>
                      <td className="text-center">
                        <button className="btn btn-light btn-sm rounded-circle">
                          <Printer size={16} />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center bg-white p-3 rounded-3 shadow-sm mt-4 border mb-3">
              <div className="text-muted small mb-3 mb-sm-0">
                <span>Mostrando Cuotas del </span>
                <span className={circleClasses} style={circleStyle}>
                  {indexOfFirstItem + 1}
                </span>

                <span className="mx-1">al</span>

                <span className={circleClasses} style={circleStyle}>
                  {Math.min(indexOfLastItem, filtrar.length)}
                </span>

                <span className="mx-1">de un total de</span>

                <span className={circleClasses} style={circleStyle}>
                  {filtrar.length}
                </span>
              </div>

              <nav aria-label="Page navigation">
                <ul className="pagination pagination-sm mb-0 gap-1">
                  {/* Botón Anterior */}
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link border-0 bg-light text-muted rounded shadow-sm d-flex align-items-center justify-content-center"
                      onClick={() => paginate(currentPage - 1)}
                      style={{ width: "32px", height: "32px" }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                  </li>

                  {/* Números de página */}
                  {[...Array(totalPages)].map((_, index) => (
                    <li
                      key={index}
                      className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                    >
                      <button
                        className={`page-link border-0 rounded shadow-sm fw-bold d-flex align-items-center justify-content-center ${currentPage === index + 1 ? "text-white" : "text-muted bg-white"}`}
                        style={{
                          width: "32px",
                          height: "32px",
                          backgroundColor:
                            currentPage === index + 1
                              ? MisColores.headerBlue
                              : "",
                        }}
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}

                  {/* Botón Siguiente */}
                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link border-0 bg-light text-muted rounded shadow-sm d-flex align-items-center justify-content-center"
                      onClick={() => paginate(currentPage + 1)}
                      style={{ width: "32px", height: "32px" }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {}
          <div className="card-footer bg-light border-0 py-4 px-4">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
              <div className="d-flex align-items-center gap-2">
                <div className="p-2 bg-info-subtle text-info rounded-3">
                  <FileText size={16} />
                </div>
                <span className="text-muted small fw-bold">
                  Nota: Cliente realiza pagos puntuales por transferencia.
                </span>
              </div>
              <p
                className="text-muted m-0 fw-bold"
                style={{ fontSize: "0.65rem", letterSpacing: "0.1em" }}
              >
                FINANCE CACTUS • 2026
              </p>
            </div>
          </div>
        </div>
      </section>
    </Paper>
  );
};

export default PagosCuotas;
