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
  const dropdownRef = useRef(null);

  const listacapas = [
    { id: "AAA", url: "https://geo.bizkaia.eus/arcgisserverinspire/rest/services/Kartografia_Cartografia/ML_UdalMugarteak_LimitesMunicipales/MapServer/2", type: "FeatureLayer", visible: false },
    { id: "BBB", url: "https://geo.bizkaia.eus/arcgisserverinspire/rest/services/Kartografia_Cartografia/SareKartografikoak_MallasCartograficas/MapServer/2", type: "FeatureLayer", visible: false },
    { id: "PPP", url: "/mapas/f12-circuits.geojson", type: "GeoJSONLayer", visible: false },
    { id: "CCC", url: "/mapas/jp-1962.geojson", type: "GeoJSONLayer", visible: false },
    // Agrega más capas según sea necesario
  ];

  const [capaModificada, setCapaModificada] = useState(null);
  const [ocultarVisiblisar, setOcultarVisiblisar] = useState(false);
  const [listacp, setListacp] = useState(listacapas);

  const openNav = () => setIsNavOpen(true);
  const closeNav = () => setIsNavOpen(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);



  const toggleCapa = (capa, isVisible) => {
    const newLista = listacp.map((cp) => {
      if (capa.id === cp.id) {
        cp.visible = isVisible;
      }
      return cp;
    });
    setOcultarVisiblisar(isVisible);
    setListacp(newLista);
    setCapaModificada(capa);
  };

  const cargarCapa = async (layer) => {
    try {
      await layer.when(); // Aseguramos que la capa esté lista
      if (layer.fullExtent) {
        await mapView.goTo(layer.fullExtent); // Solo hacemos "goTo" si tiene una extensión válida
      } else {
        console.warn('La capa no tiene una extensión válida.');
      }
    } catch (error) {
      console.error('Error al cargar la capa:', error);
    }
  };


  const GeoJsonFromProject = async (filePath) => {
    try {
      const newLayer = new GeoJSONLayer({
        url: filePath,
        id: capaModificada.id,
        title: filePath.split('/').pop(),
        visible: true,
      });

      //  mapView.map.add(newLayer);
      // setListacp([...listacp, { id: filePath, type: 'GeoJSONLayer', visible: true }]);


      return newLayer;
    } catch (error) {
      console.error('Error al cargar el archivo GeoJSON desde el proyecto:', error);
    }
  };

  useEffect(() => {
    if (!mapView || !capaModificada) return;

    const cargarYAgregarCapa = async () => {
      let layer = mapView.map.findLayerById(capaModificada.id);

      if (!layer) {
        switch (capaModificada.type) {
          case "FeatureLayer":
            layer = new FeatureLayer({ url: capaModificada.url, id: capaModificada.id });
            break;
          case "GeoJSONLayer":
            layer = await GeoJsonFromProject(capaModificada.url, capaModificada.id);
            break;
          case "CSVLayer":
            layer = new CSVLayer({ url: capaModificada.url, id: capaModificada.id });
            break;
          case "KMLLayer":
            layer = new KMLLayer({ url: capaModificada.url, id: capaModificada.id });
            break;
          case "WMSLayer":
            layer = new WMSLayer({ url: capaModificada.url, id: capaModificada.id });
            break;
          case "WMTSLayer":
            layer = new WMTSLayer({ url: capaModificada.url, id: capaModificada.id });
            break;
          default:
            console.warn(`Tipo de capa no soportado: ${capaModificada.type}`);
            return;
        }

        mapView.map.add(layer);
        await cargarCapa(layer);
      }

      if (layer) {
        layer.visible = ocultarVisiblisar;
      }
    };

    cargarYAgregarCapa();
  }, [capaModificada, ocultarVisiblisar, mapView]);

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