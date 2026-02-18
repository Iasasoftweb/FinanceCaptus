import express from "express";
import { getRoles } from "../controller/RolesController.js";

const router = express.Router();

router.get("/", getRoles);

export default router;
