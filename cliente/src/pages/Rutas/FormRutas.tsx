import React, { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import {
  Modal,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { MdOutlineCancel, MdOutlineSaveAlt } from "react-icons/md";
import { SiReacthookform } from "react-icons/si";

export const FormRutas = ({
  ModoEdicion,
  open,
  handleClose,
  initialData,
  idRutas,
}) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ defaultValues: { estado: "" } });

  const [modo, setModo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rutadatos, setRutaData] = useState([]);
  const [cargado, setCargado] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const URI = "http://localhost:8000/zonas/";

  useEffect(() => {

    if (ModoEdicion ===true) {
      reset(initialData);
      setRutaData(initialData);
      console.log(initialData);
    }
  }, [initialData, reset, ModoEdicion]);

  useEffect(() => {
     if (!ModoEdicion) {
      reset()
      console.log(ModoEdicion)      
     }
  }, [ModoEdicion])

  const handleInputChange = (e) => {
    const upperCaseValue = e.target.value.toUpperCase();
    setValue(e.target.name, upperCaseValue, { shouldValidate: true });
  };

  const onSubmit = async (data: FieldValues) => {
    if (ModoEdicion) {
      await axios.put(`http://localhost:8000/zonas/${idRutas}`, data);
      Swal.fire({
        position: "top-end",
        icon: "success",
        html: '<p style="color: gray; font-weight: normal;">Ruta Actualizada</p>',
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      console.log(data)
      const respond = await axios.post(URI, data)
      console.log(respond)
      //await new Promise((resolve) => setTimeout(resolve, 1000));

      Swal.fire({
        position: "center",
        icon: "success",
        html: '<p style="color: gray; font-weight: normal;">Nueva Ruta Guardada</p>',
        showConfirmButton: false,
        timer: 2000,
      });
    }

    reset();
    handleClose();
  };

  const handlKillModal = (event) => {
    handleClose();

    return;
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
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
          width: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 2,
        }}
      >
        <div className="d-flex mx-2 bg-dark bg-opacity-100  p-2 rounded-4">
          <div className="p-2">
            <SiReacthookform className="IconsTitle text-info fs-2" />
          </div>

          <div>
            <h5 className="cFont d-flex lh-1 mb-0 text-white">
              Formulario Rutas
            </h5>
            <p className="d-flex lh- clFont mb-0">
              El Formulario esta en Modo :
              <strong className="text-success">
                {ModoEdicion ? "Editando" : "Insertando"}
              </strong>
            </p>
          </div>
        </div>
        <br />
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            InputProps={{
              sx: {
                fontSize: "12px",
              },
            }}
            label="Nombre de Ruta"
            fullWidth
            margin="normal"
            {...register("nombrerutas", {
              required: "Este campo es obligatorio",
            })}
            onChange={handleInputChange}
            className="clFont form-control"
          />
          {errors.nombrerutas && (
            <p className="text-red-500 clFont">
              {" "}
              {errors.nombrerutas.message}{" "}
            </p>
          )}
          <br />

          <FormControl fullWidth>
            <InputLabel id="estado-label">Estado</InputLabel>
            <Controller
              name="estado"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  labelId="estado-label"
                  label="Estado"
                  {...field} // Conectar el Select con react-hook-form
                  inputProps={{
                    sx: {
                      fontSize: "12px",
                    },
                  }}
                >
                  <MenuItem value="1">Activo</MenuItem>
                  <MenuItem value="0">Inactivo</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          <br />
          <br />
          <div className="d-flex justify-content-center">
            <Button
              type="submit"
              variant="contained"
              sx={{
                ml: 3,
                background: "#0097B2",
                "&:hover": { background: "#59A5B3" },
              }}
            >
              <p className="clFont text-white m-auto text-capitalize">
                {ModoEdicion ? "Guardar Cambios" : "Guardar"}
              </p>
            </Button>
            <Button
              onClick={handlKillModal}
              variant="contained"
              sx={{
                ml: 3,
                background: "#56595C",
                "&:hover": { background: "#3A3D3D" },
              }}
            >
              <p className="clFont text-white m-auto text-capitalize">
                Cancelar
              </p>
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};
