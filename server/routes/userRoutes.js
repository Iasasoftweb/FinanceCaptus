import express from "express";

import { avataDelete, CreateUser, getOneUser, getTipo, getUser, updateUser, UpPass, validateUser, getGestor } from "../controller/UsesrController.js";

const router = express.Router();

router.get('/', getUser);
router.post('/login', validateUser);
router.get('/:id', getOneUser);
router.get('/tipo/:tipo', getTipo);
router.put('/:id', updateUser);
router.post('/', CreateUser);
router.put('/credential/:id', UpPass);
router.delete('/deleteimg/:img', avataDelete);
router.get('/roles/:id', getGestor);


export default router;

