import axios from "axios";

const AllClient = async () => {
   
    const URI = `${import.meta.env.VITE_API_URL}/clientes/`;
    const res = await axios.get(URI);
    const clientes = await res.data;
  
    return clientes;
   
}

export default AllClient;
