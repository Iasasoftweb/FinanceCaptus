import express from 'express'
import { CreatePrestamos, getOnePrestamos, getPrestamos, updatePrestamos, updateSituacionPrestamo } from '../controller/PrestamosController.js'
import { procesarCobroTransaccional } from '../controller/cobrosController.js'
const router = express.Router()

router.get('/', getPrestamos)
router.get('/:id', getOnePrestamos)
router.post('/', CreatePrestamos)
router.put('/:id', updatePrestamos)
router.post('/cobrar', procesarCobroTransaccional)
router.patch('/:id/situacion', updateSituacionPrestamo)

export default router