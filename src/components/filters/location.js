// @flow
import React from 'react';
import { fromJS } from 'immutable';
import debounce from 'lodash.debounce';
import { Async } from 'react-select';
import Select from 'react-select';

import area from '@turf/area';
import bbox from '@turf/bbox';
import simplify from '@turf/simplify';
import truncate from '@turf/truncate';
import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';

import { nominatimSearch } from '../../network/nominatim';
import { mapboxAccessToken } from '../../config/constants';
import { importChangesetMap } from '../../utils/cmap';

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

  updateMap(data) {
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
    this.props.onChange(
      this.props.name,
      fromJS([{ label: data, value: data }])
    );
    const geom_bbox = bbox(data);
    this.map.fitBounds([geom_bbox.slice(0, 2), geom_bbox.slice(2)], {
      padding: 20
    });
  }

  componentDidMount() {
    importChangesetMap('getGL').then((getGL: any) => {
      if (getGL) {
        var mapboxgl = getGL();
        mapboxgl.accessToken = mapboxAccessToken;
        const map = new mapboxgl.Map({
          container: 'geometry-map',
          style: 'mapbox://styles/mapbox/light-v9'
        });
        this.map = map;
        this.draw = new MapboxDraw({
          displayControlsDefault: false,
          controls: {
            polygon: true
          }
        });
        map.addControl(this.draw);

        map.on('draw.create', this.drawingUpdate);
        map.on('draw.modechange', this.clearBeforeDraw);
        map.on('draw.delete', this.drawingUpdate);
        map.on('draw.update', this.drawingUpdate);
        map.on('style.load', () => {
          try {
            this.updateMap(
              this.props.value
                .get('0')
                .get('value')
                .toJS()
            );
          } catch (e) {
            if (e instanceof TypeError) {
            }
          }
        });
      }
    });
  }

  clearBeforeDraw = e => {
    if (e.mode === 'draw_polygon') {
      this.clearMap();
      this.draw.changeMode('draw_polygon');
    }
  };
  clearMap = () => {
    this.draw.deleteAll();
    this.props.onChange(this.props.name, null);
    if (this.map.getSource('feature')) {
      this.map.getSource('feature').setData({});
    }
    if (this.map.getLayer('geometry')) {
      this.map.removeLayer('geometry');
    }
  };
  drawingUpdate = e => {
    const drawingData = this.draw.getAll();
    if (
      drawingData &&
      drawingData.features.length &&
      drawingData.features[0].geometry
    ) {
      this.updateMap(
        truncate(drawingData.features[0].geometry, {
          precision: 6,
          coordinates: 2
        })
      );
    } else {
      this.clearMap();
    }
  };

  getAsyncOptions = (input: string, cb: (e: ?Error, any) => void) => {
    if (input.length >= 3) {
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
  onChangeLocal = (data: ?Array<Object>) => {
    if (data) {
      this.draw.deleteAll();
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
            <div id="geometry-map">
              <button
                onClick={this.clearMap}
                className="pointer z5 mx1 my1 inline-block px6 py3 txt-s bg-white txt-bold round absolute fl"
                style={{ zIndex: 2 }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
