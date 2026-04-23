import React from 'react';

// Envolvemos el componente en React.memo
export const InputField = React.memo(({ label, icon: Icon, children, required, readOnly, col = "col-md-12" }) => {
  return (
    <div className={`${col} mb-3`}> {/* Usamos la prop aquí */}
      <label 
        className="form-label small fw-bold text-secondary text-uppercase mb-1" 
        style={{ fontSize: '10px', letterSpacing: '0.5px' }}
      >
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="input-group shadow-sm border rounded-2 overflow-hidden">
        <span className={`input-group-text border-0 ${readOnly ? 'bg-info-subtle' : 'bg-light'} text-muted`}>
          {Icon && <Icon size={12} />}
        </span>
        {/* Agregamos w-100 al children para que se expanda */}
        {children}
      </div>
    </div>
  );
});

// Opcional: Agregar un nombre para depuración en las DevTools
InputField.displayName = 'InputField';