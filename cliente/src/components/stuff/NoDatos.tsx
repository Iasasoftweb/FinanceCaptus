import React from "react";
import BeatLoader from "react-spinners/BeatLoader";
import FindPng from "../../assets/img/nodata.png";

interface Props {
  mensaje: string;
}
const NoDatos: React.FC<Props> = ({ mensaje }) => {
  return (
    <div>
      <div className="text-center m-lg-5">
        <img src={FindPng} alt="" width={100} />
        <p className="text-center clFont">{mensaje}</p>
        <BeatLoader color="#008080" size={15} className="text-center" />
      </div>
    </div>
  );
};

export default NoDatos;
