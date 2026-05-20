import React, { useEffect } from 'react';

const Notification = ({ mensaje, tipo = 'success', onClose, duracion = 4000 }) => {
  
  // Auto-cerrar después de X segundos
  useEffect(() => {
    if (!mensaje) return;
    const timer = setTimeout(() => {
      onClose();
    }, duracion);

    return () => clearTimeout(timer); // Limpieza del timer
  }, [mensaje, duracion, onClose]);

  if (!mensaje) return null;

  // Configuración de colores e iconos según el tipo
  const configuracion = {
    success: { clase: 'alert-success', icono: 'bi-check-circle-fill' },
    danger: { clase: 'alert-danger', icono: 'bi-exclamation-triangle-fill' },
    warning: { clase: 'alert-warning', icono: 'bi-exclamation-circle-fill' },
    info: { clase: 'alert-info', icono: 'bi-info-circle-fill' }
  };

  const { clase, icono } = configuracion[tipo] || configuracion.success;

  return (
    <div 
      className={`alert ${clase} alert-dismissible fade show position-fixed top-0 end-0 m-3 d-flex align-items-center shadow-lg`} 
      style={{ zIndex: 1100, minWidth: '300px', maxWidth: '450px' }}
      role="alert"
    >
      {/* Icono (Usa Bootstrap Icons si los tienes, si no, puedes quitar esta etiqueta i) */}
      <i className={`bi ${icono} me-2 fs-5`}></i>
      
      {/* Contenido del texto */}
      <div className="flex-grow-1 pe-3">
        {mensaje}
      </div>

      {/* Botón de cerrar manual */}
      <button 
        type="button" 
        className="btn-close" 
        aria-label="Close"
        onClick={onClose}
      ></button>
    </div>
  );
};

export default Notification;