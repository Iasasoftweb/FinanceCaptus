import { Avatar } from "@mui/material";
import Logincard from "../../components/login/Logincard";
import "./Login.css";
import { GoPasskeyFill } from "react-icons/go";
import { GrUserAdmin } from "react-icons/gr";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { LuEye, LuEyeOff, LuUser2 } from "react-icons/lu";
import { MdCopyright } from "react-icons/md";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../../components/Brand/Brand.tsx";
import fondo from "../../assets/img/bg.jpg";
import { SiMeteor } from "react-icons/si";
import { Allusuarios } from "../../data/usuarios/usuariosData.tsx";
import { getDate } from "date-fns";
import { MisColores } from "../../components/stuff/MisColores.tsx";


interface LoginProps {
  onSuccessfulLogin: (token: string) => void;
}

const Login = () => {
  const tx = "";
  const [usuario, setUsuario] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [allUser, setAllUser]= useState([]);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const validarCredencial = (e) => {
    e.preventDefault();

    // const data = { usuario: usuario, pass: pass };
    // console.log(data);

     
    
    axios
      .post("http://localhost:5000/usuarios/login/", { usuario, pass })
      .then((res) => {
        console.log(res);
        console.log(res.data.ID);
        console.log(res.data.Role);

        if (res.data.token) {
          const token = localStorage.setItem("token", res.data.token);
          localStorage.setItem("role", res.data.Role);

          localStorage.setItem("userID", String(res.data.ID));

          toast.success("Credenciales correctas");
          window.location.replace("/");
        } else {
          toast.error("Credenciales inválidas");
        }
      })

      .catch((err) => {
        console.log(err);
        toast.error("Credenciales inválidas");
      });
  };

  const backgroundStyle = {
    backgroundImage: `url(${fondo})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
    width: "100vw",
  };


  const getData= async()=>{
      try {
        Allusuarios().then(
          (allUsuarios)=>{
            setAllUser(allUsuarios)
            console.log(allUsuarios)
          }


        )
      } catch (error) {
        console.error("Error de Coneccion", error);
      }

    }

 useEffect(()=>{
    getData();
 }, [])

  return (
    <div style={backgroundStyle}>
      <div className="container-fluid">
        <div className="d-flex justify-content-center align-items-center vh-100 ">
          <div className=" bg-white shadow-sm" style={{ width: 400 }}>
            <div
              className=" border-black border-1 "
              style={{ position: "relative" }}
            >
              <div
                className=" p-4 d-flex justify-content-center align-content-center"
                style={{ background: "grey" }}
              >
                <div className="text-center d-flex justify-content-center align-content-center ">
                  <SiMeteor
                    className="me-2 text-white"
                    style={{ fontSize: 35 }}
                  />
                  <Logo fs={25} />
                  {/* <span className="text-center clFont text-white">Sistema de Gestión de Préstamos</span> */}
                </div>
              </div>

              <form onSubmit={validarCredencial} className="p-5">
                
                <TextField
                  label="Usuarios del Sistema"
                  fullWidth
                  margin="normal"
                  name="usuario"
                  onChange={(e) => setUsuario(e.target.value)}
                  className=" form-control bg-light clFont"
                  variant="outlined"
                  InputLabelProps={{ style: { fontSize: "1.1em" } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "15px",
                      fontSize: "12px", // Controla el radio de borde
                    },
                  }}
                  InputProps={{}}
                />
                <br />
                <TextField
                  label="Contraseña"
                  fullWidth
                  name="pass"
                  margin="normal"
                  type={showPassword ? "text" : "password"}
                  className=" form-control mt-4 bg-light"
                  variant="outlined"
                  onChange={(e) => setPass(e.target.value)}
                  InputLabelProps={{ style: { fontSize: "0.9em" } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "15px",
                    },
                  }}
                  InputProps={{
                    style: { fontSize: "10px" },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          sx={{ fontSize: "2em" }}
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
                    className="btn mb-4 px-5 shadow w-100 clFont text-white p-2"
                    //onClick={validarCredencial}
                    style={{backgroundColor: MisColores.headerBlue}}
                  >
                    Login
                  </button>
                </div>
                <div className="footer">
                  <p className="" style={{ fontSize: 10, color: "GrayText" }}>
                    Desarrollado por Iasasoft <span>©</span> 2026.{" "}
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/*  */}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;

function register(
  arg0: string,
  arg1: { required: string },
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
