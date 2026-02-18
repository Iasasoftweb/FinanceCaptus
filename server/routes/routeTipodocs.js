import express from "express"
import { getAllTipoDocumento } from "../controller/TipoIdentidadController.js";

const router = express.Router();
router.get('/', getAllTipoDocumento);

export default router;
