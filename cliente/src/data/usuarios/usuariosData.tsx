
import axios from "axios";


 export const Allusuarios = async () => {
  const URI = "http://localhost:8000/usuarios/";   
  const res = await axios.get(URI);
  const usuarios = await res.data;

  return usuarios;
};
