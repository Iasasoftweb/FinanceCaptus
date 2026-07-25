import express from "express";
import cors from "cors";
import ClienteRoute from "./routes/routes.js";
import TipoDocs from "./routes/routeTipodocs.js";
import Zonas from "./routes/routeszonas.js";
import DocCliente from "./routes/routerDoc.js";
import UsuariosRoute from "./routes/userRoutes.js";
import Prestamos from "./routes/routerPrestamos.js";
import Empresas from "./routes/routerEmpresas.js";
import path, { extname } from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { upload } from "./controller/ClienteController.js";
import { uploaddoc } from "./controller/ClienteDocController.js";
import morgan from "morgan";
import Roles from "./routes/routerRoles.js";
import { uploadUser } from "./controller/UsesrController.js";
import { uploadEmpresas } from "./controller/EmpresasController.js";
import jce from "./routes/JceRouter.js";
import Notarios from "./routes/notariosRouter.js";
import Company from "./routes/CompanyRouter.js";
import Cuotas from "./routes/CuotasRouter.js";
import Pagos from "./routes/routePagos.js";
import Moneda from "./routes/ModenaRouter.js";
import db from "./database/db.js";

//Inizializations
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(morgan("dev"));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://localhost:5173",
      "https://localhost:5174",
      "http://74.208.14.40",
    ],
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/clientes", ClienteRoute);
app.use("/tipodocs", TipoDocs);
app.use("/zonas", Zonas);
app.use("/clienteDoc", DocCliente);
app.use("/usuarios", UsuariosRoute);
app.use("/roles", Roles);
app.use("/prestamos", Prestamos);
app.use("/empresas", Empresas);
app.use("/jce", jce);
app.use("/notarios", Notarios);
app.use("/company", Company);
app.use("/cuotas", Cuotas);
app.use("/pagos", Pagos);
app.use("/moneda", Moneda);

app.post("/uploadImg/", upload.single("imgDNI2"), async (req, res) => {
  if (upload) {
    res.json({
      fileName: req.file.filename,
      filePath: `/uploads/clientes/avata/${req.file.filename}`,
    });
  }
});

app.post("/uploadDoc/", uploaddoc.single("img"), async (req, res) => {
  if (upload) {
    res.json({
      fileName: req.file.filename,
      filePath: `/uploads/clientes/docs/${req.file.filename}`,
    });
  }
});

app.post("/uploaduser/", uploadUser.single("avata"), async (req, res) => {
  if (uploadUser) {
    res.json({
      fileName: req.file.filename,
      filePath: `/uploads/clientes/avatauser/${req.file.filename}`,
    });
  }
});

app.post(
  "/uploadEmpresa/",
  uploadEmpresas.single("logoempresa"),
  async (req, res) => {
    if (uploadEmpresas) {
      res.json({
        fileName: req.file.filename,
        filePath: `/uploads/clientes/empresa/${req.file.filename}`,
      });
    }
  },
);

// app.use(
//   "/uploads",
//   express.static(path.join(__dirname, "uploads/clientes/avata/")),
// );
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  "/uploadusers",
  express.static(path.join(__dirname, "uploads/clientes/avatauser/")),
);

app.use(
  "/uploadDocs",
  express.static(path.join(__dirname, "uploads/clientes/docs/")),
);

app.use(
  "/uploadEmpresa",
  express.static(path.join(__dirname, "uploads/clientes/empresa/")),
);

// app.use('/public/images/clientes', express.static('./uploads'));

try {
  await db.authenticate();
  console.log("🚀 Conexión exitosa a la base de datos local");
} catch (error) {
  console.log(`❌ Error de conexión a la base de datos: ${error.message}`);
}

app.listen(5000, () => {
  console.log("⭐ Servidor Backend corriendo en: http://localhost:5000");
});
