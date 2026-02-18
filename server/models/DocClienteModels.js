import db from "../database/db.js";
import { DataTypes } from "sequelize";

const DocClienteModels = db.define("tbdocs", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idcliente: {type: DataTypes.INTEGER},
  img: { type: DataTypes.STRING },
  descripcion: { type: DataTypes.STRING},
  createdAt: { type: DataTypes.DATE, timestamps: false, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, timestamps: false, defaultValue: DataTypes.NOW },
});

export default DocClienteModels;
