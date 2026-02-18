import RolesModels from "../models/RoleModels.js";

export const getRoles = async (req, res) => {
  try {
    const roles = await RolesModels.findAll();
    if (roles) {
      res.json(roles);
    } else {
      res.json({ message: "Registros no encontrados" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};
