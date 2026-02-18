import db from "../database/db.js";
import NotarioModels from "../models/NotarioModels.js";

export const getNotarios = async (req, res) => {
  try {
    const resultado = await NotarioModels.findAll();
    res.json(resultado);
  } catch (error) {
    res.json({ message: error.message });
  }
};
