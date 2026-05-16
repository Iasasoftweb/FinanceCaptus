import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
interface props {
  iidprestamos?: number;
}

export const useDataPrestamos = () => {
  const UrisPrestamos = "http://localhost:5000/prestamos/";

  const [DataPrestamos, setDataPrestamos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getPrestamos = async () => {
    try {
      setLoading(true);

      const response = await axios.get(UrisPrestamos);

      setDataPrestamos(response.data);
    } catch (err: any) {
      console.log(err);
      setError("Error al cargar los préstamos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPrestamos();
  }, []);

  return {
    DataPrestamos,
    loading,
    error,
    getPrestamos,
  };
};

export const usePrestamosOne = (idprestamos?: number) => {
  return useQuery({
    queryKey: ["prestamos", idprestamos],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:5000/prestamos/${idprestamos}`,
      );
      return data;
    },
  });
};

export const useCuotasPrestamos = (idprestamos?: number) => {
  return useQuery({
    queryKey: ["cuotas", idprestamos],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:5000/cuotas/${idprestamos}`,
      );
      return data.data || [];
    },

    enabled: !!idprestamos,
  });
};
