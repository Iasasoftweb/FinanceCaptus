import React, { useState, useMemo } from "react";
// Importamos los componentes de react-map-gl
// Nota: Asegúrate de ejecutar 'pnpm add react-map-gl mapbox-gl' en tu terminal del VPS
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, User, DollarSign, AlertCircle } from "lucide-react";
import { StyleMap } from "./StyleMap";

/**
 * Componente MapaClientes
 * Diseñado para visualizar la ubicación geográfica de los clientes en el dashboard.
 * @param {Array} clientes - Lista de objetos cliente desde la API
 */
const MapFront = ({ clientes = [] }) => {
  const [popupInfo, setPopupInfo] = useState(null);
  const [mapError, setMapError] = useState(false);

  const UrisImg = "http://localhost:5000/uploads/clientes/avata/";

  // Filtrado de clientes con coordenadas válidas para prevenir errores de renderizado
  const clientesConGPS = useMemo(() => {
    return (clientes || []).filter((cliente) => {
      const lat = parseFloat(cliente.latitud);
      const lng = parseFloat(cliente.longitud);
      // Validamos que sean números, no sean 0 (ubicación nula) y existan
      return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
    });
  }, [clientes]);

  // Acceso seguro al Token de Mapbox
  const getSafeToken = () => {
    try {
      // Intentamos obtenerlo del entorno de Vite
      const envToken = import.meta.env.VITE_MAPBOX_TOKEN;
      if (envToken) return envToken;
    } catch (err) {
      // Fallback para entornos donde import.meta no esté disponible
    }
    // Token proporcionado para la demostración
    return import.meta.env.VITE_MAPBOX_TOKEN;
  };

  const MAPBOX_TOKEN = getSafeToken();

  // Vista de error si no hay Token configurado
  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-[400px] bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-amber-100 p-4 rounded-full text-amber-600 mb-4">
          <AlertCircle size={40} />
        </div>
        <h3 className="text-lg font-bold text-slate-800">
          Token de Mapbox no configurado
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mt-2">
          Para que el mapa funcione, añade{" "}
          <code className="bg-slate-200 px-1 rounded">VITE_MAPBOX_TOKEN</code> a
          tu archivo .env y reinicia el servidor.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 bg-slate-50 relative group font-sans p-1">
      <Map
        initialViewState={{
          longitude: -70.1627, // República Dominicana
          latitude: 18.7357,
          zoom: 7,
        }}
        mapStyle={StyleMap.Outdoors}
        mapboxAccessToken={MAPBOX_TOKEN}
        onError={() => setMapError(true)}
        reuseMaps
      >
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />

        {/* Marcadores de Clientes */}
        {clientesConGPS.map((cliente) => (
          <Marker
            key={cliente.id}
            longitude={parseFloat(cliente.longitud)}
            latitude={parseFloat(cliente.latitud)}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setPopupInfo(cliente);
            }}
          >
            <div
              className="rounded-circle bg-light d-flex align-items-center justify-content-center border border-2 border-white shadow-sm overflow-hidden"
              style={{ width: "40px", height: "40px" }}
            >
              {cliente.imgFOTOS ? (
                <img
                  src={`${UrisImg}${cliente.imgFOTOS}`}
                  alt="avatar"
                  // "w-100 h-100" asegura que llene el círculo
                  // "object-cover" evita que se deforme y la centra automáticamente
                  className="w-100 h-100 object-cover"
                  style={{ display: "block" }}
                />
              ) : (
                <User className="text-secondary" size={20} />
              )}
            </div>
            {/* <div className="relative cursor-pointer group/pin">
            
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-xl opacity-0 group-hover/pin:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 font-medium">
                {cliente.nombre}
              </div>
              <MapPin 
                className="text-indigo-600 fill-indigo-100 transition-transform duration-200 group-hover/pin:scale-125 drop-shadow-md" 
                size={36} 
                strokeWidth={2.5}
              />
            </div> */}
          </Marker>
        ))}

        {/* Ventana de información del Cliente al hacer clic */}
        {popupInfo && (
          

          <Popup
            anchor="top-left"
            longitude={parseFloat(popupInfo.longitud)}
            latitude={parseFloat(popupInfo.latitud)}
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
            className="z-50 rounded-lg "
          >
            <div className="popup-container">
              <div className="popup-header">
                <img
                  src={`${UrisImg}${popupInfo.imgFOTOS}`}
                  className="popup-avatar"
                  alt="Avatar"
                />
                <div className="user-info">
                  <h3>Juan Mendez</h3>
                  <p>ID: 010-0022566-2</p>
                </div>
              </div>

              <div className="popup-body">
                <div className="data-row">
                  <span className="label">Balance Actual</span>
                  <span className="value balance-highlight">$ 0.00</span>
                </div>

                <div className="data-row">
                  <span className="label">Dirección</span>
                  <span className="value">📍 Respaldo Colon #206</span>
                </div>

                <div className="data-row">
                  <span className="label">Ruta</span>
                  <span className="value">🚚 AZUA 01</span>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Indicadores de Estado y Resumen */}
      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
        <div className="bg-white/90 backdrop-blur-xl p-5 rounded-[1.5rem] shadow-2xl border border-white/20 pointer-events-auto">
          <div className="flex items-center gap-3 mb-3 text-indigo-600">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-widest">
              Cartera en Tiempo Real
            </span>
          </div>
          <div className="flex gap-6 divide-x divide-slate-100">
            <div className="pr-2">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                Localizados
              </p>
              <p className="text-2xl font-black text-slate-800">
                {clientesConGPS.length}
              </p>
            </div>
            <div className="pl-6">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                Sin Ubicación
              </p>
              <p className="text-2xl font-black text-amber-500">
                {clientes.length - clientesConGPS.length}
              </p>
            </div>
          </div>
        </div>

        {mapError && (
          <div className="bg-red-600 text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-lg mb-2 flex items-center gap-2 pointer-events-auto">
            <AlertCircle size={14} />
            Error de conexión con el servicio
          </div>
        )}
      </div>
    </div>
  );
};

export default MapFront;
