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
import { MisColores } from "../../components/stuff/MisColores";
import { UserRoundX, X } from "lucide-react";

function Updatepass({ Id, open, dataInitial, handleClose, onSave }) {
  const [getUsuario, setGetUser] = useState([]);
  const [pass, setPass] = useState("");
  const [confirmarPass, setConfirmarPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValidate, setIsValidate] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const UriUser = "http://localhost:5000/usuarios/";
  const UriUpdate = "http://localhost:5000/usuarios/credential/";
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
        onSave();
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
                            Cambio de Contraseña
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
              <Button type="submit" className="clFont mt-4 w-100 text-white" style={{backgroundColor: MisColores.headerBlue}}>
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
