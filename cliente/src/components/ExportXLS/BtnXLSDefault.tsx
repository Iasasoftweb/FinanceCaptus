import { format } from "date-fns/format";
import React, { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { BsFiletypeXls } from "react-icons/bs";
import * as XLSX from "xlsx";

const BtnXlsDefault = ({ tarray, fileName }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);

    const libro = XLSX.utils.book_new();
    const hoja = XLSX.utils.json_to_sheet(tarray);
    let num = Math.random();
    XLSX.utils.book_append_sheet(libro, hoja, "tarray");
    const FileName = fileName+'-'+format(new Date(), 'dd-MM-yyyy')+'-'+num.toFixed(1)+'.xlsx'
    setTimeout(() => {
      XLSX.writeFile(libro, FileName);
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

export default BtnXlsDefault;
