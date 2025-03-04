import React, { useEffect, useRef } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import './Mapa.css';

const Mapa = ({ setMapView }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Inicializar el mapa base
    const map = new Map({
      basemap: 'topo-vector',
    });

    // Inicializar la vista del mapa
    const view = new MapView({
      container: mapRef.current,
      map: map,
      center: [-118.805, 34.027],
      zoom: 13,
    });

    setMapView(view); // Pasamos el mapView a App.jsx

    return () => {
      // Limpiar la vista del mapa cuando el componente se desmonte
      view.destroy();
    };
  }, [setMapView]);

  return (
    <div>
      <div ref={mapRef} style={{ height: '80vh', width: '100%' }}></div>
    </div>
  );
};

export default Mapa;