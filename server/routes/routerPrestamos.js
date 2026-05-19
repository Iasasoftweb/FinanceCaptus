import express from 'express'
import { CreatePrestamos, getOnePrestamos, getPrestamos, updatePrestamos } from '../controller/PrestamosController.js'
import { procesarCobroTransaccional } from '../controller/cobrosController.js'
const router = express.Router()

router.get('/', getPrestamos)
router.get('/:id', getOnePrestamos)
router.post('/', CreatePrestamos)
router.put('/:id', updatePrestamos)
router.post('/cobrar', procesarCobroTransaccional)

export default router