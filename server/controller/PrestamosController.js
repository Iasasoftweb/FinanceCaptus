import ClientesModel from "../models/ClienteModels.js";
import PrestaModels from "../models/PrestaModels.js";
import { fn, col } from "sequelize";
import ZonasModels from "../models/ZonasModels.js";
import NotarioModels from "../models/NotarioModels.js";


export const getPrestamos = async (req, res) => {
  try {
    const resultado = await PrestaModels.findAll({
      include: [
        {
          model: ClientesModel,
          attributes: [
            [
              fn("CONCAT", col("nombres"), " ", col("apellidos")),
              "nombre_completo",
            ],
            "dni",
            "imgFOTOS",
            "id",
          ],
          include: {
            model: ZonasModels,
            attributes: ["nombrerutas"],
          },
        },
        { model: NotarioModels, attributes: ["nombrecompleto"] },
      ],
    });
    res.json(resultado);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const getOnePrestamos = async (req, res) => {
  try {
    const repuesta = await PrestaModels.findOne({ 
      where: { id: req.params.id },
      include: [
        {
          model: ClientesModel,
          attributes: [
            [
              fn("CONCAT", col("nombres"), " ", col("apellidos")),
              "nombre_completo",
            ],
            "dni",
            "imgFOTOS",
            "id"
          ],
          include: {
            model: ZonasModels,
            attributes: ["nombrerutas"],
          },
        },
        { model: NotarioModels, attributes: ["nombrecompleto"] },
      ],
    });
    res.json(repuesta);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const CreatePrestamos = async (req, res) => {

  try {
    const datos = Array.isArray(req.body) ? req.body[0] : req.body;
    const nuevoPresamo = await PrestaModels.create(datos);
    res.status(201).json({ message: "Préstamo creado correctamente", data: nuevoPresamo });
} catch (error) {
  console.error("Error al crear el préstamo:", error);
  res.status(500).json({ message: error.message });
  }

};

export const updatePrestamos = async (req, res) => {
  try {
    await PrestaModels.update(req.body, {
      where: { id: req.params.id },
    });

    res.json({ message: "!Registro Actualizado Correctamente" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const updateSituacionPrestamo = async (req, res) => {
try {
    // CAMBIO AQUÍ: Extraemos 'situacion' en lugar de 'nuevoEstado'
    const { situacion } = req.body; 
    const { id } = req.params;

    // 1. Validar que venga el campo
    if (!situacion) {
      return res.status(400).json({ message: "El campo situacion es requerido" });
    }

    // 2. Validar estados permitidos
    const estadosValidos = ["EVALUACION", "ACEPTADO", "INCOMPLETO", "RECHAZADO"];
    if (!estadosValidos.includes(situacion)) {
      return res.status(400).json({ message: "Situación inválida" });
    }

    // 3. Verificar si el préstamo existe
    const prestamoExiste = await PrestaModels.findByPk(id);
    if (!prestamoExiste) {
      return res.status(404).json({ message: "Préstamo no encontrado" });
    }

    // 4. Realizar la actualización usando la variable correcta
    await PrestaModels.update(
      { situacion: situacion }, // Asigna el valor recibido a la columna 'situacion'
      { where: { id } }
    );

    // 5. Responder con éxito
    res.json({ 
      message: "Situación actualizada correctamente", 
      situacion: situacion 
    });

  } catch (error) {
    console.error("Error en updateSituacionPrestamo:", error);
    res.status(500).json({ message: error.message });
  }
};