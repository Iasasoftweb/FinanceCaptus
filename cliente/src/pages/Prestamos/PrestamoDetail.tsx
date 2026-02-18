import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import { formatCurrency } from "../../components/UtilsStuff";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import dayjs from "dayjs";
import fechaCorta from "../../components/stuff/fechaCorta";
import { Cell, Pie, PieChart } from "recharts";
import { GiCash, GiPayMoney } from "react-icons/gi";
import Button from "@mui/material/Button";
import { BsCashCoin } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { PiPrinterLight } from "react-icons/pi";
import { TbCashBanknoteOff } from "react-icons/tb";

import {
  Box,
  createTheme,
  Pagination,
  Tab,
  ThemeProvider,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import NoDatos from "../../components/stuff/NoDatos";
import PaginationItem from "../../components/Pagination/PaginatedItems.tsx";
import { format, isBefore } from "date-fns";
import PagosCuotas from "../pagos/PagosCuotas.tsx";
import CalculoMora from "./CalculoMora.tsx";

interface Cuotas {
  idprestamo: number;
  numcuota: number;
  fechapago: string;
  montocuota: number;
  montocapital: number;
  montointeres: number;
  montomora: number;
  seguro: number;
  montopagado: number;
  capitalpagado: number;
  interespagado: number;
  morapago: number;
  estado: string;
}

interface Totales {
  totalCuotas: number;
  totalInteres: number;
  totalCapitalPagado: number;
  totalSeguro: number;
}

const PrestamoDetail = () => {
  const [dataPrestamo, setDataPrestamo] = useState([]);
  const [verCuotas, setVerCuotas] = useState([]);
  const [verCuotasP, setVerCuotasP] = useState([]);
  const [verPagos, setVerPagos] = useState([]);
  const [value, setValue] = React.useState("1");
  const [page, setPage] = useState(1);
  const [Avata, setAvata] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [isModalPagos, setIsModalPagos] = useState(false);
  
 

  const [totales, setTotales] = useState({
    totalCuotas: 0,
    totalInteres: 0,
    totalCapitalPagado: 0,
    totalSeguro: 0,
  });

  const PER_PAGE = 13;
  const countpageCuotas = Math.ceil(verCuotas.length / PER_PAGE);
  const _DATACUOTAS = PaginationItem(verCuotasP, PER_PAGE);

  const TotalInteres = verCuotas.reduce(
    (sum, item) => sum + (Number(item.montointeres) || 0),
    0
  );
  const TotalCapital = verCuotas.reduce(
    (sum, item) => sum + (Number(item.montocapital) || 0),
    0
  );
  const TotalMora = verCuotas.reduce(
    (sum, item) => sum + (Number(item.montomora) || 0),
    0
  );
  const TotalSeguro = verCuotas.reduce(
    (sum, item) => sum + (Number(item.seguro) || 0),
    0
  );
  const TotalCapitalPagado = verCuotas.reduce(
    (sum, item) => sum + (Number(item.capitalpagado) || 0),
    0
  );
  const TotalInteresPagado = verCuotas.reduce(
    (sum, item) => sum + (Number(item.interespagado) || 0),
    0
  );
  const TotalMoraPagado = verCuotas.reduce(
    (sum, item) => sum + (Number(item.morapagado) || 0),
    0
  );
  const TotalMontoPagado = verCuotas.reduce(
    (sum, item) => sum + (Number(item.montopagado) || 0),
    0
  );

  
  const handlePageChance = (e, p) => {
    setPage(p);
    _DATACUOTAS.jump(p);
  };

  const handleCrearPago = () => {
    setIsModalPagos(true);
  };

  const { id } = useParams();

  

  const UriGetPrestamos = "http://localhost:8000/prestamos/";
  const UrisImg = "http://localhost:8000/uploads/";
  const UriCuotas = "http://localhost:8000/cuotas/";

  const GetAmortiza = async (id: number) => {
    try {
      const respuesta = await axios.get(`${UriCuotas}${id}`);

      const responseData = respuesta.data?.data || respuesta.data;

      if (Array.isArray(responseData)) {
        setVerCuotas(responseData); // Directamente el array
        setVerCuotasP(responseData); // Directamente el array
        setTotalItems(responseData.length);

        console.log("Datos recibidos:", responseData);
      } else {
        setVerCuotas([responseData]);
        setVerCuotasP([responseData]);
        setTotalItems([responseData].length);
        console.log("Datos recibidos (no array):", responseData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const GetPrestamos = async (id: Number) => {
    try {
      await axios.get(`${UriGetPrestamos}${id}`).then((respuesta) => {
        if (Array.isArray(respuesta.data)) {
          setDataPrestamo(respuesta.data);
        } else {
          setDataPrestamo([respuesta.data]); // Envolvemos la respuesta en un arreglo
        }

        setAvata(respuesta.data.tcliente.imgFOTOS);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getCuotasInfo = () => {
    const hoy = new Date();

    const pendientes = verCuotas.filter((item) => {
      const pagada =
        typeof item.pagada === "string"
          ? item.pagada.toLowerCase() === "true"
          : Boolean(item.pagada);

      return !pagada;
    });

    const atrasadas = pendientes.filter((c) => {
      const fechavencimiento = new Date(c.fechavencimiento);
      return fechavencimiento < hoy;
    });

    console.log(atrasadas.length);

    return {
      pagada: pendientes.length,
      atrasadas: atrasadas.length,
    };
  };

  const actualizaMora= () =>{
    CalculoMora(id)
  }

  useEffect(() => {
    // actualizaMora();
    GetPrestamos(id);
    GetAmortiza(id);
       
  }, []);

  const data = [
    { name: "Atrazadas", value: 400 },
    { name: "Pagadas", value: 300 },
    { name: "Abonos", value: 300 },
    { name: "Vencidas", value: 200 },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="blue"
        fontSize={10}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const HandleMenuClose = () => {
    setIsModalPagos(false);
  };

  return (
    <Container fluid className="vh-100">
      {isModalPagos && (
        <PagosCuotas
          ModoEdicion={false}
          idprestamo={Number(id)}
          open={true}
          handleClose={HandleMenuClose}
        />
      )}

      {dataPrestamo.map((items) => (
        <Row>
          <Col md={2} sm={12}>
            <div className="border p-2  rounded-4 shadow-lg">
              <div className="d-flex flex-column justify-content-center align-items-center ">
                <Avatar
                  aria-label="recipe"
                  sx={{ width: 100, height: 100 }}
                  src={`${UrisImg}${items.tcliente.imgFOTOS}`}
                  className=" rounded-circle  border-success text-center"
                />
                <div className="mt-2 text-center">
                  <span className="clFont fw-medium">
                    {items.tcliente.nombre_completo}
                  </span>
                  <br />
                  <Rating name="size-small" defaultValue={2} size="small" />
                  <br />
                  <div className="border p-1 rounded-4 border-primary">
                    <span className="text-center clFont">Al dia</span>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          <Col md={10} sm={12} className="border shadow-lg rounded-4 p-4">
            <Row>
              <Col md={3} sm={12} className="lh-lg ">
                <span className="clFont fw-bold">
                  Monto Capital:{" "}
                  <span className="fw-normal mx-3 text-bg-secondary p-2 rounded-4 px-3">
                    {formatCurrency(items.capital)}
                  </span>
                </span>{" "}
                <br />
                <span className="clFont fw-bold">
                  Interes:{" "}
                  <span className="fw-normal mx-3 bg-info-subtle p-1 px-3 rounded-4">
                    {Number(items.interes)} %
                  </span>
                </span>{" "}
                <br />
                <span className="clFont fw-bold ">
                  Balance Pendiente:{" "}
                  <span className="fw-normal mx-3 bg-info-subtle p-1 px-3 rounded-4">
                    {formatCurrency(items.balancependiente)}
                  </span>
                </span>{" "}
                <br />
                <span className="clFont fw-bold">
                  Tipo Amortizacion :{" "}
                  <span className="fw-normal mx-3 bg-info-subtle p-1 px-3 rounded-4">
                    {items.tipoamortizacion}
                  </span>
                </span>{" "}
                <br />
                <span className="clFont fw-bold">
                  Frecuencia :{" "}
                  <span className="fw-normal mx-3 bg-info-subtle p-1 px-3 rounded-4">
                    {items.frecuencia}
                  </span>
                </span>{" "}
                <br />
              </Col>
              <Col md={3} sm={12} className="lh-lg">
                <span className="clFont fw-bold">
                  Comision :{" "}
                  <span className="fw-normal mx-3 bg-info-subtle p-1 px-3 rounded-4">
                    {formatCurrency(items.comision)}
                  </span>
                </span>{" "}
                <br />
                <span className="clFont fw-bold">
                  Cuotas :{" "}
                  <span className="fw-normal mx-3 bg-info-subtle p-1 px-3 rounded-4">
                    0/{items.tcuota}
                  </span>
                </span>{" "}
                <br />
                <span className="clFont fw-bold">
                  Gastos Legales :{" "}
                  <span className="fw-normal mx-3 bg-info-subtle p-1 px-3 rounded-4">
                    {formatCurrency(items.gastoslegal)}
                  </span>
                </span>{" "}
                <br />
                <span className="clFont fw-bold">
                  Mora :{" "}
                  <span className="fw-normal mx-3 bg-info-subtle p-1 px-3 rounded-4">
                    {Number(items.mora)} %
                  </span>
                </span>{" "}
                <br />
                <span className="clFont fw-bold">
                  Fecha Inicio{" "}
                  <span className="fw-normal mx-3 bg-info-subtle p-1 px-3 rounded-4">
                    {items.fechaprimer}
                  </span>
                </span>{" "}
                <br />
              </Col>
              <Col md={2} sm={12} className="">
                <div className="flex-column justify-content-center align-item-center">
                  <div className=" text-center">
                    <span className="clFont fw-medium">Estado de Cuotas</span>
                  </div>

                  <PieChart
                    width={300}
                    height={130}
                    className="text-center"

                    //  onMouseEnter={onPieEnter}
                  >
                    <Pie
                      data={data}
                      cx={90}
                      cy={65}
                      innerRadius={45}
                      outerRadius={60}
                      label={renderCustomizedLabel}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    {/* <Pie
                    data={data}
                    cx={420}
                    cy={200}
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie> */}
                  </PieChart>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      ))}

      <Row>
        <Col md={2} className="mt-3">
          <div className=" p-3 border shadow-lg rounded-4">
            <Button
              className="mx-1 w-100 mb-2 text-capitalize rounded-4"
              style={{ fontSize: "0.9em" }}
              variant="outlined"
              onClick={handleCrearPago}
            >
              <span className="mx-2" style={{ fontSize: "1.4em" }}>
                <GiCash />
              </span>
              Realizar Pago
            </Button>
            <Button
              className="mx-1 w-100 mb-2 text-capitalize rounded-4"
              style={{ fontSize: "0.9em" }}
              variant="outlined"
            >
              <span className="mx-2" style={{ fontSize: "1.4em" }}>
                <BsCashCoin />
              </span>
              Reenganche
            </Button>
            <Button
              className="mx-1 w-100 mb-2 text-capitalize rounded-4"
              style={{ fontSize: "0.9em" }}
              variant="outlined"
            >
              <span className="mx-2" style={{ fontSize: "1.4em" }}>
                <CiEdit />
              </span>
              Editar
            </Button>
            <Button
              className="mx-1 w-100 mb-2 text-capitalize rounded-4"
              style={{ fontSize: "0.9em" }}
              variant="outlined"
            >
              <span className="mx-2" style={{ fontSize: "1.4em" }}>
                <GiPayMoney />
              </span>
              Modificar Capital
            </Button>
            <Button
              className="mx-1 w-100 mb-2 text-capitalize rounded-4 border-danger-subtle text-danger-emphasis"
              style={{ fontSize: "0.9em" }}
              variant="outlined"
            >
              <span className="mx-2" style={{ fontSize: "1.4em" }}>
                <TbCashBanknoteOff />
              </span>
              Anular Prestamos
            </Button>
            <Button
              className="mx-1 w-100 mb-2 text-capitalize rounded-4"
              style={{ fontSize: "0.9em" }}
              variant="outlined"
            >
              <span className="mx-2" style={{ fontSize: "1.4em" }}>
                <PiPrinterLight />
              </span>
              Imprimir
            </Button>
          </div>
        </Col>
        <Col
          md={10}
          sm={12}
          className="mt-4 text-center shadow-lg rounded-bottom-4"
        >
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab
                    label="Amortizacion"
                    value="1"
                    className="text-capitalize"
                  />
                  <Tab
                    label="Pagos Realizados"
                    value="2"
                    className="text-capitalize"
                  />
                </TabList>
              </Box>
              <TabPanel value="1" className="">
                {verCuotas ? (
                  <table className="mi-tabla table-striped table-hover table-responsive text-center">
                    <thead>
                      <tr>
                        <th
                          className="text-muted fw-medium text-center"
                          style={{ fontSize: "0.8em" }}
                        >
                          No
                        </th>
                        <th
                          className="text-muted fw-medium text-center"
                          style={{ fontSize: "0.8em", width: "75px" }}
                        >
                          Fecha
                        </th>

                        <th
                          className="text-muted fw-medium text-center"
                          style={{ fontSize: "0.8em", width: "100px" }}
                        >
                          Fecha V
                        </th>
                        <th
                          className="text-muted fw-medium text-end"
                          style={{ fontSize: "0.8em" }}
                        >
                          Monto Cuota
                        </th>
                        <th
                          className="text-muted fw-medium text-end"
                          style={{ fontSize: "0.8em" }}
                        >
                          Interes
                        </th>
                        <th
                          className="text-muted fw-medium text-end"
                          style={{ fontSize: "0.8em" }}
                        >
                          Capital
                        </th>
                        <th
                          className="text-muted fw-medium text-end"
                          style={{ fontSize: "0.8em" }}
                        >
                          Seguro
                        </th>
                        <th
                          className="text-muted fw-medium text-end"
                          style={{ fontSize: "0.8em" }}
                        >
                          Mora
                        </th>
                        <th
                          className="text-muted fw-medium text-end"
                          style={{ fontSize: "0.8em" }}
                        >
                          Interes Pagado
                        </th>
                        <th
                          className="text-muted fw-medium text-end"
                          style={{ fontSize: "0.8em" }}
                        >
                          Capita Pagado
                        </th>
                        <th
                          className="text-muted fw-medium text-end"
                          style={{ fontSize: "0.8em" }}
                        >
                          Mora Pagado
                        </th>
                        <th
                          className="text-muted fw-medium text-end"
                          style={{ fontSize: "0.8em" }}
                        >
                          Monto Pagado
                        </th>
                        <th
                          className="text-muted fw-medium text-end"
                          style={{ fontSize: "0.8em" }}
                        >
                          Capital Restante
                        </th>
                        <th
                          className="text-muted fw-medium text-end"
                          style={{ fontSize: "0.8em" }}
                        >
                          Estado
                        </th>
                        <th className="text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {_DATACUOTAS?.currentData().map((items) => {
                        const vencida = isBefore(
                          items.fechavencimiento,
                          new Date()
                        )
                       
                        return (
                          <tr
                            className="text-muted lh-lg fw-lighter"
                            style={{ fontSize: "0.7em", height: " 40px" }}
                            key={items.id}
                          >
                            <td className="text-center fw-bold">
                              {items.numcuota}
                            </td>
                            <td className="text-center">
                              {format(items.fechapago, "dd-MM-yyyy")}
                            </td>

                            <td className="text-center">
                              {format(items.fechavencimiento, "dd-MM-yyyy")}
                            </td>
                            <td className="text-end" style={{ width: "100px" }}>
                              {formatCurrency(items.montocuota)}
                            </td>
                            <td className="text-end" style={{ width: "100px" }}>
                              {formatCurrency(items.montointeres)}
                            </td>
                            <td className="text-end" style={{ width: "100px" }}>
                              {formatCurrency(items.montocapital)}
                            </td>
                            <td className="text-end" style={{ width: "50px" }}>
                              {formatCurrency(items.seguro)}
                            </td>
                            <td className="text-end" style={{ width: "100px" }}>
                              {/* {formatCurrency(mora)} */}
                            </td>
                            <td
                              className="text-end fw-semibold"
                              style={{ width: "100px" }}
                            >
                              {formatCurrency(items.interespagado)}
                            </td>
                            <td className="text-end fw-semibold">
                              {formatCurrency(items.capitalpagado)}
                            </td>
                            <td className="text-end fw-semibold">
                              {formatCurrency(items.morapago)}
                            </td>
                            <td className="text-end fw-semibold">
                              {formatCurrency(items.montopagado)}
                            </td>
                            <td className="text-end" style={{ width: "100px" }}>
                              {formatCurrency(2000)}
                            </td>
                            <td className="text-end">
                              {isBefore(items.fechavencimiento, new Date()) ? (
                                <span>Atrasada</span>
                              ) : (
                                <span>Normal</span>
                              )}{" "}
                            </td>
                            <td className="text-end">
                              <div
                                className="mx-3"
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  borderRadius: "50%",
                                  border: "2 px solid black",
                                  backgroundColor: vencida
                                    ? "#dc4c4c"
                                    : items.estado === "Pagada"
                                    ? "#aed581"
                                    : "#b3e5fc",
                                }}
                              >
                                .
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="text-end" style={{ fontSize: "0.7em" }}>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th>Totales :</th>
                      <th className="fw-semibold text-end">
                        {formatCurrency(TotalInteres)}
                      </th>
                      <th className="fw- semibold text-end">
                        {formatCurrency(TotalCapital)}
                      </th>
                      <th className="fw-semibold text-end">
                        {formatCurrency(TotalSeguro)}
                      </th>
                      <th className="fw-semibold text-end">
                        {formatCurrency(TotalMora)}
                      </th>
                      <th className="fw-semibold text-end">
                        {formatCurrency(TotalInteresPagado)}
                      </th>
                      <th className="fw-semibold text-end">
                        {formatCurrency(TotalCapitalPagado)}
                      </th>
                      <th className="fw-semibold text-end">
                        {formatCurrency(TotalMoraPagado)}
                      </th>
                      <th className="fw-semibold text-end">
                        {formatCurrency(TotalMontoPagado)}
                      </th>
                      <th className="text-center">-</th>
                      <th className="text-center">-</th>
                    </tfoot>
                  </table>
                ) : (
                  <NoDatos mensaje="No se han procesados cuotas" />
                )}
                <ThemeProvider theme={theme}>
                  <div className="d-flex align-items-center ">
                    <Pagination
                      count={countpageCuotas}
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
              </TabPanel>
              <TabPanel value="2">
                {!verPagos ? (
                  <table className="mi-tabla">
                    <thead>
                      <tr style={{ fontSize: "0.8em" }}>
                        <th className="fw-semibold">Fecha </th>
                        <th className="fw-semibold">Fecha Vencimiento</th>
                        <th className="fw-semibold">Total Pagado</th>
                        <th className="fw-semibold">Capital</th>
                        <th className="fw-semibold">Interes</th>
                        <th className="fw-semibold">Mora</th>
                        <th className="fw-semibold">Descuento</th>
                        <th className="fw-semibold">Comision</th>
                        <th className="fw-semibold">Otros</th>
                        <th className="fw-semibold">Capital Pendiente</th>
                        <th className="fw-semibold">Cobrado por</th>
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </table>
                ) : (
                  <NoDatos mensaje="No Existen Pagos" />
                )}
              </TabPanel>
            </TabContext>
          </Box>
        </Col>
      </Row>
    </Container>
  );
};

export default PrestamoDetail;

const theme = createTheme({
  palette: {
    secundary: {
      main: "#0EB582",
    },
  },
});
