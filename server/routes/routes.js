import express from "express";
import {
  CreateClientes,
  deleteCliente,
  updateClienteImg,
  ImgDelete,
  getAllClientes,
  uploadImg,
  getCliente,
  updateCliente,
  existeDni,
  upload,
  GetAll,
  ClientesRutas,
  ClientesActivos,
} from "../controller/ClienteController.js";
import multer from "multer";
import path from "path";
import { getGestor } from "../controller/UsesrController.js";
//import upload from "../routes/uploadMiddleware.js"

const router = express.Router();

router.get("/", getAllClientes);
router.get("/app/", GetAll)
router.get("/:id", getCliente);
router.get("/buscar-dni/:dni", existeDni);
router.post("/", CreateClientes);
router.post('/uploaduser', upload.single('avatar'), uploadImg);
router.put("/:id", updateCliente);
router.get('/rutas/:rutas', ClientesRutas);
router.get('/estado/:estado', ClientesActivos);
router.delete("/:id", deleteCliente);
router.delete("/deleteimagen/imagen/:image", ImgDelete);


export default router;
