import { Box, InputAdornment, Modal, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { CiCalendarDate } from "react-icons/ci";
import { IoCloseCircleOutline } from "react-icons/io5";
import axios from "axios";
import useBalancePendiente from "../Prestamos/balancePendiente.tsx";
import { formatCurrency } from "../../components/UtilsStuff.tsx";

interface formProps {
  idprestamo: number;
  open: boolean;
  handleClose: () => void;
}

interface FormValues {
  fecha: string;
}

const PagosCuotas: React.FC<formProps> = ({
  idprestamo,
  open,
  handleClose,
}) => {
  const [data, setdata] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(open);
  const [ffecha, setFFecha] = useState(new Date());

 

  const {
    CuotasPendientes,
    BalancePendiente,
    BalanceMoraPendiente,
    BalanceCapitaPendiente,
    BalanceInteresPendiente,
    CuotasAtrasadas,
    montoCuota,
  } = useBalancePendiente(idprestamo);

  useEffect(() => {
     setFFecha(new Date().toISOString().split('T')[0])
    // PrestamoBalance(idprestamo)
  }, []);

  const CloseModal = () => {
    handleClose();
  };

  const handleFecha = (e) => {
    setFFecha(e.target.value);
  };

  return (
    <div>
      <Modal
        open={isModalOpen}
        onClose={CloseModal}
        BackdropProps={{
          timeout: 500, // Duración de la transición del backdrop
          onClick: (event) => {
            event.stopPropagation(); // Evitar que el clic cierre el modal (si lo deseas)
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "10px",
            },

            maxHeight: {
              xs: "650px",
              sm: "600px",
              md: "800px",
              lg: "820px",
            },
            transform: "translate(-50%, -50%)",
            width: {
              xs: "90%", // 90% del ancho en pantallas extra pequeñas
              sm: "80%", // 80% del ancho en pantallas pequeñas
              md: 400, // 600px en pantallas medianas
              lg: 600, // 800px en pantallas grandes
            },
            bgcolor: "background.paper",
            boxShadow: 24,
          }}
        >
          <div className="bg-body">
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ background: "#0097B2" }}
            >
              <span className="m-2 text-white">
                Realizar Pagos 
              </span>
              <span className="m-2" onClick={CloseModal}>
                <IoCloseCircleOutline className="fs-3 text-white" />
              </span>
            </div>

            <div className="">
              <div className="p-2" style={{ background: "#dcdcdc" }}>
                <div className="m-2 row">
                  <div className="col-6 lh-lg">
                    <div className="d-flex justify-content-between">
                      <span className="clFont fw-semibold">
                        Capital Pendiente :
                      </span>
                      <span className="clFont">
                        {formatCurrency(BalanceCapitaPendiente)}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="clFont fw-semibold">
                        Interes Pendiente :
                      </span>
                      <span className="clFont ">
                        {formatCurrency(BalanceInteresPendiente)}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span className="clFont fw-semibold">
                        Cuotas en Atrasos :
                      </span>
                      <span className="" style={{color:"#dc143c", fontSize:"0.9em"}}>
                        {Number(CuotasAtrasadas)}
                      </span>
                    </div>
                  </div>

                  <div className="col-6 lh-lg">
                    <div className="d-flex justify-content-between">
                      <span className="clFont fw-semibold">
                        Mora Pendiente :
                      </span>
                      <span className="clFont">
                        {formatCurrency(BalanceMoraPendiente)}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="clFont fw-semibold">
                        Total Pendiente :
                      </span>
                      <span className="clFont ">
                        {formatCurrency(
                          BalancePendiente + BalanceMoraPendiente
                        )}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span className="clFont fw-semibold">
                        Monto de Cuota :
                      </span>
                      <span className="fw-semibold" style={{color:"#1e90ff", fontSize:"0.9em"}}>
                        {formatCurrency(montoCuota)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-6 m-2">
                  
                  <TextField
                    label="Fecha"
                    type="Date"
                    value={ffecha}
                    onChange={handleFecha}
                    fullWidth
                      InputLabelProps={{
                      style: { fontSize: "1em" },
                      shrink: true,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        fontSize: "0.9em", // Controla el radio de borde
                        width: "100%",
                        color: "GrayText",
                      },
                    }}
                  />
                </div>
                <div className="col-6"></div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default PagosCuotas;
