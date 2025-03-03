import React, { useEffect, useRef } from 'react';
import './Mapa.css'; // Importamos el archivo CSS (opcional, para estilos adicionales)
import WebMap from '@arcgis/core/WebMap';
import Map from 'https://js.arcgis.com/4.28/@arcgis/core/Map.js';
import MapView from '@arcgis/core/views/MapView';

const Mapas = () => {
  const mapRef = useRef(null); // Referencia para el contenedor del mapa

  useEffect(() => {
    // Configuración del mapa
    const webMap = new WebMap({
      basemap: 'topo-vector', // Puedes cambiar el basemap según tus necesidades
    });

    // Configuración de la vista del mapa
    const view = new MapView({
      container: mapRef.current, // Contenedor donde se renderizará el mapa
      map: webMap,
      center: [-3.7038, 40.4168], // Coordenadas de España (Madrid)
      zoom: 7, // Nivel de zoom inicial (ajustado para ver mejor España)
    });

    // Limpieza al desmontar el componente
    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);
https:  //services-eu1.arcgis.com/NPIbx47lsIiu2pqz/ArcGIS/rest/services/Neptune_Coastline_Campaign_Open_Data_Land_Use_2014/FeatureServer/;
  return (
    <div className="map-container">
      <div ref={mapRef} className="map-view"></div>
    </div>
  );
};

export default Mapas;