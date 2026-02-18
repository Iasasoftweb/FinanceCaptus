import express from 'express';
import { getMoneda } from '../controller/MonedaController.js';


const router = express.Router();

router.get('/', getMoneda);


export default router;