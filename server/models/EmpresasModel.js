import db from "../database/db.js";
import { DataTypes } from "sequelize";

const EmpresasModel = db.define("tbempresas", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  empresa: { type: DataTypes.STRING },
  correo: { type: DataTypes.STRING },
  rnc: { type: DataTypes.STRING },
  direccion: { type: DataTypes.STRING },
  gerente: { type: DataTypes.STRING },
  telefono1: { type: DataTypes.STRING },
  telefono2: { type: DataTypes.STRING },
  wathsapp: { type: DataTypes.STRING },
  tiponegocio: { type: DataTypes.STRING },
  latitud: { type: DataTypes.FLOAT },
  longitud: { type: DataTypes.FLOAT },
  aplicarmora: { type: DataTypes.STRING, defaultValue: "false" },
  imprimirlogo: { type: DataTypes.STRING, defaultValue: "false" },
  modoporcentaje: { type: DataTypes.FLOAT },
  logoempresa: { type: DataTypes.STRING },
  interesdefecto: { type: DataTypes.FLOAT },
  gastolegal: { type: DataTypes.FLOAT, defaultValue: 0.0 },
  prorrogamora: { type: DataTypes.FLOAT, defaultValue: 0.0 },
  prorrogacuota: { type: DataTypes.FLOAT, defaultValue: 0.0 },
  seguro: { type: DataTypes.FLOAT, defaultValue: 0.0 },
  isactivo: { type: DataTypes.STRING, defaultValue: "true" },
  pais: { type: DataTypes.STRING },
  tipomoneda: { type: DataTypes.STRING },

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

export default EmpresasModel;
