import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react'; // O cualquier icono que uses

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface Props {
  lat: number;
  lng: number;
  nombre?: string;
  styleMap?: string;
}

const MapCliente = ({ lat, lng, nombre, styleMap }: Props) => {
  return (
    <div style={{ height: '450px', width: '100%', overflow: 'hidden', borderRadius: '12px' }}>
      <Map
        initialViewState={{
          latitude: lat,
          longitude: lng,
          zoom: 8
        }}
        mapStyle={styleMap}
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {/* Controles de navegación (zoom, rotar) */}
        <NavigationControl position="top-right" />

        {/* Marcador personalizado */}
        <Marker latitude={lat} longitude={lng} anchor="bottom">
          <div style={{ color: '#d32f2f', textAlign: 'center' }}>
            <span style={{ 
              backgroundColor: 'white', 
              padding: '2px 8px', 
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              display: 'block',
              marginBottom: '4px'
            }}>
              {nombre || 'Cliente'}
            </span>
            <MapPin size={32} fill="#d32f2f" color="white" />
          </div>
        </Marker>
      </Map>
    </div>
  );
};

export default MapCliente;