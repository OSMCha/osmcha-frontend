import mapboxgl from 'mapbox-gl';
import platform from 'platform-detect';
import { featureCollection } from '@turf/helpers';

import { getBoundingBox, getBounds, getFeatureBBOX } from './helpers';
import { cmap } from './render';
import { renderFeatureDiff } from './featureDiff/renderFeatureDiff';

const LAYERS_KEY = {
  'added-line': { added: true, ways: true },
  'added-point-tagged': { added: true, nodes: true },
  'added-point-untagged': { added: true, nodes: true },
  'added-relation': { added: true, relations: true },
  'modified-old-line': { modified: true, ways: true },
  'modified-old-point-tagged': { modified: true, nodes: true },
  'modified-old-point-untagged': { modified: true, nodes: true },
  'modified-old-point-on-way': { modified: true, nodes: true },
  'modified-new-line': { modified: true, ways: true },
  'modified-old-relation': { modified: true, relations: true },
  'modified-new-point-tagged': { modified: true, nodes: true },
  'modified-new-point-untagged': { modified: true, nodes: true },
  'modified-new-point-on-way': { modified: true, nodes: true },
  'modified-new-relation': { modified: true, relations: true },
  'deleted-line': { deleted: true, ways: true },
  'deleted-point-tagged': { deleted: true, nodes: true },
  'deleted-point-untagged': { deleted: true, nodes: true },
  'deleted-relation': { deleted: true, relations: true }
};

