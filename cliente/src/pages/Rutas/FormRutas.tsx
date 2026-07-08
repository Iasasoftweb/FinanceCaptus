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
import { MisColores } from "../../components/stuff/MisColores";
import { Briefcase, CircleFadingPlus, MapPin, X } from "lucide-react";
import { InputField } from "../../components/stuff/InputField";

export const FormRutas = ({
  ModoEdicion,
  open,
  handleClose,
  initialData,
  idRutas,
  updateList,
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

  const URI = `${import.meta.env.VITE_API_URL}/zonas/`;

  useEffect(() => {
    if (ModoEdicion === true) {
      reset(initialData);
      setRutaData(initialData);
      console.log(initialData);
    }
  }, [initialData, reset, ModoEdicion]);

  useEffect(() => {
    if (!ModoEdicion) {
      reset();
      console.log(ModoEdicion);
    }
  }, [ModoEdicion]);

  const handleInputChange = (e) => {
    const upperCaseValue = e.target.value.toUpperCase();
    setValue(e.target.name, upperCaseValue, { shouldValidate: true });
  };

  const onSubmit = async (data: FieldValues) => {
    if (ModoEdicion) {
      await axios.put(`${import.meta.env.VITE_API_URL}/zonas/${idRutas}`, data);
      Swal.fire({
        position: "top-end",
        icon: "success",
        html: '<p style="color: gray; font-weight: normal;">Ruta Actualizada</p>',
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      console.log(data);
      const respond = await axios.post(URI, data);
      console.log(respond);
      //await new Promise((resolve) => setTimeout(resolve, 1000));

      Swal.fire({
        position: "center",
        icon: "success",
        html: '<p style="color: gray; font-weight: normal;">Nueva Ruta Guardada</p>',
        showConfirmButton: false,
        timer: 2000,
      });
    }
    await updateList();
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
              <MapPin size={20} />
            </div>
            <div>
              <h5
                className="fw-bold mb-0"
                style={{ color: "#2c3e50" }}
              >
                Formulario Rutas
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: "0.7rem" }}>
                Mantenimiento de Rutas{" "}
                <strong className="text-success">
                  {ModoEdicion ? "Editando" : "Insertando"}
                </strong>
              </p>
            </div>
          </div>
          <button
            className="btn btn-light rounded-circle p-2 text-secondary hover:bg-danger hover:text-white transition-all"
            // onClick={handleClose}
          >
            <X size={20} onClick={handleClose} />
          </button>
        </div>

        <br />
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField label="Nombre de Ruta" icon={MapPin} col="col-md-12" error={errors.nombrerutas?.message}>
             <input
              type="text"
              className="form-control clFont"
              {...register("nombrerutas", {
                required: "Este campo es obligatorio",
              })}
              onChange={handleInputChange}
            />
          </InputField>

          
             <InputField
              label="Estado"
              icon={CircleFadingPlus}
              
              required
              col="col-md-12"
            >
              <select
                name="estado"
                className="form-select border-0 shadow-none"
                style={{
                  fontSize: "0.8em",
                 
                }}
                {...register("estado")}
              >
                <option value="1">Activo </option>
                <option value="0">Inactivo </option>
              </select>
            </InputField>
          

          

          <br />
          <br />
          <div className="d-flex justify-content-center">
            <button
              type="submit"
              className="btn mx-3"
              style={{ backgroundColor: MisColores.headerBlue }}
            >
              <p className="clFont text-white m-auto text-capitalize">
                {ModoEdicion ? "Guardar Cambios" : "Guardar"}
              </p>
            </button>
            <button
              onClick={handlKillModal}
              style={{ backgroundColor: MisColores.bgGray }}
              className="mx-2 btn rounded-2 border-dark-subtle"
            >
              <p className="clFont text-muted m-auto text-capitalize">
                Cancelar
              </p>
            </button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};
