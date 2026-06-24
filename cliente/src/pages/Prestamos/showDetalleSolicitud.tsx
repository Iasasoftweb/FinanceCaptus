import React, { useEffect, useState } from "react";
import { MisColores } from "../../components/stuff/MisColores";
import { Tags } from "lucide-react";
import { safeFixed } from "../../components/UtilsStuff";

export const ShowDetalleSolicitud = ({ cuotas, onClose }) => {
  const misCuotas = cuotas.cuotas || [];

  const totalCapital =
    misCuotas?.reduce((acc, c) => acc + Number(c.montocapital || 0), 0) || 0;
  const totalInteres =
    misCuotas?.reduce((acc, c) => acc + Number(c.montointeres || 0), 0) || 0;
  const totalAPagar =
    misCuotas?.reduce((acc, c) => acc + Number(c.montocuota || 0), 0) || 0;

  return (
    <div
      className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
      style={{ maxWidth: "850px", width: "90%" }}
    >
      <div className="modal-content w-100">
        <div className="modal-header">
          <div className="d-flex align-items-center gap-3">
            <div
              className="p-2 rounded-3 text-white d-flex align-items-center justify-content-center shadow-sm"
              style={{
                backgroundColor: MisColores.headerBlue,
                width: "45px",
                height: "45px",
              }}
            >
              <Tags />
            </div>
            <div className="">
              <h4 className="mb-0 lh-1 text-start">Cuotas</h4>
              <span className="text-muted">Lista de Cuotas</span>
            </div>
          </div>

          <button
            type="button"
            className="btn-close"
            style={{ fontSize: "0.9em" }}
            onClick={onClose}
          ></button>
        </div>

        <div className="row g-3 mt-2">
          <div className="col-md-4">
            <div className="card border-0 bg-light shadow-sm rounded-3 p-3 text-start border-start border-danger border-3" style={{width:"85%"}}>
              <div
                className="text-uppercase text-secondary fw-bold mb-1"
                style={{ fontSize: "11px", letterSpacing: "0.5px" }}
              >
                Total Monto Capital
              </div>
              <h3 className="mb-0 fw-bold text-dark">
                $
                {Math.ceil(totalCapital).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h3>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 bg-info-subtle shadow-sm rounded-3 p-3 text-start border-start border-primary border-3" style={{width:"85%"}}>
              <div
                className="text-uppercase text-info-emphasis fw-bold mb-1"
                style={{ fontSize: "11px", letterSpacing: "0.5px" }}
              >
                Total Monto Interés
              </div>
              <h3 className="mb-0 fw-bold text-info-emphasis">
                $
                {Math.ceil(totalInteres).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 bg-success-subtle shadow-sm rounded-3 p-3 text-start border-start border-success border-3 w-75">
              <div
                className="text-uppercase text-success-emphasis fw-bold mb-1"
                style={{ fontSize: "11px", letterSpacing: "0.5px" }}
              >
                Total A Pagar
              </div>
              <h3 className="mb-0 fw-bold text-success-emphasis">
                $
                {Math.ceil(totalAPagar).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h3>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="table-responsive ">
            <table className="table table-hover align-middle mb-0 w-100">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Capital</th>
                  <th>Interés</th>
                  <th>Monto Cuota</th>
                  <th className="">Estado</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {misCuotas?.length > 0 ? (
                  misCuotas?.map((cuota) => (
                    <tr key={cuota.id}>
                      <td>{cuota.numcuota}</td>
                      <td>{cuota.fechavencimiento}</td>
                      <td>${Number(safeFixed(cuota.montocapital, 2))}</td>
                      <td>${Number(safeFixed(cuota.montointeres, 2))}</td>
                      <td>${Number(safeFixed(cuota.montocuota, 2))}</td>
                      <td>
                        <span
                          className={`badge ${cuota.estado === "Pendiente" ? "bg-warning" : "bg-success"}`}
                        >
                          {cuota.estado}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No hay cuotas registradas para este préstamo.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot></tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
