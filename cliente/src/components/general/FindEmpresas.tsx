import React, { useEffect, useState } from "react";
import axios from "axios";

interface Empresa {
  seguro: number;
  gastolegal: number;
  interesdefecto: Number;
}

interface Props {
  onUpdate: (valores: Empresa) => void;
}

const FindEmpresas: React.FC<Props> = ({ onUpdate }) => {
  const [dataEmpresa, setDataEmpresa] = useState<Empresa | null>(null);

  const URI = "http://localhost:8000/empresas/";

  const getEmpresa = async () => {
    try {
      const { data } = await axios.get<Empresa[]>(URI);

      if (data.length > 0) {
        const empresa = data[0];
        console.log(empresa.interesdefecto)
        setDataEmpresa(empresa);
        onUpdate(empresa); // Actualiza el estado en el componente padre
      }
    } catch (error) {
      console.error("Error al obtener datos de empresa:", error);
    }
  };

  useEffect(() => {
    getEmpresa();
  }, []);

  return null; // No es necesario renderizar nada en este componente
};

export default FindEmpresas;