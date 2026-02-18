import db from "../database/db.js";
import { DataTypes } from "sequelize";

const RolesModels = db.define("tbroles", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: { type: DataTypes.STRING },
  createdAt: { type: DataTypes.DATE, timestamps: false, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, timestamps: false, defaultValue: DataTypes.NOW },
});

export default RolesModels;
