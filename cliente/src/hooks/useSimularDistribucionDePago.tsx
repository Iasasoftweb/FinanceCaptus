

  export const simularDistribucionDePago = (cuotas, montoAPagar) => {
  let efectivoDisponible = parseFloat(montoAPagar) || 0;
  const operacionesEfectuadas = []; // Historial de a dónde fue el dinero
  
  // Clonar y asegurar que cada cuota contenga sus propiedades de balance calculadas internamente
  const cuotasCalculadas = cuotas?.map(c => {
    const montoTotalCuota = (parseFloat(c.montocapital) || 0) + (parseFloat(c.montointeres) || 0);
    const montoPagadoActual = parseFloat(c.montopagado) || 0;
    const saldoPendienteActual = Math.max(0, montoTotalCuota - montoPagadoActual);
     
    return {
      ...c,
      montoTotalCuota,
      nuevoMontoPagado: montoPagadoActual,
      nuevoSaldoPendiente: saldoPendienteActual
    };
  });

  for (let i = 0; i < cuotasCalculadas.length; i++) {
    const cuota = cuotasCalculadas[i];
    console.log(cuota)
    if (efectivoDisponible <= 0.01) break; // Ya no hay más dinero que distribuir
    if (cuota.nuevoSaldoPendiente <= 0.05) continue; // Esta cuota ya está saldada, saltar a la siguiente

    const saldoAnterior = cuota.nuevoSaldoPendiente;

    if (efectivoDisponible >= saldoAnterior) {
      // CASO A: El efectivo salda por completo la cuota actual y sobra dinero para derramar
      efectivoDisponible -= saldoAnterior;
      cuota.nuevoMontoPagado += saldoAnterior;
      cuota.nuevoSaldoPendiente = 0;
      
      operacionesEfectuadas.push({
        numero: cuota.numcuota,
        montoAplicado: saldoAnterior,
        tipo: 'SALDAR',
        detalle: `Se saldó la cuota #${cuota.numcuota} con $${saldoAnterior.toLocaleString('es-DO', { minimumFractionDigits: 2 })}`
      });
    } else {
      // CASO B: El efectivo no alcanza para saldar, se realiza un ABONO parcial y se consume el dinero
      cuota.nuevoMontoPagado += efectivoDisponible;
      cuota.nuevoSaldoPendiente = saldoAnterior - efectivoDisponible;
      
      operacionesEfectuadas.push({
        numero: cuota.numcuota,
        montoAplicado: efectivoDisponible,
        tipo: 'ABONAR',
        detalle: `Se abonaron $${efectivoDisponible.toLocaleString('es-DO', { minimumFractionDigits: 2 })} a la cuota #${cuota.cuota}. Pendiente: $${cuota.nuevoSaldoPendiente.toLocaleString('es-DO', { minimumFractionDigits: 2 })}`
      });
      efectivoDisponible = 0; // Se consumió todo el dinero
    }
  }

  return {
    cuotasCalculadas,
    operacionesEfectuadas,
    sobranteFavor: efectivoDisponible // Dinero sobrante que excede la deuda completa
  };
};