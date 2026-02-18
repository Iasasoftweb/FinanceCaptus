import express from "express";
import { CreateCompany, deleteCompany, GetCompany, getOneCompany, updateCompany } from "../controller/CompanyController.js";

const router = express.Router();
//
router.get("/", GetCompany);
router.get("/:id", getOneCompany);
router.put("/:id", updateCompany);
router.post("/", CreateCompany);
router.delete("/:id", deleteCompany);

export default router;
