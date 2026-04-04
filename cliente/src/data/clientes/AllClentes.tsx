import axios from "axios";

const AllClient = async () => {
   
    const URI = "http://localhost:5000/clientes/";
    const res = await axios.get(URI);
    const clientes = await res.data;
  
    return clientes;
   
}

export default AllClient;
