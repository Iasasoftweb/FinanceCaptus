import db from "../database/db.js";
import { DataTypes } from "sequelize";

const CompanyModels = db.define("tbcompanies", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  company: { type: DataTypes.STRING },
  nombrecontacto: { type: DataTypes.STRING },
  telefono: { type: DataTypes.STRING },
  activo: { type: DataTypes.INTEGER, defaultValue: 1 },
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

export default CompanyModels;
