import React, { useState, useRef, useEffect } from 'react';
import './Capas.css';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import CSVLayer from '@arcgis/core/layers/CSVLayer';
import KMLLayer from '@arcgis/core/layers/KMLLayer';
import WMSLayer from '@arcgis/core/layers/WMSLayer';
import WMTSLayer from '@arcgis/core/layers/WMTSLayer';
import SceneView from '@arcgis/core/views/SceneView';
import PropTypes from 'prop-types';

const Capas = ({ mapView, mapSceneView, setBaseMap }) => {
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

  const listaBaseMapas = [
    {
      id: "streets",
      title: "Street Map",
      basemap: "streets",// Basemap de calles
      visible: false,
    },
    {
      id: "topo",
      title: "Topographic Map",
      basemap: "topo", // Basemap topográfico
      visible: false,

    },
    {
      id: "satellite",
      title: "Satellite Imagery",
      basemap: "satellite",// Basemap de imágenes satelitales
      visible: false,

    },
    {
      id: "hybrid",
      title: "Hybrid Map",
      basemap: "hybrid", // Basemap híbrido (satélite con calles)
      visible: false,
    },
    {
      id: "dark-gray",
      title: "Dark Gray Canvas",
      basemap: "dark-gray",// Basemap oscuro en escala de grises
      visible: false,
    }
  ];


  const [capaModificada, setCapaModificada] = useState(null);
  const [isLayerVisible, setIsLayerVisible] = useState(false);
  const [isBaseMapVisible, setIsBaseMapVisible] = useState(false);

  const [listacp, setListacp] = useState(listacapas);
  const [listaBaseMaps, setlistaBaseMaps] = useState(listaBaseMapas);

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
    setIsLayerVisible(isVisible);
    setListacp(newLista);
    setCapaModificada(capa);
  };

  const toggleBaseMapa = (basemapa, isVisible) => {
    debugger
    const newListaMapas = listaBaseMaps.map((bmap) => {
      if (basemapa.title === bmap.title) {
        bmap.visible = isVisible;
      }
      return bmap;
    });
    basemapa.visible=isVisible;
    setIsBaseMapVisible(isVisible);
    setlistaBaseMaps(newListaMapas);
    setBaseMap(basemapa);
  };

  const cargarCapa = async (layer, map) => {
    try {
      await layer.when(); // Aseguramos que la capa esté lista
      if (layer.fullExtent) {
        await map.goTo(layer.fullExtent); // Solo hacemos "goTo" si tiene una extensión válida
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

      return newLayer;
    } catch (error) {
      console.error('Error al cargar el archivo GeoJSON desde el proyecto:', error);
    }
  };

  useEffect(() => {
    if (!mapView || !mapSceneView || !capaModificada) return;

    const cargarYAgregarCapa = async () => {
      let layer = mapView.map.findLayerById(capaModificada.id);
      let layer3d = mapSceneView.map.findLayerById(capaModificada.id);

      if (!layer && !layer3d) {
        switch (capaModificada.type) {
          case "FeatureLayer":

            layer = new FeatureLayer({ url: capaModificada.url, id: capaModificada.id });
            layer3d = new FeatureLayer({ url: capaModificada.url, id: capaModificada.id });
            // layer3d = agregarFeatureLayer(capaModificada.url, capaModificada.id);
            break;
          case "GeoJSONLayer":
            layer = await GeoJsonFromProject(capaModificada.url);
            layer3d = await GeoJsonFromProject(capaModificada.url);
            break;
          case "CSVLayer":
            layer = new CSVLayer({ url: capaModificada.url, id: capaModificada.id });
            layer3d = new CSVLayer({ url: capaModificada.url, id: capaModificada.id });
            break;
          case "KMLLayer":
            layer = new KMLLayer({ url: capaModificada.url, id: capaModificada.id });
            layer3d = new KMLLayer({ url: capaModificada.url, id: capaModificada.id });
            break;
          case "WMSLayer":
            layer = new WMSLayer({ url: capaModificada.url, id: capaModificada.id });
            layer3d = new WMSLayer({ url: capaModificada.url, id: capaModificada.id });
            break;
          case "WMTSLayer":
            layer = new WMTSLayer({ url: capaModificada.url, id: capaModificada.id });
            layer3d = new WMTSLayer({ url: capaModificada.url, id: capaModificada.id });
            break;
          default:
            console.warn(`Tipo de capa no soportado: ${capaModificada.type}`);
            return;
        }

        mapView.map.add(layer);
        mapSceneView.map.add(layer3d);
        await cargarCapa(layer, mapView);
        await cargarCapa(layer3d, mapSceneView);
      }

      if (layer || layer3d) {
        layer.visible = isLayerVisible;
        layer3d.visible = isLayerVisible;
      }
    };

    cargarYAgregarCapa();
  }, [capaModificada, isLayerVisible, mapView, mapSceneView]);
  
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

        <button className="dropbtn" onClick={toggleDropdown}>Listado BaseMap</button>
        <div className={`dropdown-content ${isDropdownOpen ? 'show' : ''}`} id="myDropdown">
          {listaBaseMaps.map((basemapa, index) => (
            <div key={basemapa.id}>
              <label>
                <input type="checkbox" checked={basemapa.visible} onChange={(e) => toggleBaseMapa(basemapa, e.target.checked)} />
                {`Basemap ${basemapa.basemap}`}
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
  mapSceneView: PropTypes.object.isRequired,
};

export default Capas;
