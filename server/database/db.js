import { Sequelize } from "sequelize";

const db = new Sequelize(
  process.env.DB_NAME || "financedb",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "dockerpass",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  },
);

db.authenticate()
  .then(() => console.log("Conexión exitosa"))
  .catch((error) => console.error("Error de coneccion al la DB: $error"));

export default db;
