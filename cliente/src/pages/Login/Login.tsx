import "./Login.css";
import axios from "axios";

import { LuEye, LuEyeOff } from "react-icons/lu";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../../components/Brand/Brand.tsx";
import fondo from "../../assets/img/bg.jpg";
import { SiMeteor } from "react-icons/si";
import { Allusuarios } from "../../data/usuarios/usuariosData.tsx";
import { MisColores } from "../../components/stuff/MisColores.tsx";
import { InputField } from "../../components/stuff/InputField.tsx";
import { User, UserKey } from "lucide-react";
import { useEmpresa } from "../../hooks/useEmpresas.tsx";
import BeatLoader from "react-spinners/BeatLoader";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const { data: dataEmpresa, isLoading } = useEmpresa();

  const navigate = useNavigate();

  const UrisImg = `${import.meta.env.VITE_API_URL}/uploads/clientes/empresa/`;
  const validarCredencial = (e) => {
    e.preventDefault();
    axios
      .post(`${import.meta.env.VITE_API_URL}/usuarios/login/`, {
        usuario,
        pass,
      })
      .then((res) => {
        console.log(res);
        console.log(res.data.ID);
        console.log(res.data.Role);

        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("role", res.data.Role);
          localStorage.setItem("userID", String(res.data.ID));
          // const token = localStorage.setItem("token", res.data.token);
 
          toast.success("Credenciales correctas");
          window.location.href = "/";
  //        navigate("/", { replace: true });
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

  const getData = async () => {
    try {
      Allusuarios().then((allUsuarios) => {
        setAllUser(allUsuarios);
        console.log(allUsuarios);
      });
    } catch (error) {
      console.error("Error de Coneccion", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div style={backgroundStyle}>
      <div className="container-fluid">
        <div className="d-flex justify-content-center align-items-center vh-100 ">
          <div className=" bg-white shadow-md" style={{ width: 400 }}>
            <div
              className=" border-black border-1 "
              style={{ position: "relative" }}
            >
              <div className="d-flex justify-content-center">
                {isLoading ? (
                  <div className="text-center w-full py-10">
                    <br />
                    <BeatLoader
                      color={MisColores.headerBlue}
                      size={15}
                      className="text-center"
                    />
                  </div>
                ) : (
                  <img
                    src={`${UrisImg}${dataEmpresa?.logoempresa}`}
                    alt="logo"
                    className="mt-2 img-fluid"
                  />
                )}
              </div>

              {/* <hr className="mb-0" /> */}

              <form onSubmit={validarCredencial} className="p-5">
                <InputField label="Usuario del Sistema" icon={User} required>
                  <input
                    type="text"
                    className="form-control border-0 shadow-none "
                    onChange={(e) => setUsuario(e.target.value)}
                    style={{ fontSize: "0.8em" }}
                    name="usuario"
                  />
                </InputField>

                <InputField label="Contraseña" icon={UserKey} required>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control border-0 shadow-none"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    name="pass"
                    style={{
                      fontSize: "0.8em",
                    }}
                  />

                  <button
                    type="button"
                    className="btn bg-white border-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <LuEyeOff size={20} />
                    ) : (
                      <LuEye size={20} />
                    )}
                  </button>
                </InputField>

                <div className="d-flex justify-content-center mt-5 mb-3">
                  <button
                    type="submit"
                    data-mdb-button-init
                    data-mdb-ripple-init
                    className="btn mb-4 px-5 shadow w-100 clFont text-white p-2"
                    //onClick={validarCredencial}
                    style={{ backgroundColor: MisColores.headerBlue }}
                  >
                    Login
                  </button>
                </div>

                <div className="footer">
                  <p className="" style={{ fontSize: 10, color: "GrayText" }}>
                    Desarrollado por Iasasoft <span>©</span> 2026.{" "}
                  </p>

                  <div
                    className=" p-3 d-flex justify-content-center align-content-center"
                    style={{ background: "grey" }}
                  >
                    <div className="text-center d-flex justify-content-center align-content-center ">
                      <SiMeteor
                        className="me-2 text-white"
                        style={{ fontSize: 15 }}
                      />
                      <Logo fs={15} />
                      {/* <span className="text-center clFont text-white">Sistema de Gestión de Préstamos</span> */}
                    </div>
                  </div>
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
