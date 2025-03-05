import { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header/Header.jsx';
import Mapas from './components/Mapas/Mapa.jsx';
import Capas from './components/Capas/Capas.jsx';

function App() {
  // const [capa1Visible, setCapa1Visible] = useState(false);
  // const [capa2Visible, setCapa2Visible] = useState(false);
  const [mapView, setMapView] = useState(null);

  return (
    <>
      <div>
        <Header />
        <Capas mapView={mapView} />
        <Mapas setMapView={setMapView} />
       
      </div>
    </>
  );
}

export default App;