import EmpresasModel from "../models/EmpresasModel.js";
import db from "../database/db.js";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const GetEmpresas = async (req, res) => {
  try {
    const respuesta = await EmpresasModel.findAll(
     { where: { isactivo: 'true' }}
    );
    res.json(respuesta);
  } catch (error) {
    res.json(error);
  }
};

export const OnlyEmpresas = async (req, res) => {
  try {
    const respuesta = await EmpresasModel.findOne({
      where: { id: req.params.id },
    });
    res.json(respuesta);
  } catch (error) {
    res.json(error);
  }
};

export const UpdateEmpresas = async (req, res) => {
  try {
    await EmpresasModel.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Empresa Actualizada" });
  } catch (error) {
    res.json(error);
  }
};

export const CreateEmpresas = async (req, res) => {
  try {
    await EmpresasModel.create(req.body);
    res.json({ message: "Empresa Creada" });
  } catch (error) {
    res.json(error);
  }
};

export const getEmpresaActivo = async (req, res) => {
  
  try {
    const resp = await EmpresasModel.findAll({
      where: { isactivo: 'true'}
    });

    res.json(resp);
  } catch (error) {
    res.json(error);
  }
};

export const updateEmpresasImg = async (req, res) => {
  try {
    const logo = req.file.filename;
    await EmpresasModel.update(logo, {
      where: { id: req.params.id },
    });

    res.json({ message: "!Registro Actualizado Correctamente" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const uploadempresas = (req, res) => {
  res.send("carga de archivo realizo");
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/clientes/empresa/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + uniqueSuffix + path.extname(file.originalname));
  },
});

export const uploadEmpresas = multer({
  storage: storage,
  limits: { fileSize: "10000000" },
  fileFilter: (req, file, cb) => {
    const fileType = /jpg|jpeg|png|gif|pdf/;
    const minType = fileType.test(file.mimetype);
    const extname = fileType.test(path.extname(file.originalname));

    if (minType && extname) {
      return cb(null, true);
    }
    cb("Give proper files formate to upload");
  },
});
