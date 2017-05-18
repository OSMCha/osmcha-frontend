var jsonParser = require('real-changesets-parser');
import {osmBase, overpassBase} from '../config/constants';
import moment from 'moment';
var S3_URL = '//s3.amazonaws.com/mapbox/real-changesets/production/';

export function networkFetchChangesetMap(changesetID) {
  var url = S3_URL + changesetID + '.json';

  var network = fetch(url, {
    'Response-Type': 'application/json',
  }).then(r => r.json());

  return Promise.all([osm(changesetID), network]).then(resp => {
    var geojson = jsonParser(resp[1]); //jsonParser(JSON.parse(resp[1]));
    var featureMap = getFeatureMap(geojson);
    return {
      geojson: geojson,
      featureMap: featureMap,
      changeset: resp[0],
    };
  });
}

function getDataParam(c) {
  return '[out:xml][adiff:%22' +
    c.from.toString() +
    ',%22,%22' +
    c.to.toString() +
    '%22];(node(bbox)(changed);way(bbox)(changed);relation(bbox)(changed));out%20meta%20geom(bbox);';
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

function osm(changesetID) {
  var url = osmBase + 'changeset/' + changesetID;
  var options = {
    'Response-Type': 'document',
  };
  return fetch(url, options).then(r => r.text()).then(r => {
    const parser = new DOMParser();
    let xml;
    try {
      xml = parser.parseFromString(r, 'text/xml');
    } catch (e) {
      throw e;
    }
    var csFeature = xml.getElementsByTagName('changeset')[0];
    var cs = csFeature.attributes;
    var uid = cs.uid.textContent;
    var user = cs.user.textContent;
    var from = moment(cs.created_at.textContent, 'YYYY-MM-DDTHH:mm:ss\\Z')
      .subtract('seconds', 1)
      .format('YYYY-MM-DDTHH:mm:ss\\Z');
    var to = cs.closed_at ? cs.closed_at.textContent : null;
    var left = cs.min_lon ? cs.min_lon.textContent : -180;
    var bottom = cs.min_lat ? cs.min_lat.textContent : -90;
    var right = cs.max_lon ? cs.max_lon.textContent : 180;
    var top = cs.max_lat ? cs.max_lat.textContent : 90;
    return {
      id: changesetID,
      uid: uid,
      user: user,
      from: from,
      to: to,
      bbox: {
        left: left,
        bottom: bottom,
        right: right,
        top: top,
      },
    };
  });
}
