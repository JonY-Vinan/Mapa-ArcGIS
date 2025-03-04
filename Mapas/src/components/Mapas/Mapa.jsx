// src/components/Mapa.jsx
import React, { useEffect, useRef, useState } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import './Mapa.css'


const Mapa = () => {
  const mapRef = useRef(null);
  const [mapView, setMapView] = useState(null);
  const [capa1Visible, setCapa1Visible] = useState(false);
  const [capa2Visible, setCapa2Visible] = useState(false);

  useEffect(() => {
    // Inicializar el mapa base
    const map = new Map({
      basemap: 'topo-vector',
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

  useEffect(() => {
    if (!mapView) return;

    // URL de las capas
    const capa1Url = "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0";
    const capa2Url = "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0";

    // Añadir o remover Capa 1
    if (capa1Visible) {
      const layer1 = new FeatureLayer({ url: capa1Url });
      mapView.map.add(layer1);
    } else {
      const layer1 = mapView.map.layers.find(layer => layer.url === capa1Url);
      if (layer1) mapView.map.remove(layer1);
    }

    // Añadir o remover Capa 2
    if (capa2Visible) {
      const layer2 = new FeatureLayer({ url: capa2Url });
      mapView.map.add(layer2);
    } else {
      const layer2 = mapView.map.layers.find(layer => layer.url === capa2Url);
      if (layer2) mapView.map.remove(layer2);
    }

  }, [capa1Visible, capa2Visible, mapView]);

  return (
    <div>
      <div ref={mapRef} style={{ height: '500px', width: '100%' }}></div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={capa1Visible}
            onChange={(e) => setCapa1Visible(e.target.checked)}
          />
          Activar Capa 1 (Trailheads)
        </label>
        <label>
          <input
            type="checkbox"
            checked={capa2Visible}
            onChange={(e) => setCapa2Visible(e.target.checked)}
          />
          Activar Capa 2 (Trails)
        </label>
      </div>
    </div>
  );
};

export default Mapa;