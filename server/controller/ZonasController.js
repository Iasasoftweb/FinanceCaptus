import ZonasModels from "../models/ZonasModels.js";
import db from "../database/db.js";
import path from "path";
import multer from "multer";
import fs from "fs";
import { error } from "console";
import { fileURLToPath } from "url";
import { where } from "sequelize";

export const getAllzonas = async (req, res) => {
  try {
    const zonas = await ZonasModels.findAll();
    res.json(zonas);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const getOneZonas = async (req, res) => {
  try {
    const zona = await ZonasModels.findAll({ where: { id: req.params.id } });
    res.json(zona);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const updateZonas = async (req, res) => {
  try {
    await ZonasModels.update(req.body, {
      where: { id: req.params.id },
    });
    res.json({ message: "!Registro Actualizado Correctamente" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const createZonas = async (req, res) => {
  try {
    await ZonasModels.create(req.body);
    res.json({ message: "!Registro Creado Correctamente" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const deleteZonas = async (req, res) => {
  try {
    await ZonasModels.destroy({
      where: { id: req.params.id },
    });
    res.status(200)
       .json({ message: "!!Registro eliminados correctamente" });
  } catch (error) {
    res.json({ message: error.message });
  }
};
