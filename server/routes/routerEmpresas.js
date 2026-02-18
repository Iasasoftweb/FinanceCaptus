import express from "express";
import {
  getEmpresaActivo,
  GetEmpresas,
  OnlyEmpresas,
  UpdateEmpresas,
} from "../controller/EmpresasController.js";

const router = express.Router();

router.get("/estado", getEmpresaActivo);
router.get("/", GetEmpresas);
router.get("/:id", OnlyEmpresas);
router.put("/:id", UpdateEmpresas)

export default router;
