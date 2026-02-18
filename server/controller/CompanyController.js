import CompanyModels from "../models/CompanyModels.js";

export const GetCompany = async (req, res) => {
  try {
    const resultado = await CompanyModels.findAll();
    res.json(resultado);
  } catch (error) {
    console.log(error);
  }
};

export const getOneCompany = async (req, res) => {
    try {
      const repuesta = await CompanyModels.findOne({ where: { id: req.params.id } });
      res.json(repuesta);
    } catch (error) {
      res.json({ message: error.message });
    }
  };

export const CreateCompany = async (req, res) => {
  try {
    await CompanyModels.create(req.body);
    res.json({ message: "!Registro Creado Correctamente" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

//Actualidar Registro
export const updateCompany = async (req, res) => {
  try {
    await CompanyModels.update(req.body, {
      where: { id: req.params.id },
    });

    res.json({ message: "!Registro Actualizado Correctamente" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    await CompanyModels.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "!!Registro eliminados correctamente" });
  } catch (error) {
    res.json({ message: error.message });
  }
};
