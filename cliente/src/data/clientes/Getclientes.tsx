import axios from "axios";

const getCliente = async (clienteID) => {
  const URI = "http://localhost:8000/clientes/"+{ clienteID };
  const res = await axios.get(URI);
  const gclientes = await res.data;

  return gclientes;
};

export default getCliente;