export class Map {
  constructor() {
    this.map = null;
    this.queue = [];
    this.filterLayers = this.filterLayers.bind(this);
    this.relationMembersLayers = {
      'added-relation-member-point': {
        added: true,
        nodes: true,
        changeType: 'added'
      },
      'added-relation-member-point-with-role': {
        added: true,
        nodes: true,
        changeType: 'added',
        extraFilter: ['has', 'role']
      },
      'modified-relation-member-new-point': {
        modified: true,
        nodes: true,
        changeType: 'modifiedNew'
      },
      'modified-relation-member-old-point': {
        modified: true,
        nodes: true,
        changeType: 'modifiedOld'
      },
      'deleted-relation-member-point': {
        deleted: true,
        nodes: true,
        changeType: 'deletedNew'
      },
      'added-relation-member-line': {
        added: true,
        ways: true,
        changeType: 'added'
      },
      'modified-relation-member-new-line': {
        modified: true,
        ways: true,
        changeType: 'modifiedNew'
      },
      'modified-relation-member-old-line': {
        modified: true,
        ways: true,
        changeType: 'modifiedOld'
      },
      'deleted-relation-member-line': {
        deleted: true,
        ways: true,
        changeType: 'deletedNew'
      },
      'modified-relation-member-new-point-on-way': {
        modified: true,
        nodes: true,
        changeType: 'modifiedNew',
        extraFilter: ['==', 'role', 'via']
      },
      'modified-relation-member-old-point-on-way': {
        modified: true,
        nodes: true,
        changeType: 'modifiedOld',
        extraFilter: ['==', 'role', 'via']
      }
    };
    this.layersKey = LAYERS_KEY;
  }
  filterLayers() {
    var selectedActions = [];
    var selectedTypes = [];
    document
      .querySelectorAll('.cmap-filter-action-section input:checked')
      .forEach(function(checkedElement) {
        selectedActions.push(checkedElement.value);
      });

    document
      .querySelectorAll('.cmap-filter-type-section input:checked')
      .forEach(function(checkedElement) {
        selectedTypes.push(checkedElement.value);
      });

    var layers = Object.keys(this.layersKey);
    var layersKey = LAYERS_KEY;

    layers.forEach(layer => {
      var isSelectedAction = selectedActions.reduce(function(accum, action) {
        return layersKey[layer][action] || accum;
      }, false);
      var isSelectedType = selectedTypes.reduce(function(accum, type) {
        return layersKey[layer][type] || accum;
      }, false);

      if (isSelectedAction && isSelectedType) {
        this.map.setLayoutProperty(layer, 'visibility', 'visible');
      } else {
        this.map.setLayoutProperty(layer, 'visibility', 'none');
      }

      if (selectedActions.length === 0 || selectedTypes.length === 0) {
        this.map.setLayoutProperty('bg-point', 'visibility', 'none');
        this.map.setLayoutProperty('bg-line', 'visibility', 'none');
      } else {
        this.map.setLayoutProperty('bg-point', 'visibility', 'visible');
        this.map.setLayoutProperty('bg-line', 'visibility', 'visible');
      }
    });
  }
  getMapInstance() {
    return this.map;
  }
  getResult() {
    return this.result;
  }
  remove() {
    if (this.map) {
      this.map.remove();
      this.mapLoaded = false;
      this.map = undefined;
    }
  }
  getRelationMembers(result) {
    let relationMembers = [];
    result.geojson.features
      .filter(feature => feature.properties.type === 'relation')
      .forEach(relation =>
        relation.properties.relations.forEach(element => {
          element.properties.relation = relation.properties.id;
          element.properties.changeType = relation.properties.changeType;
          relationMembers.push(element);
        })
      );

    // exclude invalid relation members coordinates
    // caused by https://github.com/drolbr/Overpass-API/issues/536
    relationMembers = relationMembers.filter(
      member => member.geometry.coordinates.length > 0
    );
    relationMembers.forEach(member => {
      member.geometry.coordinates = member.geometry.coordinates.filter(
        i => typeof i === 'number' || (typeof i === 'object' && !isNaN(i[0]))
      );
    });
    return featureCollection(relationMembers);
  }
  addMapSource(result, bounds) {
    if (this.map.getSource('changeset')) {
      this.map.getSource('changeset').setData(result.geojson);
    } else {
      this.map.addSource('changeset', {
        type: 'geojson',
        data: result.geojson
      });
    }

    if (this.map.getSource('relationMembers')) {
      this.map
        .getSource('relationMembers')
        .setData(this.getRelationMembers(result));
      this.clearRelationMemberHighlight();
    } else {
      this.map.addSource('relationMembers', {
        type: 'geojson',
        data: this.getRelationMembers(result)
      });
    }

    if (this.map.getSource('bbox')) {
      this.map.getSource('bbox').setData(getBoundingBox(bounds));
    } else {
      this.map.addSource('bbox', {
        type: 'geojson',
        data: getBoundingBox(bounds)
      });
    }
  }
  addMapLayers() {
    this.map.addLayer({
      id: 'bbox-line',
      type: 'line',
      source: 'bbox',
      paint: {
        'line-color': '#A58CF2',
        'line-opacity': 0.75,
        'line-width': 2
      }
    });

    this.map.addLayer({
      id: 'bg-line',
      source: 'changeset',
      type: 'line',
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': 'hsl(0, 0%, 15%)',
        'line-width': 12,
        'line-blur': 0.2,
        'line-opacity': {
          base: 1.5,
          stops: [
            [12, 0.5],
            [18, 0.2]
          ]
        }
      },
      filter: ['all', ['==', 'type', 'way']]
    });

    this.map.addLayer({
      id: 'bg-point',
      source: 'changeset',
      type: 'circle',
      paint: {
        'circle-color': 'hsl(0, 0%, 15%)',
        'circle-blur': 0.2,
        'circle-opacity': {
          base: 1.5,
          stops: [
            [12, 0.5],
            [18, 0.2]
          ]
        },
        'circle-radius': {
          base: 1.5,
          stops: [
            [10, 12],
            [16, 10]
          ]
        }
      },
      filter: ['all', ['==', '$type', 'Point']]
    });

