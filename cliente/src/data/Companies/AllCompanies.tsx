import axios from "axios";

export const Allcompanies = async () => {
    const URI = `${import.meta.env.VITE_API_URL}/Company/`;   
    const res = await axios.get(URI);
    const companies = await res.data;
  
    return companies;
  };
  