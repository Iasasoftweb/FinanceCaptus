/**
 * Convierte una tasa mensual compuesta a cualquier período basado en días.
 * @param {number} tasaMensual - Tasa de interés mensual en porcentaje (ej: 10)
 * @param {number} diasPeriodo - Días del nuevo período (ej: 7 para semanal, 1 para diario)
 * @returns {number} Tasa equivalente en formato decimal (ej: 0.0225)
 */
export const calcularTasaEquivalente = (tasaMensual, diasPeriodo) => {
  const iMensual = tasaMensual / 100;
  // Fórmula de interés compuesto: (1 + i)^(dias_destino / 30) - 1
  return Math.pow(1 + iMensual, diasPeriodo / 30) - 1;
};


/**
 * Calcula la cuota fija mensual del Método Francés (Saldo Insoluto).
 * @param {number} capital - Monto total del préstamo
 * @param {number} tasaPeriodoDecimal - Tasa del período ya convertida a decimal
 * @param {number} totalCuotas - Número total de pagos
 * @returns {string} Cuota fija formateada a 2 decimales
 */
export const calcularCuotaFrancesa = (
  capital,
  tasaPeriodoDecimal,
  totalCuotas,
) => {
  if (tasaPeriodoDecimal === 0) return (capital / totalCuotas);

  const numerador = capital * tasaPeriodoDecimal;
  const denominador = 1 - Math.pow(1 + tasaPeriodoDecimal, -totalCuotas);

  return (numerador / denominador);
};
