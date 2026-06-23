import axios from "axios";

const getCliente = async (clienteID) => {
  const URI = `${import.meta.env.VITE_API_URL}/clientes/`+{ clienteID };
  const res = await axios.get(URI);
  const gclientes = await res.data;

  return gclientes;
};

export default getCliente;
