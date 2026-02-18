import {
  Box,
  IconButton,
  InputAdornment,
  MenuItem,
  Modal,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LiaUserEditSolid, LiaUserLockSolid } from "react-icons/lia";
import { FieldValues, useForm, Controller } from "react-hook-form";
import axios from "axios";
import dataEstado from "../../data/Apis/dataEstado.json";
import { Button } from "react-bootstrap";
import { TbPasswordUser } from "react-icons/tb";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../index.css";
import Swal from "sweetalert2";

function Updatepass({ Id, open, dataInitial, handleClose }) {
  const [getUsuario, setGetUser] = useState([]);
  const [pass, setPass] = useState("");
  const [confirmarPass, setConfirmarPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValidate, setIsValidate] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const UriUser = "http://localhost:8000/usuarios/";
  const UriUpdate = "http://localhost:8000/usuarios/credential/";
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
  } = useForm();

  const closeModal = () => {
    handleClose();
  };

  useEffect(() => {
    getUser();
    reset(dataInitial);
  }, []);

  const validatePass = () => {
    if (pass.length < 5) {
      toast.error("Las contraseña no debe ser menos de 4 caracteres");
      setIsValidate(false);
      return false;
    }

    if (pass !== confirmarPass) {
      toast.error("Las contraseñas no coinciden");
      return false;
    }
    return true
  };

  const onSubmit = async (data: FieldValues) => {
   
    const isPassValid = validatePass()
    
    if (isPassValid) {
      try {
        const NewPass = {
          ...data,
          pass: pass,
        };
        await axios.put(`${UriUpdate}${Id}`, NewPass);
        Swal.fire({
          title: "Actualizando!",
          text: "Password Actualizado",
          icon: "success",
        });
        closeModal();
      } catch (error) {
        console.error(error);
      }
    } else {
      toast.error("Error al actualizar el password");
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
          <div className="d-flex p-2  justify-content-between align-items-center">
            <div className="p-2">
              <div className="d-flex justify-content-between">
                <div>
                  <LiaUserLockSolid className="IconsTitle text-info fs-1" />
                </div>
                <div>
                  <h5 className="cFont d-flex lh-2 mb-0 text-black">
                    Cambio de Contraseña
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

          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              name="pass"
              fullWidth
              variant="outlined"
              label="Introduzca la Nueva Contraseña"
              className="clFont mt-4"
              type={showPassword ? "text" : "password"}
              onChange={(e) => setPass(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <LuEye /> : <LuEyeOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              //     {...register('pass')}
              fullWidth
              name="confirmarpass"
              margin="normal"
              variant="outlined"
              label="Confirmar Contraseña"
              className="clFont mt-4"
              type="password"
              onChange={(e) => setConfirmarPass(e.target.value)}
            />

            <div className="text-center">
              <Button type="submit" className="clFont mt-4 w-100">
                {" "}
                Procesar{" "}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default Updatepass;
