import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import TitleTop from "../../components/TitleTop/TItleTop";
import { LuUsers2 } from "react-icons/lu";
import ClienteForm from "./ClienteForm";
import { LiaUserEditSolid } from "react-icons/lia";

function EditCliente() {
  const { id } = useParams();

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <TitleTop
        titulos={"Clientes"}
        subtitulos={"Editando Cliente"}
        btnVisible={false}
        btnLabel={"Refrescar"}
        visibleEstado={false}
        estado="Show"
        icon={
          <LiaUserEditSolid className="fs-1  border-1 rounded-circle p-2 text-info" />
        }
      />
      <div className="bg-light p-4 shadow-lg mt-2">
        <ClienteForm ModoEdicion={true} idCliente={id} open={true} />                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              </div>
    </>
  );
}
export default EditCliente;
