import mapboxgl from 'mapbox-gl';
import { EventEmitter as Events } from 'events';
import ReactDom from 'react-dom';
import React from 'react';

import { getChangeset } from './getChangeset';
import { Sidebar } from './sidebar';
import { Map as GlMap } from './map';
//filterLayers, renderMap, selectFeature, clearFeature
import { mapboxAccessToken, overpassApiUrl } from '../../config/constants';

export const cmap = new Events();

let map;

window.cmap = cmap;

export function render(container, changesetId, options) {
  container.style.width = options.width || '1000px';
  container.style.height = options.height || '500px';

  options = options || {};
  options.overpassApiUrl = options.overpassApiUrl || overpassApiUrl;
  mapboxgl.accessToken = mapboxAccessToken;
  container.classList.add('cmap-loading');
  if (!map) {
    map = new GlMap();
  }

  if (options.data) {
    _render(container, changesetId, options.data, options.disableSidebar);
  } else {
    getChangeset(changesetId, options.overpassApiUrl)
      .then(result => _render(container, changesetId, result))
      .catch(err => {
        errorMessage(err.msg);
      });
  }

  return cmap;
}
export function getMapInstance() {
  return map;
}
export function getGL() {
  return mapboxgl;
}

function _render(container, changesetId, result, disableSidebar) {
  renderHTML(container, changesetId, result, disableSidebar);

  container.classList.remove('cmap-loading');

  map.renderMap(false, result);

  var featureMap = result.featureMap;

  cmap.removeAllListeners();
  cmap.on('remove', () => {
    map.remove();
  });

  cmap.on('selectFeature', (geometryType, featureId) => {
    if (geometryType && featureId) {
      map.selectFeature(featureMap[featureId][0], featureMap);
      map.zoomToFeatures(featureMap[featureId]);
    }
  });
  cmap.on('selectMember', featureId => {
    map.selectMember(featureId);
  });

  cmap.on('clearFeature', () => {
    map.clearFeature();
  });
}

// Sets initial markup for info box and map container
function renderHTML(container, changesetId, result, disableSidebar) {
  var info;
  if (document.getElementById('seat')) {
    info = document.getElementById('seat');
  } else {
    info = document.createElement('div');
    info.id = 'seat';
    container.appendChild(info);
  }
  container.classList.add('cmap-container');

  // Add `tagsCount` to feature properties
  result.geojson.features.forEach(feature => {
    var tags = feature.properties.tags || {};
    feature.properties.tagsCount = Object.keys(tags).length;
  });

  ReactDom.render(
    <div>
      <div className="cmap-map" />

      <div
        className="cmap-diff"
        style={{ display: 'none', maxWidth: 'calc(100% - 20px)' }}
      >
        <button
          className="cmap-diff-close"
          onClick={() => getMapInstance().clearFeature()}
        >
          &times;
        </button>
        <div className="cmap-diff-metadata cmap-scroll-styled" />
        <div className="cmap-diff-tags cmap-scroll-styled" />
        <div className="cmap-diff-members cmap-scroll-styled" />
      </div>
      {!disableSidebar && (
        <Sidebar
          result={result}
          changesetId={changesetId}
          filterLayers={map.filterLayers}
          toggleLayer={function(e) {
            var layer = e.target.value;
            if (layer === 'satellite') {
              map.renderMap(
                'mapbox://styles/openstreetmap/cjnd8lj0e10i42spfo4nsvoay',
                result
              );
            }

            if (layer === 'dark') {
              map.renderMap('mapbox://styles/mapbox/dark-v9', result);
            }

            if (layer === 'streets') {
              map.renderMap('mapbox://styles/mapbox/streets-v9', result);
            }
          }}
        />
      )}
    </div>,
    info
  );
}

function errorMessage(message) {
  message = message || 'An unexpected error occured';
  document.querySelector('.cmap-info').innerHTML = message;
  document.querySelector('.cmap-sidebar').style.display = 'block';
  document.querySelector('.cmap-layer-selector').style.display = 'none';
  document.querySelector('.cmap-type-selector').style.display = 'none';
}
