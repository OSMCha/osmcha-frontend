// @flow
import React from 'react';
import { fromJS } from 'immutable';
import debounce from 'lodash.debounce';
import { Async } from 'react-select';
import Select from 'react-select';

import maplibre from 'maplibre-gl';
import {
  TerraDraw,
  TerraDrawRectangleMode,
  TerraDrawRenderMode
} from 'terra-draw';
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';
import area from '@turf/area';
import bbox from '@turf/bbox';
import simplify from '@turf/simplify';
import truncate from '@turf/truncate';

import { nominatimSearch } from '../../network/nominatim';

export class LocationSelect extends React.PureComponent {
  props: {
    name: string,
    display: string,
    value: Object,
    type: string,
    placeholder: string,
    options: Array<Object>,
    onChange: (string, value: Object) => any
  };
  state = {
    geometry: Object,
    location: '',
    queryType: 'q',
    lastSearch: new Date()
  };
  queryTypeOptions = [
    { value: 'q', label: 'Any' },
    { value: 'city', label: 'City' },
    { value: 'county', label: 'County' },
    { value: 'state', label: 'State' },
    { value: 'country', label: 'Country' }
  ];
  map = null;
  draw = null;

  componentDidMount() {
    let map = new maplibre.Map({
      container: 'geometry-map',
      style: '/positron.json'
    });
    map.setMaxPitch(0);
    map.dragRotate.disable();
    map.boxZoom.disable();
    map.touchZoomRotate.disableRotation();
    map.keyboard.disableRotation();

    map.on('style.load', () => {
      map.setProjection({ type: 'globe' });
    });

    if (this.props.value) {
      // FIXME: this doesn't work; how can we draw an existing geometry on the map?
      this.updateMap(this.props.value);
    }

    let draw = new TerraDraw({
      adapter: new TerraDrawMapLibreGLAdapter({ map, lib: maplibre }),
      modes: [
        new TerraDrawRectangleMode(),
        new TerraDrawRenderMode({ modeName: 'render' })
      ]
    });

    draw.start();

    draw.on('finish', (id, context) => {
      const snapshot = draw.getSnapshot();
      const feature = snapshot.find(f => f.id === id);
      const bounds = bbox(feature); // even though the user drew a box, 'feature' is a Polygon
      const wsen = bounds.map(v => v.toFixed(4)).join(',');

      this.props.onChange('geometry', undefined);
      this.props.onChange('in_bbox', fromJS([{ label: wsen, value: wsen }]));
    });

    this.map = map;
    this.draw = draw;

    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  handleKeyDown = event => {
    if (event.key === 'Shift') {
      this.draw.clear();
      this.draw.setMode('rectangle');
    }
  };

  handleKeyUp = event => {
    if (event.key === 'Shift') {
      this.draw.setMode('render');
    }
  };

  updateMap(data) {
    // called with geojson polygon of a feature that was retrieved by
    // name from Nominatim

    if (this.map.getSource('feature')) {
      this.map.getSource('feature').setData(data);
    } else {
      this.map.addSource('feature', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: data
        }
      });
    }

    if (this.map.getLayer('geometry') === undefined) {
      this.map.addLayer({
        id: 'geometry',
        type: 'fill',
        source: 'feature',
        paint: {
          'fill-color': '#088',
          'fill-opacity': 0.6
        }
      });
    }

    this.setState({ geometry: data });
    this.props.onChange('in_bbox', undefined);
    this.props.onChange('geometry', fromJS([{ label: data, value: data }]));
    const bounds = bbox(data);
    this.map.fitBounds([bounds.slice(0, 2), bounds.slice(2)], { padding: 20 });
  }

  getAsyncOptions = (input: string, cb: (e: ?Error, any) => void) => {
    if (input.length >= 2 || this.isOneCharInputAllowed(input)) {
      return nominatimSearch(input, this.state.queryType)
        .then(json => {
          if (!Array.isArray(json)) return cb(null, { options: [] });

          const data = json.map(d => ({
            label: d.display_name,
            value: d.geojson
          }));

          return cb(null, { options: data });
        })
        .catch(e => cb(e, null));
    } else {
      return cb(null, { options: [] });
    }
  };

  isOneCharInputAllowed = (input: string) => {
    // Allowing one character input if it contains characters from certain scripts while
    // guarding against browsers that don't support this kind of regular expression
    try {
      return /\p{scx=Han}|\p{scx=Hangul}|\p{scx=Hiragana}|\p{scx=Katakana}/u.test(
        input
      );
    } catch {
      // Allowing always is better than never allowing for the above-mentioned scripts
      return true;
    }
  };

  onChangeLocal = (data: ?Array<Object>) => {
    if (data) {
      this.draw.clear();
      const tolerance = area(data.value) / 10 ** 6 < 1000 ? 0.01 : 0.1;
      const simplified_bounds = simplify(data.value, {
        tolerance: tolerance,
        highQuality: true
      });
      this.updateMap(
        truncate(simplified_bounds, { precision: 6, coordinates: 2 })
      );
    }
  };

  handleQueryTypeChange = value => {
    this.setState({ queryType: value });
  };

  renderSelect = () => {
    const { name, placeholder, value } = this.props;
    return (
      <Async
        name={name}
        className=""
        value={value}
        loadOptions={debounce(
          (input, cb) => this.getAsyncOptions(input, cb),
          500
        )}
        onChange={this.onChangeLocal}
        placeholder={placeholder}
      />
    );
  };

  render() {
    return (
      <div>
        <div className="grid grid--gut12">
          <div className="col col--4">
            <Select
              onChange={this.handleQueryTypeChange}
              options={this.queryTypeOptions}
              simpleValue
              value={this.state.queryType}
              placeholder="Place Type"
            />
          </div>
          <div className="col col--8 pl3">{this.renderSelect()}</div>
        </div>
        <div className="grid grid--gut12 pt6">
          <div className="col col--12 map-select">
            <div id="geometry-map" />
          </div>
        </div>
        <p>
          Hold <kbd>Shift</kbd> and click to draw a bounding box.
        </p>
      </div>
    );
  }
}
