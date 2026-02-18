import React from "react";
import { useNavigate } from "react-router-dom";
import TitleTop from "../../components/TitleTop/TItleTop";
import { LuUsers2 } from "react-icons/lu";
import ClienteForm from "./ClienteForm";
import { PiUserPlus } from "react-icons/pi";


function CreateCliente() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <TitleTop
        titulos={"Clientes"}
        subtitulos={"Creando Nuevo Cliente"}
        btnVisible={false}
        btnLabel={"Refrescar"}
        visibleEstado={false}
        estado="Show"
        icon={
          <PiUserPlus className="fs-1  border-1 rounded-circle p-2 text-info" />
        }
      />
      <div className="bg-light p-4 shadow-lg mt-2">
        <ClienteForm ModoEdicion={false} idCliente={0} />
      </div>
    </>
  );
}
export default CreateCliente;
