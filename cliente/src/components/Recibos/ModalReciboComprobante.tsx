import { useState } from "react";

export function ModalReciboComprobante({ recibo, empresa, onClose }) {

  const [telefono, setTelefono] = useState(recibo.telefono || '');
  const [codigoPais, setCodigoPais] = useState('1'); // Por defecto +1 (República Dominicana / NA)

  const handlePrint = () => {
    window.print();
  };

   // Función constructora de texto formateado para WhatsApp
  const enviarPorWhatsApp = () => {
    if (!telefono) {
      alert("Por favor, introduzca un número de teléfono válido.");
      return;
    }

    // Limpiar el número de caracteres especiales o espacios vacíos
    const numeroLimpio = telefono.replace(/\D/g, '');

    let msg = `${empresa.empresa} 💳\n`;
    msg += `*SERVICIOS FINANCIEROS Y COBROS*\n`;
    msg += `------------------------------------------------\n`;
    msg += `📄 *RECIBO:* ${recibo.codigo}\n`;
    msg += `📅 *FECHA:* ${new Date(recibo.fecha).toLocaleString('es-DO', { hour12: true })}\n`;
    msg += `👤 *CLIENTE:* ${recibo.cliente.toUpperCase()}\n`;
    msg += `🪪 *CÉDULA:* ${recibo.cedula}\n`;
    msg += `📍 *ZONA:* ${recibo.zona || 'N/D'}\n`;
    msg += `------------------------------------------------\n`;
    msg += `📝 *DETALLE DE AMORTIZACIÓN:*\n\n`;

    recibo.detalles.forEach((det) => {
      msg += `• *Cuota #${det.numcuota}* (${det.tipoOperacion})\n`;
      msg += `   *Monto Aplicado:* $${det.montoAplicado.toLocaleString('es-DO', { minimumFractionDigits: 2 })}\n`;
      msg += `   _Desglose:_ (Cap: $${det.desglose.capital.toFixed(2)} | Int: $${det.desglose.interes.toFixed(2)}${det.desglose.mora > 0 ? ` | Mora: $${det.desglose.mora.toFixed(2)}` : ''})\n\n`;
    });

    msg += `------------------------------------------------\n`;
    msg += `💰 *MONTO RECIBIDO:* *$${recibo.montoTotal.toLocaleString('es-DO', { minimumFractionDigits: 2 })}*\n`;
    
    if (recibo.sobranteFavor > 0) {
      msg += `💵 *SOBRANTE A FAVOR (CAJA):* *$${recibo.sobranteFavor.toLocaleString('es-DO', { minimumFractionDigits: 2 })}*\n`;
    }
    msg += `------------------------------------------------\n`;
    msg += `✅ _¡Gracias por mantenerse al día con sus pagos!_\n`;
    msg += `_Conserve este comprobante como garantía oficial de cobro._`;

    // Codificar texto para formato URL
    const urlMensaje = encodeURIComponent(msg);
    const linkWhatsApp = `https://api.whatsapp.com/send?phone=${codigoPais}${numeroLimpio}&text=${urlMensaje}`;

    // Abrir WhatsApp en una nueva pestaña (automático en Web o App móvil)
    window.open(linkWhatsApp, '_blank');
  };

  return (
    <div 
      className="modal d-block" 
      tabIndex="-1" 
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(3px)', zIndex: 1100 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-impresion-contenedor" style={{ maxWidth: '450px' }}>
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          
          <div className="modal-header bg-success text-white py-3 px-4 border-0 d-print-none">
            <h5 className="modal-title fw-bold" style={{ fontSize: '15px' }}>Comprobante de Caja Generado</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* CONTENEDOR DE IMPRESIÓN */}
          <div className="modal-body p-4 bg-white" id="recibo-a-imprimir">
            
            {/* Encabezado Corporativo */}
            <div className="text-center mb-2">
              <h4 className="fw-bolder text-dark mb-1 font-monospace text-uppercase" style={{ fontSize: '18px', letterSpacing: '0.02em' }}>{empresa.empresa}</h4>
              <p className="text-muted mb-0" style={{ fontSize: '11px', lineHeight: '1.3' }}>
                Servicios Financieros de Cobros & Préstamos<br />
                República Dominicana | Tel: {empresa.telefono1} / {empresa.telefono2}
              </p>
              <div className="linea-punteada my-2"></div>
            </div>

            {/* Datos de Cabecera del Ticket */}
            <div className="row g-2 text-dark font-monospace mb-2" style={{ fontSize: '12px' }}>
              <div className="col-12 d-flex justify-content-between">
                <span>RECIBO:</span>
                <span className="fw-bold">{recibo.codigo}</span>
              </div>
              <div className="col-12 d-flex justify-content-between">
                <span>FECHA:</span>
                <span>{new Date(recibo.fecha).toLocaleString('es-DO', { hour12: true })}</span>
              </div>
              
              <div className="col-12 mt-2">
                <span className="text-muted d-block" style={{ fontSize: '10px' }}>CLIENTE:</span>
                <strong className="text-dark text-uppercase d-block" style={{ fontSize: '13px' }}>{recibo.cliente}</strong>
              </div>
              
              <div className="col-12 d-flex justify-content-between mt-1">
                <span>CÉDULA:</span>
                <span className="fw-bold">{recibo.cedula}</span>
              </div>
              <div className="col-12 d-flex justify-content-between">
                <span>ZONA:</span>
                <span className="text-uppercase fw-bold">{recibo.zona || 'N/D'}</span>
              </div>
            </div>

            <div className="linea-punteada my-2"></div>

            {/* Listado de Distribución de Cuotas */}
            <h6 className="fw-bold mb-2 text-uppercase text-secondary font-monospace text-center" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>
              APLICACIÓN DE COBRO A CUOTAS
            </h6>
            
            <div className="table-responsive">
              <table className="table table-sm table-borderless mb-0 text-dark font-monospace" style={{ fontSize: '11px' }}>
                <thead>
                  <tr className="border-bottom border-secondary text-muted" style={{ fontSize: '10px' }}>
                    <th>CUOTA</th>
                    <th className="text-center">TIPO</th>
                    <th className="text-end">APLICADO</th>
                  </tr>
                </thead>
                <tbody>
                  {recibo.detalles.map((det, index) => (
                    <tr key={index} className="align-middle">
                      <td className="py-1 text-start">
                        <div className="fw-bold">Cuota #{det.numcuota}</div>
                        <div className="text-muted" style={{ fontSize: '9px' }}>
                          (Cap: ${det.desglose.capital.toFixed(2)} | Int: ${det.desglose.interes.toFixed(2)} {det.desglose.mora > 0 && `| Mora: $${det.desglose.mora.toFixed(2)}`})
                        </div>
                      </td>
                      <td className="text-center py-1">
                        <span className="badge bg-dark px-1.5 py-0.5" style={{ fontSize: '9px' }}>
                          {det.tipoOperacion}
                        </span>
                      </td>
                      <td className="text-end fw-bold text-dark py-1">
                        ${det.montoAplicado.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="linea-punteada my-2"></div>

            {/* Importes del Pago */}
            <div className="font-monospace text-dark" style={{ fontSize: '12px' }}>
              <div className="d-flex justify-content-between py-1">
                <span>MONTO RECIBIDO:</span>
                <strong className="text-success fw-bold" style={{ fontSize: '14px' }}>
                  ${recibo.montoTotal.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                </strong>
              </div>
              
              {recibo.sobranteFavor > 0 && (
                <div className="d-flex justify-content-between py-1 text-danger fw-bold">
                  <span>SOBRANTE EN CAJA:</span>
                  <span>${recibo.sobranteFavor.toLocaleString('es-DO', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
            </div>

            <div className="linea-punteada my-2"></div>

            {/* Mensaje de Garantía */}
            <div className="text-center mt-2">
              <p className="text-muted mb-0" style={{ fontSize: '10px', lineHeight: '1.4' }}>
                ¡Gracias por mantenerse al día con sus pagos!<br />
                Conserve este comprobante como garantía oficial de cobro.
              </p>
            </div>
          </div>

          {/* PANEL DE ENVÍO POR WHATSAPP (ÚNICAMENTE VISIBLE EN PANTALLA) */}
          <div className="bg-light p-3 border-top border-bottom d-print-none">
            <h6 className="text-muted text-uppercase font-monospace fw-bold mb-2" style={{ fontSize: '10px' }}>📱 Enviar Comprobante Digital</h6>
            <div className="row g-2">
              <div className="col-4">
                <select 
                  className="form-select form-select-sm font-monospace" 
                  value={codigoPais} 
                  onChange={(e) => setCodigoPais(e.target.value)}
                >
                  <option value="1">🇩🇴 +1 (DO)</option>
                  <option value="54">🇦🇷 +54 (AR)</option>
                  <option value="57">🇨🇴 +57 (CO)</option>
                  <option value="52">🇲🇽 +52 (MX)</option>
                  <option value="34">🇪🇸 +34 (ES)</option>
                  <option value="1">🇺🇸 +1 (US)</option>
                </select>
              </div>
              <div className="col-8">
                <input 
                  type="text" 
                  placeholder="Número de WhatsApp (ej: 8292918866)" 
                  className="form-control form-control-sm font-monospace"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
              <div className="col-12 mt-2">
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-success w-100 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-3"
                  onClick={enviarPorWhatsApp}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                  <span>Enviar Recibo por WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          {/* Panel de Botones del Modal */}
          <div className="modal-footer bg-light p-3 border-top-0 d-flex justify-content-between d-print-none">
            <button 
              type="button" 
              className="btn btn-sm btn-outline-secondary rounded-3" 
              onClick={onClose}
            >
              Cerrar Ventana
            </button>
            <button 
              type="button" 
              className="btn btn-sm btn-success rounded-3 px-4 d-flex align-items-center gap-1"
              onClick={handlePrint}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Imprimir Recibo</span>
            </button>
          </div>

        </div>
      </div>

      {/* Estilos CSS Híbridos */}
      <style>{`
        .linea-punteada {
          border-bottom: 1.5px dashed #000 !important;
          width: 100%;
        }

        @media print {
          body > *:not(.modal),
          #root {
            display: none !important;
          }

          .modal {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            display: block !important;
            background: #fff !important;
          }

          .modal-dialog.modal-impresion-contenedor {
            width: 80mm !important;
            max-width: 80mm !important;
            margin: 0 auto !important;
            padding: 0 !important;
          }

          .modal-content {
            border: none !important;
            box-shadow: none !important;
            background: #fff !important;
          }

          .modal-body {
            padding: 0 !important;
          }

          #recibo-a-imprimir {
            width: 80mm !important;
            max-width: 80mm !important;
            margin: 0 auto !important;
            padding: 4mm !important;
            box-sizing: border-box !important;
            background: #fff !important;
          }

          #recibo-a-imprimir table {
            width: 100% !important;
          }
          #recibo-a-imprimir .text-start {
            text-align: left !important;
          }
          #recibo-a-imprimir .text-end {
            text-align: right !important;
          }
          #recibo-a-imprimir .text-center {
            text-align: center !important;
          }

          @page {
            size: auto;
            margin: 5mm;
          }
        }
      `}</style>
    </div>
  );
}
