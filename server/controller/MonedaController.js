import MonedaModels from "../models/MonedaModels.js";

export const getMoneda = async (req, res) => {
  try {
    const result = await MonedaModels.findAll();
    res.json(result);
  } catch (error) {
    console.log(error);
    res.json({ message: error });
  }
};
