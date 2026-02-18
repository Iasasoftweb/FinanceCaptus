import React, { useEffect, useState } from "react";
import "../../components/Modalpopup/Modalpopup.css";
import Swal from "sweetalert2";
import {
  Box,
  MenuItem,
  Modal,
  TextField,
  Button,
  Chip,
  Avatar,
} from "@mui/material";
import { IoIosCloseCircleOutline } from "react-icons/io";
import axios from "axios";
import { FieldValues, useForm, Controller } from "react-hook-form";
import { Theme, styled } from "@mui/material/styles";
import { LiaUserEditSolid } from "react-icons/lia";
import { PiUserPlusThin } from "react-icons/pi";
import Select from "react-select";
import { TiCloudStorageOutline } from "react-icons/ti";
import FileViewer from "../../components/general/FilePreview";
import { CiFileOff } from "react-icons/ci";
import { toast, ToastContainer } from "react-toastify";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

function ModalUsuario({ Id, open, dataInitial, handleClose, edit, onSave }) {
  const [getUser, setGetUser] = useState([]);
  const [isDisable, setIsDisable] = useState(false);
  const [dataRol, getDataRol] = useState([]);
  const [dataZonas, getDataZonas] = useState([]);
  const [dataTipo, getDataTipo] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const vTipo = 4;
  const [selectedRutas, setSelectedRutas] = useState([]);
  const [idRole, setIdRole] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [filet, setFile] = useState([]);
  const [vSupervisor, setVsupervisor] = useState("");
  const [vRole, setVRole] = useState("");

  const myData = edit ? dataInitial : "";
  const UriUser = "http://localhost:8000/usuarios/";
  const UriRol = "http://localhost:8000/roles/";
  const UriRutas = "http://localhost:8000/zonas/";
  const UriTipo = "http://localhost:8000/usuarios/tipo/";
  const UriImg = "http://localhost:8000/uploadusers/";
  const UrisImgDelete = "http://localhost:8000/usuarios/deleteimg/";

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm({ defaultValues: { zonas: [], estado: "HABILITADO" } });

  const cargaNameImg = (newName) => {
    setValue("avata", newName);
  };

  const delImg = async (img: string) => {
    console.log(img);
    try {
      await axios.delete(`${UrisImgDelete}${img}`);
      console.log(" Imagen Elimnada :" + img);
    } catch (error) {
      console.error("No se pudo eliminar el archivos");
    }
  };

  const upImg = async (fileOriginal) => {
    console.log(filet);

    if (filet) {
      delImg(filet);
      console.log(filet);
    }

    const formatdata = new FormData();
    formatdata.append("avata", fileOriginal);
    console.log(fileOriginal);
    try {
      const res = await axios.post(
        "http://localhost:8000/uploaduser/",
        formatdata
      );
      console.log(res.data.fileName);
      cargaNameImg(res.data.fileName);
      setSelectedFileId(res.data.fileName);
    } catch (err) {
      console.log(err);
      setSelectedFileId(null);
    }
  };

  const closeModal = () => {
    handleClose();
    reset();
  };

  const findAvata = (obj, path = "") => {
    for (let key in obj) {
      if (key === "avata") {
        console.log(`'avata' encontrado en la ruta: ${path}${key}`);
        console.log("Valor de avata:", obj[key]);
        return obj[key];
      }
      // Si el valor es un objeto, llamamos a la función recursivamente
      if (typeof obj[key] === "object" && obj[key] !== null) {
        findAvata(obj[key], `${path}${key}.`);
      }
    }
    return null;
  };

  const getData = async () => {
    try {
      const respuesta = await axios.get(`${UriUser}${Id}`);
      setGetUser(respuesta.data);
      setFile(respuesta.data[0].avata);
      setVsupervisor(respuesta.data[0].idsupervisor);
      setVRole(respuesta.data[0].idrole);
      

      if ("avata" in respuesta.data) {
        console.log("Campo 'avata' encontrado:", respuesta.data.avata); // Mostrar el contenido de 'avata'
      } else {
        console.log(
          "El campo 'avata' no existe en el primer nivel de la respuesta"
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getRol = async () => {
    try {
      await axios.get(`${UriRol}`).then((data) => {
        getDataRol(data.data);

        console.log(data.data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getTipo = async (valor) => {
    try {
      await axios.get(`${UriTipo}${valor}`).then((datos) => {
        getDataTipo(datos.data);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getZonas = async () => {
    try {
      await axios.get(`${UriRutas}`).then((data) => {
        const formattedOptions = data.data.map((route) => ({
          value: route.nombrerutas, // El valor real que se enviará en el formulario
          label: route.nombrerutas, // El nombre visible en el dropdown
        }));

        getDataZonas(formattedOptions);
        console.log(formattedOptions);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (edit) {
      getData();
      setValue("zonas", myData);

      if (myData.avata) {
        setSelectedFileId(myData.avata);
      } else {
        setSelectedFileId(null);
      }

      getRol();
      getZonas();
      getTipo(vTipo);

      console.log(myData);

      reset(myData);
    } else {
      getRol();
      getZonas();
      getTipo(vTipo);
    }
  }, []);

  const handleSupervisor = (e) => {
    setVsupervisor(e.target.value);
  };

  const handleRole = (e) => {
    setVRole(e.target.value);
  };

  const onSubmit = async (data: FieldValues) => {
    if (edit) {
      const zonasString = data.zonas.map((zona) => zona.value).join(", ");
      const datosActualizado = { ...data, zonas: zonasString };
      await axios.put(`${UriUser}${Id}`, datosActualizado);
      Swal.fire({
        position: "center",
        icon: "success",
        html: '<p style="color: gray; font-weight: normal;">Usuario Actualizado</p>',
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      const zonasString = data.zonas.map((zona) => zona.value).join(", ");
      const datosActualizado = { ...data, zonas: zonasString };
      await axios.post(`${UriUser}`, datosActualizado);
      Swal.fire({
        position: "center",
        icon: "success",
        html: '<p style="color: gray; font-weight: normal;">Usuario Guardado</p>',
        showConfirmButton: false,
        timer: 2000,
      });
    }

    reset();
    closeModal();
    onSave(); 
  };

  const formatPhoneNumber = (value) => {
    // Eliminar todo lo que no sea dígitos
    const digits = value.replace(/\D/g, "");

    // Formato: 809-632-0987
    const formattedPhoneNumber = digits.replace(
      /^(\d{3})(\d{3})(\d{0,4})$/,
      (match, p1, p2, p3) => `${p1}-${p2}${p3 ? "-" + p3 : ""}`
    );

    return formattedPhoneNumber;
  };

  const handleChangeMask = (event) => {
    const inputValue = event.target.value;
    const formattedValue = formatPhoneNumber(inputValue);
    setValue("telefonos", formattedValue);
  };

  const handleSelect = (options) => {
    setSelectedRutas(options);
    setValue("zonas", options);
    console.log(options);
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
            width: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
          }}
        >
          <div className="d-flex p-2  justify-content-between align-items-center">
            <div className="p-2">
              <div className="d-flex justify-content-between">
                <div>
                  {edit ? (
                    <LiaUserEditSolid className="IconsTitle text-info fs-1" />
                  ) : (
                    <PiUserPlusThin className="IconsTitle text-info fs-1" />
                  )}
                </div>
                <div>
                  <h5 className="cFont d-flex lh-2 mb-0 text-black">
                    {edit
                      ? "Editando Usuarios de Sistema"
                      : "Creando Usuario de Sistema"}
                  </h5>

                  {edit && (
                    <p className="d-flex  clFont mb-0 text-black-50">
                      Usuario :
                      <strong className="text-danger">
                        {dataInitial.nombreusuario}
                      </strong>
                    </p>
                  )}
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

          <div className=" border-1 border-dark-subtle rounded-2 m-3  ">
            <form action="" onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <TextField
                    {...register("nombreusuario", {
                      required: "Este campo es obligatorio",
                    })}
                    label="Nombres *"
                    fullWidth
                    className="form-control clFont"
                    variant="outlined"
                    disabled={isDisable}
                  />
                  {errors.nombreusuario && (
                    <p className="  text-danger clFont">
                      {" "}
                      {errors.nombreusuario.message}{" "}
                    </p>
                  )}
                </div>

                <div className="col-md-6 col-sm-12">
                  <TextField
                    {...register("usuario", {
                      required: "Este campo es obligatorio",
                    })}
                    label="Usuario *"
                    fullWidth
                    className="form-control clFont"
                    variant="outlined"
                    disabled={isDisable}
                  />
                  {errors.usuario && (
                    <p className="text-danger clFont">
                      {" "}
                      {errors.usuario.message}{" "}
                    </p>
                  )}
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-6 col-sm-12">
                  <TextField
                    {...register("email")}
                    label="E-mail"
                    fullWidth
                    className="clFont"
                    variant="outlined"
                    disabled={isDisable}
                    //defaultValue={dataInitial?.email || ""}
                  />
                </div>
                <div className="col-md-6 col-sm-12">
                  <TextField
                    select
                    label="Rol *"
                    fullWidth
                    className="clFont"
                    {...register("idrole", {
                      required: " Este campo es requerido ",
                    })}
                    disabled={isDisable}
                    variant="outlined"
                    value={vRole}
                    onChange={handleRole}
                  >
                    {dataRol.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        <span className="clFont"> {option.nombre}</span>
                      </MenuItem>
                    ))}
                  </TextField>
                  {errors.idrole && (
                    <p className="text-danger clFont">
                      {" "}
                      {errors.idrole.message}{" "}
                    </p>
                  )}
                </div>

                <div className="row mt-3">
                  <div className="col-md-12">
                    <label className="clFont">Rutas:</label>

                    <Controller
                      name="zonas"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={dataZonas}
                          defaultValue={selectedRutas}
                          placeholder="Asigne las rutas correspondientes"
                          className="clFont"
                          onChange={handleSelect}
                          isMulti
                          isSearchable
                          noOptionsMessage={() => "No Rutas Encontradas..."}
                          //  onChange={(selected) => field.onChange(selected)}
                          styles={{
                            placeholder: (baseStyles, state) => ({
                              ...baseStyles,
                              color: "grey",
                            }),

                            clearIndicator: (baseStyles) => ({
                              ...baseStyles,
                              color: "red",
                            }),

                            dropdownIndicator: (baseStyles) => ({
                              ...baseStyles,
                              color: "grey",
                            }),

                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: "grey",
                            }),
                            multiValueRemove: (baseStyles, state) => ({
                              ...baseStyles,
                              color: state.isFocused ? "red" : "blue",
                              backgroundColor: state.isFocused
                                ? "lightgreen"
                                : "lightgrey",
                            }),
                          }}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6 col-sm-12">
                    <TextField
                      select
                      label="Supervisor"
                      fullWidth
                      className="clFont"
                      {...register("idsupervisor")}
                      disabled={isDisable}
                      variant="outlined"
                      value={vSupervisor}
                      onChange={handleSupervisor}
                    >
                      {dataTipo.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.nombreusuario}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <TextField
                      variant="outlined"
                      fullWidth
                      className="clFont"
                      label="Teléfonos"
                      {...register("telefonos")}
                      onChange={handleChangeMask}
                      // value={phoneNumber}
                      disabled={isDisable}
                    />
                  </div>
                </div>
                {!edit && (
                  <div className="row mt-3">
                    <div className="col-md-6 col-sm-12">
                      <TextField
                        label="Contraseña"
                        fullWidth
                        {...register("pass", { required: "Campo requerido" })}
                        className="form-control clFont "
                        variant="outlined"
                        disabled={isDisable}
                        type="password"
                      />
                      {errors.pass && (
                        <p className="text-danger clFont">
                          {" "}
                          {errors.pass.message}{" "}
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <TextField
                        label="Confirmar Contraseña"
                        fullWidth
                        className="form-control clFont"
                        variant="outlined"
                        disabled={isDisable}
                        hidden
                        type="password"
                      />
                    </div>
                  </div>
                )}

                <div className="row mt-4">
                  <div className="m-4 d-flex justify-content-center">
                    {selectedFileId ? (
                      <Avatar
                        src={`${UriImg}${selectedFileId}`}
                        sx={{ width: 100, height: 100 }}
                      />
                    ) : (
                      <div className="d-flex justify-content-center align-items-center h-100">
                        <Avatar sx={{ width: 100, height: 100 }}>
                          <CiFileOff
                            style={{ fontSize: "50px", color: "white" }}
                          />
                        </Avatar>
                      </div>
                    )}
                  </div>
                  <Button
                    sx={{
                      ml: 3,
                      background: "#0097B2",
                      "&:hover": { background: "#59A5B3" },
                    }}
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<TiCloudStorageOutline />}
                    className="clFont text-white"
                    disabled={isDisable}
                  >
                    Subir Avata
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(event) => upImg(event.target.files[0])}
                    />
                  </Button>
                </div>

                <div className="row mt-4">
                  <div className="col-md-12">
                    <div className="d-flex justify-content-center">
                      <Button
                        color="info"
                        variant="contained"
                        className="clFont text-white mx-3"
                        type="submit"
                      >
                        {" "}
                        {edit ? "Guardar Cambios" : "Guardar"}
                      </Button>
                      <Button
                        color="info"
                        variant="outlined"
                        className="clFont"
                        onClick={closeModal}
                      >
                        {" "}
                        {edit ? "Cancelar Cambios" : "Cancelar"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
      <ToastContainer />
    </>
  );
}

export default ModalUsuario;
