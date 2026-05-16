import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Paper, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createTheme } from "@mui/material/styles";
import PrestamosForm from "./PrestamosForm.tsx";
import { formatCurrency } from "../../components/UtilsStuff.tsx";
import "./prestamos.css";
import { MisColores } from "../../components/stuff/MisColores.tsx";
import {
  AlertCircle,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileSpreadsheet,
  FileText,
  HandCoins,
  Landmark,
  Printer,
  RefreshCw,
  Search,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { InputField } from "../../components/stuff/InputField.tsx";
import { EmptyState } from "../../components/stuff/EmptyState.tsx";
import { useEmpresa } from "../../hooks/useEmpresas.tsx";
import { getBase64ImageFromURL } from "../../components/stuff/getBase64ImageFromURL.tsx";
import { agregarImagenProporcional } from "../../components/stuff/agragarImagenProporcional.tsx";

const ShowPrestamos = () => {
  const [PrestamoData, setPrestamoData] = useState([]);
  const [DataPrestamo, setDataPrestamo] = useState([]);
  const [dataRutas, setDataRutas] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [searchZonas, setSearchZonas] = useState("");
  const [cuotas, setCuotas] = useState([]);
  const [checked, setChecked] = React.useState(true);
  const [idPrestamo, setIdPrestamos] = useState(0);
  const [verPDF, setVerPDF] = useState(false);

  const UriData = "http://localhost:5000/prestamos/";
  const uriCuotas = "http://localhost:5000/cuotas/";
  const uriRutas = "http://localhost:5000/zonas/";

  const UrisImg = "http://localhost:5000/uploads/clientes/avata/";
  const UrisImgEmpresa = "http://localhost:5000/uploads/clientes/empresa/";

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
    const datosExcel = filtrar.map((item) => ({
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
    const { jsPDF } = window.jspdf;
    if (!jsPDF) return;

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

    const rows = filtrar.map((item) => ({
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
    doc.autoTable({
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
      setDataPrestamo(PrestamosRes.data);
      setPrestamoData(PrestamosRes.data);
      setCuotas(CuotasRes.data);
      setDataRutas(RutasRes.data);
      setTotalItems(PrestamosRes.data.length);
      setIdPrestamos(PrestamosRes.data.id);
    } catch (error) {
      console.error(error);
    }
  };

  const getCuotasInfo = (prestamoId) => {
    const hoy = new Date();
    const prestamoCuotas = cuotas.filter((c) => c.idprestamo === prestamoId);

    const pendientes = prestamoCuotas.filter((item) => {
      const pagada =
        typeof item.pagada === "string"
          ? item.pagada.toLowerCase() === "true"
          : Boolean(item.pagada);
      return !pagada;
    });

    const cPagadas = prestamoCuotas.filter((item) => {
      const pagada =
        typeof item.pagada === "string"
          ? item.pagada.toLowerCase() === "true"
          : Boolean(item.pagada);
      return pagada;
    });

    const atrasadas = pendientes.filter((item) => {
      const fechaVencimiento = new Date(item.fechavencimiento);
      return fechaVencimiento < hoy;
    });

    const BalancePendiente = atrasadas.reduce(
      (sum, cuotas) => sum + parseFloat(cuotas.montocuota || 0),
      0,
    );
    const BalancePagado = atrasadas.reduce(
      (sum, cuota) =>
        sum +
        parseFloat(
          cuota.capitalpagado + cuota.interespagado + cuota.morapago || 0,
        ),
      0,
    );

    const BalanceMora = atrasadas.reduce(
      (sum, cuota) => sum + parseFloat(cuota.montomora || 0),
      0,
    );

    return {
      pendientes: pendientes.length,
      atrasadas: atrasadas.length,
      cuotaspagada: cPagadas.length,
      montovencido: BalancePendiente,
      Balancepagado: BalancePagado,
      Balancemora: BalanceMora,
    };
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

  const PrintPDF = () => {
    window.open("../Prestamos/Pdfs/reportePrestmos", "_blank");
  };

  useEffect(() => {
    Datos();

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    script.async = true;
    document.body.appendChild(script);

    const scriptJspdf = document.createElement("script");
    scriptJspdf.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    scriptJspdf.async = true;
    document.body.appendChild(scriptJspdf);

    const scriptAutotable = document.createElement("script");
    scriptAutotable.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js";
    scriptAutotable.async = true;
    document.body.appendChild(scriptAutotable);

    //  inputRef.current.focus();
  }, []);

  const filtrar = PrestamoData.filter((item) => {
    const coincideZona = searchZonas
      ? item.tcliente.tbzona.nombrerutas
          .toLowerCase()
          .includes(searchZonas.toLowerCase())
      : true;

    // 2. Filtro por Texto (Nombre o DNI)
    const coincideBusqueda =
      item.tcliente.nombre_completo
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.tcliente.dni.toLowerCase().includes(search.toLowerCase());

    const coincideActivo = checked
      ? item.modo.toLowerCase() === "activo"
      : item.modo.toLowerCase() === "inactivo";

    return coincideZona && coincideBusqueda && coincideActivo;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPrestamos = filtrar.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtrar.length / itemsPerPage);

  const totalCapital = currentPrestamos.reduce((sum, prestamos) => {
    const capital = Number(prestamos.capital) || 0;
    return sum + capital;
  }, 0);

  const totalInteres = currentPrestamos.reduce((sum, prestamos) => {
    const capital = Number(prestamos.montointeres) || 0;
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
            <Landmark size={20} />
          </div>
          <div>
            <h5 className="fw-bold mb-0" style={{ color: "#2c3e50" }}>
              Préstamos
            </h5>
            <p className="text-muted mb-0 " style={{ fontSize: "0.8em" }}>
              Control de Préstamos Emitidos
            </p>
          </div>
        </div>
        <button className="btn btn-light rounded-circle p-2 text-secondary">
          <X size={20} />
        </button>
      </div>

      <Paper>
        <div className="container-fluid max-width-xxl mx-auto">
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
                      {formatCurrency(totalCapital.toFixed(2))}
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
                      {formatCurrency(totalMora.toFixed(2))}
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
                    <h4 className="fw-bold mb-0 text-dark">{filtrar.length}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                    placeholder="Buscar Préstamos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ fontSize: "0.85rem" }}
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
                <InputField label="" col="" icon={Briefcase}>
                  <select
                    className="form-select bg-light border-0 shadow ps-2"
                    value={searchZonas}
                    onChange={(e) => setSearchZonas(e.target.value)}
                    style={{ fontSize: "0.85rem" }}
                  >
                    <option value="">Seleccione una Zona</option>
                    {dataRutas.map((ruta) => (
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
                    <th
                      className="py-3 border-0 text-muted text-uppercase fw-bold text-center"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Estado
                    </th>
                    <th
                      className="pe-4 py-3 border-0 text-muted text-uppercase fw-bold text-center"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {currentPrestamos.map((item, idx) => (
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
                        {item.capital.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="text-end text-muted">
                        $
                        {item.interes.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="text-center">
                        <span
                          className="border px-2 py-1 rounded-pill fw-bold text-secondary"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {item.cuotaspagas} / {item.tcuota}
                        </span>
                      </td>
                      <td>
                        <span className="text-muted fw-medium">
                          {item.tcliente.tbzona.nombrerutas}
                        </span>
                      </td>
                      <td className="text-center">
                        {item.vencido > 0 ? (
                          <div className="d-inline-block">
                            <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 mb-1 fw-bold">
                              VENCIDO
                            </span>
                            <div
                              className="fw-bold text-danger"
                              style={{ fontSize: "0.75rem" }}
                            >
                              ${item.vencido.toLocaleString()}
                            </div>
                          </div>
                        ) : (
                          <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 fw-bold">
                            AL DÍA
                          </span>
                        )}
                      </td>
                      <td className="pe-4 text-center">
                        <div className="btn-group">
                          <button
                            className="btn btn-outline-primary btn-sm border-0 rounded-3 p-1 mx-1"
                            title="Cobrar"
                          >
                            <HandCoins size={18} />
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-sm border-0 rounded-3 p-1 mx-1"
                            title="Ver"
                            onClick={() => handleDetail(item.id)}
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-light fw-bold border-top">
                  <tr>
                    <td colSpan="2" className="text-end ps-4 py-3 text-muted">
                      TOTALES
                    </td>
                    <td className="text-end py-3 text-primary">$108,000.00</td>
                    <td className="text-end py-3 text-dark">$5,982.28</td>
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

        {/* <ThemeProvider theme={theme}>
          <div className="d-flex align-items-center ">
            <Pagination
              count={countpage}
              size="large"
              page={page}
              color="secundary"
              onChange={handlePageChance}
            />

            <div>
              <p className="clFont m-auto">
                Total de Clientes :{" "}
                <span className="fw-bolder">{totalItems} </span>
              </p>
            </div>
          </div>
        </ThemeProvider> */}
      </Paper>
    </div>
  );
};

export default ShowPrestamos;
const theme = createTheme({
  palette: {
    secondary: {
      main: "#0EB582",
    },
  },
});
