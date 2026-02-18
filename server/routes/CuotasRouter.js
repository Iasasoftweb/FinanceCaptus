import express from "express";
import { deleteCuotas, GetCuota, postCuotas, putCuotas, getCuotas } from "../controller/CuotasController.js";

const router = express.Router();
router.get('/:idprestamo', GetCuota);
router.get('/', getCuotas);
router.post('/', postCuotas);
router.put("/:id", putCuotas);
router.delete('/:id', deleteCuotas);
export default router;