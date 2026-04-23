import { Box, MenuItem, Modal, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FieldValues, useForm, Controller } from "react-hook-form";
import axios from "axios";
import dataEstado from "../../data/Apis/dataEstado.json";
import { Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { Building, User, User2, UserRoundX, X } from "lucide-react";
import { MisColores } from "../../components/stuff/MisColores";

function DisableUser({ Id, open, dataInitial, handleClose, onSave }) {
  const [getUsuario, setGetUser] = useState([]);
  const [estado, setEstado] = useState(0);

  const UriUser = "http://localhost:5000/usuarios/";
  const getUser = async () => {
    try {
      await axios.get(`${UriUser}${Id}`).then((response) => {
        setGetUser(response.data);
        console.log(response.data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm({ defaultValues: { estado: "1" } });

  const closeModal = () => {
    handleClose();
  };

  const handleEstado =(e)=>{
    const realEstado = e.target.value === 'HABILITADO' ? 1 : 0
    setEstado(realEstado)
  }

  useEffect(() => {
    getUser();
    reset(dataInitial);
    setValue("estado", "HABILITADO");
  }, [setValue]);
  const MuestrToast = () => {
    toast.success("Credenciales correctas");
  };
  const onSubmit = async (data: FieldValues) => {

const result = await Swal.fire({
    title: "¿Está seguro de deshabilitarlo?",
    text: "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, deshabilítalo!",
    cancelButtonText: "Cancelar"
  });

  if (result.isConfirmed) {
    try {
      // ✅ Creamos una copia de los datos y forzamos el estado a 0 (deshabilitado)
      
      const dataUpdate = { 
        ...data, 
        estado: estado
      };

      await axios.put(`${UriUser}${Id}`, dataUpdate);

      await Swal.fire({
        title: "¡Deshabilitado!",
        text: "El usuario ha sido deshabilitado correctamente.",
        icon: "success",
      });

      // Es recomendable refrescar la lista de usuarios aquí antes de cerrar
      // updateList(); 
      closeModal();
      onSave();

    } catch (error) {
      console.error("Error al deshabilitar:", error);
      Swal.fire({
        title: "¡Error!",
        text: "Hubo un problema al deshabilitar el usuario.",
        icon: "error",
      });
    }
  }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        style={{ zIndex: 1200 }}
        BackdropProps={{
          timeout: 500, // Duración de la transición del backdrop
          onClick: (event) => {
            event.stopPropagation(); // Evitar que el clic cierre el modal (si lo deseas)
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
          }}
        >
          <div className="card-header border-bottom bg-white p-4 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <div
                className="p-2 rounded-3 text-white d-flex align-items-center justify-content-center shadow-sm"
                style={{
                  backgroundColor: MisColores.headerBlue,
                  width: "45px",
                  height: "45px",
                }}
              >
                <UserRoundX size={20} />
              </div>
              <div>
                <h4
                  className="fw-bold mb-0"
                  style={{ color: "#2c3e50", fontSize: "1rem" }}
                >
                  Deshabilitar Usuario
                </h4>
                <p className="text-muted mb-0 small">
                  Usuario :
                  <strong className="" style={{ color: MisColores.headerBlue }}>
                    {dataInitial.nombreusuario}
                  </strong>
                </p>
              </div>
            </div>
            <button className="btn btn-light rounded-circle p-2 text-secondary hover:bg-danger hover:text-white transition-all">
              <X size={20} onClick={closeModal} />
            </button>
          </div>

          

          <p className="clFont fw-bold text-dark text-uppercase border-start border-3 border-warning ps-3 py-2 bg-warning bg-opacity-10 rounded-1">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            !! Precaución !!
          </p>

          <p className="clFont">
            Esta acción deshabilitará por completo al usuario, todas las
            operaciones realizada por este, pasarán a Audiotira Interna del
            sistema.
          </p>

          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <select
              id=""
              {...register("estado")}
              className="clFont form-select"
              onChange={handleEstado}
            >
              {dataEstado.map((items) => (
                <option key={items.id} value={items.estado} className="clFont">
                  {items.estado}
                </option>
              ))}
            </select>
           
            <div className="text-center">
              <Button type="submit" className="clFont mt-4 w-100 text-white" style={{backgroundColor : MisColores.headerBlue}}>
                {" "}
                Procesar{" "}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
      <ToastContainer />
    </>
  );
}

export default DisableUser;
