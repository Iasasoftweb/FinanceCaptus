import { format } from "date-fns/format";
import React, { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { BsFiletypeXls } from "react-icons/bs";
import * as XLSX from "xlsx";

const BtnXLSEstilizado = ({ tdata, fileName, tTitulo }) => {
    const [loading, setLoading]=useState(false);
    const [getData, setGetData]= useState([]);
    
    
    const wb = XLSX.utils.book_new();
    
    const titulo = [{A: tTitulo}, {}];
    const informacionAdicional = { A: "probando informacion adicional"};
    
  
    const handleDownload=()=>{
        setLoading(true);
    
       const datosFormateados = tdata.map((datos) => ({
        'Id' : datos.id,
        'fecha' : datos.fecha,
        'DNI' : datos.tcliente.dni,
        'Nombres' : datos.tcliente.nombre_completo,
        'Zonas/Rutas' : datos.tcliente.tbzona.nombrerutas,
        'Armortizacion' : datos.tipoamortizacion,
        'Frecuencia' : datos.frecuencia, 
        'Monto Capital' : datos.capital || 0.00,
        'Monto Interes' : datos.montointeres || 0.00,
        'Monto Mora' : datos.mora || 0.00,
        'Monto Pagado' : datos.montopagado || 0.0,
        'Cuotas' :datos.cuotas || 0,       
       }));
       
      console.log(datosFormateados) 

      const  ws = XLSX.utils.json_to_sheet(datosFormateados);
      const longitudes = [{wch: 5}, {wch:15}, {wch:15}, {wch:30}, {wch:15}, {wch:15}, {wch:10}, {wch:20}, {wch:20}, {wch:20}, {wch:20}, {wch:5}];
      ws['!cols'] = longitudes;
      
      XLSX.utils.book_append_sheet(wb, ws, fileName);
      let num = Math.random();
      const FileName = fileName+'-'+format(new Date(), 'dd-MM-yyyy')+'-'+num.toFixed(1)+'.xlsx'
    
    // const dataFinal = [...titulo, ...tabla, informacionAdicional];

    setTimeout(() => {
       XLSX.writeFile(wb, FileName);
      setLoading(false);
    }, 1000);
  };


      

    

     
  return (
    <div>
     {!loading ? (
            <div className="BottonExport_XLS" onClick={handleDownload}>
              <BsFiletypeXls className="mx-2 fs-4" />
              <span>Excel Default</span>
            </div>
          ) : (
            <div className="BottonExport_XLS" onClick={handleDownload}>
              <BsFiletypeXls className="mx-2 fs-4" />
    
              <Spinner size="sm" className="mx-2">
                {" "}
                ....{" "}
              </Spinner>
              <span>Excel Default</span>
            </div>
          )}
    </div>
  );
};

export default BtnXLSEstilizado;