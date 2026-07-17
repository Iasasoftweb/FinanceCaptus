import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { Paper, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PrestamosForm from "./PrestamosForm.tsx";
import { formatCurrency, safeFixed } from "../../components/UtilsStuff.tsx";
import "./prestamos.css";
import { MisColores } from "../../components/stuff/MisColores.tsx";
import {
  AlertCircle,
  AlertTriangle,
  BanknoteArrowDown,
  Calendar,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ClipboardPen,
  Cuboid,
  DollarSign,
  Eye,
  FileSpreadsheet,
  FileText,
  HandCoins,
  Info,
  Landmark,
  MapPinCheckInside,
  MessageSquare,
  Printer,
  RefreshCw,
  Search,
  Tags,
  TrendingUp,
  TriangleAlert,
  User,
  Users,
  WandSparkles,
  X,
  XCircle,
} from "lucide-react";
import { InputField } from "../../components/stuff/InputField.tsx";
import { EmptyState } from "../../components/stuff/EmptyState.tsx";
import { useEmpresa } from "../../hooks/useEmpresas.tsx";
import { getBase64ImageFromURL } from "../../components/stuff/getBase64ImageFromURL.tsx";
import { agregarImagenProporcional } from "../../components/stuff/agragarImagenProporcional.tsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { usePrestamosCalculado } from "../../hooks/useDataPrestamos.tsx";
import {
  circleClasses,
  circleStyle,
} from "../../components/stuff/toolsComponents.tsx";
import { simularDistribucionDePago } from "../../hooks/useSimularDistribucionDePago.tsx";
import { ModalReciboComprobante } from "../../components/Recibos/ModalReciboComprobante.tsx";
import { ShowDetalleSolicitud } from "./showDetalleSolicitud.tsx";
import ModiSolicitud from "./ModiSolicitud.tsx";
import DocumentosDropdown from "../../components/Prestamos/DocumentsDropdown.tsx";

const ShowPrestamos = ({ situacion }) => {
  const [PrestamoData, setPrestamoData] = useState([]);
  const [DataPrestamo, setDataPrestamo] = useState([]);
  const [dataRutas, setDataRutas] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [searchZonas, setSearchZonas] = useState("");
  const [cuotas, setCuotas] = useState([]);
  const [checked, setChecked] = React.useState(true);
  const [verPDF, setVerPDF] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
  const [tipoModal, setTipoModal] = useState(null); // 'pago' | 'detalle'
  const [notificacion, setNotificacion] = useState("");
  const [montoIngresado, setMontoIngresado] = useState("");
  const [reciboActivo, setReciboActivo] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState(null);
  const [observacionCambio, setObservacionCambio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const UriData = `${import.meta.env.VITE_API_URL}/prestamos/`;
  const uriCuotas = `${import.meta.env.VITE_API_URL}/cuotas/`;
  const uriRutas = `${import.meta.env.VITE_API_URL}/zonas/`;

  const UrisImg = `${import.meta.env.VITE_API_URL}/uploads/clientes/avata/`;
  const UrisImgEmpresa = `${import.meta.env.VITE_API_URL}/uploads/clientes/empresa/`;
 

  const { data: dataEmpresa, isLoading } = useEmpresa();
  const Navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const exportarExcel = () => {
    if (!window.XLSX) {
      alert(
        "La librería de Excel aún se está cargando. Intente de nuevo en un segundo.",
      );
      return;
    }

    // Preparar los datos para el Excel (aplanar el objeto)
    const datosExcel = filtrar?.map((item) => ({
      "No. Préstamo": item.nPre,
      Cliente: item.tcliente.nombre_completo,
      DNI: item.tcliente.dni,
      Frecuencia: item.frecuencia,
      "Monto Capital": item.capital,
      Interés: item.interes,
      Cuotas: item.cuotas,
      "Zona/Ruta": item.tcliente.tbzona.nombrerutas,
      "Monto Vencido": item.vencido,
      Estado: item.vencido > 0 ? "VENCIDO" : "AL DÍA",
    }));

    // Crear el libro y la hoja
    const worksheet = window.XLSX.utils.json_to_sheet(datosExcel);
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, worksheet, "Préstamos");

    // Descargar el archivo
    const fecha = new Date().toISOString().split("T")[0];
    window.XLSX.writeFile(workbook, `Reporte_Prestamos_${fecha}.xlsx`);
  };

  const exportarPDF = async () => {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString();

    const logoEmpresara = `${UrisImgEmpresa}${dataEmpresa.logoempresa}`;
    const logoBase64 = await getBase64ImageFromURL(logoEmpresara);

    // Título y encabezado

    doc.setFont("helvetica", "bold");
    await agregarImagenProporcional(doc, logoBase64, 10, 5, 40);

    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("Control de Préstamos Emitidos", 105, 20, {
      align: "center",
    });

    doc.setFontSize(11);
    doc.setTextColor(100);

    doc.setFont("helvetica", "normal");
    doc.text(`Fecha del reporte: ${fecha}`, 190, 32, {
      align: "right",
    });
    doc.text(`Zona filtrada: ${searchZonas || "Todas"}`, 190, 38, {
      align: "right",
    });

    // Preparar columnas y filas para AutoTable
    const columns = [
      { header: "# Pre", dataKey: "nPre" },
      { header: "Cliente", dataKey: "cliente" },
      { header: "DNI", dataKey: "dni" },
      { header: "Capital", dataKey: "capital" },
      { header: "Interés", dataKey: "interes" },
      { header: "Cuotas", dataKey: "cuotas" },
      { header: "Zona", dataKey: "zona" },
      { header: "Vencido", dataKey: "vencido" },
    ];

    const rows = filtrar?.map((item) => ({
      nPre: item.id,
      cliente: item.tcliente.nombre_completo,
      dni: item.tcliente.dni,
      capital: `$${item.capital.toLocaleString()}`,
      interes: `$${item.interes.toLocaleString()}`,
      cuotas: item.cuotas,
      zona: item.tcliente.tbzona.nombrerutas,
      vencido: item.vencido > 0 ? `$${item.vencido.toLocaleString()}` : "-",
    }));

    const totalCapital = filtrar.reduce(
      (acc, item) => acc + Number(item.capital || 0),
      0,
    );

    const totalInteres = filtrar.reduce(
      (acc, item) => acc + Number(item.interes || 0),
      0,
    );

    const totalVencido = filtrar.reduce(
      (acc, item) => acc + Number(item.vencido || 0),
      0,
    );

    rows.push({
      nPre: "",
      cliente: "TOTAL",
      dni: "",
      capital: `$${totalCapital.toLocaleString()}`,
      interes: `$${totalInteres.toLocaleString()}`,
      cuotas: "",
      zona: "",
      vencido: `$${totalVencido.toLocaleString()}`,
    });

    // Generar la tabla en el PDF
    autoTable(doc, {
      columns,
      body: rows,
      startY: 45,

      styles: {
        fontSize: 8,
        cellPadding: 2,
      },

      headStyles: {
        fillColor: [13, 110, 253],
        textColor: 255,
      },

      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },

      columnStyles: {
        capital: {
          halign: "right",
        },

        interes: {
          halign: "right",
        },

        vencido: {
          halign: "right",
        },
      },

      didParseCell: function (data) {
        const lastRowIndex = rows.length - 1;

        if (data.row.index === lastRowIndex) {
          data.cell.styles.fontStyle = "bold";

          data.cell.styles.fillColor = [230, 230, 230];
        }
      },
    });

    // Guardar PDF
    doc.save(`Reporte_Prestamos_${fecha.replace(/\//g, "-")}.pdf`);
  };

  const Datos = async () => {
    try {
      const [PrestamosRes, CuotasRes, RutasRes] = await Promise.all([
        axios.get(`${UriData}`),
        axios.get(`${uriCuotas}`),
        axios.get(`${uriRutas}`),
      ]);

      const allPrestamos = Array.isArray(PrestamosRes.data)
        ? PrestamosRes.data
        : [];
      setDataPrestamo(allPrestamos);
      setPrestamoData(allPrestamos);
      setCuotas(CuotasRes.data);
      setDataRutas(RutasRes.data);
      // setTotalItems(allPrestamos.data.length);
      // setIdPrestamos(allPrestamos.data.id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    Datos();

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    script.async = true;
    document.body.appendChild(script);

    //  inputRef.current.focus();
  }, []);

  const prestamosConCuotas = DataPrestamo?.map((prestamo) => {
    const cuotasDelPrestamo = cuotas?.filter(
      (cuota) => cuota.idprestamo === prestamo.id,
    );

    return {
      ...prestamo,
      cuotas: cuotasDelPrestamo,
    };
  });

  const [prestamosData, setPrestamosData] = useState(prestamosConCuotas);

  const fechaHoySimulada = new Date("2026-05-17T12:00:00");
  const { prestamos: misPrestamos, totalesTabla } = usePrestamosCalculado(
    prestamosConCuotas,
    fechaHoySimulada,
  );

  // Clonar y asegurar que cada cuota contenga sus propiedades de balance calculadas internamente
  const cuotasCalculadas = cuotas?.map((c) => {
    const montoTotalCuota = (c.montocapital || 0) + (c.montointeres || 0);
    const montoPagadoActual = c.montopagado || 0;
    const saldoPendienteActual = Math.max(
      0,
      montoTotalCuota - montoPagadoActual,
    );

    return {
      ...c,
      montoTotalCuota,
      nuevoMontoPagado: montoPagadoActual,
      nuevoSaldoPendiente: saldoPendienteActual,
    };
  });

  const togglePagoCuota = (prestamoId, cuotaId) => {
    setPrestamoSeleccionado((prevData) => {
      return prevData.map((p) => {
        if (p.id === prestamoId) {
          return {
            ...p,
            cuotas: p.cuotas.map((c) => {
              if (c.id === cuotaId) {
                const nuevoEstado = !c.pagada;

                mostrarAlerta(
                  `Cuota #${c.numero} de ${p.cliente} marcada como ${nuevoEstado ? "PAGADA" : "PENDIENTE"}`,
                );
                return { ...c, pagada: nuevoEstado };
              }
              return c;
            }),
          };
        }

        return p;
      });
    });

    setTimeout(() => {
      setPrestamoSeleccionado((prev) => {
        const actualizado = misPrestamos.find((p) => p.id === prestamoId);
        if (!actualizado) return prev;
        const cuotas = actualizado.cuotas?.map((c) =>
          c.id === cuotaId ? { ...c, pagada: !c.pagada } : c,
        );
        const cuotasAtrasadas = cuotas?.filter(
          (c) => !c.pagada && new Date(c.fechavencimiento) < fechaHoySimulada,
        );
        return {
          ...actualizado,
          cuotas,
          cuotasPagadas: cuotas?.filter((c) => c.pagada).length,
          cuotasTotales: cuotas.length,
          cantidadAtrasadas: cuotasAtrasadas.length,
          estado: cuotasAtrasadas.length > 0 ? "ATRASADO" : "AL DÍA",
          montoCapitalTotal: cuotas.reduce((acc, c) => acc + c.montoCapital, 0),
          interesTotal: cuotas.reduce((acc, c) => acc + c.montoInteres, 0),
        };
      });
    }, 50);
  };

  const mostrarAlerta = (mensaje) => {
    setNotificacion(mensaje);
    setTimeout(() => setNotificacion(null), 4000);
  };

  const ModoFiltrar = (condiciones) => {
    console.log(condiciones);
    const modo = condiciones ? "activo" : "inactivo";
    const result = PrestamoData.filter((elementos) => {
      const filt = elementos.modo === modo;
      return filt;
    });
    setDataPrestamo(result);
    setTotalItems(result.length);
  };

  const searcher = (e) => {
    setSearch(e.target.value);
    filtrar(e.target.value);
  };

  const FormInsert = () => {
    setIsModalOpen(true);
    setIsModalEdit(false);
  };

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    ModoFiltrar(event.target.checked);
    console.log(event.target.checked);
  };

  const prestamosParaFiltrar = Array.isArray(misPrestamos) ? misPrestamos : [];

  const filtrar = prestamosParaFiltrar.filter((item) => {
    // Convertimos las búsquedas a minúsculas una sola vez aquí adentro
    const buscarZonasTermino = (searchZonas || "").toLowerCase();
    const buscarGeneralTermino = (search || "").toLowerCase();

    // 2. Filtro por Zona (Asegurando que tcliente y tbzona existan)
    const coincideZona = searchZonas
      ? (item?.tcliente?.tbzona?.nombrerutas || "")
          .toString()
          .toLowerCase()
          .includes(buscarZonasTermino)
      : true;

    // 3. Filtro por Texto (Nombre o DNI)
    const nombreCompleto = item?.tcliente?.nombre_completo
      ? item.tcliente.nombre_completo.toString().toLowerCase()
      : "";

    const dniCliente = item?.tcliente?.dni
      ? item.tcliente.dni.toString().toLowerCase()
      : "";

    const coincideBusqueda =
      nombreCompleto.includes(buscarGeneralTermino) ||
      dniCliente.includes(buscarGeneralTermino);

    // 4. Filtro por Estado (ACTIVO E INACTIVO)
    const modoActual = item?.modo ? item.modo.toString().toLowerCase() : "";
    const coincideActivo = checked
      ? modoActual === "activo"
      : modoActual === "inactivo";

    // 5. Filtro por Estado de Cuota
    const cumpleEstado =
      filtroEstado === "TODOS" || item?.estado === filtroEstado;

    // 6. Filtro por Situación
    const coincideSituacion =
      situacion === "ACEPTADO"
        ? item?.situacion === "ACEPTADO"
        : item?.situacion === "EVALUACION";

    return (
      coincideZona &&
      coincideBusqueda &&
      coincideActivo &&
      cumpleEstado &&
      coincideSituacion
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPrestamos = filtrar.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtrar.length / itemsPerPage);

  // Encontrar la cuota activa más antigua con saldo pendiente
  const primerCuotaPendiente = useMemo(() => {
    if (!prestamoSeleccionado) return null;
    return prestamoSeleccionado.cuotas.find((c) => c.pagada === "false");
  }, [prestamoSeleccionado]);

  // Simulación en tiempo real de cómo se distribuirá el pago a medida que se digita
  const simulacionPago = useMemo(() => {
    if (!prestamoSeleccionado || !montoIngresado) return null;

    const monto = parseFloat(montoIngresado);

    if (isNaN(monto) || monto <= 0) return null;
    return simularDistribucionDePago(prestamoSeleccionado.cuotas, monto);
  }, [prestamoSeleccionado, montoIngresado]);

  // Aplicación definitiva del pago en el estado persistente
  const procesarCobroDefinitivo = async (e) => {
    e.preventDefault();
    const monto = parseFloat(montoIngresado);

    if (isNaN(monto) || monto <= 0) {
      mostrarAlerta("Por favor, ingrese un monto válido de pago.");
      return;
    }

    try {
      // Envía la petición a tu backend Express
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/prestamos/cobrar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idprestamo: prestamoSeleccionado.id,
            montoRecibido: monto,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        console.log(data);
        // 1. Sincronizar el cliente en tu estado de React con los datos reales recalculados por Sequelize
        setPrestamosData((prevData) => {
          return prevData.map((p) => {
            if (p.id === data.prestamoActualizado.id) {
              return {
                ...p,
                // Sincroniza los campos de amortización y las cuotas
                cuotaspagas: data.prestamoActualizado.cuotaspagas,
                montopagado: data.prestamoActualizado.montopagado,
                capitalpendiente: data.prestamoActualizado.capitalpendiente,
                balancependiente: data.prestamoActualizado.balancependiente,
                estado: data.prestamoActualizado.estado,
                cuotas: data.prestamoActualizado.cuotas,
              };
            }
            return p;
          });
        });

        // 2. Establecer el recibo activo devuelto del servidor para mostrar el modal de impresión
        setReciboActivo({
          ...data.recibo,
          cliente:
            prestamoSeleccionado.tcliente?.nombre_completo ||
            prestamoSeleccionado.tcliente?.nombre_completo ||
            "Cliente",
          cedula: prestamoSeleccionado.tcliente.dni || "N/D",
          zona: prestamoSeleccionado.tcliente.tbzona.nombreruta || "N/D",
        });

        mostrarAlerta(`Cobro registrado con éxito en la base de datos.`);

        // Cerrar modal de caja y limpiar input
        setPrestamoSeleccionado(null);
        setTipoModal(null);
        setMontoIngresado("");
      } else {
        mostrarAlerta(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error conectando con la API de Cobros:", error);
      mostrarAlerta("Error de comunicación con el servidor.");
    }
  };

  const restablecerPagosPrestamo = (prestamoId) => {
    setPrestamosData((prev) =>
      prev.map((p) => {
        if (p.id === prestamoId) {
          return {
            ...p,
            cuotas: p.cuotas.map((c) => ({ ...c, montoPagado: 0 })),
          };
        }
        return p;
      }),
    );
    mostrarAlerta("Historial de pagos restablecido para simular de nuevo.");
    setPrestamoSeleccionado(null);
    setTipoModal(null);
  };

  const totalCapital = currentPrestamos.reduce((sum, prestamos) => {
    const capital = Number(prestamos.montoprestar) || 0;
    return sum + capital;
  }, 0);

  const totalInteres = currentPrestamos.reduce((sum, prestamos) => {
    const capital = parseFloat(prestamos.montointeres) || 0;
    return sum + capital;
  }, 0);

  const totalMora = currentPrestamos.reduce((sum, prestamos) => {
    const capital = Number(prestamos.montointeres) || 0;
    return sum + capital;
  }, 0);

  const balancePendiente = currentPrestamos.reduce((sum, prestamos) => {
    const capital = Number(prestamos.balancependiente) || 0;
    return sum + capital;
  }, 0);

  const montoCuota = currentPrestamos.reduce((sum, prestamos) => {
    const capital = Number(prestamos.mcuota) || 0;
    return sum + capital;
  }, 0);

  const montoMora = currentPrestamos.reduce((sum, prestamos) => {
    const capital = Number(prestamos.mora) || 0;
    return sum + capital;
  }, 0);

  const capitalPendiente = currentPrestamos.reduce((sum, prestamos) => {
    const capital = Number(prestamos.capitalpendiente) || 0;
    return sum + capital;
  }, 0);

  const gastosLegales = currentPrestamos.reduce((sum, prestamos) => {
    const capital = Number(prestamos.gastoslegal) || 0;
    return sum + capital;
  }, 0);

  const ShowDatos = () => {
    setSearch("");
    setSearchZonas("");
    Datos();
    setCurrentPage(1);
  };

  const Imprimir = () => {
    setVerPDF(true);
  };

  const handleRutas = (e) => {
    setSearchZonas(e);
    setCurrentPage(1);
  };

  const HandleMenuClose = () => {
    setIsModalOpen(false);
  };

  const handleDetail = (id) => {
    Navigate(`/pagos/${id}`);
  };

  const handlePrint = () => {
    window.print();
  };

  console.log(nuevoEstado);

   const guardarCambiosEstado = async (e) => {
    e.preventDefault();
    if (!prestamoSeleccionado) return;
    
    try {
    await axios.patch(`${import.meta.env.VITE_API_URL}/prestamos/${prestamoSeleccionado.id}/situacion`, { 
      situacion: nuevoEstado 
    });
            
    } catch (err) {
      setError(err.response?.data?.message || "Error al actualizar");
    } finally {
      setLoading(false);
    }
    
    setTipoModal(null)
    setNuevoEstado(null)
   }
    // Actualizamos el estado de la solicitud en nuestro listado simulado
    
    // setSolicitudes(prev => prev.map(sol => {
    //   if (sol.id === prestamoSeleccionado.id) {
    //     return {
    //       ...sol,
    //       estado: nuevoEstado,
    //       observacion: observacionCambio
    //     };
    //   }
    //   return sol;
    // }));
    console.log(prestamoSeleccionado);

  return (
    <div className="vh-100">
      {isModalOpen && (
        <PrestamosForm
          ModoEdicion={isModalEdit}
          idCliente={0}
          open={true}
          handleClose={HandleMenuClose}
        />
      )}

      <style>{`
        @media print {
          /* Ocultar elementos innecesarios */
          .no-print, nav, .sidebar, aside, button, .input-group, .form-check, .vr, .pagination {
            display: none !important;
          }
          
          /* Forzar visibilidad de texto y quitar fondos que bloquean la vista */
          body, .container-fluid, main {
            background-color: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }

          .card {
            border: 1px solid #eee !important;
            box-shadow: none !important;
            margin-bottom: 10px !important;
          }

          /* Estilo de tabla para impresión */
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            color: black !important;
          }
          
          th {
            background-color: #f8f9fa !important;
            color: black !important;
            border: 1px solid #dee2e6 !important;
            -webkit-print-color-adjust: exact;
            font-size: 9pt !important;
          }
          
          td {
            border: 1px solid #dee2e6 !important;
            color: black !important;
            font-size: 9pt !important;
            padding: 6px !important;
            background-color: transparent !important;
          }

          /* Asegurar que el contenido de las celdas sea visible */
          td * {
            color: black !important;
          }

          .badge {
            border: none !important;
            background: none !important;
            padding: 0 !important;
            color: black !important;
            font-weight: bold !important;
          }

          .row { display: flex !important; flex-wrap: nowrap !important; }
          .col-md-4 { width: 33.33% !important; flex: 0 0 33.33% !important; }
        }

        .max-width-xxl { max-width: 1400px; }
        .cursor-pointer { cursor: pointer; }
      `}</style>

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
            {situacion === "ACEPTADO" ? (
              <Landmark size={20} />
            ) : (
              <Cuboid size={20} />
            )}
          </div>
          <div>
            <h5 className="fw-bold mb-0" style={{ color: "#2c3e50" }}>
              {situacion === "ACEPTADO" ? "Préstamos" : "Solicitudes"}
            </h5>
            <p className="text-muted mb-0 " style={{ fontSize: "0.8em" }}>
              Control de{" "}
              {situacion === "ACEPTADO"
                ? "Préstamos Emitidos"
                : "Solicitudes de Préstamo"}
            </p>
          </div>
        </div>
        <button className="btn btn-light rounded-circle p-2 text-secondary">
          <X size={20} />
        </button>
      </div>

      <Paper>
        <div className="container-fluid max-width-xxl mx-auto">
          {situacion === "ACEPTADO" && (
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-4">
                <div className="card border-0 shadow-sm p-3 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-3 p-2 bg-success bg-opacity-10 text-success">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <p
                        className="text-uppercase text-muted mb-0 fw-bold"
                        style={{ fontSize: "0.7rem", letterSpacing: "1px" }}
                      >
                        Capital Total
                      </p>
                      <h4 className="fw-bold mb-0 text-dark">
                        {formatCurrency(safeFixed(totalCapital, 2))}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card border-0 shadow-sm p-3 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-3 p-2 bg-danger bg-opacity-10 text-danger">
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <p
                        className="text-uppercase text-muted mb-0 fw-bold"
                        style={{ fontSize: "0.7rem", letterSpacing: "1px" }}
                      >
                        Mora Acumulada
                      </p>
                      <h4 className="fw-bold mb-0 text-dark">
                        {formatCurrency(safeFixed(totalMora, 2))}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card border-0 shadow-sm p-3 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-3 p-2 bg-primary bg-opacity-10 text-primary">
                      <Users size={24} />
                    </div>
                    <div>
                      <p
                        className="text-uppercase text-muted mb-0 fw-bold"
                        style={{ fontSize: "0.7rem", letterSpacing: "1px" }}
                      >
                        Clientes Activos
                      </p>
                      <h4 className="fw-bold mb-0 text-dark">
                        {filtrar.length}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="card-body p-3 bg-white border-bottom">
          <div className="row g-3 align-items-center">
            {/* Buscador */}
            <div className="col-12 col-lg-3">
              <div className="input-group input-group-sm">
                <InputField label="" col="" icon={Search}>
                  <input
                    type="text"
                    className="form-control bg-light border-0 shadow-none ps-2"
                    placeholder={`${situacion === "ACEPTADO" ? "Buscar Préstamos..." : "Buscar Solicitudes..."}`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ fontSize: "0.7rem" }}
                  />

                  <span className="input-group-text bg-white border-start-0 d-flex align-items-center justify-content-center">
                    <X
                      color="#718096"
                      size={18}
                      onClick={() => setSearch("")}
                      style={{ cursor: "pointer" }}
                    />
                  </span>
                </InputField>
              </div>
            </div>

            {/* Selector de Zonas */}
            <div className="col-12 col-md-4 col-lg-2">
              <div className="input-group input-group-sm">
                <InputField label="" col="" icon={MapPinCheckInside}>
                  <select
                    className="form-select bg-light border-0 shadow ps-2"
                    value={searchZonas}
                    onChange={(e) => setSearchZonas(e.target.value)}
                    style={{ fontSize: "0.7rem" }}
                  >
                    <option value="">Seleccione una Zona</option>
                    {dataRutas?.map((ruta) => (
                      <option key={ruta.id} value={ruta.nombrerutas}>
                        {ruta.nombrerutas}
                      </option>
                    ))}
                  </select>
                </InputField>
              </div>
            </div>

            {/* Botón Refresh */}

            <div className="col-auto">
              <button
                className="btn text-white btn-sm px-3 fw-semibold shadow-sm d-flex align-items-center gap-2"
                style={{ background: MisColores.buscarOrange }}
                onClick={ShowDatos}
              >
                <RefreshCw size={16} /> Refresh
              </button>
            </div>

            {/* Botones de Acción Derecha */}
            {situacion === "ACEPTADO" && (
              <div className="col text-end d-flex justify-content-end align-items-center gap-2">
                <button
                  className="btn  btn-sm px-3 fw-semibold text-white shadow-sm d-flex align-items-center gap-2"
                  style={{ background: MisColores.headerBlue }}
                  onClick={handlePrint}
                >
                  <Printer size={16} /> Imprimir Reporte
                </button>
                <div
                  className="vr mx-1 d-none d-md-block"
                  style={{ height: "24px" }}
                ></div>
                <button
                  className="btn btn-outline-success btn-sm border-0 d-flex align-items-center gap-1"
                  onClick={exportarExcel}
                >
                  <FileSpreadsheet size={18} />{" "}
                  <span className="d-none d-xl-inline">Excel</span>
                </button>
                <button
                  className="btn btn-outline-danger btn-sm border-0 d-flex align-items-center gap-1"
                  onClick={exportarPDF}
                >
                  <FileText size={18} />{" "}
                  <span className="d-none d-xl-inline">PDF</span>
                </button>
                <div className="form-check form-switch ms-2">
                  <input
                    className="form-check-input shadow-none cursor-pointer"
                    type="checkbox"
                    checked={checked}
                    onChange={() => setChecked(!checked)}
                  />
                  <label className="form-check-label small fw-bold text-muted">
                    Activos
                  </label>
                </div>
              </div>
            )}

            {situacion === "ACEPTADO" && (
              <div className="col-12 col-md-12 d-flex justify-content-end">
                <div className="btn-group rounded-3" role="group">
                  {["TODOS", "AL DÍA", "ATRASADO"].map((est) => (
                    <button
                      key={est}
                      type="button"
                      onClick={() => setFiltroEstado(est)}
                      className={`btn btn-sm px-3 fw-bold text-uppercase ${
                        filtroEstado === est
                          ? "btn-warning"
                          : "btn-light text-muted border-0"
                      }`}
                      style={{ fontSize: "11px" }}
                    >
                      {est}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-3">
          {currentPrestamos.length > 0 ? (
            <div className="table-responsive">
              <table
                className="table table-hover align-middle mb-0"
                style={{ fontSize: "0.85rem" }}
              >
                <thead className=" table-light">
                  <tr>
                    <th
                      className="ps-4 py-3 border-0 text-muted text-uppercase fw-bold"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Cliente
                    </th>
                    <th
                      className="py-3 border-0 text-muted text-uppercase fw-bold text-center"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Frecuencia
                    </th>
                    <th
                      className="py-3 border-0 text-muted text-uppercase fw-bold text-end"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Monto Capital
                    </th>
                    <th
                      className="py-3 border-0 text-muted text-uppercase fw-bold text-end"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Interés
                    </th>

                    <th
                      className="py-3 border-0 text-muted text-uppercase fw-bold text-end"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Monto Cuota
                    </th>

                    <th
                      className="py-3 border-0 text-muted text-uppercase fw-bold text-center"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Cuotas
                    </th>
                    <th
                      className="py-3 border-0 text-muted text-uppercase fw-bold"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Zona
                    </th>

                    {situacion === "ACEPTADO" && (
                      <th
                        className="py-3 border-0 text-muted text-uppercase fw-bold text-center"
                        style={{ fontSize: "0.7rem" }}
                      >
                        Atrasadas
                      </th>
                    )}
                    {situacion === "ACEPTADO" && (
                      <th
                        className="py-3 border-0 text-muted text-uppercase fw-bold text-center"
                        style={{ fontSize: "0.7rem" }}
                      >
                        Estado
                      </th>
                    )}
                    <th
                      className="pe-4 py-3 border-0 text-muted text-uppercase fw-bold text-center"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {currentPrestamos?.map((item, idx) => {
                    return (
                      <tr key={idx}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="rounded-circle bg-light d-flex align-items-center justify-content-center text-primary fw-bold"
                              style={{
                                width: "40px",
                                height: "40px",
                                fontSize: "14px",
                              }}
                            >
                              <Avatar
                                src={`${UrisImg}${item?.tcliente?.imgFOTOS}`}
                                sx={{ width: 40, height: 40 }}
                              />
                            </div>
                            <div>
                              <div className="fw-bold text-dark">
                                {item?.tcliente?.nombre_completo}
                              </div>
                              <div
                                className="text-muted"
                                style={{ fontSize: "0.75rem" }}
                              >
                                {item.tcliente.dni}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <span
                            className="badge text-dark fw-medium rounded-pill px-3 py-2 border"
                            style={{ fontSize: "0.9em" }}
                          >
                            {item.frecuencia}
                          </span>
                        </td>
                        <td className="text-end fw-bold text-dark">
                          $
                          {item.montoprestar.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="text-end text-muted">
                          $
                          {item.interes.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="text-end text-muted">
                          $
                          {item.mcuota.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </td>

                        <td className="text-center">
                          <span
                            className="border px-2 py-1 rounded-pill fw-bold text-secondary"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {situacion === "ACEPTADO"
                              ? `${item.cuotasPagadas} / ${item.tcuota}`
                              : `${item.tcuota}`}
                          </span>
                        </td>
                        <td>
                          <span
                            className="text-muted fw-bold"
                            style={{ fontSize: "0.8em" }}
                          >
                            {item.tcliente.tbzona.nombrerutas}
                          </span>
                        </td>
                        {situacion === "ACEPTADO" && (
                          <td>
                            <span className="text-muted fw-medium">
                              <span
                                className={circleClasses}
                                style={circleStyle}
                              >
                                {item.cantidadAtrasadas}
                              </span>
                              <span
                                className="px-1"
                                style={{ fontSize: "0.8em" }}
                              >
                                Cuotas
                              </span>
                            </span>
                          </td>
                        )}

                        {situacion === "ACEPTADO" && (
                          <td className="text-center">
                            <span
                              className={`badge rounded-pill text-uppercase px-3 py-1.5 fw-bold  ${
                                item.estado === "AL DÍA"
                                  ? "bg-success-subtle text-success border border-success-subtle"
                                  : "bg-danger-subtle text-danger border border-danger-subtle"
                              }`}
                              style={{
                                fontSize: "10px",
                                letterSpacing: "0.05em",
                              }}
                            >
                              {item.estado}
                            </span>
                          </td>
                        )}

                        <td className="pe-4 text-center">
                          <div className="btn-group">

                              {situacion === "solicitudes" && (
                                 <DocumentosDropdown prestamo={item} />
                              // <button
                              //   className="btn btn-outline-info btn-sm border-0 rounded-3 p-1 mx-1"
                              //   title="Documentos"
                              //   onClick={() => {
                              //     setPrestamoSeleccionado(item);
                              //     setTipoModal("detalle");
                              //   }}
                              // >
                              //   <Info size={18} />
                              // </button>
                            )}


                            {situacion === "ACEPTADO" && (
                              <button
                                className="btn btn-outline-warning btn-sm border-0 rounded-3 p-1 mx-1 bg-warning-subtle border-2 border rounded-2 pe-2 ps-2"
                                title="Cobrar"
                                onClick={() => {
                                  setPrestamoSeleccionado(item);
                                  setTipoModal("pagodirecto");
                                  setMontoIngresado("");
                                }}
                              >
                                   <HandCoins size={18} /> <span className="" style={{ fontSize: "0.8em", color: MisColores.headerBlue, fontWeight: "bold" }}>
                                    Cobrar
                                  </span>
                              </button>
                            )}
                            {situacion === "solicitudes" && (
                              <button
                                className="btn btn-outline-secondary btn-sm border-0 rounded-3 p-1 mx-1"
                                title="Ver"
                                onClick={() => {
                                  setPrestamoSeleccionado(item);
                                  setTipoModal("detalle");
                                }}
                              >
                                <Eye size={18} />
                              </button>
                            )}

                          


                            {situacion === "ACEPTADO" && (
                              <button
                                className="btn btn-outline-primary btn-sm border-0 rounded-3 p-1 mx-1"
                                title="Detalle del Préstamo"
                                onClick={() => {
                                  setPrestamoSeleccionado(item);
                                  setTipoModal("pago");
                                }}
                              >
                                <BanknoteArrowDown size={18} />
                              </button>
                            )}

                            {situacion === "solicitudes" && (
                              <button
                                className="btn btn-outline-success btn-sm border-0 rounded-3 p-1 mx-1"
                                title="Cuotas Generadas"
                                onClick={() => {
                                  setPrestamoSeleccionado(item);
                                  setTipoModal("cuotas");
                                }}
                              >
                                <Tags size={18} />
                              </button>
                            )}

                            {situacion === "solicitudes" && (
                              <button
                                className="btn btn-outline-danger btn-sm border-0 rounded-3 p-1 mx-1"
                                title="Cuotas Generadas"
                                onClick={() => {
                                  setPrestamoSeleccionado(item);
                                  setTipoModal("modificasolicitud");
                                }}
                              >
                                <ClipboardPen size={18} />
                              </button>
                            )}

                            {situacion === "solicitudes" && (
                              <button
                                className="btn btn-sm border-0 rounded-3 p-1 mx-1 text-white p-1 shadow fw-semibold"
                                style={{
                                  backgroundColor: MisColores.headerBlue,
                                }}
                                title="Modificar Solicitud"
                                onClick={() => {
                                  setPrestamoSeleccionado(item);
                                  setTipoModal("Estado");
                                }}
                              >
                                {/* <WandSparkles size ={18}/> */}
                                <span
                                  className="px-2"
                                  style={{ fontSize: "0.9em" }}
                                >
                                  Evaluar <ChevronRight size={17} />
                                </span>
                              </button>
                            )}

                            {situacion === "ACEPTADO" && (
                              <button
                                className="btn btn-outline-success btn-sm border-0 rounded-3 p-1 mx-1"
                                title="Ver"
                                // onClick={''}
                              >
                                <Printer size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="table-light fw-bold border-top">
                  <tr>
                    <td colSpan="2" className="text-end ps-4 py-3 text-muted">
                      TOTALES
                    </td>
                    <td className="text-end py-3 text-primary">
                      {formatCurrency(totalCapital)}
                    </td>
                    <td className="text-end py-3 text-dark">
                      {formatCurrency(totalInteres)}
                    </td>
                    <td colSpan="4"></td>
                    <td colSpan="4"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No se han creados prestamos."
              subtitle="En cuanto se cree un nuevo prestamo, aparecerá aquí."
            />
          )}
        </div>

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center bg-white p-3 rounded-3 shadow-sm mt-4 border mb-3">
          <div className="text-muted small mb-3 mb-sm-0">
            Mostrando registros del{" "}
            <b style={{ fontSize: "1em" }}>{indexOfFirstItem + 1}</b> al{" "}
            <b style={{ fontSize: "1em" }}>
              {Math.min(indexOfLastItem, filtrar.length)}
            </b>{" "}
            de un total de <b style={{ fontSize: "1em" }}>{filtrar.length}</b>
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
                        currentPage === index + 1 ? MisColores.headerBlue : "",
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
      </Paper>

      {prestamoSeleccionado && tipoModal === "cuotas" && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            overflowX: "hidden",
            overflowY: "auto", // Permite el scroll correcto en la pantalla general
          }}
        >
          <ShowDetalleSolicitud
            cuotas={prestamoSeleccionado}
            onClose={() => {
              setPrestamoSeleccionado(null);
              setTipoModal(null);
            }}
          />
        </div>
      )}

      {prestamoSeleccionado && tipoModal === "modificasolicitud" && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            overflowX: "hidden",
            overflowY: "auto", // Permite el scroll correcto en la pantalla general
          }}
        >
          <ModiSolicitud
            dataInicial={prestamoSeleccionado}
            onClose={() => {
              setPrestamoSeleccionado(null);
              setTipoModal(null);
            }}
          />
        </div>
      )}

      {/* ==========================================
          MODAL: REGISTRAR PAGO (BOOTSTRAP STYLE)
          ========================================== */}
      {prestamoSeleccionado && tipoModal === "pago" && (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 1055,
          }}
        >
          <div
            className="shadow overflow-hidden bg-white"
            style={{
              width: "900px", // El ancho que siempre quisiste
              maxWidth: "92vw", // Seguro para laptops pequeñas y celulares
              borderRadius: "20px", // Mantiene tus bordes redondeados originales
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* HEADER */}
            <div
              className="bg-dark text-white p-4 d-block"
              style={{
                borderTopLeftRadius: "20px",
                borderTopRightRadius: "20px",
              }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="modal-title fw-bold text-white mb-1">
                    Cobrar Cuota -{" "}
                    {prestamoSeleccionado.tcliente.nombre_completo}
                  </h5>
                  <p
                    className="text-white-50 mb-0"
                    style={{ fontSize: "0.85em" }}
                  >
                    Cédula: {prestamoSeleccionado.tcliente.dni}
                    {" | "}
                    Zona: {prestamoSeleccionado.tcliente.tbzona.nombrerutas}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setPrestamoSeleccionado(null);
                    setTipoModal(null);
                  }}
                ></button>
              </div>

              {/* PROGRESS */}
              <div className="mt-4">
                <div className="d-flex justify-content-between mb-2">
                  <small className="text-white-50 fw-semibold">
                    Progreso de Amortización
                  </small>
                  <small className="text-white-50 fw-semibold">
                    {prestamoSeleccionado.cuotasPagadas} de{" "}
                    {prestamoSeleccionado.cuotasTotales} cuotas
                  </small>
                </div>
                <div
                  className="progress bg-secondary"
                  style={{ height: "8px" }}
                >
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{
                      width: `${
                        (prestamoSeleccionado.cuotasPagadas /
                          prestamoSeleccionado.cuotasTotales) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* BODY */}
            <div
              className="modal-body bg-light p-4"
              style={{ maxHeight: "450px", overflowY: "auto" }}
            >
              <h6
                className="text-muted fw-bold mb-3"
                style={{
                  letterSpacing: "1px",
                  fontSize: "0.8em",
                }}
              >
                CALENDARIO Y COBROS
              </h6>

              <div className="d-flex flex-column gap-3 w-100">
                {prestamoSeleccionado.cuotas?.map((cuota) => {
                  const esVencida =
                    cuota.pagada === "false" &&
                    new Date(cuota.fechavencimiento) < fechaHoySimulada;

                  return (
                    <div
                      key={cuota.id}
                      className={`card shadow-sm border w-100 ${
                        cuota.pagada === "true"
                          ? "bg-success-subtle border-success-subtle"
                          : esVencida
                            ? "bg-danger-subtle border-danger-subtle"
                            : "bg-white border-light"
                      }`}
                      style={{ borderRadius: "14px" }}
                    >
                      <div className="card-body p-3">
                        <div className="row align-items-center g-3">
                          {/* INFO */}
                          <div className="col-12 col-sm-8">
                            <div className="d-flex align-items-center gap-2 mb-2">
                              <span
                                className="fw-bold text-dark"
                                style={{ fontSize: "14px" }}
                              >
                                Cuota #{cuota.numcuota}
                              </span>

                              {cuota.pagada === "true" ? (
                                <span
                                  className="badge bg-success-subtle text-success border border-success-subtle"
                                  style={{ fontSize: "9px" }}
                                >
                                  PAGADA
                                </span>
                              ) : esVencida ? (
                                <span
                                  className="badge bg-danger-subtle text-danger border border-danger-subtle"
                                  style={{ fontSize: "9px" }}
                                >
                                  ATRASADA / MORA
                                </span>
                              ) : (
                                <span
                                  className="badge bg-light text-muted border"
                                  style={{ fontSize: "9px" }}
                                >
                                  PENDIENTE
                                </span>
                              )}
                            </div>

                            <div
                              className="row text-muted"
                              style={{ fontSize: "12px" }}
                            >
                              <div className="col-4">
                                Capital:{" "}
                                <strong className="text-dark">
                                  $
                                  {cuota.montocapital.toLocaleString("es-DO", {
                                    minimumFractionDigits: 2,
                                  })}
                                </strong>
                              </div>

                              <div className="col-4">
                                Interés:{" "}
                                <strong className="text-dark">
                                  $
                                  {cuota.montointeres.toLocaleString("es-DO", {
                                    minimumFractionDigits: 2,
                                  })}
                                </strong>
                              </div>

                              <div className="col-4">
                                Monto Cuota:{" "}
                                <strong className="text-dark">
                                  $
                                  {cuota.montocuota.toLocaleString("es-DO", {
                                    minimumFractionDigits: 2,
                                  })}
                                </strong>
                              </div>

                              <div className="col-12 mt-2">
                                Vencimiento:{" "}
                                <strong className="text-dark">
                                  {new Date(
                                    cuota.fechavencimiento,
                                  ).toLocaleDateString("es-DO", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </strong>
                              </div>
                            </div>
                          </div>

                          {/* BOTON */}
                          <div className="col-12 col-sm-4 text-sm-end">
                            <button
                              onClick={() =>
                                togglePagoCuota(
                                  prestamoSeleccionado.id,
                                  cuota.id,
                                )
                              }
                              className={`btn btn-sm fw-bold px-3 w-100 ${
                                cuota.pagada === "true"
                                  ? "btn-outline-success bg-white"
                                  : esVencida
                                    ? "btn-danger"
                                    : "btn-dark"
                              }`}
                              style={{
                                borderRadius: "50px",
                                fontSize: "11px",
                              }}
                            >
                              {cuota.pagada ? "Anular Pago" : "Pagar Cuota"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer bg-white border-0 p-3">
              <button
                type="button"
                className="btn btn-light text-secondary px-4"
                style={{ borderRadius: "12px" }}
                onClick={() => {
                  setPrestamoSeleccionado(null);
                  setTipoModal(null);
                }}
              >
                Cerrar Ventana
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ==========================================
          MODAL: DETALLE DEL PRESTAMO 
          ========================================== */}

      {prestamoSeleccionado && tipoModal === "detalle" && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered ">
            <div className="modal-content border-1 shadow">
              {/* HEADER */}
              <div className="modal-header">
                <h5 className="modal-title fw-semibold">
                  Detalle del Préstamo
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  style={{ fontSize: "0.9em" }}
                  onClick={() => {
                    setPrestamoSeleccionado(null);
                    setTipoModal(null);
                  }}
                ></button>
              </div>

              {/* BODY */}
              <div className="modal-body">
                {/* CLIENTE */}

                <div className="row g-3 mb-4">
                  <div className="card border-0 bg-light ">
                    <div className="card-body text-start">
                      <div className="d-flex align-items-center">
                        <img
                          src={`${UrisImg}${prestamoSeleccionado.tcliente.imgFOTOS}`}
                          alt=""
                          className="rounded-circle border shadow-sm me-3"
                          style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                          }}
                        />

                        <div className="">
                          <p className="mb-1 fw-bold">
                            {prestamoSeleccionado.tcliente.nombre_completo}
                          </p>

                          <p
                            className="text-muted mb-1"
                            style={{ fontSize: "0.8em" }}
                          >
                            <span className=" fw-semibold">Cédula:</span>{" "}
                            {prestamoSeleccionado.tcliente.dni}
                          </p>

                          <p
                            className="text-muted mb-0"
                            style={{ fontSize: "0.8em" }}
                          >
                            <strong>Zona:</strong>{" "}
                            {prestamoSeleccionado.tcliente.tbzona.nombrerutas}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TARJETAS
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="card border-1 border">
                      <div className="card-body text-start">
                        <p className="text-muted lh-1" style={{fontSize:'0.8em'}}>CAPITAL</p>
                        <p className="fw-bold lh-1"  style={{fontSize:'1em'}}>
                          $
                          {prestamoSeleccionado.montoprestar.toLocaleString(
                            "es-DO",
                            {
                              minimumFractionDigits: 2,
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <small className="text-muted">INTERÉS</small>

                        <h5 className="fw-bold mt-2">
                          $
                          {prestamoSeleccionado.montointeres.toLocaleString(
                            "es-DO",
                            {
                              minimumFractionDigits: 2,
                            },
                          )}
                        </h5>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <small className="text-muted">FRECUENCIA</small>

                        <h5 className="fw-bold text-primary mt-2">
                          {prestamoSeleccionado.frecuencia}
                        </h5>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <small className="text-muted">ESTADO</small>

                        <h5
                          className={`fw-bold mt-2 ${
                            prestamoSeleccionado.estado === "AL DÍA"
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          {prestamoSeleccionado.estado}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div> */}

                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-6">
                    <div className="card shadow-sm border border-1 bg-light w-100">
                      <div className="card-body p-3 text-start">
                        <p
                          className="text-muted fw-semibold mb-1"
                          style={{ fontSize: "0.7em" }}
                        >
                          CAPITAL
                        </p>

                        <h6 className="fw-bold mb-0">
                          $
                          {prestamoSeleccionado.montoprestar.toLocaleString(
                            "es-DO",
                            {
                              minimumFractionDigits: 2,
                            },
                          )}
                        </h6>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="card shadow-sm border border-1 bg-light w-100">
                      <div className="card-body p-3 text-start">
                        <p
                          className="text-muted fw-semibold mb-1"
                          style={{ fontSize: "0.7em" }}
                        >
                          INTERÉS
                        </p>

                        <h6 className="fw-bold mb-0">
                          $
                          {prestamoSeleccionado.montointeres.toLocaleString(
                            "es-DO",
                            {
                              minimumFractionDigits: 2,
                            },
                          )}
                        </h6>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="card shadow-sm border border-1 bg-light w-100">
                      <div className="card-body p-3 text-start">
                        <p
                          className="text-muted fw-semibold mb-1"
                          style={{ fontSize: "0.7em" }}
                        >
                          FRECUENCIA
                        </p>

                        <h6 className="fw-bold text-primary mb-0">
                          {prestamoSeleccionado.frecuencia}
                        </h6>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="card shadow-sm border border-1 bg-light w-100 ">
                      <div className="card-body p-3 text-start">
                        <p
                          className="text-muted fw-semibold mb-1"
                          style={{ fontSize: "0.7em" }}
                        >
                          ESTADO
                        </p>

                        <h6
                          className={`fw-bold mb-0 ${
                            prestamoSeleccionado.estado === "AL DÍA"
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          {prestamoSeleccionado.estado}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
                {/* ALERTA */}

                {prestamoSeleccionado.cantidadAtrasadas > 0 && (
                  <div
                    className="alert alert-danger border-danger rounded-4 d-flex align-items-start gap-3 p-3"
                    role="alert"
                  >
                    {/* ICONO */}
                    <div className="flex-shrink-0">
                      <TriangleAlert size={20} color={MisColores.actionRed} />
                    </div>

                    {/* CONTENIDO */}
                    <div>
                      <p className="fw-bold mb-1" style={{ fontSize: "0.9em" }}>
                        ¡Alerta de cuotas atrasadas!
                      </p>

                      <p
                        className="mb-0 text-dark"
                        style={{ fontSize: "0.8em" }}
                      >
                        Este préstamo tiene{" "}
                        <strong>
                          {prestamoSeleccionado.cantidadAtrasadas}
                        </strong>{" "}
                        cuota(s) vencida(s) sin pagar. Se recomienda aplicar
                        políticas de mora o contactar al cliente de inmediato.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* FOOTER */}
              <div className="modal-footer">
                <button
                  className="btn btn-dark"
                  onClick={() => {
                    setPrestamoSeleccionado(null);
                    setTipoModal(null);
                  }}
                  style={{ fontSize: "0.8em" }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {prestamoSeleccionado && tipoModal === "Estado" && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered ">
            <div className="modal-content border-1 shadow">
              {/* HEADER */}
              <div className="modal-header">
                <h6 className="modal-title fw-semibold">
                  Modificar Estado de Solicitud
                </h6>

                <button
                  type="button"
                  className="btn-close"
                  style={{ fontSize: "0.9em" }}
                  onClick={() => {
                    setPrestamoSeleccionado(null);
                    setTipoModal(null);
                  }}
                ></button>
              </div>

              <div className="modal-body p-4 bg-light text-start">
                <form className="modal-body p-4 d-flex flex-column gap-4" onSubmit={guardarCambiosEstado}>
                  
                  {/* Información Breve de la Solicitud */}
                  <div className="bg-secondary bg-opacity-10 p-3 rounded-3 border border-secondary border-opacity-25">
                    <div className="d-flex justify-content-between align-items-center mb-2" style={{ fontSize: '0.75rem' }}>
                      <span className="text-secondary d-flex align-items-center gap-1">
                        <User style={{ width: '14px', height: '14px' }} className="text-muted" /> Solicitante:
                      </span>
                      <span className="fw-semibold ">{prestamoSeleccionado?.tcliente.nombre_completo || "N/A"}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2" style={{ fontSize: '0.75rem' }}>
                      <span className="text-secondary d-flex align-items-center gap-1">
                        <DollarSign style={{ width: '14px', height: '14px' }} className="text-muted" /> Monto:
                      </span>
                      <span className="font-monospace fw-semibold">
                        RD$ {Number(safeFixed(prestamoSeleccionado?.montoprestar)).toLocaleString("es-DO", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '0.75rem' }}>
                      <span className="text-secondary d-flex align-items-center gap-1">
                        <Calendar style={{ width: '14px', height: '14px' }} className="text-muted" /> Fecha registro:
                      </span>
                      <span className="font-monospace">{prestamoSeleccionado?.fechaprimer || "N/A"}</span>
                    </div>
                  </div>

                  {/* Selección de Estados con Diseño Tipo Tarjetas */}
                  <div>
                    <label className="form-label text-secondary text-uppercase fw-semibold tracking-wider m-0 mb-3" style={{ fontSize: '0.75rem' }}>
                      Selecciona el nuevo estado:
                    </label>
                    <div className="row g-2">
                     
                      {/* Opción: Aceptado */}
                      <div className="col-4">
                        <button
                          type="button"
                          onClick={() => setNuevoEstado("ACEPTADO")}
                          className={`btn w-100 py-3 rounded-3 border d-flex flex-column align-items-center gap-2 position-relative text-wrap ${
                            nuevoEstado === "ACEPTADO"
                              ? "border-success text-white"
                              : "border-secondary text-secondary text-white"
                          }`}
                          style={{ borderColor: nuevoEstado === "ACEPTADO" ? '#198754' : 'rgba(255,255,255,0.1)', minHeight: '90px', background : MisColores.headerBlue }}
                        >
                          <CheckCircle style={{ width: '22px', height: '22px' }} className={"text-white"} />
                          <span className="fw-semibold" style={{ fontSize: '0.75rem' }}>Aceptado</span>
                          {nuevoEstado === "ACEPTADO" && (
                            <span className="position-absolute bg-danger rounded-circle " style={{ width: '8px', height: '8px', top: '8px', right: '8px' }}></span>
                          )}
                        </button>
                      </div>

                      {/* Opción: Incompleta */}
                      <div className="col-4">
                        <button
                          type="button"
                          onClick={() => setNuevoEstado("INCOMPLETO")}
                          className={`btn w-100 py-3 rounded-3 border d-flex flex-column align-items-center gap-2 position-relative text-wrap ${
                            nuevoEstado === "INCOMPLETO"
                              ? "bg-opacity-10 border-warning text-white"
                              : "bg-opacity-20 border-secondary text-white"
                          }`}
                          style={{ borderColor: nuevoEstado === "INCOMPLETO" ? '#ffc107' : 'rgba(255,255,255,0.1)', minHeight: '90px', background: MisColores.teal  }}
                        >
                          <AlertTriangle style={{ width: '22px', height: '22px' }} className={nuevoEstado === "INCOMPLETO" ? "text-warning" : "text-warning"} />
                          <span className="fw-semibold" style={{ fontSize: '0.75rem' }}>Incompleta</span>
                          {nuevoEstado === "INCOMPLETO" && (
                            <span className="position-absolute bg-warning rounded-circle" style={{ width: '8px', height: '8px', top: '8px', right: '8px' }}></span>
                          )}
                        </button>
                      </div>

                      {/* Opción: Cancelado */}
                      <div className="col-4">
                        <button
                          type="button"
                          onClick={() => setNuevoEstado("RECHAZADO")}
                          className={`btn w-100 py-3 rounded-3 border d-flex flex-column align-items-center gap-2 position-relative text-wrap ${
                            nuevoEstado === "RECHAZADO"
                              ? "bg-opacity-10 border-danger text-white"
                              : "bg-opacity-5 border-secondary text-white"
                          }`}
                          style={{ borderColor: nuevoEstado === "RECHAZADO" ? '#dc3545' : 'rgba(255,255,255,0.1)', minHeight: '90px', background: MisColores.buscarOrange }}
                        >
                          <XCircle style={{ width: '22px', height: '22px' }} className={"text-white"} />
                          <span className="fw-semibold" style={{ fontSize: '0.75rem' }}>Rechazado</span>
                          {nuevoEstado === "RECHAZADO" && (
                            <span className="position-absolute bg-danger rounded-circle" style={{ width: '8px', height: '8px', top: '8px', right: '8px' }}></span>
                          )}
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Campo para Observación / Comentarios de Auditoría */}
                  {/* <div className="d-flex flex-column gap-2">
                    <label className="form-label text-secondary text-uppercase fw-semibold tracking-wider m-0 d-flex align-items-center gap-1.5" style={{ fontSize: '0.75rem' }}>
                      <MessageSquare style={{ width: '16px', height: '16px' }} className="text-muted" /> Observaciones o Justificación:
                    </label>
                    <textarea
                     // value={observacionCambio}
                     // onChange={(e) => setObservacionCambio(e.target.value)}
                      placeholder="Explique el motivo del cambio de estado (ej: documentos faltantes, buró crediticio aprobado, etc...)"
                      className="form-control bg-dark text-light border-secondary rounded-3"
                      style={{ minHeight: '100px', fontSize: '0.85rem', borderColor: 'rgba(255,255,255,0.15)', resize: 'none' }}
                    />
                  </div> */}

                  {/* Botonera de Acción del Modal */}
                  <div className="modal-footer border-secondary px-0 pb-0 pt-3 d-flex flex-column flex-sm-row gap-2" style={{ borderTopColor: 'rgba(255,255,255,0.1)' }}>
                    <button
                      type="button"
                      onClick={()=>setTipoModal(null)}
                      className="btn btn-outline-secondary w-100 w-sm-auto order-2 order-sm-1 px-4 py-2 rounded-3 text-secondary"
                      style={{ fontSize: '0.85rem' }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn w-100 w-sm-auto order-1 order-sm-2 px-4 py-2 rounded-3 d-flex align-items-center justify-content-center gap-1.5 fw-semibold text-white"
                      style={{ fontSize: '0.85rem', background: MisColores.headerBlue }}
                    >
                      <Check style={{ width: '16px', height: '16px' }} className="mx-2" /> Guardar Estado
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL INTERACTIVO DE PAGO AVANZADO (CON DISTRIBUCIÓN EN CASCADA)
          ========================================================================= */}
      {prestamoSeleccionado && tipoModal === "pagodirecto" && (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 1055,
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden w-100">
              <div className="modal-header bg-dark text-white p-4 border-0 d-flex flex-column align-items-stretch ">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="text-start">
                    <h3 className="modal-title h5 fw-bold text-white">
                      Registrar Cobro Avanzado
                    </h3>
                    <p className="small text-white-50 mb-0">
                      Cliente: {prestamoSeleccionado.tcliente.nombre_completo} |{" "}
                      {prestamoSeleccionado.tcliente.dni}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => {
                      setPrestamoSeleccionado(null);
                      setTipoModal(null);
                    }}
                  ></button>
                </div>

                {/* Resumen Deudas */}
                <div className="row g-2 mt-3 text-white text-start">
                  <div className="col-6 col-sm-4">
                    <span className="d-block small text-white-50">
                      Deuda Total Préstamo:
                    </span>
                    <strong className="fs-6">
                      $
                      {prestamoSeleccionado.saldoPendienteTotal.toLocaleString(
                        "es-DO",
                        { minimumFractionDigits: 2 },
                      )}
                    </strong>
                  </div>
                  <div className="col-6 col-sm-4 border-start border-secondary">
                    <span className="d-block small text-white-50">
                      Frecuencia de Pago:
                    </span>
                    <strong className="fs-6 text-uppercase">
                      {prestamoSeleccionado.frecuencia}
                    </strong>
                  </div>
                  <div className="col-12 col-sm-4 border-start border-secondary mt-2 mt-sm-0">
                    <span className="d-block small text-white-50">
                      Amortización Real:
                    </span>
                    <strong className="fs-6">
                      {prestamoSeleccionado.cuotasPagadas} /{" "}
                      {prestamoSeleccionado.cuotasTotales} Cuotas
                    </strong>
                  </div>
                </div>
              </div>

              {/* Formulario e Inteligencia de Aplicación de Cobro */}
              <form onSubmit={procesarCobroDefinitivo}>
                <div className="modal-body p-4 bg-light text-start">
                  <div className="row g-4">
                    {/* Panel de Entrada de Dinero */}
                    <div className="col-12 col-lg-5">
                      <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 w-100">
                        <h4 className="h6 fw-bold text-secondary mb-3">
                          Monto Recibido
                        </h4>

                        <div className="input-group mb-3">
                          <span className="input-group-text bg-light fw-bold">
                            $
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            className="form-control form-control-lg fw-bold text-primary"
                            placeholder="0.00"
                            value={montoIngresado}
                            onChange={(e) => setMontoIngresado(e.target.value)}
                            autoFocus
                            required
                          />
                        </div>

                        {/* Botones de Cobro Rápido */}
                        <div className="d-grid gap-2 mb-3">
                          {primerCuotaPendiente && (
                            <button
                              type="button"
                              className="btn btn-xs btn-outline-secondary text-start"
                              style={{ fontSize: "11px" }}
                              onClick={() =>
                                setMontoIngresado(
                                  primerCuotaPendiente.montopendiente,
                                )
                              }
                            >
                              👉{" "}
                              <strong>
                                Saldar cuota #{primerCuotaPendiente.numcuota}{" "}
                                actual:
                              </strong>{" "}
                              $
                              {primerCuotaPendiente.montopendiente.toLocaleString(
                                "es-DO",
                                { minimumFractionDigits: 2 },
                              )}
                            </button>
                          )}

                          <button
                            type="button"
                            className="btn btn-xs btn-outline-secondary text-start"
                            style={{ fontSize: "11px" }}
                            onClick={() => {
                              setMontoIngresado(
                                safeFixed(
                                  prestamoSeleccionado?.saldoPendienteTotal,
                                  2,
                                ),
                              );
                            }}
                          >
                            💸 <strong>Saldar Préstamo Complet o:</strong> $
                            {prestamoSeleccionado.saldoPendienteTotal.toLocaleString(
                              "es-DO",
                              { minimumFractionDigits: 2 },
                            )}
                          </button>
                        </div>

                        <div
                          className="bg-light p-2 rounded-3 text-muted"
                          style={{ fontSize: "11px" }}
                        >
                          <span className="fw-bold d-block text-dark mb-1">
                            💡 Reglas de Distribución:
                          </span>
                          <ul className="ps-3 mb-0">
                            <li>
                              Montos inferiores al saldo cuota actúan como{" "}
                              <strong>Abono</strong>.
                            </li>
                            <li>
                              Montos exactos <strong>Saldan</strong> la cuota.
                            </li>
                            <li>
                              Montos superiores <strong>Derraman</strong> el
                              remanente en las siguientes cuotas en orden
                              consecutivo.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Panel de Simulación Visual de Cascada en Tiempo Real */}
                    <div className="col-12 col-lg-7">
                      <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 w-100">
                        <h4 className="h6 fw-bold text-secondary mb-3">
                          Cuotas Afectas en el Pago
                        </h4>

                        {!simulacionPago ? (
                          <div className="d-flex flex-column align-items-center justify-content-center text-muted h-100 py-4">
                            <span className="small">
                              <EmptyState
                                title=""
                                subtitle="Debes seleccionar un monto a pagar."
                              />
                            </span>
                          </div>
                        ) : (
                          <div>
                            {/* Resultados de la Simulación */}
                            <div className="mb-3">
                              <span className="badge bg-primary text-uppercase mb-2">
                                Distribución del Pago
                              </span>
                              <div className="p-3 bg-primary-subtle rounded-3 text-primary border border-primary-subtle">
                                <ul className="list-unstyled mb-0 small">
                                  {simulacionPago.operacionesEfectuadas?.map(
                                    (op, idx) => (
                                      <li
                                        key={idx}
                                        className="mb-1 d-flex gap-2"
                                      >
                                        <span>✔️</span>
                                        <span>
                                          {op.tipo === "SALDAR" ? (
                                            <span>
                                              <strong>
                                                Saldada Cuota #{op.numero}
                                              </strong>{" "}
                                              por valor de{" "}
                                              <strong>
                                                $
                                                {op.montoAplicado.toLocaleString(
                                                  "es-DO",
                                                  { minimumFractionDigits: 2 },
                                                )}
                                              </strong>
                                            </span>
                                          ) : (
                                            <span>
                                              <strong>
                                                Abonada Cuota #{op.numero}
                                              </strong>{" "}
                                              con{" "}
                                              <strong>
                                                $
                                                {op.montoAplicado.toLocaleString(
                                                  "es-DO",
                                                  { minimumFractionDigits: 2 },
                                                )}
                                              </strong>
                                            </span>
                                          )}
                                        </span>
                                      </li>
                                    ),
                                  )}
                                  {simulacionPago.sobranteFavor > 0 && (
                                    <li className="mt-2 text-danger fw-bold">
                                      🚨 El pago excede el préstamo. Sobrante a
                                      favor del cliente: $
                                      {simulacionPago.sobranteFavor.toLocaleString(
                                        "es-DO",
                                        { minimumFractionDigits: 2 },
                                      )}
                                    </li>
                                  )}
                                </ul>
                              </div>
                            </div>

                            {/* Vista Previa de la Lista Amortizada */}
                            <span
                              className="text-muted d-block font-monospace mb-2"
                              style={{ fontSize: "10px" }}
                            >
                              Resultado Proyectado de Cuotas Clave:
                            </span>
                            <div
                              className="d-flex flex-column gap-2 overflow-y-auto"
                              style={{ maxHeight: "150px" }}
                            >
                              {simulacionPago.cuotasCalculadas?.map((cuota) => {
                                // Solo mostrar cuotas afectadas por el pago o la siguiente pendiente
                                const fueAfectada =
                                  cuota.nuevoMontoPagado !==
                                  (cuota.montoPagado || 0);
                                const esPendienteActual =
                                  cuota.id === primerCuotaPendiente?.id;
                                if (!fueAfectada && !esPendienteActual)
                                  return null;

                                const porcentaje =
                                  (cuota.nuevoMontoPagado /
                                    cuota.montoTotalCuota) *
                                  100;

                                return (
                                  <div
                                    key={cuota.id}
                                    className="p-2 border rounded bg-light"
                                    style={{ fontSize: "11px" }}
                                  >
                                    <div className="d-flex justify-content-between font-weight-bold mb-1">
                                      <span>
                                        Cuota #{cuota.numcuota} (
                                        {cuota.fechavencimiento})
                                      </span>
                                      <span
                                        className={
                                          cuota.nuevoSaldoPendiente === 0
                                            ? "text-success fw-bold"
                                            : "text-primary font-weight-bold"
                                        }
                                      >
                                        {cuota.nuevoSaldoPendiente === 0
                                          ? "Saldará"
                                          : `Abonará (Resta $${safeFixed(cuota.nuevoSaldoPendiente, 2)})`}
                                      </span>
                                    </div>
                                    <div
                                      className="progress"
                                      style={{ height: "4px" }}
                                    >
                                      <div
                                        className="progress-bar bg-primary"
                                        role="progressbar"
                                        style={{ width: `${porcentaje}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-white border-top-0 p-3">
                  <button
                    type="button"
                    className="btn btn-sm btn-light text-secondary rounded-3 px-3 py-2"
                    onClick={() => {
                      setPrestamoSeleccionado(null);
                      setTipoModal(null);
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary rounded-3 px-4 py-2"
                    disabled={
                      !montoIngresado || parseFloat(montoIngresado) <= 0
                    }
                  >
                    Confirmar Cobro e Imprimir Recibo
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {notificacion && (
        <div
          className="position-fixed top-0 end-0 m-3 bg-dark text-white shadow-lg rounded-pill d-flex align-items-center px-4 py-2 border border-secondary"
          style={{
            zIndex: 1100,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(33, 37, 41, 0.95)",
          }}
        >
          <span
            className="bg-success rounded-circle me-2"
            style={{ width: "10px", height: "10px", display: "inline-block" }}
          ></span>
          <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>
            {notificacion}
          </span>
        </div>
      )}

      {reciboActivo && (
        <ModalReciboComprobante
          recibo={reciboActivo}
          empresa={dataEmpresa}
          onClose={() => setReciboActivo(null)}
        />
      )}
    </div>
  );
};

export default ShowPrestamos;
