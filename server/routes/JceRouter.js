import express from "express";
import { GetJce } from '../controller/JceController.js';

const router = express.Router();
//
router.get('/:cedula', GetJce);

export default router;
