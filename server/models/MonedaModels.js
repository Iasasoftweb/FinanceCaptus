import db from "../database/db.js";
import { DataTypes } from "sequelize";

const MonedaModels = db.define("tbmonedas", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

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
export default MonedaModels;