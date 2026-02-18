import CuotasModels from '../models/CuotasModels.js';
import PrestaModels from '../models/PrestaModels.js';

export const GetCuota = async (req, res) => {
  const { idprestamo } = req.params;
  const idNumerico = Number(idprestamo);


  try {
    
    const cuotas = await CuotasModels.findAll({
      where: { idprestamo: idNumerico },
      // logging: (sql) => {
      //   console.log('4. SQL generado:', sql);
      // },
      // raw: true // Solo para debugging
    });
   
    if (!cuotas || cuotas.length === 0) {
      console.log('6. No se encontraron resultados');
      // Verificación adicional
      const existePrestamo = await PrestaModels.findByPk(idNumerico);
      console.log('7. Existe préstamo?', !!existePrestamo);
      
      return res.status(404).json({
        success: false,
        message: `No se encontraron cuotas para el préstamo ${idNumerico}`,
        existe_prestamo: !!existePrestamo
      });
    }

    console.log('8. Resultado final:', JSON.stringify(cuotas, null, 2));
    res.json({ success: true, data: cuotas });

  } catch (error) {
    console.error('9. Error completo:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error_details: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  } finally {
    console.log('=== DEBUG FIN ===');
  }
};

const validateCuotas = (cuotas) => {
  const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
  return cuotas.every(cuota => dateRegex.test(cuota.fechapago));
};

export const getCuotas = async (req, res) => {
  try {
    const cuotas = await CuotasModels.findAll();
    res.json(cuotas);
  } catch (error) {
    res.json({ message: error.message });
  };
};

export const postCuotas = async (req, res) => {
  try {
    const cuotas = req.body;
    if (!validateCuotas(cuotas)) {
      return res.status(400).json({ message: 'Formato de fecha incorrecto' });
    }
    await CuotasModels.bulkCreate(cuotas);
    res.json({ message: "!Registro Creado Correctamente" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const putCuotas = async (req, res) => {
  try {
    await CuotasModels.update(req.body, {
      where: { id: req.params.id },
    });

    res.json({ message: "!Registro Actualizado Correctamente" });
  } catch (error) {
    res.json({ message: error.message });
  }
}; 

export const deleteCuotas = async (req, res) => {
  try {
    await CuotasModels.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "!!Registro eliminados correctamente" });
  } catch (error) {
    res.json({ message: error.message });
  }
};
