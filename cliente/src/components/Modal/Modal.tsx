import React from "react";
import "./Modal.css";
import ClienteForm from "../../pages/Clientes/ClienteForm";
import { LiaWpforms } from "react-icons/lia";

const Modal = ({ closeModal,  ModoEdicion, id}) => {
//  console.log(ModoEdicion)
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="d-flex mx-2">
          <div className="">
            <LiaWpforms className="IconsTitle text-primary-emphasis" />
          </div>

          <div>
            <h5 className="cFont d-flex lh-1 mb-0 text-danger-emphasis">
              Formulario Clientes
            </h5>
            <p className="d-flex lh- clFont mb-0">El Formulario esta en Modo  :  
             <strong className="text-danger">{ModoEdicion? "Editando" : "Insertando"}</strong></p>
            
          </div>
        </div>

        <hr className="lh-1" />
        <ClienteForm estado={false} closeModal={closeModal}  ModoEdicion ={ModoEdicion} idCliente={id} />
      </div>
    </div>
  );
};

export default Modal;
