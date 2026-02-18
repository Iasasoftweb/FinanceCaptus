import ClientesModel from "../models/ClienteModels.js";
import ZonasModels from "../models/ZonasModels.js";
import NotarioModels from "../models/NotarioModels.js";
import db from "../database/db.js";
import path from "path";
import multer from "multer";
import fs from "fs";
import { error } from "console";
import { fileURLToPath } from "url";

//Mostrar todos los registros

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllClientes = async (req, res) => {
  try {
    const clientes = await ClientesModel.findAll({
      include: [
        {
          model: ZonasModels,
          attributes: ["nombrerutas"],
        },
      ],
    });
    res.json(clientes);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const GetAll = async (req, res) => {
  try {
    await ClientesModel.findAll({
      include: [
        {
          model: ZonasModels,
          attributes: ["nombrerutas"],
        },
      ],
    }).then((clientes) => res.json(clientes));
  } catch {
    res.json({ message: error.message });
  }
};

// Mostrar un Registro

export const getCliente = async (req, res) => {
  try {
    const cliente = await ClientesModel.findAll({
      where: { id: req.params.id },
      include: [
        {
          model: ZonasModels,
          attributes: ["nombrerutas"],
        },
      ]
    });
    res.json(cliente[0]);
    // res.status(200).json({message: 'Consulta realiza con exitos'})
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const ClientesActivos = async (req, res) => {
  try {
    const resultados = await ClientesModel.findAll({
      include: [
        {
          model: ZonasModels,
          attributes: ["nombrerutas"],
        },
      ],
      where: { estado: req.params.estado },
    });
    res.json(resultados);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const ClientesRutas = async (req, res) => {
  try {
    const Filter = await ClientesModel.findAll({
      where: { idrutas: req.params.rutas },
      include: [
        {
          model: ZonasModels,
          attributes: ["nombrerutas"],
        },
      ],
    });
    res.json(Filter);
  } catch (error) {
    console.log(error);
  }
};

// Buscar por DNI
export const existeDni = async (req, res) => {
  try {
    const clienteDNI = await ClientesModel.findAll({
      where: { dni: req.params.dni },
    });
    res.json(clienteDNI[0]);
  } catch (error) {
    res.json({ message: error.message });
  }
};

// Crear Registro

export const CreateClientes = async (req, res) => {
  try {
    await ClientesModel.create(req.body);
    res.json({ message: "!Registro Creado Correctamente" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

//Actualidar Registro
export const updateCliente = async (req, res) => {
  try {
    await ClientesModel.update(req.body, {
      where: { id: req.params.id },
    });

    res.json({ message: "!Registro Actualizado Correctamente" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const updateClienteImg = async (req, res) => {
  try {
    const imgFOTOS = req.file.filename;
    await ClientesModel.update(imgFOTOS, {
      where: { id: req.params.id },
    });

    res.json({ message: "!Registro Actualizado Correctamente" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

//Eliminar Registro

export const deleteCliente = async (req, res) => {
  try {
    const ID = req.params.id;

    const clientedelete = await ClientesModel.findOne({
      where: { id: req.params.id },
    });

    if (!clientedelete) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    const imgName = clientedelete.imgFOTOS;

    console.log(imgName);
    if (imgName) {
      const imagePath = path.resolve(
        __dirname,
        "..",
        "uploads",
        "clientes",
        "avata",
        imgName
      );
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error al eliminar la imagen:", err);
          // No detener el proceso de eliminación si el archivo no existe
        }
      });
    }

    await ClientesModel.destroy({
      where: { id: req.params.id },
    });

    res
      .status(200)
      .json({ message: "Cliente y su imagen eliminados correctamente" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

// Subir Archivo

export const uploadImg = (req, res) => {
  res.send("carga de archivo realizo");
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/clientes/avata");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: "10000000" },
  fileFilter: (req, file, cb) => {
    const fileType = /jpg|jpeg|png|gif/;
    const minType = fileType.test(file.mimetype);
    const extname = fileType.test(path.extname(file.originalname));

    if (minType && extname) {
      return cb(null, true);
    }
    cb("Give proper files formate to upload");
  },
});

//Elimina Imagen

export const ImgDelete = async (req, res) => {
  const image = req.params.image;

  try {
    const imgName = image;
    console.log(imgName);
    const imagePath = path.resolve(
      __dirname,
      "..",
      "uploads",
      "clientes",
      "avata",
      imgName
    );
    await fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error al eliminar la imagen:", err);
        res.status(500).json({ error: " Error al Eliminar el Imagen" });
      }

      res.status(200).json({ error: "Imgen Elimanada con Exitos" });
    });
  } catch (error) {
    res.status(500).json({ error: " Error al Eliminar el Imagen" });
  }
};
