import db from "../database/db.js";
import { DataTypes } from "sequelize";
import PrestaModels from "./PrestaModels.js";

const CuotasModels = db.define("tbcuotas", {
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
      key: 'id'
    }
  },
  numcuota: { type: DataTypes.INTEGER, defaultValue: 0 },
  fechapago: { type: DataTypes.DATE },
  fechavencimiento: { type: DataTypes.DATE },
  montocuota: { type: DataTypes.DECIMAL, defaultValue: 0.0 },
  montocapital: { type: DataTypes.DECIMAL, defaultValue: 0.0 },
  montointeres: { type: DataTypes.DECIMAL, defaultValue: 0.0 },
  montomora: { type: DataTypes.DECIMAL, defaultValue: 0.0 },
  seguro: { type: DataTypes.DECIMAL, defaultValue: 0.0 },
  montopagado: { type: DataTypes.DECIMAL, defaultValue: 0.0 },
  capitalpagado: { type: DataTypes.DECIMAL, defaultValue: 0.0 },
  interespagado: { type: DataTypes.DECIMAL, defaultValue: 0.0 },
  morapago: { type: DataTypes.DECIMAL, defaultValue: 0.0 },
  montopendiente: { type: DataTypes.DECIMAL, defaultValue: 0.0 },
  concepto: { type: DataTypes.STRING},
  estado: { type: DataTypes.STRING, defaultValue: 'NORMAL' },
  pagada: { type: DataTypes.STRING, defaultValue: 'false' },
  fechacuotamora: { type: DataTypes.DATE },
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

PrestaModels.hasMany(CuotasModels, {
  foreignKey: 'idprestamo',
  sourceKey: 'id' // Asegúrate que coincida con la PK en PrestaModels
});

CuotasModels.belongsTo(PrestaModels, {
  foreignKey: 'idprestamo',
  targetKey: 'id' // Asegúrate que coincida con la PK en PrestaModels
});

export default CuotasModels
