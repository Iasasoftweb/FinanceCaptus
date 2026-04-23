import UserModels from "../models/UserModels.js";
import RolesModels from "../models/RoleModels.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { json } from "sequelize";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import fs from "fs";
import { error } from "console";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getUser = async (req, res) => {
  try {
    const user = await UserModels.findAll({
      include: {
        model: RolesModels,
        attributes: ["nombre"],
      },
    });
    res.json(user);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const getOneUser = async (req, res) => {
  try {
    const usuarios = await UserModels.findAll({
      where: { id: req.params.id },
      include: {
        model: RolesModels,
        attributes: ["nombre"],
      },
    });
    if (usuarios.length > 0) {
      res.json(usuarios);
    } else {
      res.json({ message: "Registro no entrado" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const getGestor = async (req, res) => {
  try {
    const usuarios = await UserModels.findAll({
      where: { idrole: req.params.id },
   
      include: {
        model: RolesModels,
        attributes: ["nombre"],
      },
    });
    if (usuarios.length > 0) {
      res.json(usuarios);
    } else {
      res.json({ message: "Registro no entrado" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const getTipo = async (req, res) => {
  try {
    const usuarios = await UserModels.findAll({
      where: { idrole: req.params.tipo, estado: "1" },
      include: {
        model: RolesModels,
        attributes: ["nombre"],
      },
    });
    if (usuarios.length > 0) {
      res.json(usuarios);
    } else {
      res.json({ message: "Registro no entrado" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const validateUser = async (req, res) => {
  const { usuario, pass } = req.body;

  try {
    if (!usuario || !pass) {
      console.log("Datos requeridos");
      return res
        .status(400)
        .json({ message: "Usuario y clave son requeridas" });
    }

    if (usuario || pass) {
      console.log("Datos Correctos");

      const user = await UserModels.findOne({
        where: { usuario },
        include: {
          model: RolesModels,
          attributes: ["nombre"],
        },
      });

      if (!user) {
        console.log("Usuario no encontrado");
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const isMatch = await bcrypt.compare(pass, user.pass);

      if (!isMatch) {
        console.log("Clave incorrecta");
        return res.status(401).json({ message: "Contraseña incorrecta" });
      } else {
        console.log("Clave correcta");

        const token = jwt.sign({ id: user.id }, "secreto", { expiresIn: "3h" });
        const ID = user.id;
        const Role = user.tbrole.nombre;
        res.status(200).json({ message: "Login exitoso", token, ID, Role });
        //  return res.status(200).json(user);
      }
    }
  } catch (error) {
    console.error("Error al buscar el usuario", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const UpPass = async (req, res) => {
  try {
    const password = req.body.pass;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.pass, salt);
      const newPass = {
        ...req.body,
        pass: hashedPassword
      };
      await UserModels.update(newPass, { where: { id: req.params.id } } );
      res.json({ message: "Password Actualizado" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    await UserModels.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "!Registro Actualizado Correctamente" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const CreateUser = async (req, res) => {
  try {
    if (req.body.pass) {
      // Encripta la contraseña antes de crear el usuario
      const salt = await bcrypt.genSalt(10); // Genera una salt
      const hashedPassword = await bcrypt.hash(req.body.pass, salt); // Encripta la contraseña

      // Crea el usuario con la contraseña encriptada
      const newUser = {
        ...req.body, // Otros campos del usuario
        pass: hashedPassword, // Reemplaza la contraseña con la encriptada
      };
      await UserModels.create(newUser);
      res.json({ message: "!Registro Creado Correctamente" });
    } else {
      res.status(400).json({ message: "La contraseña es requerida" });
    }

    // await UserModels.create(req.body);
    // res.json({ message: "!Registro Creado Correctamente" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const updateUserImg = async (req, res) => {
  try {
    const avata = req.file.filename;
    await UserModels.update(avata, {
      where: { id: req.params.id },
    });

    res.json({ message: "!Registro Actualizado Correctamente" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const uploaduser = (req, res) => {
  res.send("carga de archivo realizo");
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/clientes/avatauser/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + uniqueSuffix + path.extname(file.originalname));
  },
});

export const uploadUser = multer({
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

export const avataDelete = async (req, res) => {
  const img = req.params.img;

  try {
    const imgName = img;
    console.log(imgName);
    const imagePath = path.resolve(
      __dirname,
      "..",
      "uploads",
      "clientes",
      "avatauser",
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
    res.status(500).json({ error: " Error al Eliminar el Imagen " });
  }
};
