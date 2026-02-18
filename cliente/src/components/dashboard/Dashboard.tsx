import React, { useRef } from "react";
import { useState, useEffect } from "react";

import { PiPiggyBank, PiUsersThreeThin } from "react-icons/pi";

import "./DashStyle.css";
import axios from "axios";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import formatNumber from "../misc/formattedNumber";
import { GiTakeMyMoney } from "react-icons/gi";
import FindPng from "../../assets/img/nodata.png";
import BeatLoader from "react-spinners/BeatLoader";
import { LuUserRoundCheck } from "react-icons/lu";
import { TbUserX } from "react-icons/tb";
import dayjs from "dayjs";

function Dashboard() {
  const [totalCliente, setTotalCliente] = useState(0);
  const hasFetched = useRef(false);
  const [dataCliente, setDataCliente] = useState([]);
  const [dataPrestamosActivos, setDataPrestamosActivos] = useState([]);
  const [dataPrestamosActivosporcent, setDataPrestamosActivosporcent] =useState(0);

  const UriCliente = "http://localhost:8000/clientes/";
  const UriPrestamos = "http://localhost:8000/prestamos/";
  const UriCuotas = "http://localhost:8000/cuotas/"
  const getInf = async () => {
    try {
      const [clientesRes, prestamosRes, cuotasRes] = await Promise.all([
        axios.get(`${UriCliente}`),
        axios.get(`${UriPrestamos}`),
        axios.get(`${UriCuotas}`),
      ]);

      const getClientes = clientesRes?.data.data || clientesRes.data;
      const getPrestamos = prestamosRes?.data.data || prestamosRes.data;
      const getCuotas = cuotasRes?.data.data || cuotasRes.data;
      

      const hoy = dayjs();

      
        const cuotasVencidas = getCuotas.filter((item) => {
              const pagada =
                typeof item.pagada === "string"
                  ? item.pagada.toLowerCase() === "true"
                  : Boolean(item.pagada);
      
              const estaVencida = dayjs(item.fechapago).isAfter(hoy);
      
              return !pagada && estaVencida;
            });
            
     
      
      const prestamosIdsConCuotasVencidas = [...new Set(
        cuotasVencidas.map(cuota => cuota.idprestamo)
      )];
      

      console.log(prestamosIdsConCuotasVencidas)
    const cantidadPrestamosVencidos = prestamosIdsConCuotasVencidas.length;
    const prestamosVencidos = getPrestamos.filter(prestamo => 
      prestamosIdsConCuotasVencidas.includes(prestamo.id)
    );


    console.log(`Préstamos con cuotas vencidas: ${cantidadPrestamosVencidos}`);

      console.log(getClientes);

      const prestamosAct = getPrestamos.filter(
        (prestamos) => prestamos.modo === "activo"
      );

      console.log(prestamosAct.length);
      console.log(getPrestamos.length);
      const pocentPrestAct =
        getPrestamos.length > 0
          ? (Number(prestamosAct.length) / Number(getPrestamos.length) ) * 100
          : 0;
      console.log(pocentPrestAct);

      setDataPrestamosActivos(prestamosAct.length);
      setDataPrestamosActivosporcent(pocentPrestAct.toFixed(0))

     
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
      <div className="row">
        <div className="col-md-3 my-2">
          <div className="border p-3 shadow-lg border-opacity-25 rounded-4 w-100 mx-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="mx-3">
                <p className="text-muted fw-medium text-center mb-0 fs-1">
                  {dataPrestamosActivos}
                </p>
              </div>
              <span className="">
                <LuUserRoundCheck
                  className="text-danger"
                  style={{ fontSize: "40px" }}
                />
              </span>
            </div>

            <div className=" d-flex justify-content-between">
              <span className=" lh-0" style={{ fontSize: "0.9em" }}>
                Prestamos Activos
              </span>

              <span className=" lh-0" style={{ fontSize: "0.9em" }}>
                {dataPrestamosActivosporcent}%
              </span>
            </div>

            <LinearProgress
              variant="determinate"
              value={dataPrestamosActivosporcent}
              color="success"
              className="mb-2"
            />
          </div>
        </div>
        <div className="col-md-3 my-2">
        <div className="border p-3 shadow-lg border-opacity-25 rounded-4 w-100 mx-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="mx-3">
                <p className="text-muted fw-medium text-center mb-0 fs-1">
                  {dataPrestamosActivos}
                </p>
              </div>
              <span className="">
                <TbUserX 
                  className="text-danger"
                  style={{ fontSize: "40px" }}
                />
              </span>
            </div>

            <div className=" d-flex justify-content-between">
              <span className=" lh-0" style={{ fontSize: "0.9em" }}>
                Prestamos en Atrasos
              </span>

              <span className=" lh-0" style={{ fontSize: "0.9em" }}>
                {dataPrestamosActivosporcent}%
              </span>
            </div>

            <LinearProgress
              variant="determinate"
              value={dataPrestamosActivosporcent}
              color="primary"
              className="mb-2"
            />
          </div>
        </div>
        <div className="col-md-3 my-2">
          <div className="border p-2 shadow-lg border-opacity-25 rounded-4 w-100 mx-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="">
                <GiTakeMyMoney className="fs-1 text-primary" />
              </span>
              <div className="">
                <p className="text-muted mb-0" style={{ fontSize: "0.8em" }}>
                  Total Prestamos
                </p>
                <p className="text-muted text-center mb-0 fs-2">
                  {formatNumber(4000)}
                </p>
              </div>
            </div>
            <hr className="m-0 p-1" />
            <p className="text-muted" style={{ fontSize: "0.8em" }}>
              Total Capital : <strong>DOP {formatNumber(50700)}</strong>
            </p>
          </div>
        </div>
        <div className="col-md-3 my-2">
          <div className="border p-2 shadow-lg border-opacity-25 rounded-4 w-100 mx-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="">
                <GiTakeMyMoney className="fs-1 text-primary" />
              </span>
              <div className="">
                <p className="text-muted mb-0" style={{ fontSize: "0.8em" }}>
                  Total Prestamos
                </p>
                <p className="text-muted text-center mb-0 fs-2">
                  {formatNumber(4000)}
                </p>
              </div>
            </div>
            <hr className="m-0 p-1" />
            <p className="text-muted" style={{ fontSize: "0.8em" }}>
              Total Capital : <strong>DOP {formatNumber(50700)}</strong>
            </p>
          </div>
        </div>

        {/* <div className="border p-2 shadow-lg border-opacity-25 rounded-4 w-100 mx-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="">
                <GiTakeMyMoney className="fs-1 text-primary" />
              </span>
              <div className="">
                <p className="text-muted mb-0" style={{ fontSize: "0.8em" }}>
                  Total Prestamos
                </p>
                <p className="text-muted text-center mb-0 fs-2">
                  {formatNumber(4000)}
                </p>
              </div>
            </div>
            <hr className="m-0 p-1" />
            <p className="text-muted" style={{ fontSize: "0.8em" }}>
              Total Capital : <strong>DOP {formatNumber(50700)}</strong>
            </p>
          </div> */}
      </div>

      <div className="row p-2 mx-1">
        <div
          className="col-md-6 border shadow-lg overflow-x-scroll d-flex justify-content-center align-items-center"
          style={{ height: "450px", overflowY: "auto" }}
        >
          <table className="table table-striped table-hover table-responsive text-center">
            <div className="text-center">
              <img src={FindPng} alt="" width={100} />
              <p className="text-center clFont">No Existe Datos</p>
              <BeatLoader color="#008080" size={15} className="text-center" />
            </div>
            {/* <thead className="">
              <tr className="clFont">
                <th scope="col" className="text-muted " style={{fontSize:"0.9em"}}>Id</th>
                <th scope="col" className="text-muted " style={{fontSize:"0.9em"}}>Cliente</th>
                <th scope="col" className="text-muted " style={{fontSize:"0.9em"}}>Monto Capital</th>
                <th scope="col" className="text-muted " style={{fontSize:"0.9em"}}>Fecha Inicio</th>
                <th scope="col" className="text-muted " style={{fontSize:"0.9em"}}>Monto Pagado</th>
                <th scope="col" className="text-muted " style={{fontSize:"0.9em"}}>Cuotas en Atrasos</th>
              </tr>
            </thead> */}

            {/* <tbody>
                 
              <tr className="clFont">
                 
                                    
                <th scope="row">1</th>
                <td className="text-muted" style={{fontSize:"0.8em"}}>Ismael Santos</td>
                <td className="text-muted" style={{fontSize:"0.8em"}}>DOP 38,000.00</td>
                <td className="text-muted" style={{fontSize:"0.8em"}}>12/12/2024</td>
                <td className="text-muted" style={{fontSize:"0.8em"}}>DOP 27,000.00</td>
                <td className="text-center text-muted" style={{fontSize:"0.8em"}}>5</td>
              </tr>
                  
              
            </tbody> */}
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
      </div>

      <div className="charts">
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
      </div>
    </main>
  );
}

export default Dashboard;
