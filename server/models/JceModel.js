import db from "../database/db.js";
import { DataTypes } from "sequelize";

const JceModel = db.define("data_jces", {
  cedula: { type: DataTypes.STRING },
  nombres: { type: DataTypes.STRING },
  apellido1: { type: DataTypes.STRING },
  appelido2: { type: DataTypes.STRING },
  FechaNacimiento: { type: DataTypes.DATE },
  idNacionalidad: { type: DataTypes.INTEGER },
  idSexo: { type: DataTypes.STRING },
  IdEstadoCivil: { type: DataTypes.STRING },
});

export default JceModel;
