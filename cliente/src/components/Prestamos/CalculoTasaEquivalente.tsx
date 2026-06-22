// utils/finance.js

/**
 * Calcula las tasas y la cantidad exacta de cuotas dinámicamente
 * @param {number} tasaMensual - Tasa base del sistema (ej: 10)
 * @param {number} diasTotalesCredito - Plazo total del crédito en días (ej: 91 para un trimestre, 180, 365, etc.)
 */
export const obtenerEsquemaFrecuenciasDinamico = (
  tasaMensual,
  diasTotalesCredito = 91,
) => {
  if (!tasaMensual || tasaMensual <= 0) return [];
  console.log(diasTotalesCredito);
  // Definimos la duración en días de cada frecuencia de pago
  const mapeoFrecuencias = [
    { id: "diaria", nombre: "Diaria", diasFrecuencia: 1 },
    { id: "semanal", nombre: "Semanal", diasFrecuencia: 7 },
    { id: "bi-semanal", nombre: "Bi-semanal", diasFrecuencia: 14 },
    {
      id: "quincenal",
      nombre: "Quincenal",
      diasFrecuencia: diasTotalesCredito / 6,
    }, // 6 cuotas en el plazo
    {
      id: "mensual",
      nombre: "Mensual",
      diasFrecuencia: diasTotalesCredito / 3,
    }, // 3 cuotas en el plazo
  ];

  const diasMesBase = diasTotalesCredito / 3; // El "mes" relativo del sistema

  return mapeoFrecuencias.map((frec) => {
    // 1. CALCULO DINÁMICO DE CUOTAS: Días totales del crédito / Días de esta frecuencia
    const cantidadCuotas = diasTotalesCredito / frec.diasFrecuencia;

    // 2. CÁLCULO DE TASA COMPUESTA
    let tasaCalculada = tasaMensual;
    if (frec.id !== "mensual") {
      const tasaDecimal = tasaMensual / 100;
      const resultadoExponental =
        Math.pow(1 + tasaDecimal, frec.diasFrecuencia / diasMesBase) - 1;
      tasaCalculada = resultadoExponental * 100;
    }

    return {
      id: frec.id,
      nombre: frec.nombre,
      dias: frec.diasFrecuencia,
      tasa: tasaCalculada,
      // Redondeamos las cuotas a 1 decimal por si dan números periódicos (ej: 6.5)
      cuotas: Number(cantidadCuotas.toFixed(1)),
    };
  });
};

export const buscarTasaImplicita = (capital, montoCuota, cantidadCuotas) => {
  if (capital <= 0 || montoCuota <= 0 || cantidadCuotas <= 0) return 0;
  if (montoCuota * cantidadCuotas <= capital) return 0; // No hay interés

  let tasaBaja = 0;
  let tasaAlta = 5.0; // Límite inicial de 500% por período (ajustable)
  let tasaMedia = 0;
  const precision = 0.000001;
  const maxIteraciones = 100;

  for (let i = 0; i < maxIteraciones; i++) {
    tasaMedia = (tasaBaja + tasaAlta) / 2;

    // Calcular qué cuota daría esta tasa media
    const numerador = tasaMedia * Math.pow(1 + tasaMedia, cantidadCuotas);
    const denominador = Math.pow(1 + tasaMedia, cantidadCuotas) - 1;
    const cuotaCalculada = capital * (numerador / denominador);

    // Comparar con la cuota real que introdujo el usuario
    if (Math.abs(cuotaCalculada - montoCuota) < precision) {
      break;
    }

    if (cuotaCalculada > montoCuota) {
      tasaAlta = tasaMedia;
    } else {
      tasaBaja = tasaMedia;
    }
  }

  // Retorna la tasa de la frecuencia en formato porcentaje (ej: 3.97)
  return tasaMedia * 100;
};

/**
 * Convierte una tasa de frecuencia de vuelta a la Tasa Mensual Base del Sistema (Inversa)
 */
export const convertirFrecuenciaAMensual = (
  tasaFrecuenciaPorcentaje,
  frecuenciaElegida,
) => {
  const DIAS_POR_FRECUENCIA = {
    diaria: 1,
    semanal: 7,
    bi_semanal: 14,
    quincenal: 15.2,
    mensual: 30.4,
  };
  const diasFrecuencia = DIAS_POR_FRECUENCIA[frecuenciaElegida] || 30.4;

  const tasaFrecDecimal = tasaFrecuenciaPorcentaje / 100;

  // Operación inversa exponencial: (1 + tasaFrec)^(30.4 / diasFrec) - 1
  const tasaMensualDecimal =
    Math.pow(1 + tasaFrecDecimal, 30.4 / diasFrecuencia) - 1;

  return tasaMensualDecimal * 100;
};
