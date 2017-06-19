// @flow
import React from 'react';
import debounce from 'lodash.debounce';
import { fromJS } from 'immutable';

let mapboxgl;

function importChangesetMap() {
  if (mapboxgl) return Promise.resolve(mapboxgl);
  return import('changeset-map')
    .then(function(module) {
      mapboxgl = module.getGL();
      return mapboxgl;
    })
    .catch(function(err) {
      console.error(err);
      console.log('Failed to load module changeset-map');
    });
}

export class BBoxPicker extends React.Component {
  update = debounce(() => {
    if (!this.map) return;
    let bounds: {
      getSouth: () => number,
      getWest: () => number,
      getNorth: () => number,
      getEast: () => number
    } =
      this.map && this.map.getBounds(); // ne, sw / lat, lng

    let s = bounds.getSouth().toFixed(4);
    let w = bounds.getWest().toFixed(4);
    let n = bounds.getNorth().toFixed(4);
    let e = bounds.getEast().toFixed(4);
    let wsen = [w, s, e, n].join(',');
    this.props.onChange(
      this.props.name,
      fromJS([
        {
          label: wsen,
          value: wsen
        }
      ])
    );
  }, 600);

  map = null;
  componentDidMount() {
    importChangesetMap().then((mapboxgl: any) => {
      mapboxgl.accessToken =
        'pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiemdYSVVLRSJ9.g3lbg_eN0kztmsfIPxa9MQ';
      let center = [-122.4237, 37.7682];
      if (this.props.value) {
        let bbox = this.props.value.getIn(['0', 'value'], '').split(',');
      }
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v9',
        center: [-122.4237, 37.7682],
        zoom: 4
      });
      map.on('dragend', this.update);
      map.on('zoomend', this.update);
      map.on('touchend', this.update);
      this.map = map;
    });
  }
  componentWillUnmount() {
    console.log('unmount');
    this.map && this.map.remove();
  }
  clearBbox = () => {
    this.props.onChange(this.props.name, null);
  };

  render() {
    return (
      <div className="map-select border border--1  border--gray-light">
        <div
          onClick={this.clearBbox}
          className="pointer z5 m3 inline-block px6 py3 txt-s bg-gray-light txt-bold round absolute fl"
        >
          Clear
        </div>
        <div id="map" style={{ height: 300, width: 300 }} />
      </div>
    );
  }
}
