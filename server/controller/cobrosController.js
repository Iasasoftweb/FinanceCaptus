import PrestaModels from "../models/PrestaModels.js";
import CuotasModels from "../models/CuotasModels.js";
import db from "../database/db.js"; // Tu instancia de conexión a Sequelize

export const procesarCobroTransaccional = async (req, res) => {
  const { idprestamo, montoRecibido } = req.body;
  const efectivo = parseFloat(montoRecibido);

  if (!idprestamo || isNaN(efectivo) || efectivo <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Datos de cobro inválidos." });
  }

  // 1. Iniciar la transacción administrada por Sequelize
  const t = await db.transaction();

  try {
    // 2. Buscar el préstamo bloqueando la fila para actualización concurrente (FOR UPDATE)
    const prestamo = await PrestaModels.findByPk(idprestamo, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!prestamo) {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, message: "Préstamo no encontrado." });
    }

    // 3. Obtener todas las cuotas del préstamo ordenadas por su número de cuota
    const cuotas = await CuotasModels.findAll({
      where: { idprestamo },
      order: [["numcuota", "ASC"]],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (cuotas.length === 0) {
      await t.rollback();
      return res
        .status(404)
        .json({
          success: false,
          message: "No se encontraron cuotas para este préstamo.",
        });
    }

    let efectivoDisponible = efectivo;
    const detallesRecibo = [];

    // 4. Ciclo de distribución en cascada
    for (const cuota of cuotas) {
      if (efectivoDisponible <= 0.009) break; // No queda saldo por distribuir

      const montocuota = parseFloat(cuota.montocuota || 0);
      const montopagadoActual = parseFloat(cuota.montopagado || 0);
      const saldoPendiente = Math.max(0, montocuota - montopagadoActual);

      // Si la cuota ya está marcada como pagada o el saldo pendiente es nulo, la saltamos
      if (saldoPendiente <= 0.05 || cuota.pagada === "true") continue;

      let montoAplicado = 0;
      let tipoOperacion = "ABONO";

      if (efectivoDisponible >= saldoPendiente) {
        // Se salda la cuota completa y el remanente derrama a la siguiente
        montoAplicado = saldoPendiente;
        efectivoDisponible -= saldoPendiente;
        tipoOperacion = "SALDO";
        cuota.pagada = "true";
        cuota.fechapago = new Date();
      } else {
        // Se abona el saldo restante del efectivo y se detiene el derrame
        montoAplicado = efectivoDisponible;
        efectivoDisponible = 0;
        tipoOperacion = "ABONO";
      }

      // --- DISTRIBUCIÓN ESPECÍFICA (Mora -> Interés -> Capital) ---
      let remanenteAplicar = montoAplicado;

      // A. Amortizar Mora
      const moraMax = parseFloat(cuota.montomora || 0);
      const moraPagadaAct = parseFloat(cuota.morapago || 0);
      const moraPendiente = Math.max(0, moraMax - moraPagadaAct);
      let aplicarMora = 0;
      if (remanenteAplicar > 0 && moraPendiente > 0) {
        aplicarMora = Math.min(remanenteAplicar, moraPendiente);
        cuota.morapago = parseFloat((moraPagadaAct + aplicarMora).toFixed(2));
        remanenteAplicar -= aplicarMora;
      }

      // B. Amortizar Interés
      const intMax = parseFloat(cuota.montointeres || 0);
      const intPagadoAct = parseFloat(cuota.interespagado || 0);
      const intPendiente = Math.max(0, intMax - intPagadoAct);
      let aplicarInt = 0;
      if (remanenteAplicar > 0 && intPendiente > 0) {
        aplicarInt = Math.min(remanenteAplicar, intPendiente);
        cuota.interespagado = parseFloat(
          (intPagadoAct + aplicarInt).toFixed(2),
        );
        remanenteAplicar -= aplicarInt;
      }

      // C. Amortizar Capital
      const capMax = parseFloat(cuota.montocapital || 0);
      const capPagadoAct = parseFloat(cuota.capitalpagado || 0);
      const capPendiente = Math.max(0, capMax - capPagadoAct);
      let aplicarCap = 0;
      if (remanenteAplicar > 0 && capPendiente > 0) {
        aplicarCap = Math.min(remanenteAplicar, capPendiente);
        cuota.capitalpagado = parseFloat(
          (capPagadoAct + aplicarCap).toFixed(2),
        );
        remanenteAplicar -= aplicarCap;
      }

      // Guardar saldos finales calculados de la cuota
      cuota.montopagado = parseFloat(
        (montopagadoActual + montoAplicado).toFixed(2),
      );
      cuota.montopendiente = parseFloat(
        (montocuota - cuota.montopagado).toFixed(2),
      );

      if (cuota.montopendiente <= 0.05) {
        cuota.pagada = "true";
        cuota.estado = "PAGADA";
      } else {
        cuota.estado = "ABONADA";
      }

      // Guardar cuota en la base de datos dentro de la transacción
      await cuota.save({ transaction: t });

      detallesRecibo.push({
        idcuota: cuota.id,
        numcuota: cuota.numcuota,
        montoAplicado: parseFloat(montoAplicado.toFixed(2)),
        tipoOperacion,
        desglose: {
          mora: aplicarMora,
          interes: aplicarInt,
          capital: aplicarCap,
        },
      });
    }

    if (detallesRecibo.length === 0) {
      await t.rollback();
      return res
        .status(400)
        .json({
          success: false,
          message: "El préstamo ya se encuentra completamente al día.",
        });
    }

    // 5. Recalcular los acumuladores globales del Préstamo
    const todasLasCuotas = await CuotasModels.findAll({
      where: { idprestamo },
      transaction: t,
    });

    const totalPagadoPrestamo = todasLasCuotas.reduce(
      (acc, c) => acc + parseFloat(c.montopagado || 0),
      0,
    );
    const totalCapitalPagado = todasLasCuotas.reduce(
      (acc, c) => acc + parseFloat(c.capitalpagado || 0),
      0,
    );
    const totalCuotasPagas = todasLasCuotas?.filter(
      (c) => c.pagada === "true",
    ).length;

    prestamo.cuotaspagas = totalCuotasPagas;
    prestamo.montopagado = parseFloat(totalPagadoPrestamo.toFixed(2));
    prestamo.capitalpendiente = parseFloat(
      Math.max(0, (prestamo.capital || 0) - totalCapitalPagado).toFixed(2),
    );
    prestamo.balancependiente = parseFloat(
      Math.max(
        0,
        (prestamo.montoprestar || 0) +
          (prestamo.montointeres || 0) -
          totalPagadoPrestamo,
      ).toFixed(2),
    );
    prestamo.fechaultimopago = new Date();

    if (prestamo.balancependiente <= 0.05) {
      prestamo.estado = "SALDADO";
    }

    await prestamo.save({ transaction: t });

    // 6. Confirmar transacción
    await t.commit();

    // Código de recibo único para control de caja
    const codigoRecibo = `RC-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    return res.status(200).json({
      success: true,
      message: "Cobro procesado correctamente en la base de datos.",
      recibo: {
        codigo: codigoRecibo,
        montoTotal: efectivo,
        fecha: new Date(),
        idprestamo: idprestamo,
        detalles: detallesRecibo,
        sobranteFavor: parseFloat(efectivoDisponible.toFixed(2)),
      },
      prestamoActualizado: {
        id: prestamo.id,
        idclientes: prestamo.idclientes,
        cuotaspagas: prestamo.cuotaspagas,
        montopagado: prestamo.montopagado,
        capitalpendiente: prestamo.capitalpendiente,
        balancependiente: prestamo.balancependiente,
        estado: prestamo.estado,
        cuotas: todasLasCuotas,
      },
    });
  } catch (error) {
    await t.rollback();
    console.error("Error procesando cobro en Sequelize:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error interno en el servidor." });
  }
};
