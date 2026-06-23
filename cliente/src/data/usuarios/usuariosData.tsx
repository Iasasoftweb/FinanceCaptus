
import axios from "axios";


 export const Allusuarios = async () => {
  const URI = `${import.meta.env.VITE_API_URL}/usuarios/`;   
  const res = await axios.get(URI);
  const usuarios = await res.data;

  return usuarios;
};
