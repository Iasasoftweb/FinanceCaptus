import React, { lazy, useRef } from "react";
import { useState, useEffect } from "react";
import "./DashStyle.css";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import LinearProgress from "@mui/material/LinearProgress";
import formatNumber from "../misc/formattedNumber";
import BeatLoader from "react-spinners/BeatLoader";
import { LuUserRoundCheck } from "react-icons/lu";
import { TbUserX } from "react-icons/tb";
import dayjs from "dayjs";
import MapFront from "../Maps/MapFront";
import { useAllClientes } from "../../hooks/useGetCliente";
import { MisColores } from "../stuff/MisColores";
import { safeFixed } from "../UtilsStuff";


const Dashboard = () => {
  const [totalCliente, setTotalCliente] = useState(0);
  const hasFetched = useRef(false);

  // const [dataEmpresa, setDataEmpresa] = useState([]);

  const [dataPrestamosActivos, setDataPrestamosActivos] = useState([]);
  const [dataPrestamosActivosporcent, setDataPrestamosActivosporcent] =
    useState(0);
  const [clientesData, setClientesData] = useState([]);

  const UriCliente = `${import.meta.env.VITE_API_URL}/clientes/`;
  const UriPrestamos = `${import.meta.env.VITE_API_URL}/prestamos/`;
  const UriCuotas = `${import.meta.env.VITE_API_URL}/cuotas/`;

  const { data: listaDeClientes, isLoading } = useAllClientes();

  const getInf = async () => {
    try {
      const [clientesRes, prestamosRes, cuotasRes] = await Promise.all([
        axios.get(`${UriCliente}`),
        axios.get(`${UriPrestamos}`),
        axios.get(`${UriCuotas}`),
      ]);

      const getClients = clientesRes?.data.data || clientesRes.data;
      const getPrestamos = prestamosRes?.data.data || prestamosRes.data;
      const getCuotas = cuotasRes?.data.data || cuotasRes.data;

      const hoy = dayjs();

      const cuotasVencidas = getCuotas?.filter((item) => {
        const pagada =
          typeof item.pagada === "string"
            ? (item.pagada || '').toLowerCase() === "true"
            : Boolean(item.pagada);

        const estaVencida = dayjs(item.fechapago).isAfter(hoy);

        return !pagada && estaVencida;
      });

      const prestamosIdsConCuotasVencidas = [
        ...new Set(cuotasVencida?.map((cuota) => cuota.idprestamo)),
      ];

      console.log(prestamosIdsConCuotasVencidas);
      const cantidadPrestamosVencidos = prestamosIdsConCuotasVencidas.length;
      const prestamosVencidos = getPrestamos?.filter((prestamo) =>
        prestamosIdsConCuotasVencidas.includes(prestamo.id),
      );

      console.log(
        clientesData.isArray
          ? clientesData.length
          : "clientesData no es un array",
      );
      console.log(
        `Préstamos con cuotas vencidas: ${cantidadPrestamosVencidos}`,
      );

      const prestamosAct = getPrestamos?.filter(
        (prestamos) => prestamos.modo === "activo",
      );

      console.log(prestamosAct.length);
      console.log(getPrestamos.length);
      const pocentPrestAct =
        getPrestamos.length > 0
          ? (Number(prestamosAct.length) / Number(getPrestamos.length)) * 100
          : 0;
      console.log(pocentPrestAct);

      setDataPrestamosActivos(prestamosAct.length);
      setDataPrestamosActivosporcent(Number(safeFixed(pocentPrestAct, 0)));
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalClient = async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    try {
      const res = await axios.get(`${UriCliente}`);
      setTotalCliente(res.data.length);
      console.log(totalCliente);
    } catch (error) {
      console.log("Error al obtener los clientes:", error);
    }
  };

  useEffect(() => {
    getTotalClient();
    getInf();
  }, []);

  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <main className="p-4">
      <div className="row g-4 mb-3">
        {/* Tarjeta 1: Préstamos Activos */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <div className="d-flex align-items-center mb-4">
              <div className="bg-success bg-opacity-10 rounded-circle p-3 d-flex align-items-center justify-content-center">
                <LuUserRoundCheck className="text-success fs-4" />
              </div>
              <div className="ms-3">
                <p className="text-muted small fw-medium mb-0 tracking-tight">
                  Activos
                </p>
                <h2 className="fw-bold mb-0 text-dark">
                  {dataPrestamosActivos}
                </h2>
              </div>
            </div>
            <div className="pt-2">
              <div className="d-flex justify-content-between mb-2">
                <span
                  className="text-muted"
                  style={{ fontSize: "11px", fontWeight: 600 }}
                >
                  CUMPLIMIENTO
                </span>
                <span
                  className="text-success"
                  style={{ fontSize: "11px", fontWeight: 700 }}
                >
                  {dataPrestamosActivosporcent}%
                </span>
              </div>
              <LinearProgress
                variant="determinate"
                value={parseInt(dataPrestamosActivosporcent)}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "#f0f0f0",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 2,
                    backgroundColor: "#2ecc71",
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Préstamos en Atrasos */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <div className="d-flex align-items-center mb-4">
              <div className="bg-danger bg-opacity-10 rounded-circle p-3 d-flex align-items-center justify-content-center">
                <TbUserX className="text-danger fs-4" />
              </div>
              <div className="ms-3">
                <p className="text-muted small fw-medium mb-0 tracking-tight">
                  En Mora
                </p>
                {/* <h2 className="fw-bold mb-0 text-dark">
                  {dataAtrasosCount || 0}
                </h2> */}
              </div>
            </div>
            <div className="pt-2">
              <div className="d-flex justify-content-between mb-2">
                <span
                  className="text-muted"
                  style={{ fontSize: "11px", fontWeight: 600 }}
                >
                  RIESGO
                </span>
                <span
                  className="text-danger"
                  style={{ fontSize: "11px", fontWeight: 700 }}
                >
                  {dataPrestamosActivosporcent}%
                </span>
              </div>
              <LinearProgress
                variant="determinate"
                value={parseInt(dataPrestamosActivosporcent)}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "#f0f0f0",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 2,
                    backgroundColor: "#e74c3c",
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Tarjeta 3: Total Cartera (Estilo Minimal Dark o Light Accent) */}
        <div className="col-md-3">
          <div
            className="card border-0 shadow-sm rounded-4 p-4 h-100"
            style={{
              background: MisColores.cremaArena
            }}
          >
            <p
              className=" text-info small fw-bold text-uppercase mb-1"
              style={{ letterSpacing: "1px" }}
            >
              Total Cartera
            </p>
            <h2 className="text-muted fw-bold mb-4">
              DOP {formatNumber(50700)}
            </h2>

            <div className="mt-auto d-flex align-items-center justify-content-between bg-white bg-opacity-75 p-2 rounded-3 shadow">
              <span className="text-opacity-75 small">
                Préstamos:
              </span>
              <span className="fw-bold text-muted">{formatNumber(4000)}</span>
            </div>
          </div>
        </div>

        {/* Tarjeta 4: Rendimiento Simple */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <p className="text-muted small fw-medium mb-1">
                  Rendimiento Estimado
                </p>
                <h2 className="fw-bold mb-0 text-dark">DOP 12.5K</h2>
              </div>
              <span
                className="badge bg-success-subtle text-success border-0 px-2 py-1 rounded-2"
                style={{ fontSize: "10px" }}
              >
                +12.5%
              </span>
            </div>
            <div className="mt-4 pt-3 border-top border-light">
              <div className="d-flex align-items-center text-muted">
                <small>Proyección al cierre de mes</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    

      <div className="row border shadow-lg  w-100" style={{ height: "500px" }}>
        {isLoading ? (
          <div className="text-center w-full py-10">
            <BeatLoader color="#008080" size={15} className="text-center" />
          </div>
        ) : (
          <MapFront clientes={listaDeClientes} />
        )}
      </div>
      {/* <div className="row p-2 mx-1">
        <div
          className="col-md-6 border shadow-lg overflow-x-scroll d-flex justify-content-center align-items-center"
          style={{ height: "450px", overflowY: "auto" }}
        >
          <table className="table table-striped table-hover table-responsive text-center">
            <div className="text-center">
              <img src={FindPng} alt="" width={100} />
              <p className="text-center clFont">No Existe Datos</p>
              <BeatLoader color="#008080" size={15} className="text-center" />
            </div> *
            <thead className="">
              <tr className="clFont">
                <th scope="col" className="text-muted " style={{fontSize:"0.9em"}}>Id</th>
                <th scope="col" className="text-muted " style={{fontSize:"0.9em"}}>Cliente</th>
                <th scope="col" className="text-muted " style={{fontSize:"0.9em"}}>Monto Capital</th>
                <th scope="col" className="text-muted " style={{fontSize:"0.9em"}}>Fecha Inicio</th>
                <th scope="col" className="text-muted " style={{fontSize:"0.9em"}}>Monto Pagado</th>
                <th scope="col" className="text-muted " style={{fontSize:"0.9em"}}>Cuotas en Atrasos</th>
              </tr>
            </thead>

            <tbody>
                 
              <tr className="clFont">
                 
                                    
                <th scope="row">1</th>
                <td className="text-muted" style={{fontSize:"0.8em"}}>Ismael Santos</td>
                <td className="text-muted" style={{fontSize:"0.8em"}}>DOP 38,000.00</td>
                <td className="text-muted" style={{fontSize:"0.8em"}}>12/12/2024</td>
                <td className="text-muted" style={{fontSize:"0.8em"}}>DOP 27,000.00</td>
                <td className="text-center text-muted" style={{fontSize:"0.8em"}}>5</td>
              </tr>
                  
              
            </tbody>
          </table>
        </div>
        <div className="col-md-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pv" fill="#8884d8" />
              <Bar dataKey="uv" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div> */}

      {/* <div className="charts">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pv" fill="#8884d8" />
            <Bar dataKey="uv" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div> */}
    </main>
  );
};

export default Dashboard;
