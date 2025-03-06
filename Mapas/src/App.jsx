import { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header/Header.jsx';
import Mapas from './components/Mapas/Mapa.jsx';
import Capas from './components/Capas/Capas.jsx';

function App() {
  // const [capa1Visible, setCapa1Visible] = useState(false);
  // const [capa2Visible, setCapa2Visible] = useState(false);
  const [mapView, setMapView] = useState(null);
  const [mapSceneView, setMapSceneView] = useState(null);
  
  //Base map
  const [baseMap, setBaseMap] = useState('gray-vector');

  return (
    <>
      <div>
        <Header />
        <Capas mapView={mapView}  mapSceneView={mapSceneView} setBaseMap={setBaseMap}/>
        <Mapas setMapView={setMapView} setMapSceneView={setMapSceneView} baseMap={baseMap}/>
       
      </div>
    </>
  );
}

export default App;