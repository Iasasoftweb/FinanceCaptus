import db from "../database/db.js";
import { DataTypes } from "sequelize";
import ZonasModels from "./ZonasModels.js";
import NotarioModels from "./NotarioModels.js";

const ClientesModel = db.define("tclientes", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  dni: { type: DataTypes.STRING, defaultValue: 1 },
  tipo_dni: { type: DataTypes.INTEGER, defaultValue: 1 },
  nombres: { type: DataTypes.STRING },
  apellidos: { type: DataTypes.STRING },
  sexo: { type: DataTypes.STRING },
  apodo: { type: DataTypes.STRING },
  estadocivil: { type: DataTypes.STRING },
  ciudad: { type: DataTypes.STRING },
  escolaridad: { type: DataTypes.STRING },
  ocupacion: { type: DataTypes.STRING },
  direccion: { type: DataTypes.STRING },
  sector: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  telefono1: { type: DataTypes.STRING },
  telefono2: { type: DataTypes.STRING },
  fecha_nac: { type: DataTypes.DATE },
  nacionalidad: { type: DataTypes.STRING },
  referencia: { type: DataTypes.STRING },
  lugartrabajo: { type: DataTypes.STRING },
  telefonotrabajo: { type: DataTypes.STRING },
  sueldo: { type: DataTypes.DECIMAL, defaultValue: 0.0 },
  fechaingresotrabajo: { type: DataTypes.DATE },
  idrutas: { type: DataTypes.INTEGER },
  limitecredito: { type: DataTypes.DECIMAL, defaultValue: 0.0 },
  vivienda: { type: DataTypes.STRING, defaultValue: "ALQUILER" },
  estado: { type: DataTypes.STRING, defaultValue: 'ACTIVO' },
  longitud: {type: DataTypes.STRING},
  latitud: {type: DataTypes.STRING},
  imgDNI1: { type: DataTypes.STRING },
  imgDNI2: { type: DataTypes.STRING },
  imgFOTOS: { type: DataTypes.STRING },
  createdAt: {
    type: DataTypes.DATE,
    timestamps: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    timestamps: false,
    defaultValue: DataTypes.NOW,
  },
});

ZonasModels.hasMany(ClientesModel, { foreignKey: "id" });
ClientesModel.belongsTo(ZonasModels, { foreignKey: "idrutas" });


//Pedido.belongsTo(Usuario, { foreignKey: 'usuario_id' });

export default ClientesModel;
