import db from "../database/db.js";
import { DataTypes } from "sequelize";
import PrestaModels from "./PrestaModels.js";

const pagosModels = db.define("tbpagos", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idprestamo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PrestaModels,
      key: "id",
    },
  },
  fecha: { type: DataTypes.DATE },
  concepto: { type: DataTypes.TEXT },
  pagomora: { type: DataTypes.DECIMAL, defaultValue: 0.0 },
  pagocapital: { type: DataTypes.DECIMAL, defaultValue: 0.0 },
  pagointeres: { type: DataTypes.DECIMAL, defaultValue: 0.0 },
  otros: { type: DataTypes.DECIMAL, defaultValue: 0.0 },
  pendiente: { type: DataTypes.DECIMAL, defaultValue: 0.0 },
  totalpagado: { type: DataTypes.DECIMAL, defaultValue: 0.0 },
  formapago: { type: DataTypes.STRING, defaultValue: "efectivo" },
  comentario: { type: DataTypes.STRING },
  estado: { type: DataTypes.STRING, defaultValue: "hold" },
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

PrestaModels.hasMany(pagosModels, {
  foreignKey: "idprestamo",
  sourceKey: "id", // Asegúrate que coincida con la PK en PrestaModels
});

pagosModels.belongsTo(PrestaModels, {
  foreignKey: "idprestamo",
  targetKey: "id", // Asegúrate que coincida con la PK en PrestaModels
});

export default pagosModels;
