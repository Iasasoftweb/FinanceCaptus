import React from "react";
// Usamos lucide-react, que ya tienes en el proyecto
import { Users, Search, DatabaseBackup } from "lucide-react";

// Puedes guardar esto en un archivo separado como components/stuff/EmptyState.jsx
export const EmptyState = ({ 
  title = "No hay datos disponibles aún.", 
  subtitle = "En cuanto se registren datos, aparecerán aquí." 
}) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center py-5 mx-auto" style={{ maxWidth: "450px" }}>
      {/* 1. Área del Icono (Replicando el estilo de la imagen) */}
      <div className="position-relative mb-4" style={{ color: "#a0aec0" }}> {/* Un gris neutro suave */}
        {/* Icono principal de usuarios */}
        <DatabaseBackup size={60} strokeWidth={1} />
        {/* Icono de lupa superpuesto abajo a la derecha */}
        <div 
          className="position-absolute bg-white rounded-circle p-1 d-flex align-items-center justify-content-center"
          style={{ 
            bottom: "-10px", 
            right: "-10px", 
            border: "3px solid white" // Para dar el efecto de separación
          }}
        >
          <Search size={25} strokeWidth={2.5} color="#718096" />
        </div>
      </div>

      {/* 2. Título (Negrita, color oscuro) */}
      <h5 
        className="fw-bold mb-2" 
        style={{ color: "#2d3748", letterSpacing: "-0.5px" }}
      >
        {title}
      </h5>

      {/* 3. Subtítulo (Más pequeño, color gris tenue) */}
      <p 
        className="text-muted small clFont px-4" 
        style={{ color: "#718096", lineHeight: "1.6" }}
      >
        {subtitle}
      </p>
    </div>
  );
};