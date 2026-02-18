import db from "../database/db.js";
import { DataTypes } from "sequelize";

const ZonasModels = db.define("tbzonas", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombrerutas: { type: DataTypes.STRING },
  estado: { type: DataTypes.INTEGER, defaultValue: 1 },
  createdAt: { type: DataTypes.DATE, timestamps: false, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, timestamps: false, defaultValue: DataTypes.NOW },
});

export default ZonasModels;
