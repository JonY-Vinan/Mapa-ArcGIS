import React, { useEffect, useRef, useState } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import SceneView from '@arcgis/core/views/SceneView';
import Home from '@arcgis/core/widgets/Home'; // Importar el widget Home
import './Mapa.css';

const Mapa = ({ setMapView, setMapSceneView, baseMap }) => {
  const mapRef = useRef(null);
  const mapRef3D = useRef(null);

  const [ocultarVisiblisarMapa, setOcultarVisiblisarMapa] = useState(false);
  const cambiarVista = () => setOcultarVisiblisarMapa(!ocultarVisiblisarMapa);
  const [is3DView, setIs3DView] = useState(false);


  // Función para cambiar entre 2D y 3D
  const toggleView = () => {
    setIs3DView(!is3DView); // Cambiar el estado
    if (is3DView) {
      // Cambiar a vista 2D
      mapRef.current.style.display = 'block';
      mapRef3D.current.style.display = 'none';
    } else {
      // Cambiar a vista 3D
      mapRef.current.style.display = 'none';
      mapRef3D.current.style.display = 'block';
    }
  };

  useEffect(() => {
    // Inicializar el mapa base
    const map = new Map({

      basemap: baseMap?.basemap ? baseMap.basemap : 'hybrid',
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
        basemap: baseMap?.basemap ? baseMap.basemap : 'hybrid',
        ground: 'world-elevation',
      }), // Mapa creado previamente
      center: [-2.92528, 43.26271], // Coordenadas de Bilbao, España
      zoom: 12, // Ajusta el nivel de zoom para ver Bilbao en detalle
    });

    // Crear el widget Home
    const homeWidget = new Home({
      view: view, // Asociar el widget a la vista 2D 
    });

    // Agregar el widget Home a la vista 2D
    view.ui.add(homeWidget, 'top-left');

    setMapView(view); // Pasamos el mapView a App.jsx
    setMapSceneView(view3D); // Pasamos el SceneView a App.jsx


    return () => {
      // Limpiar la vista del mapa cuando el componente se desmonte
      view.destroy();
    };
  }, [baseMap]);

  return (
    <div>
      <button className="toggle-button" onClick={toggleView}>
        {is3DView ? '2D' : '3D'}
      </button>
      <div
        id="2d"
        className={`${ocultarVisiblisarMapa ? 'visibeMap' : ''}`}
        ref={mapRef}
        style={{ height: '100vh', width: '100%' }}
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