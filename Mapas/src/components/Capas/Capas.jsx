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
  const [isCircuitListOpen, setIsCircuitListOpen] = useState(false);
  const [isBaseMapListOpen, setIsBaseMapListOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [circuitosF1, setCircuitosF1] = useState([]);

  const listaBaseMapas = [
    {
      id: "streets",
      title: "Street Map",
      basemap: "streets",
      visible: false,
    },
    {
      id: "topo",
      title: "Topographic Map",
      basemap: "topo",
      visible: false,
    },
    {
      id: "satellite",
      title: "Satellite Imagery",
      basemap: "satellite",
      visible: false,
    },
    {
      id: "hybrid",
      title: "Hybrid Map",
      basemap: "hybrid",
      visible: false,
    },
    {
      id: "dark-gray",
      title: "Dark Gray Canvas",
      basemap: "dark-gray",
      visible: false,
    }
  ];

  const [capaModificada, setCapaModificada] = useState(null);
  const [isLayerVisible, setIsLayerVisible] = useState(false);
  const [isBaseMapVisible, setIsBaseMapVisible] = useState(false);
  const [listacp, setListacp] = useState(circuitosF1);
  const [listaBaseMaps, setlistaBaseMaps] = useState(listaBaseMapas);

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const toggleCircuitList = () => setIsCircuitListOpen(!isCircuitListOpen);
  const toggleBaseMapList = () => setIsBaseMapListOpen(!isBaseMapListOpen);

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
    const newListaMapas = listaBaseMaps.map((bmap) => {
      if (basemapa.title === bmap.title) {
        bmap.visible = isVisible;
      }
      return bmap;
    });
    basemapa.visible = isVisible;
    setIsBaseMapVisible(isVisible);
    setlistaBaseMaps(newListaMapas);
    setBaseMap(basemapa);
  };

  const apiUrl = "https://api.github.com/repos/bacinger/f1-circuits/contents/circuits";

  const obtenerArchivosGeoJSON = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const archivosGeoJSON = data.filter((archivo) => archivo.name.endsWith('.geojson'));
      const nuevosCircuitos = archivosGeoJSON.map((archivo) => ({
        id: archivo.name.replace('.geojson', ''),
        url: archivo.download_url,
        type: "GeoJSONLayer",
        visible: false,
      }));
      setCircuitosF1(nuevosCircuitos);
      setListacp(nuevosCircuitos);
    } catch (error) {
      console.error('Error al obtener los archivos:', error);
    }
  };

  useEffect(() => {
    obtenerArchivosGeoJSON();
  }, []);

  const cargarCapa = async (layer, map) => {
    try {
      await layer.when();
      if (layer.fullExtent) {
        await map.goTo(layer.fullExtent);
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

  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const geojson = JSON.parse(e.target.result);
        const fileUrl = URL.createObjectURL(file);
        const geojsonLayer = new GeoJSONLayer({
          url: fileUrl,
          title: file.name,
          visible: true,
        });

        if (mapView) {
          mapView.map.add(geojsonLayer);
        }
        if (mapSceneView) {
          mapSceneView.map.add(geojsonLayer);
        }

        setListacp([...listacp, { id: file.name, url: fileUrl, type: "GeoJSONLayer", visible: true }]);
      } catch (error) {
        console.error('Error al cargar el archivo GeoJSON:', error);
      }
    };

    reader.readAsText(file);
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
      {/* Barra de navegación */}
      <div id="mySidenav" className={`sidenav ${isNavOpen ? 'open' : ''}`}>
        {/* Botón de Listado de Circuitos (izquierda) */}
        <div className="left-section">
          <button className="dropbtn" onClick={toggleCircuitList}>
            Circuitos
          </button>
        </div>

        {/* Lista de Circuitos (centro) */}
        <div className={`center-section ${isCircuitListOpen ? 'show' : ''}`}>
          {listacp.map((capa, index) => (
            <div key={capa.id}>
              <label>
                <input
                  type="checkbox"
                  checked={capa.visible}
                  onChange={(e) => toggleCapa(capa, e.target.checked)}
                />
                {`Circuito ${capa.id}`}
              </label>
            </div>
          ))}
        </div>

        {/* Lista de Basemaps (derecha) */}
        <div className="right-section">
          {listaBaseMaps.map((basemapa, index) => (
            <div key={basemapa.id}>
              <label>
                <input
                  type="checkbox"
                  checked={basemapa.visible}
                  onChange={(e) => toggleBaseMapa(basemapa, e.target.checked)}
                />
                {`Basemap ${basemapa.basemap}`}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Botón para abrir/cerrar la barra lateral */}
      <span className="open-btn" onClick={toggleNav}>
        &#9776;
      </span>
    </div>
  );
};

Capas.propTypes = {
  mapView: PropTypes.object.isRequired,
  mapSceneView: PropTypes.object.isRequired,
};

export default Capas;