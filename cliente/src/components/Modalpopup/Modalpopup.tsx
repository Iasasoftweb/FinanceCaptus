import React, { useState, useEffect } from "react";
import "./Modalpopup.css";
import { LiaWpforms } from "react-icons/lia";
import { IoImageOutline } from "react-icons/io5";
import Input from "@mui/material/Input";
import { useForm } from "react-hook-form";
import axios from "axios";
import { GiConsoleController } from "react-icons/gi";

const Modalpopup = ({ closeModal, ModoEdicion, id, tipo }) => {
  const [file, setFile] = useState();
  const [getCliente, setGetCliente] = useState([]);
  const upload = () => {
    console.log(file);
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };
 
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    getValues,
  } = useForm();

  useEffect(() => {
    if (!ModoEdicion) {
      axios
        .get(`http://localhost:8000/clientes/${id}`)
        .then((response) => {
          setGetCliente(response.data);
          reset(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
      console.log(getCliente);
    }
  }, [ModoEdicion]);

  return (
    <div className="modal-backdrop1">
      <div className="modal-content1">
        <div className="d-flex mx-2">
          <div className=" m-auto">
            <h6 className="cFont lh-1 mb-0 text-danger-emphasis text-center">
              {tipo ? "Capturar Documento DNI" : "Capturar Foto Cliente"}
            </h6>
          </div>

          <hr className="lh-1" />
        </div>

        <div>
          <hr />

          <div className="">
            <div className=" border-1 border-dark-subtle hl-100 p-2 m-2 rounded-3">
              <IoImageOutline className="fs-1 text-black-50" />
            </div>
          </div>

          <hr />
          <div>
            <form action="">
              <input className="clFont" type="file" id="file-upload" />
            </form>

            <button
              className=" btn btn-success clFont text-white mx-2"
              onClick={upload}
            >
              Subir Imagen
            </button>
            <button className=" btn btn-danger clFont text-white mx-2">
              Eliminar Imagen
            </button>
          </div>

          <button
            className="mt-2 btn btn-primary clFont text-white"
            onClick={closeModal}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modalpopup;
