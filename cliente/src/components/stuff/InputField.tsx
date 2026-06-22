import React from 'react';

// Agregamos endIcon y onEndIconClick a las props
export const InputField = React.memo(({ 
  label, 
  icon: Icon, 
  endIcon: EndIcon, // <-- Nuevo
  onEndIconClick,   // <-- Nuevo
  children, 
  required, 
  readOnly, 
  col = "col-md-12", 
  error 
}) => {

  
  return (
    <div className={`${col} `}>
      <label 
        className="form-label small fw-bold text-secondary text-uppercase mb-1" 
        style={{ fontSize: '10px', letterSpacing: '0.5px' }}
      >
        {label} {required && <span className="text-danger">*</span>}
      </label>
      
      <div className="input-group shadow-sm border rounded-2 overflow-hidden">
        {/* Icono Principal (Inicio) */}
        {Icon && (
          <span className={`input-group-text border-0 ${readOnly ? 'bg-info-subtle' : 'bg-light'} text-muted`}>
            <Icon size={12} />
          </span>
        )}
        
        {/* Contenido (Input, Select, etc.) */}
        {children}

        {/* Icono Opcional (Fin) */}
        {EndIcon && (
          onEndIconClick ? (
            <button 
              type="button"
              className="btn border-0 bg-light text-muted d-flex align-items-center justify-content-center px-3"
              onClick={onEndIconClick}
              disabled={readOnly}
              style={{ zIndex: 4 }} // Evita que otros elementos lo tapen
            >
              <EndIcon size={14} />
            </button>
          ) : (
            <span className="input-group-text border-0 bg-light text-muted">
              <EndIcon size={14} />
            </span>
          )
        )}
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div className="invalid-feedback d-block mt-1 animate__animated animate__fadeIn" style={{ fontSize: '11px' }}>
          {error}
        </div>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';