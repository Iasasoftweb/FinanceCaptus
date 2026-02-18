import db from "../database/db.js";
import { DataTypes } from "sequelize";

const NotarioModels = db.define("tbnotarios", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombrecompleto: { type: DataTypes.STRING },
  idcompany: { type: DataTypes.INTEGER },
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

export default NotarioModels;
