import React, { useState, useRef, useEffect } from 'react';
import './Capas.css';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import CSVLayer from '@arcgis/core/layers/CSVLayer';
import KMLLayer from '@arcgis/core/layers/KMLLayer';
import WMSLayer from '@arcgis/core/layers/WMSLayer';
import WMTSLayer from '@arcgis/core/layers/WMTSLayer';
import PropTypes from 'prop-types';

const Capas = ({ mapView }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [listacp, setListacp] = useState([
    { id: "CCC", url: "/jp-1962.geojson", type: "GeoJSONLayer", visible: false }
  ]);
  const dropdownRef = useRef(null);

  const openNav = () => setIsNavOpen(true);
  const closeNav = () => setIsNavOpen(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const toggleCapa = (capa, isVisible) => {
    capa.visible = isVisible;
    setListacp([...listacp]);
    const layer = mapView.map?.layers?.find(layer => layer.id === capa.id);
    if (layer) layer.visible = isVisible;
  };

  // Nueva función para manejar archivos GeoJSON desde un directorio del proyecto
  const handleGeoJsonFromProject = async (filePath, zoomToExtent) => {
    try {
      const newLayer = new GeoJSONLayer({
        url: filePath,
        id: filePath,
        title: filePath.split('/').pop(),
        visible: true,
      });
      
      mapView.map.add(newLayer);
      setListacp([...listacp, { id: filePath, type: 'GeoJSONLayer', visible: true }]);
      
      if (zoomToExtent) {
        await newLayer.when();
        mapView.goTo(newLayer.fullExtent);
      }
    } catch (error) {
      console.error('Error al cargar el archivo GeoJSON desde el proyecto:', error);
    }
  };

  return (
    <div>
      <div id="mySidenav" className="sidenav" style={{ width: isNavOpen ? '250px' : '0' }}>
        <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>
          &times;
        </a>
        <button className="dropbtn" onClick={toggleDropdown}>Listado de Capas</button>
        <div className={`dropdown-content ${isDropdownOpen ? 'show' : ''}`} id="myDropdown">
          {listacp.map((capa, index) => (
            <div key={capa.id}>
              <label>
                <input type="checkbox" checked={capa.visible} onChange={(e) => toggleCapa(capa, e.target.checked)} />
                {`Capa ${index + 1} (${capa.type})`}
              </label>
            </div>
          ))}
        </div>
        <button onClick={() => handleGeoJsonFromProject('/mapas/jp-1962.geojson', true)}>Cargar GeoJSON</button>
      </div>
      <span className="open-btn" onClick={openNav}>
        &#9776; CAPAS
      </span>
    </div>
  );
};

Capas.propTypes = {
  mapView: PropTypes.object.isRequired,
};

export default Capas;
