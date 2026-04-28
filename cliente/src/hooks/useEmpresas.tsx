import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


export const useEmpresa = () => {
  return useQuery({
    // Cambiamos la clave de 'myEmpresa' a 'datosEmpresa' para resetear el caché
    queryKey: ['datosEmpresa1'], 
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:5000/empresas/');
      
      // Axios guarda la respuesta en .data
      // Verificamos si es un array y tomamos el primer elemento
      const resultado = Array.isArray(data) ? data[0] : data;
      
      console.log("Objeto final que devuelve el hook:", resultado);
      return resultado;
    },
    staleTime: 60000, // 1 minuto es más seguro que Infinity mientras desarrollas
  });
};