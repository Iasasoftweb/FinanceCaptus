import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 1. Obtener la ruta del archivo actual de forma dinámica
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Construir la ruta al .env de forma relativa
// Esto funciona en Windows (C:\Dev\server\.env) y en Linux (/var/www/.../.env)
const envPath = path.join(__dirname, '..', '.env');

dotenv.config({ path: envPath });

console.log("✅ Buscando .env en:", envPath);
console.log("🗄️  DB_NAME:", process.env.DB_NAME || "FALLO AL LEER .ENV");

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    logging: false
  }
);

export default db;