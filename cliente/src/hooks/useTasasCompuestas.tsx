// utils/finance.js

export const DIAS_POR_FRECUENCIA = {
  DIARIO: 1,
  SEMANAL: 7,
  BI_SEMANAL: 14,
  QUINCENAL: 15.2,
  MENSUAL: 30.4     
};

/**
 * Calcula todo el escenario del crédito incluyendo el monto de la cuota
 * @param {number} montoPrestamo - El dinero que pide el cliente (ej: 5000)
 * @param {number} tasaMensualBase - La tasa por defecto del sistema (ej: 10)
 * @param {string} frecuenciaElegida - 'diaria', 'semanal', etc.
 * @param {number} cantidadCuotas - Número de cuotas que elige el usuario
 */
export const calcularCreditoDinamico = (montoPrestamo, tasaMensualBase, frecuenciaElegida, cantidadCuotas) => {
  const diasFrecuencia = DIAS_POR_FRECUENCIA[frecuenciaElegida] || 30.4;
  const diasTotalesCredito = cantidadCuotas * diasFrecuencia;
  
  // 1. Calcular Tasa de la Frecuencia (Compuesta)
  const tasaMensualDecimal = tasaMensualBase / 100;
  const resultadoExponencial = Math.pow(1 + tasaMensualDecimal, diasFrecuencia / 30.4) - 1;
  const tasaFrecuencia = resultadoExponencial; // Se queda en decimal para la fórmula de la cuota

  // 2. FORMULA DE AMORTIZACIÓN FRANCESA (Cuota Fija)
  let montoCuota = 0;
  if (montoPrestamo > 0 && cantidadCuotas > 0) {
    if (tasaFrecuencia === 0) {
      montoCuota = montoPrestamo / cantidadCuotas; // Crédito sin interés
    } else {
      const numerador = tasaFrecuencia * Math.pow(1 + tasaFrecuencia, cantidadCuotas);
      const denominador = Math.pow(1 + tasaFrecuencia, cantidadCuotas) - 1;
      montoCuota = montoPrestamo * (numerador / denominador);
    }
  }

  const totalAPagar = montoCuota * cantidadCuotas;
  const totalIntereses = totalAPagar - montoPrestamo;

  
  return {
    diasTotalesCredito: Math.round(diasTotalesCredito),
    tasaFrecuenciaPorcentaje: Number((tasaFrecuencia * 100).toFixed(3)),
    montoCuota: Number(montoCuota.toFixed(2)),         // Redondeado a 2 decimales para dinero
    totalAPagar: Number(totalAPagar.toFixed(2)),
    totalIntereses: Number(totalIntereses.toFixed(2))
  };
};