import mapboxgl from 'mapbox-gl';
import { featureCollection } from '@turf/helpers';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';

export function getBounds(bbox) {
  var left = +bbox.left,
    right = +bbox.right,
    top = +bbox.top,
    bottom = +bbox.bottom;

  return new mapboxgl.LngLatBounds(
    new mapboxgl.LngLat(left, bottom),
    new mapboxgl.LngLat(right, top)
  );
}

export function getBoundingBox(bounds) {
  var left = bounds.getWest(),
    right = bounds.getEast(),
    top = bounds.getNorth(),
    bottom = bounds.getSouth();

  var padX = 0;
  var padY = 0;
  if (!(left === -180 && right === 180 && top === 90 && bottom === -90)) {
    padX = Math.max((right - left) / 5, 0.0001);
    padY = Math.max((top - bottom) / 5, 0.0001);
  }

  return featureCollection([
    bboxPolygon([left - padX, bottom - padY, right + padX, top + padY])
  ]);
}

export function getFeatureBBOX(features) {
  // creates a GeoJSON with the features and calculate its BBOX
  return bbox({ type: 'FeatureCollection', features: features });
}
