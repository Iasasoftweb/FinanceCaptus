import TipoIdentidadModels from "../models/TipoIdentidadModels.js";

export const getAllTipoDocumento = async (req, res) =>{
    try {
        const tipodoc = await TipoIdentidadModels.findAll();
        res.json(tipodoc);
      } catch (error) {
        res.json({ message: error.message });
      }
}