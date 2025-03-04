import React, { useEffect } from 'react';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

const Capa1 = ({ mapView, capa1Visible }) => {
  useEffect(() => {
    if (!mapView) return;

    const capa1Url = "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0";

    if (capa1Visible) {
      const layer1 = new FeatureLayer({ url: capa1Url });
      mapView.map.add(layer1);
    } else {
      const layer1 = mapView.map.layers.find(layer => layer.url === capa1Url);
      if (layer1) mapView.map.remove(layer1);
    }

  }, [capa1Visible, mapView]);

  return null; // No necesitamos renderizar nada en este componente
};

export default Capa1;