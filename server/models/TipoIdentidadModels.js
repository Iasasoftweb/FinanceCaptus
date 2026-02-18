import db from "../database/db.js";
import { DataTypes } from "sequelize";

const TipoIdentidadModels = db.define("ttipodocs", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  
    tipodoc: { type: DataTypes.STRING },
});

export default TipoIdentidadModels;