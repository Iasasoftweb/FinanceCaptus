import DocClienteModels from "../models/DocClienteModels.js";
import db from "../database/db.js";
import path from "path";
import multer from "multer";
import fs from "fs";
import { error } from "console";
import { fileURLToPath } from "url";
import { where } from "sequelize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const AllDocCliente = async (req, res) => {
  const { idcliente } = req.params;
  try {
    const DocClient = await DocClienteModels.findAll({ where: { idcliente } });
    res.json(DocClient);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const CreateDocCliente = async (req, res) => {
  try {
    await DocClienteModels.create(req.body);
    res.json({ message: "Registro Creado Correctamente" });
  } catch (error) {
    res.status(200);
    res.json({ message: error.message });
  }
};

export const UpdateDocCliente = async (req, res) => {
  try {
    await DocClienteModels.update(req.body, { where: { id: req.params.id } });
    res.status(200);
    res.json({ message: "Registro actualizado correctamente" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const deleteDocCliente = async (req, res) => {
  try {
    const ID = req.params.id;

    const clientedelete = await DocClienteModels.findOne({
      where: { id: req.params.id },
    });

    if (!clientedelete) {
      return res.status(404).json({ error: "Doc no encontrado" });
    }

    const imgName = clientedelete.img;

    console.log(imgName);
    if (imgName) {
      const imagePath = path.resolve(
        __dirname,
        "..",
        "uploads",
        "clientes",
        "docs",
        imgName
      );
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error al eliminar la imagen:", err);
          // No detener el proceso de eliminación si el archivo no existe
        }
      });
    }

    await DocClienteModels.destroy({
      where: { id: req.params.id },
    });

    res.status(200).json({ message: "Documento Eliminado correctamente" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

// Subir Archivo

export const updateImgDoc = async (req, res) => {
  try {
    const img = req.file.filename;
    await DocClienteModels.update(img, {
      where: { id: req.params.id },
    });

    res.json({ message: "!Registro Actualizado Correctamente" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const uploadDoc = (req, res) => {
  res.send("carga de archivo realizo");
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/clientes/docs/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + uniqueSuffix + path.extname(file.originalname));
  },
});

export const uploaddoc = multer({
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

//Elimina Imagen

export const findDoc = async (req, res) => {
  const { id } = req.params;
  try {
    const DocFind = await DocClienteModels.findAll({ where: { id } });
    res.json(DocFind);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const ImgDelete = async (req, res) => {
  const img = req.params.img;

    try {
      const imgName = img;
      console.log(imgName);
      const imagePath = path.resolve(
        __dirname,
        "..",
        "uploads",
        "clientes",
        "docs",
        imgName
      );
      await fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error al eliminar la imagen:", err);
          res.status(500).json({ error: " Error al Eliminar el Registro" });
        }
  
        res.status(200).json({ error: "Imgen Elimanada con Exitos" });
      });
    } catch (error) {
      res.status(500).json({ error: " Error al Eliminar el Registro xx" });
    }
};
