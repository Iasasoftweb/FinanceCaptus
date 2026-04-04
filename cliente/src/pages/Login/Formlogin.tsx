import { useState } from "react";
import "./Login.css";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { LuEye, LuEyeOff, LuUser2 } from "react-icons/lu";
import { RiLockPasswordLine } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";

interface LoginProps {
  onSuccessfulLogin: (token: string) => void;
}

const Formlogin: React.FC<LoginProps> = ({ onSuccessfulLogin }) => {
  const tx = "";
  const [usuario, setUsuario] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const validarCredencial = (e) => {
    e.preventDefault();

    const data = { usuario: usuario, pass: pass };
    console.log(data); 

    axios
      .post("http://localhost:5000/usuarios/login/", { usuario, pass })
      .then((res) => {
        console.log(res);

        if (res.data.token) {
          const token = localStorage.setItem("token", res.data.token);
          onSuccessfulLogin(token);
        } else {
          toast.error("Usuario o contraseña incorrectos");
        }
      })

      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
    <br />
      <form onSubmit={validarCredencial}>
        <TextField
          label="Usuarios del Sistema"
          fullWidth
          margin="normal"
          name="usuario"
          onChange={(e) => setUsuario(e.target.value)}
          className=" form-control bg-light"
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px", // Controla el radio de borde
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LuUser2 className="fs-4" />
              </InputAdornment>
            ),
          }}
        />
        <br />
        <TextField
          label="Contraseña"
          fullWidth
          name="pass"
          margin="normal"
          type={showPassword ? "text" : "password"}
          className=" form-control mt-5 bg-light"
          variant="outlined"
          onChange={(e) => setPass(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px", // Controla el radio de borde
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <RiLockPasswordLine className="fs-4" />
              </InputAdornment>
            ),

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

        <div className="d-flex justify-content-center mt-5">
          <button
            type="submit"
            data-mdb-button-init
            data-mdb-ripple-init
            className="btn mb-4 px-5 shadow"
            onClick={validarCredencial}
          >
            Entrar
          </button>
        </div>
      </form>
      <ToastContainer />
    </>
  );
};

export default Formlogin;

function register(
  arg0: string,
  arg1: { required: string }
): import("react/jsx-runtime").JSX.IntrinsicAttributes & {
  variant?: import("@mui/material").TextFieldVariants | undefined;
} & Omit<
    | import("@mui/material").FilledTextFieldProps
    | import("@mui/material").OutlinedTextFieldProps
    | import("@mui/material").StandardTextFieldProps,
    "variant"
  > {
  throw new Error("Function not implemented.");
}
