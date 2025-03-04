// src/App.jsx
import React, { useEffect, useRef, useState } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Capa1 from './components/Capa1';

function App() {
  const mapRef = useRef(null);
  const [mapView, setMapView] = useState(null);

  useEffect(() => {
    // Inicializar el mapa
    const map = new Map({
      basemap: 'arcgis-topographic',
    });

    // Inicializar la vista del mapa
    const view = new MapView({
      container: mapRef.current,
      map: map,
      center: [-118.805, 34.027], // Longitud, Latitud
      zoom: 13,
    });

    setMapView(view);

    return () => {
      // Limpiar la vista del mapa cuando el componente se desmonte
      view.destroy();
    };
  }, []);

  return (
    <div className="App">
      <h1>Mapa de ArcGIS con React y Vite</h1>
      <div ref={mapRef} style={{ height: '500px', width: '100%' }}></div>
      {mapView && <Capa1 mapView={mapView} />}
    </div>
  );
}

export default App;