    this.map.addLayer({
      id: 'highlight-line',
      source: 'changeset',
      type: 'line',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': 'hsl(0, 0%, 75%)',
        'line-width': {
          base: 1,
          stops: [
            [10, 15],
            [16, 10]
          ]
        },
        'line-opacity': {
          base: 1.5,
          stops: [
            [12, 0.75],
            [18, 0.75]
          ]
        }
      },
      filter: ['all', ['==', 'id', ''], ['==', '$type', 'LineString']]
    });

    this.map.addLayer({
      id: 'highlight-point',
      source: 'changeset',
      type: 'circle',
      paint: {
        'circle-color': 'hsl(0, 0%, 75%)',
        'circle-radius': {
          base: 1,
          stops: [
            [10, 10],
            [16, 11]
          ]
        },
        'circle-opacity': 0.8
      },
      filter: ['all', ['==', 'id', ''], ['==', '$type', 'Point']]
    });

    this.map.addLayer({
      id: 'highlight-relation-member-line',
      source: 'relationMembers',
      type: 'line',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': 'hsl(267, 81%, 82%)',
        'line-width': {
          base: 1,
          stops: [
            [10, 15],
            [16, 10]
          ]
        },
        'line-opacity': {
          base: 1,
          stops: [
            [12, 0.5],
            [18, 0.5]
          ]
        }
      },
      filter: ['all', ['==', 'ref', ''], ['==', '$type', 'LineString']]
    });

    this.map.addLayer({
      id: 'highlight-relation-member-point',
      source: 'relationMembers',
      type: 'circle',
      paint: {
        'circle-color': 'hsl(267, 81%, 82%)',
        'circle-radius': {
          base: 1,
          stops: [
            [10, 10],
            [16, 11]
          ]
        },
        'circle-opacity': 0.8
      },
      filter: ['all', ['==', 'ref', ''], ['==', '$type', 'Point']]
    });

    // RELATION MEMBERS

    this.map.addLayer({
      id: 'deleted-relation-member-line',
      source: 'relationMembers',
      type: 'line',
      paint: {
        'line-color': '#CC2C47',
        'line-width': {
          base: 1,
          stops: [
            [8, 3],
            [12, 5]
          ]
        },
        'line-dasharray': [0.1, 0.25],
        'line-opacity': 0.8
      },
      filter: ['all', ['==', 'relation', '']]
    });

    this.map.addLayer({
      id: 'modified-relation-member-old-line',
      source: 'relationMembers',
      type: 'line',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#DB950A',
        'line-width': {
          base: 1,
          stops: [
            [8, 3],
            [12, 6]
          ]
        },
        'line-blur': {
          base: 1,
          stops: [
            [8, 0.25],
            [12, 0.5]
          ]
        },
        'line-opacity': 0.6
      },
      filter: ['all', ['==', 'relation', '']]
    });

    this.map.addLayer({
      id: 'modified-relation-member-new-line',
      source: 'relationMembers',
      type: 'line',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#E8E845',
        'line-width': {
          base: 1,
          stops: [
            [8, 1],
            [12, 2]
          ]
        },
        'line-opacity': 0.6
      },
      filter: ['all', ['==', 'relation', '']]
    });

    this.map.addLayer({
      id: 'added-relation-member-line',
      source: 'relationMembers',
      type: 'line',
      interactive: true,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#39DBC0',
        'line-width': {
          base: 1,
          stops: [
            [8, 1.5],
            [12, 2]
          ]
        },
        'line-opacity': 0.8
      },
      filter: ['all', ['==', 'relation', '']]
    });

    this.map.addLayer({
      id: 'modified-relation-member-old-point-on-way',
      source: 'relationMembers',
      type: 'circle',
      paint: {
        'circle-color': '#DB950A',
        'circle-opacity': {
          base: 1.5,
          stops: [
            [10, 0.25],
            [14, 0.5]
          ]
        },
        'circle-blur': 0.25,
        'circle-radius': {
          base: 1.5,
          stops: [
            [10, 2.5],
            [16, 3.5]
          ]
        }
      },
      filter: ['all', ['==', 'relation', '']]
    });

    this.map.addLayer({
      id: 'modified-relation-member-new-point-on-way',
      source: 'relationMembers',
      type: 'circle',
      paint: {
        'circle-color': '#E8E845',
        'circle-opacity': {
          base: 1.5,
          stops: [
            [10, 0.25],
            [14, 0.25]
          ]
        },
        'circle-radius': {
          base: 1.5,
          stops: [
            [10, 1.25],
            [16, 2.25]
          ]
        }
      },
      filter: ['all', ['==', 'relation', '']]
    });

    this.map.addLayer({
      id: 'deleted-relation-member-point',
      source: 'relationMembers',
      type: 'circle',
      paint: {
        'circle-color': '#CC2C47',
        'circle-radius': {
          base: 1.5,
          stops: [
            [10, 2],
            [16, 3]
          ]
        },
        'circle-opacity': {
          base: 1.5,
          stops: [
            [10, 0.25],
            [14, 0.5]
          ]
        }
      },
      filter: ['all', ['==', 'relation', '']]
    });

    this.map.addLayer({
      id: 'added-relation-member-point',
      source: 'relationMembers',
      type: 'circle',
      paint: {
        'circle-color': '#39DBC0',
        'circle-opacity': {
          base: 1.5,
          stops: [
            [10, 0.3],
            [14, 0.75]
          ]
        },
        'circle-radius': {
          base: 1.5,
          stops: [
            [10, 1.25],
            [16, 1.9]
          ]
        }
      },
      filter: ['all', ['==', 'relation', '']]
    });

    this.map.addLayer({
      id: 'added-relation-member-point-with-role',
      source: 'relationMembers',
      type: 'circle',
      paint: {
        'circle-color': '#39DBC0',
        'circle-opacity': {
          base: 1.5,
          stops: [
            [10, 0.3],
            [14, 0.75]
          ]
        },
        'circle-radius': {
          base: 1.5,
          stops: [
            [10, 1],
            [16, 5]
          ]
        },
        'circle-stroke-width': 1,
        'circle-stroke-opacity': 0.9,
        'circle-stroke-color': '#39DBC0'
      },
      filter: ['all', ['==', 'relation', '']]
    });

    this.map.addLayer({
      id: 'modified-relation-member-new-point',
      source: 'relationMembers',
      type: 'circle',
      paint: {
        'circle-color': '#E8E845',
        'circle-opacity': {
          base: 1.5,
          stops: [
            [10, 0.25],
            [14, 0.75]
          ]
        },
        'circle-radius': {
          base: 1.5,
          stops: [
            [10, 2],
            [16, 7]
          ]
        },
        'circle-stroke-width': 1,
        'circle-stroke-opacity': 0.9,
        'circle-stroke-color': '#E8E845'
      },
      filter: ['all', ['==', 'relation', '']]
    });

    this.map.addLayer({
      id: 'modified-relation-member-old-point',
      source: 'relationMembers',
      type: 'circle',
      paint: {
        'circle-color': '#DB950A',
        'circle-opacity': {
          base: 1.5,
          stops: [
            [10, 0.25],
            [14, 0.5]
          ]
        },
        'circle-radius': {
          base: 1.5,
          stops: [
            [10, 1.75],
            [16, 3]
          ]
        },
        'circle-stroke-width': 1,
        'circle-stroke-opacity': 0.9,
        'circle-stroke-color': '#DB950A'
      },
      filter: ['all', ['==', 'relation', '']]
    });

    // RELATIONS
    this.map.addLayer({
      id: 'deleted-relation',
      source: 'changeset',
      type: 'line',
      paint: {
        'line-color': '#CC2C47',
        'line-width': {
          base: 1,
          stops: [
            [8, 1.5],
            [12, 1.5]
          ]
        },
        'line-dasharray': [0.1, 0.1],
        'line-opacity': 0.8
      },
      filter: [
        'all',
        ['==', 'type', 'relation'],
        ['==', 'changeType', 'deletedNew']
      ]
    });

    this.map.addLayer({
      id: 'modified-old-relation',
      source: 'changeset',
      type: 'line',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#DB950A',
        'line-width': {
          base: 1,
          stops: [
            [8, 1.75],
            [12, 1.75]
          ]
        },
        'line-blur': 0.25,
        'line-opacity': 0.8
      },
      filter: [
        'all',
        ['==', 'type', 'relation'],
        ['==', 'changeType', 'modifiedOld']
      ]
    });

    this.map.addLayer({
      id: 'modified-new-relation',
      source: 'changeset',
      type: 'line',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#E8E845',
        'line-width': {
          base: 1,
          stops: [
            [8, 1.25],
            [12, 1.25]
          ]
        },
        'line-opacity': 0.8
      },
      filter: [
        'all',
        ['==', 'type', 'relation'],
        ['==', 'changeType', 'modifiedNew']
      ]
    });

    this.map.addLayer({
      id: 'added-relation',
      source: 'changeset',
      type: 'line',
      interactive: true,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#39DBC0',
        'line-width': {
          base: 1,
          stops: [
            [8, 1],
            [12, 1]
          ]
        },
        'line-opacity': 0.8
      },
      filter: ['all', ['==', 'type', 'relation'], ['==', 'changeType', 'added']]
    });

    this.map.addLayer({
      id: 'deleted-line',
      source: 'changeset',
      type: 'line',
      paint: {
        'line-color': '#CC2C47',
        'line-width': {
          base: 1,
          stops: [
            [8, 3],
            [12, 5]
          ]
        },
        'line-dasharray': [0.1, 0.25],
        'line-opacity': 0.8
      },
      filter: ['all', ['==', 'type', 'way'], ['==', 'changeType', 'deletedNew']]
    });

    this.map.addLayer({
      id: 'modified-old-point-on-way',
      source: 'changeset',
      type: 'circle',
      paint: {
        'circle-color': '#DB950A',
        'circle-opacity': {
          base: 1.5,
          stops: [
            [10, 0.25],
            [14, 0.5]
          ]
        },
        'circle-blur': 0.25,
        'circle-radius': {
          base: 1.5,
          stops: [
            [10, 2.5],
            [16, 3.5]
          ]
        }
      },
      filter: [
        'all',
        ['==', '$type', 'LineString'],
        ['==', 'changeType', 'modifiedOld']
      ]
    });

    this.map.addLayer({
      id: 'modified-old-line',
      source: 'changeset',
      type: 'line',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#DB950A',
        'line-width': {
          base: 1,
          stops: [
            [8, 3],
            [12, 6]
          ]
        },
        'line-blur': {
          base: 1,
          stops: [
            [8, 0.25],
            [12, 0.5]
          ]
        },
        'line-opacity': 0.6
      },
      filter: [
        'all',
        ['==', 'type', 'way'],
        ['==', 'changeType', 'modifiedOld']
      ]
    });

    this.map.addLayer({
      id: 'modified-new-point-on-way',
      source: 'changeset',
      type: 'circle',
      paint: {
        'circle-color': '#E8E845',
        'circle-opacity': {
          base: 1.5,
          stops: [
            [10, 0.25],
            [14, 0.25]
          ]
        },
        'circle-radius': {
          base: 1.5,
          stops: [
            [10, 1.25],
            [16, 2.25]
          ]
        }
      },
      filter: [
        'all',
        ['==', '$type', 'LineString'],
        ['==', 'changeType', 'modifiedNew']
      ]
    });

    this.map.addLayer({
      id: 'modified-new-line',
      source: 'changeset',
      type: 'line',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#E8E845',
        'line-width': {
          base: 1,
          stops: [
            [8, 1],
            [12, 2]
          ]
        },
        'line-opacity': 0.6
      },
      filter: [
        'all',
        ['==', 'type', 'way'],
        ['==', 'changeType', 'modifiedNew']
      ]
    });

    this.map.addLayer({
      id: 'added-line',
      source: 'changeset',
      type: 'line',
      interactive: true,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#39DBC0',
        'line-width': {
          base: 1,
          stops: [
            [8, 1],
            [12, 1.5]
          ]
        },
        'line-opacity': 0.8
      },
      filter: ['all', ['==', 'type', 'way'], ['==', 'changeType', 'added']]
    });

    this.map.addLayer({
      id: 'deleted-point-untagged',
      source: 'changeset',
      type: 'circle',
      paint: {
        'circle-color': '#CC2C47',
        'circle-radius': {
          base: 1.5,
          stops: [
            [10, 2],
            [16, 3]
          ]
        },
        'circle-opacity': {
          base: 1.5,
          stops: [
            [10, 0.25],
            [14, 0.5]
          ]
        }
      },
      filter: [
        'all',
        ['==', 'changeType', 'deletedOld'],
        ['any', ['==', 'tagsCount', 0], ['==', '$type', 'LineString']]
      ]
    });

    this.map.addLayer({
      id: 'modified-old-point-untagged',
      source: 'changeset',
      type: 'circle',
      paint: {
        'circle-color': '#DB950A',
        'circle-opacity': {
          base: 1.5,
          stops: [
            [10, 0.25],
            [14, 0.5]
          ]
        },
        'circle-radius': {
          base: 1.5,
          stops: [
            [10, 1.75],
            [16, 3]
          ]
        },
        'circle-stroke-width': 1,
        'circle-stroke-opacity': 0.9,
        'circle-stroke-color': '#DB950A'
      },
      filter: [
        'all',
        ['==', 'type', 'node'],
        ['==', 'changeType', 'modifiedOld'],
        ['==', 'tagsCount', 0]
      ]
    });

    this.map.addLayer({
      id: 'modified-new-point-untagged',
      source: 'changeset',
      type: 'circle',
      paint: {
        'circle-color': '#E8E845',
        'circle-opacity': {
          base: 1.5,
          stops: [
            [10, 0.25],
            [14, 0.5]
          ]
        },
        'circle-radius': {
          base: 1.5,
          stops: [
            [10, 0.75],
            [16, 2]
          ]
        },
        'circle-stroke-width': 1,
        'circle-stroke-opacity': 0.9,
        'circle-stroke-color': '#E8E845'
      },
      filter: [
        'all',
        ['==', 'type', 'node'],
        ['==', 'changeType', 'modifiedNew'],
        ['==', 'tagsCount', 0]
      ]
    });

    this.map.addLayer({
      id: 'added-point-untagged',
      source: 'changeset',
      type: 'circle',
      paint: {
        'circle-color': '#39DBC0',
        'circle-opacity': {
          base: 1.5,
          stops: [
            [10, 0.3],
            [14, 0.75]
          ]
        },
        'circle-radius': {
          base: 1.5,
          stops: [
            [10, 1.25],
            [16, 1.9]
          ]
        }
      },
      filter: [
        'all',
        ['==', 'type', 'node'],
        ['==', 'changeType', 'added'],
        ['==', 'tagsCount', 0]
      ]
    });

    this.map.addLayer({
      id: 'deleted-point-tagged',
      source: 'changeset',
      type: 'circle',
      paint: {
        'circle-color': '#CC2C47',
        'circle-radius': {
          base: 1.5,
          stops: [
            [10, 4],
            [16, 7]
          ]
        },
        'circle-opacity': {
          base: 1.5,
          stops: [
            [10, 0.25],
            [14, 0.5]
          ]
        },
        'circle-stroke-width': 1,
        'circle-stroke-opacity': 0.75,
        'circle-stroke-color': '#CC2C47'
      },
      filter: [
        'all',
        ['==', 'type', 'node'],
        ['==', 'changeType', 'deletedOld'],
        ['!=', 'tagsCount', 0]
      ]
    });

    this.map.addLayer({
      id: 'modified-old-point-tagged',
      source: 'changeset',
      type: 'circle',
      paint: {
        'circle-color': '#DB950A',
        'circle-opacity': {
          base: 1.5,
          stops: [
            [10, 0.25],
            [14, 0.75]
          ]
        },
        'circle-radius': {
          base: 1.5,
          stops: [
            [10, 2.5],
            [16, 9]
          ]
        },
        'circle-stroke-width': 1,
        'circle-stroke-opacity': 0.9,
        'circle-stroke-color': '#DB950A'
      },
      filter: [
        'all',
        ['==', 'type', 'node'],
        ['==', 'changeType', 'modifiedOld'],
        ['!=', 'tagsCount', 0]
      ]
    });

    this.map.addLayer({
      id: 'modified-new-point-tagged',
      source: 'changeset',
      type: 'circle',
      paint: {
        'circle-color': '#E8E845',
        'circle-opacity': {
          base: 1.5,
          stops: [
            [10, 0.25],
            [14, 0.75]
          ]
        },
        'circle-radius': {
          base: 1.5,
          stops: [
            [10, 2],
            [16, 7]
          ]
        },
        'circle-stroke-width': 1,
        'circle-stroke-opacity': 0.9,
        'circle-stroke-color': '#E8E845'
      },
      filter: [
        'all',
        ['==', 'type', 'node'],
        ['==', 'changeType', 'modifiedNew'],
        ['!=', 'tagsCount', 0]
      ]
    });

    this.map.addLayer({
      id: 'added-point-tagged',
      source: 'changeset',
      type: 'circle',
      paint: {
        'circle-color': '#39DBC0',
        'circle-opacity': {
          base: 1.5,
          stops: [
            [10, 0.3],
            [14, 0.75]
          ]
        },
        'circle-radius': {
          base: 1.5,
          stops: [
            [10, 1],
            [16, 5]
          ]
        },
        'circle-stroke-width': 1,
        'circle-stroke-opacity': 0.9,
        'circle-stroke-color': '#39DBC0'
      },
      filter: [
        'all',
        ['==', 'type', 'node'],
        ['==', 'changeType', 'added'],
        ['!=', 'tagsCount', 0]
      ]
    });
  }

  renderMap(baseLayer, result) {
    if (!result) {
      if (!this.result) return;
      result = this.result;
    } else {
      this.result = result;
    }
    var bounds = getBounds(result.changeset.bbox);
    if (this.map) {
      if (!this.mapLoaded) {
        this.queue.push([result, bounds]); // TOFIX use variable instead of array
        this.result = result;
        return;
      }

      if (baseLayer && this.oldBaseLayer !== baseLayer) {
        this.map.setStyle(baseLayer);
        this.baseLayerData = [result, bounds];
        this.oldBaseLayer = baseLayer;
      } else {
        this.oldBaseLayer = baseLayer;
        this.addMapSource(result, bounds);
        this.map.fitBounds(bounds, { linear: true, padding: 200 });
        this.result = result;
        clearDiff();
      }

      // why not re attach on('click')
      // if the map is still mounted
      // it will automatically take the latest
      // result thanks to this.result
      return;
    }

    this.map = new mapboxgl.Map({
      container: document.querySelector('.cmap-map'),
      style:
        baseLayer || 'mapbox://styles/openstreetmap/cjnd8lj0e10i42spfo4nsvoay',
      center: bounds.getCenter(),
      zoom: 14,
      dragRotate: false,
      touchZoomRotate: false,
      attributionControl: false
    }).addControl(new mapboxgl.AttributionControl({ compact: false }));

    if (platform.touch && !platform.mouse) {
      this.map.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        'top-right'
      );
    }

    this.map.on('styledata', () => {
      if (!this.baseLayerData) return;
      console.log('style event fired 2');
      var bounds = this.baseLayerData[1];
      var result = this.baseLayerData[0];
      this.baseLayerData = null;
      this.map.fitBounds(bounds, { linear: true, padding: 200 });
      this.addMapSource(result, bounds);
      this.addMapLayers();
      cmap.emit('load');
    });

    this.map.on('load', () => {
      this.mapLoaded = true;
      if (this.queue.length > 0) {
        const index = this.queue.length - 1;
        result = this.queue[index][0];
        bounds = this.queue[index][1];
        this.queue = [];
      }
      this.map.fitBounds(bounds, { linear: true, padding: 200 });
      this.addMapSource(result, bounds);
      this.addMapLayers();
      cmap.emit('load');
      // if the changeset has only one element, select it when the map is loading
      if (Object.keys(result.featureMap).length === 1) {
        const featureId = Object.keys(result.featureMap)[0];
        this.selectFeature(result.featureMap[featureId][0]);
      }
    });

    this.map.on('click', e => {
      var x1y1 = [e.point.x - 5, e.point.y - 5];
      var x2y2 = [e.point.x + 5, e.point.y + 5];
      var features = this.map.queryRenderedFeatures([x1y1, x2y2], {
        layers: [
          'added-line',
          'added-point-tagged',
          'modified-old-line',
          'modified-old-point-tagged',
          'modified-old-point-untagged',
          'modified-new-line',
          'modified-new-point-tagged',
          'modified-new-point-untagged',
          'deleted-line',
          'deleted-point-tagged',
          'added-relation',
          'modified-old-relation',
          'modified-new-relation',
          'deleted-relation'
        ].concat(Object.keys(this.relationMembersLayers))
      });

      if (features.length) {
        this.selectFeature(features[0]);
      } else {
        this.clearFeature();
      }
    });
  }

  selectFeature(feature) {
    var featureMap = this.result.featureMap;
    var featureId = feature.properties.id;
    var osmType = feature.properties.type;

    this.highlightFeature(featureId);
    renderFeatureDiff(
      featureId,
      featureMap,
      this.result.changeset.id,
      document.querySelector('.cmap-diff-metadata'),
      document.querySelector('.cmap-diff-tags'),
      document.querySelector('.cmap-diff-members')
    );

    document.querySelector('.cmap-diff').style.display = 'block';
    if (osmType === 'relation') {
      this.showRelationMembers(featureId);
    }
    cmap.emit('featureChange', osmType, featureId);
  }

  zoomToFeatures(features) {
    this.map.fitBounds(getFeatureBBOX(features), {
      linear: true,
      padding: 200,
      maxZoom: 18
    });
  }

  highlightFeature(featureId) {
    this.map.setFilter('highlight-line', ['==', 'id', featureId]);
    this.map.setFilter('highlight-point', ['==', 'id', featureId]);
  }

  selectMember(feature) {
    this.highlightRelationMemberFeature(feature);
  }

  highlightRelationMemberFeature(featureId) {
    this.map.setFilter('highlight-relation-member-line', [
      '==',
      'ref',
      featureId
    ]);
    this.map.setFilter('highlight-relation-member-point', [
      '==',
      'ref',
      featureId
    ]);
  }

  clearHighlight() {
    this.map.setFilter('highlight-line', ['==', 'id', '']);
    this.map.setFilter('highlight-point', ['==', 'id', '']);
    this.clearRelationMemberHighlight();
  }

  clearRelationMemberHighlight() {
    this.map.setFilter('highlight-relation-member-line', ['==', 'ref', '']);
    this.map.setFilter('highlight-relation-member-point', ['==', 'ref', '']);
    Object.keys(this.relationMembersLayers).forEach(layer =>
      this.map.setFilter(layer, ['==', 'relation', ''])
    );
    Object.keys(this.layersKey)
      .filter(layer => !layer.endsWith('relation'))
      .forEach(layer =>
        this.map.setLayoutProperty(layer, 'visibility', 'visible')
      );
  }

  clearFeature() {
    this.clearHighlight();
    clearDiff();
    cmap.emit('featureChange', null, null);
  }

  showRelationMembers(featureId) {
    Object.keys(this.relationMembersLayers).forEach(layerName => {
      let layer = this.relationMembersLayers[layerName];
      let filter = [
        'all',
        ['==', 'relation', featureId],
        ['==', 'changeType', layer.changeType],
        ['==', '$type', getLayerType(layer)]
      ];
      if (layer.extraFilter) {
        filter.push(layer.extraFilter);
      }
      this.map.setFilter(layerName, filter);
    });
    Object.keys(this.layersKey)
      .filter(layer => !layer.endsWith('relation'))
      .forEach(layer =>
        this.map.setLayoutProperty(layer, 'visibility', 'none')
      );
  }
}

function clearDiff() {
  document.querySelector('.cmap-diff').style.display = 'none';
  document.querySelector('.cmap-diff-metadata').innerHTML = '';
  document.querySelector('.cmap-diff-tags').innerHTML = '';
  document.querySelector('.cmap-diff-members').style.display = 'none';
}

function getLayerType(layer) {
  if (layer.nodes) {
    return 'Point';
  }
  if (layer.ways) {
    return 'LineString';
  }
  return null;
}
