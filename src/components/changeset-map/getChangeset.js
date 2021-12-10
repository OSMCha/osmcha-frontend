import adiffParser from 'osm-adiff-parser-saxjs';
import jsonParser from 'real-changesets-parser';
import { query } from './query';
import { overpassApiUrl, overpassCredentials } from '../../config/constants';

export function getChangeset(changesetID) {
  return query(changesetID).then(changeset => {
    return fetchFromOverPass(changesetID, changeset);
  });
}

function fetchFromOverPass(changesetID, changeset) {
  var data = getDataParam(changeset);
  var bbox = getBboxParam(changeset.bbox);
  var url = overpassApiUrl + '?data=' + data + '&bbox=' + bbox;

 return fetch(url, {
    'credentials': overpassCredentials,
    'Response-Type': 'application/osm3s+xml'
  })
    .then(r => r.text())
    .then(response => {
      return new Promise((res, rej) => {
        adiffParser(response, null, (err, json) => {
          if (err) {
            return rej({
              msg: 'Failed to parser adiff xml.',
              error: err
            });
          }
          var elements = Object.keys(json).reduce(
            (result, item) => result.concat(json[item]),
            []
          );
          var geojson = jsonParser({
            elements: elements
          });
          var featureMap = getFeatureMap(geojson);

          var ret = {
            geojson: geojson,
            featureMap: featureMap,
            changeset: changeset
          };
          return res(ret);
        });
      });
    })
    .catch(err =>
      Promise.reject({
        msg: 'Overpass query failed.',
        error: err
      })
    );
}

function getDataParam(c) {
  return (
    '[out:xml][adiff:%22' +
    c.from.toString() +
    ',%22,%22' +
    c.to.toString() +
    '%22];(node(bbox)(changed);way(bbox)(changed);relation(bbox)(changed););out%20meta%20geom(bbox);'
  );
}

function getBboxParam(bbox) {
  return [bbox.left, bbox.bottom, bbox.right, bbox.top].join(',');
}

function getFeatureMap(geojson) {
  var features = geojson.features;
  var featureMap = {};

  for (var i = 0, len = features.length; i < len; i++) {
    var id = features[i].properties.id;
    featureMap[id] = featureMap[id] || [];
    featureMap[id].push(features[i]);
  }

  return featureMap;
}
