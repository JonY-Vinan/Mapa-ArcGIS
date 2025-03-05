import React, { useState, useRef, useEffect } from 'react';
import './Capas.css';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

const Capas = ({ mapView }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Lista de URLs de las capas
  const listacapas = [
    'https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0',
    'https://geo.bizkaia.eus/arcgisserverinspire/rest/services/Kartografia_Cartografia/SareKartografikoak_MallasCartograficas/MapServer/2',
  ];

  // Estado para controlar la visibilidad de cada capa
  const [capasVisible, setCapasVisible] = useState(
    listacapas.map(() => false) // Inicialmente, todas las capas están desactivadas
  );

  const openNav = () => {
    setIsNavOpen(true);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Función para cargar o desactivar una capa
  const cargarCapa = (index) => {
    if (!mapView) return;

    const url = listacapas[index];
    let layer = mapView.map.layers.find((layer) => layer.url === url);

    // Si la capa no existe, crearla y agregarla al mapa
    if (!layer) {
      layer = new FeatureLayer({ url });
      mapView.map.add(layer);
    }

    // Cambiar la visibilidad de la capa
    const nuevasCapas = [...capasVisible];
    nuevasCapas[index] = !nuevasCapas[index];
    setCapasVisible(nuevasCapas);
    layer.visible = nuevasCapas[index];
  };

  useEffect(() => {
    capasVisible.forEach((visible, index) => {
      const url = listacapas[index];
      let layer = mapView.map.layers.find((layer) => layer.url === url);
      if (layer) {
        layer.visible = visible;
      }
    });
  }, [capasVisible, mapView]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div id="mySidenav" className="sidenav" style={{ width: isNavOpen ? '250px' : '0' }}>
        <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>
          &times;
        </a>
        <div>
          <button className="dropbtn" onClick={toggleDropdown}>
           
          </button>
          <h2 id="titleHeader" className="accordion-header">
            Listado <i className="fa fa-caret-down"></i>
          </h2>

          <div className={`dropdown-content ${isDropdownOpen ? 'show' : ''}`} id="myDropdown" ref={dropdownRef}>
            {listacapas.map((url, index) => (
              <div key={index}>
                <label>
                  <input
                    type="checkbox"
                    checked={capasVisible[index]}
                    onChange={() => cargarCapa(index)}
                  />
                  Capa {index + 1}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <span className="open-btn" onClick={openNav}>
        &#9776; CAPAS
      </span>
    </div>
  );
};

export default Capas;
