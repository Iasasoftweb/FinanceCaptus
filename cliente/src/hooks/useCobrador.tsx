import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useCobrador = () => {
  const [dataCobrador, setDataCobrador] = useState([]); // Importante: Inicializa como array vacío
  const [loading, setLoading] = useState(true); // Opcional: Para saber si está cargando

  const GetCobrador = useCallback(async () => {
    const id = 2;
    try {
      setLoading(true);
      const respuesta = await axios.get(`http://localhost:5000/usuarios/roles/${id}`);
      
      // LOG DE DEPURACIÓN: Mira exactamente qué llega del servidor
      console.log("Respuesta completa de Axios:", respuesta);

      // Verificación de la estructura de datos
      // Muchos backends envían { data: [...] } o simplemente [...]
      const Data = respuesta.data?.data || respuesta.data || [];
      
      // Forzar que siempre sea un array antes de guardar
      setDataCobrador(Array.isArray(Data) ? Data : []);
      
    } catch (error) {
      console.error("Error al obtener cobradores:", error);
      setDataCobrador([]); // En caso de error, dejamos el array vacío para no romper el .map()
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    GetCobrador();
  }, [GetCobrador]);

  return {
    dataCobrador,
    loading,
    refetch: GetCobrador // Para poder recargar manualmente si lo necesitas
  };
};

export default useCobrador;