import express from "express";
import { getPagos, postPagos } from "../controller/pagosController.js";

const router = express.Router();

router.get("/", getPagos);
router.post("/", postPagos);

export default router;