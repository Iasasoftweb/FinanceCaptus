export function ModalReciboComprobante({ recibo, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.7)",
        backdropFilter: "blur(3px)",
        zIndex: 1100,
      }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: "480px" }}
      >
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-success text-white py-3 px-4 border-0 d-print-none">
            <h5 className="modal-title fw-bold" style={{ fontSize: "15px" }}>
              Comprobante de Caja Generado
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body p-4 bg-white" id="recibo-a-imprimir">
            <div className="text-center mb-3">
              <h4
                className="fw-bolder text-dark mb-1"
                style={{ letterSpacing: "0.05em" }}
              >
                CREDIFÁCIL EXPRESS
              </h4>
              <p className="small text-muted mb-0" style={{ fontSize: "11px" }}>
                Servicios Financieros de Cobros & Préstamos
                <br />
                República Dominicana | Tel: (809) 555-0199
              </p>
              <div className="border-bottom my-2 border-dashed"></div>
            </div>

            {/* Datos Maestros */}
            <div
              className="row g-2 text-dark mb-3"
              style={{ fontSize: "12px" }}
            >
              <div className="col-6">
                <span
                  className="text-muted d-block"
                  style={{ fontSize: "10px" }}
                >
                  NÚMERO RECIBO
                </span>
                <strong className="font-monospace text-dark">
                  {recibo.codigo}
                </strong>
              </div>
              <div className="col-6 text-end">
                <span
                  className="text-muted d-block"
                  style={{ fontSize: "10px" }}
                >
                  FECHA Y HORA
                </span>
                <strong className="text-dark">
                  {new Date(recibo.fecha).toLocaleString("es-DO")}
                </strong>
              </div>
              <div className="col-12 mt-2">
                <span
                  className="text-muted d-block"
                  style={{ fontSize: "10px" }}
                >
                  CLIENTE
                </span>
                <strong className="text-dark text-uppercase">
                  {recibo.cliente}
                </strong>
              </div>
              <div className="col-6">
                <span
                  className="text-muted d-block"
                  style={{ fontSize: "10px" }}
                >
                  CÉDULA
                </span>
                <strong className="text-dark font-monospace">
                  {recibo.cedula}
                </strong>
              </div>
              <div className="col-6 text-end">
                <span
                  className="text-muted d-block"
                  style={{ fontSize: "10px" }}
                >
                  ZONA DE COBRO
                </span>
                <strong className="text-dark text-uppercase">
                  {recibo.zona}
                </strong>
              </div>
            </div>

            <div className="border-bottom my-2 border-dashed"></div>

            {/* Desglose de Distribución por Cuotas */}
            <h6
              className="fw-bold mb-2 text-uppercase text-secondary font-monospace"
              style={{ fontSize: "10px", letterSpacing: "0.05em" }}
            >
              Aplicación de Cobro a Cuotas
            </h6>

            <div className="bg-light p-2.5 rounded-3 mb-3 border">
              <table
                className="table table-sm table-borderless mb-0 text-dark"
                style={{ fontSize: "12px" }}
              >
                <thead>
                  <tr
                    className="border-bottom text-muted"
                    style={{ fontSize: "10px" }}
                  >
                    <th>CUOTA</th>
                    <th className="text-center">OPERACIÓN</th>
                    <th className="text-end">APLICADO</th>
                  </tr>
                </thead>
                <tbody>
                  {recibo.detalles.map((det, index) => (
                    <tr
                      key={index}
                      className="align-middle border-bottom-dotted"
                    >
                      <td>
                        <div className="fw-bold">Cuota #{det.numcuota}</div>
                        {/* Pequeño desglose financiero */}
                        <div className="text-muted" style={{ fontSize: "9px" }}>
                          (Cap: ${det.desglose.capital.toFixed(2)} | Int: $
                          {det.desglose.interes.toFixed(2)}{" "}
                          {det.desglose.mora > 0 &&
                            `| Mora: $${det.desglose.mora.toFixed(2)}`}
                          )
                        </div>
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge ${det.tipoOperacion === "SALDO" ? "bg-success" : "bg-warning text-dark"} px-2 py-0.5`}
                          style={{ fontSize: "9px" }}
                        >
                          {det.tipoOperacion}
                        </span>
                      </td>
                      <td className="text-end fw-bold text-dark">
                        $
                        {det.montoAplicado.toLocaleString("es-DO", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totales */}
            <div className="row g-1 text-dark" style={{ fontSize: "13px" }}>
              <div className="col-7 text-muted">Monto Recibido:</div>
              <div className="col-5 text-end fw-extrabold text-success">
                $
                {recibo.montoTotal.toLocaleString("es-DO", {
                  minimumFractionDigits: 2,
                })}
              </div>

              {recibo.sobranteFavor > 0 && (
                <>
                  <div className="col-7 text-danger fw-bold">
                    Sobrante a favor (Caja):
                  </div>
                  <div className="col-5 text-end text-danger fw-extrabold">
                    $
                    {recibo.sobranteFavor.toLocaleString("es-DO", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="border-bottom my-3 border-dashed"></div>

            <div className="text-center mt-3">
              <p className="small text-muted mb-0" style={{ fontSize: "10px" }}>
                ¡Gracias por mantenerse al día con sus pagos!
                <br />
                Conserve este comprobante como garantía oficial.
              </p>
            </div>
          </div>

          {/* Botones de acción (No imprimibles) */}
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
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              <span>Imprimir Recibo</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #recibo-a-imprimir, #recibo-a-imprimir * {
            visibility: visible;
          }
          #recibo-a-imprimir {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          @page {
            margin: 0;
          }
        }
        .border-dashed {
          border-bottom-style: dashed !important;
          border-bottom-width: 1.5px !important;
          border-bottom-color: #dee2e6 !important;
        }
        .border-bottom-dotted {
          border-bottom: 1px dotted #dee2e6;
        }
      `}</style>
    </div>
  );
}
