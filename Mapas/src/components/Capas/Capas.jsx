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

  const [circuitosF1, setCircuitosF1] = useState([]); // Cambiar a estado

  const listaBaseMapas = [
    {
      id: "streets",
      title: "Street Map",
      basemap: "streets", // Basemap de calles
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
      basemap: "satellite", // Basemap de imágenes satelitales
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
      basemap: "dark-gray", // Basemap oscuro en escala de grises
      visible: false,
    }
  ];

  const [capaModificada, setCapaModificada] = useState(null);
  const [isLayerVisible, setIsLayerVisible] = useState(false);
  const [isBaseMapVisible, setIsBaseMapVisible] = useState(false);
  const [listacp, setListacp] = useState(circuitosF1);
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

  // URL de la API de GitHub para obtener el contenido del directorio
  const apiUrl = "https://api.github.com/repos/bacinger/f1-circuits/contents/circuits";

  // Función para obtener la lista de archivos .geojson
  const obtenerArchivosGeoJSON = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Filtrar solo los archivos .geojson
      const archivosGeoJSON = data.filter((archivo) => archivo.name.endsWith('.geojson'));

      // Generar las URLs "raw" para cada archivo
      const nuevosCircuitos = archivosGeoJSON.map((archivo) => ({
        id: archivo.name.replace('.geojson', ''), // Usar el nombre del archivo como ID
        url: archivo.download_url, // URL "raw" del archivo
        type: "GeoJSONLayer",
        visible: false,
      }));

      // Actualizar el estado de circuitosF1 y listacp
      setCircuitosF1(nuevosCircuitos);
      setListacp(nuevosCircuitos);
    } catch (error) {
      console.error('Error al obtener los archivos:', error);
    }
  };

  // Llamar a la función cuando el componente se monte
  useEffect(() => {
    obtenerArchivosGeoJSON();
  }, []);

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
        url: filePath,  // Aquí pasas la URL del archivo
        id: capaModificada.id, // Usar el nombre del archivo como ID
        title: filePath.split('/').pop(), // Asume que el nombre del archivo se encuentra al final de la URL
        visible: true,
      });

      return newLayer;
    } catch (error) {
      console.error('Error al cargar el archivo GeoJSON desde el proyecto:', error);
    }
  };

  const fileInputRef = useRef(null);

  // Función para manejar la carga del archivo GeoJSON
  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Obtener el archivo seleccionado
    if (!file) return;

    const reader = new FileReader(); // Crear un lector de archivos
    reader.onload = (e) => {
      try {
        const geojson = JSON.parse(e.target.result); // Convertir el archivo a objeto GeoJSON

        // Crear una URL temporal para el archivo
        const fileUrl = URL.createObjectURL(file);

        // Crear una capa GeoJSONLayer a partir del archivo
        const geojsonLayer = new GeoJSONLayer({
          url: fileUrl, // Usar la URL temporal
          title: file.name, // Nombre del archivo como título de la capa
          visible: true,
        });

        // Agregar la capa al mapa (tanto en 2D como en 3D)
        if (mapView) {
          mapView.map.add(geojsonLayer);
        }
        if (mapSceneView) {
          mapSceneView.map.add(geojsonLayer);
        }

        // Actualizar la lista de capas
        setListacp([...listacp, { id: file.name, url: fileUrl, type: "GeoJSONLayer", visible: true }]);
      } catch (error) {
        console.error('Error al cargar el archivo GeoJSON:', error);
      }
    };

    reader.readAsText(file); // Leer el archivo como texto
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
      <div id="mySidenav" className="sidenav" style={{ width: isNavOpen ? '250px' : '0' }}>
        <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>
          &times;
        </a>
        <button className="dropbtn" onClick={toggleDropdown}>Listado de Circuitos</button>
        <div className={`dropdown-content ${isDropdownOpen ? 'show' : ''}`} id="myDropdown">
          {listacp.map((capa, index) => (
            <div key={capa.id}>
              <label>
                <input type="checkbox" checked={capa.visible} onChange={(e) => toggleCapa(capa, e.target.checked)} />
                {`Circuito ${capa.id}`}
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

        {/* Botón para cargar el archivo GeoJSON */}
        <button
          onClick={() => fileInputRef.current.click()} // Simular clic en el input de archivo
          style={{
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Cargar GeoJSON
        </button>
        {/* Input de archivo oculto */}
        <input
          type="file"
          accept=".geojson"
          onChange={handleFileUpload}
          ref={fileInputRef}
          style={{ display: 'none' }} // Ocultar el input
        />
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