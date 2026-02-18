import express from "express";
import {
  AllDocCliente,
  UpdateDocCliente,
  CreateDocCliente,
  deleteDocCliente,
  ImgDelete,
  findDoc,
} from "../controller/ClienteDocController.js";
const router = express.Router();
//
router.get("/:idcliente", AllDocCliente);
router.put("/:id", UpdateDocCliente);
router.post("/", CreateDocCliente);
router.delete("/:id", deleteDocCliente);
router.delete("/deleteimagen/:img", ImgDelete);
router.get("/finddoc/:id", findDoc)

export default router;
