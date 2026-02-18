import axios from "axios";

export const Allcompanies = async () => {
    const URI = "http://localhost:8000/Company/";   
    const res = await axios.get(URI);
    const companies = await res.data;
  
    return companies;
  };
  