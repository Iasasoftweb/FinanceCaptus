import React, { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import {
  Modal,
  Box,
  TextField,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { Briefcase, Building, HandCoins, X } from "lucide-react";
import { MisColores } from "../../components/stuff/MisColores";
import { InputField } from "../../components/stuff/InputField";

interface ModalProps {
  open: boolean; // <--- AGREGAR ESTO
  updateList: () => Promise<void>;
  idCompany: number | null;
  ModoEdicion: boolean;
  handleClose: () => void;
  initialData: any; // Cambiado de [] a any para evitar conflictos de tipo
}

export const FormCompany = ({ open,updateList, idCompany, ModoEdicion, handleClose, initialData }: ModalProps) => {
 
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ defaultValues: { estado: "S" } });

  
  const [companydatos, setCompanyData] = useState<any[]>([]);
  
  const URI = "http://localhost:5000/Company/";

  useEffect(() => {
    if (ModoEdicion === true) {
      reset(initialData);
      setCompanyData(initialData);
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
    try {
      if (ModoEdicion) {
        // 1. Enviamos la actualización al servidor
        const response = await axios.put(
          `http://localhost:5000/Company/${idCompany}`,
          data,
        );

        // 2. ACTUALIZACIÓN DEL ESTADO (Esto es lo que falta)

        if (response.status === 200) {
          setCompanyData((prev: any[]) =>
            prev.map((item) =>
              item.id === idCompany
                ? { ...item, ...data, activo: parseInt(data.activo) }
                : item,
            ),
          );
        }

        Swal.fire({
          position: "center",
          icon: "success",
          html: '<p style="color: gray; font-weight: normal;">Compañía Actualizada</p>',
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        // Para el POST (Crear nueva)
        const respond = await axios.post(URI, data);

        setCompanyData((prev) => [...prev, respond.data]);

        Swal.fire({
          position: "center",
          icon: "success",
          html: '<p style="color: gray; font-weight: normal;">Nueva Compañía Guardada</p>',
          showConfirmButton: false,
          timer: 2000,
        });
      }
      await  updateList();
      reset();
      handleClose();
    } catch (error) {
      console.error("Error en la petición:", error);
      Swal.fire("Error", "No se pudo procesar la solicitud", "error");
    }
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
              <Building size={20} />
            </div>
            <div>
              <h2
                className="fw-bold mb-0"
                style={{ color: "#2c3e50", fontSize: "1.5rem" }}
              >
                Campañias
              </h2>
              <p className="text-muted mb-0 small">
                El Formulario esta en Modo :
                <strong className="text-mute">
                  {ModoEdicion ? "Editando" : "Insertando"}
                </strong>
              </p>
            </div>
          </div>
          <button
            className="btn btn-light rounded-circle p-2 text-secondary hover:bg-danger hover:text-white transition-all"
            onClick={handleClose}
          >
            <X size={20} />
          </button>
        </div>


        

        <br />
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            InputProps={{
              sx: {
                fontSize: "12px",
              },
            }}
            label="Nombre de Compañia"
            fullWidth
            margin="normal"
            {...register("company", {
              required: "Este campo es obligatorio",
            })}
            onChange={handleInputChange}
            className="clFont form-control"
          />
          {errors.company && (
            <p className="text-red-500 clFont"> {errors.company.message} </p>
          )}
          <br />

          <TextField
            InputProps={{
              sx: {
                fontSize: "12px",
              },
            }}
            label="Nombre del Contacto"
            fullWidth
            margin="normal"
            {...register("nombrecontacto")}
            onChange={handleInputChange}
            className="clFont form-control"
          />

          <br />

          <TextField
            InputProps={{
              sx: {
                fontSize: "12px",
              },
            }}
            label="Número de Teléfono"
            fullWidth
            margin="normal"
            {...register("telefono")}
            onChange={handleInputChange}
            className="clFont form-control"
          />

          <br />

        
            <InputField
              label="Estado"
              icon={Briefcase}
              required
              col="col-md-12"
            >
              <select
                name="activo"
                className="form-select border-0 shadow-none"
                style={{
                  fontSize: "0.8em",
                 
                }}
                {...register("activo")}
              >
                <option value="1">Activo </option>
                <option value="0">Inactivo </option>
              </select>
            </InputField>
          

          <br />
          <br />
          <div className="d-flex justify-content-center ">
            <button
              type="submit"
              className="btn"
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
              <p className="clFont m-auto text-capitalize text-mute p-2">
                Cancelar
              </p>
            </button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};
