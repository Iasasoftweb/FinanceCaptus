import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const iconBaseConfig = {
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
};

const iconNormal = L.icon({
  ...iconBaseConfig,
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
});

const iconAtraso = L.icon({
  ...iconBaseConfig,
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
});


const MapFront = ({ clientes = [] }) => {
console.log(clientes)
  
  if (!clientes || clientes.length === 0) {
    return <div style={{ height: "500px", display: "flex", alignItems: "center", justifyContent: "center" }}>Cargando mapa o sin datos de clientes...</div>;
  }

  return (
    <MapContainer 
      center={[18.45, -70.73]} 
      zoom={13} 
      style={{ height: "500px", width: "100%", borderRadius: "8px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {(Array.isArray(clientes) ? clientes: []).map((items) => {
        // Validar que el cliente tenga coordenadas válidas
        if (!items.longitud || !items.latitud) return null;

        return (
          <Marker
            key={items.id}
            position={[items.latitud, items.longitud]}
            icon={items.enAtraso ? iconAtraso : iconNormal}
          >
            <Popup>
              <div style={{ fontSize: "14px" }}>
                <strong>{items.nombre}</strong> <br />
                <span style={{ color: items.enAtraso ? "red" : "green" }}>
                  Estado: {items.enAtraso ? "En atraso" : "Al día"}
                </span> <br />
                <small>Ubicación: {items.latitud.toFixed(4)}, {items.longitud.toFixed(4)}</small>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
export default MapFront