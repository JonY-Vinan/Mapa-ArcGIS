import React, { useEffect, useRef, useState } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import SceneView from '@arcgis/core/views/SceneView';
import './Mapa.css';

const Mapa = ({ setMapView, setMapSceneView, baseMap }) => {
  const mapRef = useRef(null);
  const mapRef3D = useRef(null);

  const [ocultarVisiblisarMapa, setOcultarVisiblisarMapa] = useState(false);
  const cambiarVista = () => setOcultarVisiblisarMapa(!ocultarVisiblisarMapa);

  useEffect(() => {
    // Inicializar el mapa base
    const map = new Map({
      basemap: baseMap?.basemap ? baseMap.basemap : 'gray-vector',
    });

    // Inicializar la vista del mapa 2D
    const view = new MapView({
      container: mapRef.current, // Contenedor del mapa
      map: map, // Mapa creado previamente
      center: [-2.92528, 43.26271], // Coordenadas de Bilbao, España
      zoom: 12, // Ajusta el nivel de zoom para ver Bilbao en detalle
    });

    // Inicializar la vista del mapa 3D
    const view3D = new SceneView({
      container: mapRef3D.current, // Contenedor del mapa 3D
      map: new Map({
        basemap: baseMap.basemap,
        ground: 'world-elevation',
      }), // Mapa creado previamente
      center: [-2.92528, 43.26271], // Coordenadas de Bilbao, España
      zoom: 12, // Ajusta el nivel de zoom para ver Bilbao en detalle
    });

    setMapView(view); // Pasamos el mapView a App.jsx
    setMapSceneView(view3D); // Pasamos el SceneView a App.jsx

    return () => {
      // Limpiar la vista del mapa cuando el componente se desmonte
      view.destroy();
    };
  }, [baseMap]);

  return (
    <div>
      <button className="mapbtn" onClick={cambiarVista}>
        Listado de Capas
      </button>
      <div
        id="2d"
        className={`${ocultarVisiblisarMapa ? 'visibeMap' : ''}`}
        ref={mapRef}
        style={{ height: '80vh', width: '100%' }}
      ></div>
      <div
        id="3d"
        ref={mapRef3D}
        className={`${ocultarVisiblisarMapa ? '' : 'visibeMap'}`}
        style={{ height: '80vh', width: '100%' }}
      ></div>
    </div>
  );
};

export default Mapa;