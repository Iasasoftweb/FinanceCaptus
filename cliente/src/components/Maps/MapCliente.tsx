import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para iconos
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const MapCliente = ({lat, lng, nombre}: any) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
        return <div className="alert alert-warning">Coordenadas inválidas</div>;
    }

    return (
        <div style={{ height: "450px", width: "100%", overflow: "hidden" }}>
            <MapContainer 
                center={[latitude, longitude]} 
                zoom={16} 
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[latitude, longitude]} icon={DefaultIcon}>
                    <Popup>{nombre}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MapCliente; // Es vital que sea export default para el lazy loading