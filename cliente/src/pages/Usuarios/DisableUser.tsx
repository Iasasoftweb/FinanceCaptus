import { Box, MenuItem, Modal, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LiaUserEditSolid } from "react-icons/lia";
import { FieldValues, useForm, Controller } from "react-hook-form";
import axios from "axios";
import dataEstado from "../../data/Apis/dataEstado.json";
import { Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";

function DisableUser({ Id, open, dataInitial, handleClose }) {
  const [getUsuario, setGetUser] = useState([]);

  const UriUser = "http://localhost:8000/usuarios/";
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
  } = useForm({ defaultValues: { estado: "HABILITADO" } });

  const closeModal = () => {
    handleClose();
  };

  useEffect(() => {
    getUser();
    reset(dataInitial);
    setValue("estado", "HABILITADO");
  }, [setValue]);
  const MuestrToast = () => {
    toast.success("Credenciales correctas");

  };
  const onSubmit = async (data: FieldValues) => {
   
     
      Swal.fire({
        title: "Esta seguro de deshabilitarlo?",
        text: "No prodras revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, deshabilitalo!",
      }).then( 
        async (result) => {
            if (result.isConfirmed) {
              try {
                await axios.put(`${UriUser}${Id}`, data);
               
                Swal.fire({
                  title: "Deshabilitado!",
                  text: "Usuario ha sido deshabilitado",
                  icon: "success",
                });
                closeModal();
              } catch (error) {
                Swal.fire({
                  title: "Error!",
                  text: "Hubo un problema al deshabilitar usuario.",
                  icon: "error",
                });
              }
            }
          }
        
    //     try {
    //     await axios.put(`${UriUser}${Id}`, data);
    //     Swal.fire({
    //         title: "Eliminado!",
    //         text: "Registro ha sigo eliminado",
    //         icon: "success",
    //       });
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("Error al actualizar los datos");
    //       }
    // 
    )
    
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
          <div className="d-flex p-2  justify-content-between align-items-center">
            <div className="p-2">
              <div className="d-flex justify-content-between">
                <div>
                  <LiaUserEditSolid className="IconsTitle text-info fs-1" />
                </div>
                <div>
                  <h5 className="cFont d-flex lh-2 mb-0 text-black">
                    Deshabilitar Usuario
                  </h5>

                  <p className="d-flex clFont mb-0 text-black-50">
                    Usuario :
                    <strong className="text-danger">
                      {dataInitial.nombreusuario}
                    </strong>
                  </p>
                </div>
              </div>
            </div>
            <div>
              <IoIosCloseCircleOutline
                className="text-black-50 fs-3"
                onClick={closeModal}
              />
            </div>
          </div>
          <hr />
          <p className="clFont fw-bold text-bg-secondary text-center text-warning p-1 rounded-4 link-offset-1-hover">
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
            >
              {dataEstado.map((items) => (
                <option key={items.id} value={items.estado} className="clFont">
                  {items.estado}
                </option>
              ))}
            </select>
            {/* <TextField
              select
              {...register("estado")}
              label="Estado"
              
              className="clFont"
              variant="outlined"
              fullWidth
            >
              {dataEstado.map((items) => (
                <MenuItem
                 
                  value={items.estado}
                  className="clFont"
                >
                  {" "}
                  {items.estado}{" "}
                </MenuItem>
              ))}
            </TextField> */}
            <div className="text-center">
              <Button
                type="submit"
                className= "clFont mt-4 w-100"
                
              >
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
