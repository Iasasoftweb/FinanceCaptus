import express from "express";
import { getNotarios } from "../controller/NotariosController.js";

const router = express.Router();
//
router.get("/", getNotarios);

export default router;
