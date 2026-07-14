import { useState, useRef, useEffect } from "react";

const DOCUMENTOS = [
  { key: "Tabla de Amortización", label: 'Tabla de Amortización' },  
  { key: "carta-bureau", label: 'Carta al bureau' },
  { key: "entrega-prestaciones", label: "Entrega de prestaciones" },
  { key: "pagare-notarial", label: "Pagaré notarial" },
  { key: "poder-especial", label: "Poder especial" },
  { key: "poder-litis", label: "Poder litis" },
  { key: "reconocimiento-deudas", label: "Reconocimiento de deudas" },
];

export default function DocumentosDropdown({ prestamo }) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  // Calcula posición del botón para colocar el menú con fixed
  const handleToggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 4, // justo debajo del botón
        left: rect.right - 220, // alineado a la derecha del botón
      });
    }
    setOpen((v) => !v);
  };

  // Cierra al click fuera
  useEffect(() => {
    const handler = (e) => {
      if (!btnRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSeleccionar = (doc) => {
    setOpen(false);
    window.open(`/api/documentos/${doc.key}/${prestamo.id}`, "_blank");
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleToggle}
        className="btn btn-outline-info btn-sm border-0 rounded-3 p-1 mx-1 bg-info-subtle border-2 border rounded-2 pe-2 ps-2"
        title="Documentos"
        style={{ fontSize: "0.8em", color: "#0d6efd", fontWeight: "bold" }}
      >
        📄 Documentos ▾
      </button>

      {open && (
        <ul
          style={{
            position: "fixed", // 👈 clave: sale del flujo de la tabla
            top: menuPos.top,
            left: menuPos.left,
            zIndex: 9999,
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "6px",
            minWidth: "220px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            listStyle: "none",
            margin: 0,
          }}
        >
          {DOCUMENTOS.map((doc) => (
            <li key={doc.key}>
              <button
                onClick={() => handleSeleccionar(doc)}
                className="w-100 text-start px-3 py-2 border-0 "
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 12px",
                  background: "none",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#457b9d", e.currentTarget.style.color = "#fff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none" , e.currentTarget.style.color = "#000")
                }
              >
                {" "}
                
                {doc.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
