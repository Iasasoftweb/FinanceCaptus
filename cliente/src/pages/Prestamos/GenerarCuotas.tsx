import React, { useState, useEffect } from "react";
import axios from "axios";
import MButton from "../../components/stuff/MButton";

interface AmortizaData {
  mcuota: Number;
}

const GenerarCuotas = ({tcuota}) => {
  const [DataAmortiza, setDataAmortiza] = useState<AmortizaData[]>([]);
  const Genera = () => {
  
    const Cuotas: AmortizaData[] = [];

    for (let i = 0; i < tcuota; i++) {
      mcuota: i + 1;
    }

    setDataAmortiza(Cuotas);
  };

  useEffect(() => {
    Genera();
    console.log(DataAmortiza);
  }, [tcuota]);

  return <div></div>;
};

export default GenerarCuotas;
