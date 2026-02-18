import db from "../database/db.js";
import { DataTypes } from "sequelize";

import RolesModels from "./RoleModels.js";

const UserModels = db.define("tusuarios", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  usuario: { type: DataTypes.STRING },
  pass: { type: DataTypes.STRING },
  idrole: { type: DataTypes.INTEGER, defaultValue: 1 },
  nombreusuario: { type: DataTypes.STRING },
  estado: { type: DataTypes.INTEGER, defaultValue: 1 },
  avata: { type: DataTypes.STRING },
  idsupervisor: { type: DataTypes.INTEGER, defaultValue: 1 },
  telefonos: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  zonas: { type: DataTypes.STRING },
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

RolesModels.hasMany(UserModels, { foreignKey: "id" });
UserModels.belongsTo(RolesModels, { foreignKey: "idrole" });

export default UserModels;
