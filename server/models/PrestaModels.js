import db from '../database/db.js';
import { DataTypes } from 'sequelize';

import ClientesModel from './ClienteModels.js';
import NotarioModels from './NotarioModels.js';

const PrestaModels = db.define('tbprestamos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idclientes: { type: DataTypes.INTEGER },
  tipoamortizacion: { type: DataTypes.STRING },
  referencia: { type: DataTypes.STRING },
  interes: { type: DataTypes.FLOAT },
  capital: { type: DataTypes.FLOAT },
  montointeres: { type: DataTypes.FLOAT },
  frecuencia: { type: DataTypes.STRING },
  mcuota: { type: DataTypes.FLOAT },
  cuotaspagas: { type: DataTypes.INTEGER },
  capitalpendiente: { type: DataTypes.FLOAT },
  balancependiente: { type: DataTypes.FLOAT },
  montopagado: { type: DataTypes.FLOAT },
  fecha: { type: DataTypes.DATE },
  fechaprimer: { type: DataTypes.DATE },
  fechaultimopago: { type: DataTypes.DATE },
  mora: { type: DataTypes.FLOAT },
  gastoslegal: { type: DataTypes.FLOAT },
  comision: { type: DataTypes.FLOAT },
  seguro: { type: DataTypes.FLOAT },
  idcobrador: { type: DataTypes.INTEGER },
  tcuota: { type: DataTypes.INTEGER },
  idcompany: { type: DataTypes.INTEGER },
  idnotario: { type: DataTypes.INTEGER },
  idinstitucion: { type: DataTypes.INTEGER },
  idgestor: { type: DataTypes.INTEGER },
  codeudornombre: { type: DataTypes.STRING },
  codeudoridentificador: { type: DataTypes.STRING },
  codeudortelefono: { type: DataTypes.STRING },
  codeudordireccion: { type: DataTypes.STRING },
  estado: {type: DataTypes.STRING, defaultValue: 'VIGENTE'},
  modo: { type: DataTypes.STRING, defaultValue: 'activo' },
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

ClientesModel.hasMany(PrestaModels, { foreignKey: 'id' });
PrestaModels.belongsTo(ClientesModel, { foreignKey: 'idclientes' });

NotarioModels.hasMany(PrestaModels, { foreignKey: 'id' });
PrestaModels.belongsTo(NotarioModels, { foreignKey: 'idnotario' });

export default PrestaModels;