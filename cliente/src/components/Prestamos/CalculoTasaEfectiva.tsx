
import { safeFixed } from "../UtilsStuff";

 export const obtenerFactorMensual = (frecuencia) => {
    switch (frecuencia) {
      case 'DIARIO': return 30;      // 30 pagos al mes
      case 'SEMANAL': return 4.3333; // ~4.33 semanas al mes
      case 'QUINCENAL': return 2;    // 2 quincenas al mes
      case 'MENSUAL': return 1;      // Ya es mensual
      default: return 4.3333;
    }
  };

export const calcularTasaNewtonRaphson = (monto, n, pago) => {
    // Estimación inicial basada en el costo total sobre el capital
    let i = (pago * n / monto - 1) / n;
    if (i <= 0) i = 0.01;
    
    const maxIter = 100;
    const precision = 0.0000001;

    for (let j = 0; j < maxIter; j++) {
      const powNI = Math.pow(1 + i, n);
      // Función: Valor Presente - Monto = 0
      const f = pago * (1 - Math.pow(1 + i, -n)) / i - monto;
      
      // Derivada de la función f(i)
      const df = pago * (n * Math.pow(1 + i, -n - 1) * i - (1 - Math.pow(1 + i, -n))) / Math.pow(i, 2);
      
      let iSiguiente = i - f / df;
      
      if (Math.abs(iSiguiente - i) < precision) {
        return iSiguiente;
      }
      i = iSiguiente;
    }
    return i;
  };

  

export const calcularTasaEfectiva = (monto, cuotas, pagoCuota) => {
    let i = 0.02; // Estimación inicial (2%)
    const maxIter = 100;
    const precision = 0.0000001;

    for (let j = 0; j < maxIter; j++) {
      // f(i) = Monto * i - Pago * (1 - (1 + i)^-n)
      let f = monto * i - pagoCuota * (1 - Math.pow(1 + i, -cuotas));
      // f'(i) = Monto - Pago * n * (1 + i)^-(n+1)
      let df = monto - pagoCuota * cuotas * Math.pow(1 + i, -cuotas - 1);
      
      let iSiguiente = i - f / df;
      
      if (Math.abs(iSiguiente - i) < precision) {
        return iSiguiente;
      }
      i = iSiguiente;
    }
    return i;
  };
  

 export  const calculateFrenchCuota = (capital, term, ratePercent) => {
    const r = ratePercent / 100;
    if (r <= 0) return capital / term;
    return (capital * r) / (1 - Math.pow(1 + r, -term));
  };


  export  const solveRateForFrench = (capital, term, desiredCuota) => {
    if (capital <= 0 || term <= 0 || desiredCuota <= (capital / term)) return 0;
    
    let low = 0;
    let high = 5.0; // Soporta tasas periódicas de hasta el 500% semanal/quincenal/mensual
    let tolerance = 0.000001;
    let maxIterations = 100;

    for (let i = 0; i < maxIterations; i++) {
      let mid = (low + high) / 2;
      let calculatedCuota = (capital * mid) / (1 - Math.pow(1 + mid, -term));

      if (Math.abs(calculatedCuota - desiredCuota) < tolerance) {
        return parseFloat(safeFixed(mid * 100, 4));
      }

      if (calculatedCuota > desiredCuota) {
        high = mid;
      } else {
        low = mid;
      }
    }
    return parseFloat(safeFixed(((low + high) / 2) * 100, 4));
  };




