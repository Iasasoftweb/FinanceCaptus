import JceModel from "../models/JceModel.js";

export const GetJce = async (req, res) => {
  try {
    const resultado = await JceModel.findOne({
      attributes: ["cedula", "nombres", "apellido1", "appelido2", "idNacionalidad", "idSexo"], // Especifica las columnas que deseas
      where: { cedula: req.params.cedula },
    });
    res.json(resultado);
  } catch (error) {
    res.json({ message: error.message });
  }
};
