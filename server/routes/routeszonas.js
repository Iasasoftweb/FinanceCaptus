import express from "express";
import {
  getAllzonas,
  getOneZonas,
  updateZonas,
  createZonas,
  deleteZonas,
} from "../controller/ZonasController.js";
const router = express.Router();

router.get("/", getAllzonas);
router.get("/:id", getOneZonas);
router.put("/:id", updateZonas);
router.post("/", createZonas);
router.delete("/:id", deleteZonas);

export default router;
