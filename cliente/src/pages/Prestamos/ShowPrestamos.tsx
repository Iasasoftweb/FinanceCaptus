import React, { act, useEffect, useState, useRef } from "react";
import axios from "axios";
import TitleTop from "../../components/TitleTop/TItleTop";
import { GiPayMoney, GiTakeMyMoney } from "react-icons/gi";
import {
  Paper,
  Table,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Autocomplete,
  InputAdornment,
  Switch,
  FormGroup,
  FormControlLabel,
  Avatar,
  Tooltip,
  Box,
} from "@mui/material";

import PaginationItem from "../../components/Pagination/PaginatedItems.tsx";
import { IoIosSearch } from "react-icons/io";
import { TbRefresh } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PrestamosForm from "./PrestamosForm.tsx";
import NoDatos from "../../components/stuff/NoDatos.tsx";
import { format, isBefore } from "date-fns";
import { formatCurrency } from "../../components/UtilsStuff.tsx";
import { PiEye } from "react-icons/pi";
import "./prestamos.css";
import BtnXLSEstilizado from "../../components/ExportXLS/BtnXLSEstilizado.tsx";
import { SlPrinter } from "react-icons/sl";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import PrnPrestamos from "./Pdfs/prnPrestamos.tsx";

const ShowPrestamos = () => {
  const [PrestamoData, setPrestamoData] = useState([]);
  const [DataPrestamo, setDataPrestamo] = useState([]);
  const [dataRutas, setDataRutas] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [cuotas, setCuotas] = useState([]);
  const [searchRutas, setsearchRutas] = useState("");
  const [checked, setChecked] = React.useState(true);
  const [idPrestamo, setIdPrestamos] = useState(0);
  const [verPDF, setVerPDF] = useState(false);

  const UriData = "http://localhost:5000/prestamos/";
  const uriCuotas = "http://localhost:5000/cuotas/";
  const uriRutas = "http://localhost:5000/zonas/";
  const UrisImg = "http://localhost:5000/uploads/";
  const Navigate = useNavigate();
  const PER_PAGE = 8;
  const countpage = Math.ceil(PrestamoData.length / PER_PAGE);
  const _DATA = PaginationItem(DataPrestamo, PER_PAGE);

  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handlePageChance = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  const label = { inputProps: { "aria-label": "Switch demo" } };

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

  const RutasFiltrar = (condiciones) => {
    console.log(condiciones);
    const result = PrestamoData.filter((elementos) => {
      const filt = elementos.tcliente.tbzona.nombrerutas === condiciones;
      return filt;
    });
    setDataPrestamo(result);
    setTotalItems(result.length);
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

  const filtrar = (condicionesFiltrar) => {
    const resultados = PrestamoData.filter((elementos) => {
      if (
        elementos.tcliente.nombre_completo
          .toString()
          .toLowerCase()
          .includes(condicionesFiltrar.toLowerCase()) ||
        elementos.tcliente.dni
          .toString()
          .toLowerCase()
          .includes(condicionesFiltrar.toLowerCase()) ||
        elementos.tcliente.tbzona.nombrerutas
          .toString()
          .toLowerCase()
          .includes(condicionesFiltrar.toLowerCase())
      ) {
        return elementos;
      }
    });
    setDataPrestamo(resultados);
    setTotalItems(resultados.length);
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

  const totalCapital = DataPrestamo.reduce((sum, prestamos) => {
    const capital = Number(prestamos.capital) || 0;
    return sum + capital;
  }, 0);

  const totalInteres = DataPrestamo.reduce((sum, prestamos) => {
    const capital = Number(prestamos.montointeres) || 0;
    return sum + capital;
  }, 0);

  const balancePendiente = DataPrestamo.reduce((sum, prestamos) => {
    const capital = Number(prestamos.balancependiente) || 0;
    return sum + capital;
  }, 0);

  const montoCuota = DataPrestamo.reduce((sum, prestamos) => {
    const capital = Number(prestamos.mcuota) || 0;
    return sum + capital;
  }, 0);

  const montoMora = DataPrestamo.reduce((sum, prestamos) => {
    const capital = Number(prestamos.mora) || 0;
    return sum + capital;
  }, 0);

  const capitalPendiente = DataPrestamo.reduce((sum, prestamos) => {
    const capital = Number(prestamos.capitalpendiente) || 0;
    return sum + capital;
  }, 0);

  const gastosLegales = DataPrestamo.reduce((sum, prestamos) => {
    const capital = Number(prestamos.gastoslegal) || 0;
    return sum + capital;
  }, 0);

  useEffect(() => {
    Datos();
    inputRef.current.focus();
  }, []);

  const ShowDatos = () => {
    setSearch("");
    setsearchRutas("");
    Datos();
  };

  const Imprimir = () => {
    setVerPDF(true);
  };

  const handleRutas = (e) => {
    setsearchRutas(e.target.value);
    RutasFiltrar(e.target.value);
  };

  const HandleMenuClose = () => {
    setIsModalOpen(false);
  };

  const handleDetail = (id) => {
    Navigate(`/prestamodetail/${id}`);
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

      <TitleTop
        titulos={"Préstamos"}
        subtitulos={"Control de Préstamos Emitidos"}
        btnVisible={false}
        btnLabel={"Refrescar"}
        visibleEstado={false}
        estado="Show"
        icon={
          <GiTakeMyMoney
            className="border-1 rounded-circle p-2 text-info"
            style={{ fontSize: 55 }}
          />
        }
      />

      <Paper>
        <div className="d-flex justify-content-between align-content-center mb-1 mt-1 ">
          <div className="d-flex">
            <div className="m-3">
              <TextField
                inputRef={inputRef}
                placeholder=""
                label="Buscar"
                fullWidth
                disabled={false}
                value={search}
                onChange={searcher}
                InputLabelProps={{ style: { fontSize: "1em" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <span>
                        <IoIosSearch className="fs-5 text-info" />
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

            <div className="mt-3">
              <TextField
                select
                className="clFont"
                label="Buscar Rutas"
                value={searchRutas}
                fullWidth
                onChange={handleRutas}
                InputLabelProps={{ style: { fontSize: "1.0em" } }}
                sx={{
                  minWidth: 200,
                  minHeight: 40,

                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    fontSize: "10px", // Controla el radio de borde
                    width: "100%",
                    color: "GrayText",
                  },
                }}
              >
                <MenuItem value="" className="clFont fw-semibold">
                  {" "}
                  None
                </MenuItem>
                {dataRutas.map((item) => (
                  <MenuItem
                    value={item.nombrerutas}
                    className="clFont"
                    key={item.id}
                  >
                    {item.nombrerutas}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <div className="mx-2 m-3" onClick={ShowDatos}>
              <div className="btnRefrescar">
                <TbRefresh className="mx-2 fs-4" /> Refrescar
              </div>
            </div>

            <div className="mx-2 m-3">
              <BtnXLSEstilizado
                tdata={_DATA.currentData()}
                fileName={"Prestamos"}
                tTitulo={"Probando Titulo"}
              />
            </div>

            <PDFDownloadLink
              document={<PrnPrestamos />}
              fileName="probando.pdf"
              className="mx-2 m-3" // Mueve las clases aquí si son para el contenedor
            >
              {({ loading, error }) => {
                if (error) {
                  console.error("Error generando PDF:", error);
                  return <div>Error al generar PDF</div>;
                }
                return (
                  <div className={`BtnImprimir ${loading ? "loading" : ""}`}>
                    <SlPrinter className="mx-3 fs-4" />
                    {loading ? "Descargando..." : "Descargar PDF"}
                  </div>
                );
              }}
            </PDFDownloadLink>
          </div>
          <div className="text-center mt-4">
            <FormGroup>
              <FormControlLabel
                control={<Switch defaultChecked onChange={handleCheck} />}
                label={checked == true ? "Activos" : "Inactivos"}
              />
            </FormGroup>
          </div>
        </div>

        <div className="p-3">
          {DataPrestamo.length > 0 ? (
            <Table className="mi-tabla">
              <thead>
                <tr className="fw-normal">
                  <th className="clFont ">--</th>
                  <th className="clFont ">#Clie.</th>
                  <th className="clFont ">#Pre.</th>
                  <th className="clFont ">Clientes</th>
                  <th className="clFont ">Amorizacion</th>
                  <th className="clFont ">Frecuencia</th>
                  <th className="clFont text-end">Monto Capital</th>
                  <th className="clFont text-end">Monto Interes</th>
                  <th className="clFont text-end">Monto Mora</th>
                  <th className="clFont text-end">Monto Pagado</th>
                  <th className="clFont text-center">Cuotas</th>
                  <th className="clFont text-center">Zonas/Rutas</th>
                  <th className="clFont text-center">Cuotas V.</th>
                  <th className="clFont text-center">Vencidos</th>
                  <th className="clFont text-center">--</th>
                </tr>
              </thead>

              <tbody>
                {_DATA.currentData().map((items) => {
                  const {
                    atrasadas,
                    cuotaspagada,
                    montovencido,
                    Balancepagado,
                    Balancemora,
                  } = getCuotasInfo(items.id);

                  return (
                    <tr key={items.id}>
                      <td width={50}>
                        <Avatar
                          aria-label="recipe"
                          src={`${UrisImg}${items.tcliente.imgFOTOS}`}
                          className=" rounded-circle  border-success text-center"
                        />
                      </td>
                      <td
                        className="clFont align-middle text-center p-2"
                        width={25}
                      >
                        {items.tcliente.id}
                      </td>
                      <td
                        className="clFont align-middle text-center p-2 "
                        width={25}
                      >
                        {items.id}
                      </td>
                      <td
                        className="clFont align-middle text-start "
                        width={340}
                      >
                        <div className="">{items.tcliente.nombre_completo}</div>
                        <div className="">
                          <p
                            className="text-mute"
                            style={{ fontSize: "0.8em" }}
                          >
                            {items.tcliente.dni}
                          </p>
                        </div>
                      </td>
                      <td
                        className="clFont align-middle text-center"
                        width={50}
                      >
                        {items.tipoamortizacion}
                      </td>
                      <td
                        className="clFont align-middle text-center"
                        width={50}
                      >
                        {items.frecuencia}
                      </td>

                      <td className="clFont align-middle text-end" width={150}>
                        {formatCurrency(items.capital)}
                      </td>

                      <td className="clFont align-middle text-end" width={150}>
                        {formatCurrency(items.montointeres)}
                      </td>
                      <td className="clFont align-middle text-end" width={150}>
                        {formatCurrency(Balancemora)}
                      </td>
                      <td className="clFont align-middle text-end" width={150}>
                        {formatCurrency(Balancepagado)}
                      </td>

                      <td
                        className="clFont align-middle text-center"
                        width={50}
                      >
                        {cuotaspagada}/{items.tcuota}
                      </td>

                      <td
                        className="clFont align-middle text-center"
                        width={50}
                      >
                        {items.tcliente.tbzona.nombrerutas}
                      </td>

                      <td
                        className="clFont align-middle text-center"
                        width={100}
                      >
                        <span
                          className="border rounded-4 border-warning p-2"
                          style={{
                            background: atrasadas > 0 ? "#ffcccc" : "#d0efff",
                          }}
                        >
                          {atrasadas}
                        </span>
                      </td>

                      <td
                        className="clFont align-middle text-end"
                        width={50}
                        style={{ background: atrasadas > 0 && "#ffcccc" }}
                      >
                        <span className="fw-semibold">
                          {atrasadas === 0
                            ? "0.0"
                            : formatCurrency(montovencido)}
                        </span>
                        <br />
                        <span
                          style={{ fontSize: "0.8em" }}
                          className="me-1 text-muted"
                        >
                          Cuotas : {atrasadas}
                        </span>
                      </td>

                      <td
                        className="clFont align-middle text-center"
                        width={50}
                      >
                        <div className="d-flex">
                          <Tooltip title="Detalles" arrow>
                            <span
                              className="rounded-3 p-1 mx-3 me-2"
                              style={{ background: "#e17070" }}
                              onClick={() => handleDetail(items.id)}
                            >
                              <GiPayMoney className="fs-5 text-white" />
                            </span>
                          </Tooltip>

                          <Tooltip title="Visualizar Pagos" arrow>
                            <span
                              className="rounded-3 p-1 mx-1"
                              style={{ background: "#187bcd" }}
                            >
                              <PiEye className="fs-5 text-white" />
                            </span>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                <tr className="bg-light">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="clFont fw-semibold">Totales</td>
                  <td></td>
                  <td></td>

                  <td className="text-end clFont fw-semibold">
                    {formatCurrency(totalCapital)}
                  </td>
                  <td className="text-end clFont fw-semibold">
                    {formatCurrency(totalInteres)}
                  </td>
                  <td className="text-end clFont fw-semibold">0.0</td>
                  <td className="text-end clFont fw-semibold"> </td>
                  <td className="text-end clFont fw-semibold"></td>
                  <td className="text-end clFont fw-semibold"></td>
                  <td className="text-center"></td>
                  <td className="text-center"></td>
                  <td className="text-center"></td>
                </tr>
              </tbody>
            </Table>
          ) : (
            <NoDatos mensaje="No se han creados prestamos" />
          )}
        </div>

        <ThemeProvider theme={theme}>
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
        </ThemeProvider>
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
