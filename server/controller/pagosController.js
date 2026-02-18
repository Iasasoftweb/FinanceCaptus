import pagosModels from "../models/pagosModels.js";

export const getPagos = async (req, res) => {
  try {
    const resultadao = await pagosModels.findAll();
    res.json(resultadao);
  } catch (error) {
    console.error(error);
  }
};

export const postPagos = async (req, res) => {
  try {
    const datos = Array.isArray(req.body) ? req.body[0] : req.body;
    const insertar = await pagosModels.create(datos);
    res
      .status(201)
      .json({ message: "Pago guardado correctamente", data: insertar });
  } catch (error) {
    console.error("Error al crear el pago:", error);
    res.status(500).json({ message: error.message });
  }
};
