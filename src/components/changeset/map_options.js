// @flow
import React from 'react';
import { connect } from 'react-redux';

import { bingStyle, bingTileLabel, esriMapStyle, esriTileLabel, maxarMapStyle, maxarTileLabel, osmMapStyle, osmTileLabel } from '../../config/styles';
import { getMapInstance } from '../changeset-map';

import { updateStyle } from '../../store/map_controls_actions';
import { Dropdown } from '../dropdown';

class MapOptions extends React.PureComponent {
  state = {
    actions: true,
    type: true,
    mapStyle: true,
    user: true
  };
  layerOptions = [
    {
      label: bingTileLabel,
      value: 'bing',
      function: () => this.toggleBing()
    },
    {
      label: esriTileLabel,
      value: 'esri',
      function: () => this.toggleEsri()
    },
    {
      label: maxarTileLabel,
      value: 'maxar',
      function: () => this.toggleMaxar()
    },
    {
      label: osmTileLabel,
      value: 'osm',
      function: () => this.toggleOsm()
    }
  ];
  getLayerDropdownDisplay = id => {
    const filteredLayer = this.layerOptions.filter(l => l.value === id);
    if (filteredLayer.length) return filteredLayer[0].label;
    return 'Select a style';
  };
  onLayerChange = layer => {
    if (layer && layer.length) {
      layer[0].function();
      this.props.updateStyle(layer[0].value);
    }
  };
 onChange = () => {
    getMapInstance() && getMapInstance().filterLayers();
  };
  toggleBing = () => {
    getMapInstance() && getMapInstance().renderMap(bingStyle);
  };
  toggleEsri = () => {
    getMapInstance() && getMapInstance().renderMap(esriMapStyle);
  };
  toggleMaxar = () => {
    getMapInstance() && getMapInstance().renderMap(maxarMapStyle);
  };
  toggleOsm = () => {
    getMapInstance() && getMapInstance().renderMap(osmMapStyle);
  };
  render() {
    return (
      <div className="px12 py6">
        <h2 className="txt-m txt-uppercase txt-bold mr6 mb3">Map Controls</h2>
        <section className="cmap-filter-action-section cmap-pt3">
          <h6 className="cmap-heading pointer txt-bold">Filter by actions</h6>

          <ul className="cmap-hlist">
            <li>
              <label className="cmap-hlist-item cmap-noselect cmap-pointer">
                <input
                  type="checkbox"
                  value="added"
                  defaultChecked="true"
                  id="cmap-layer-selector-added"
                  onChange={this.onChange}
                />
                <span className="cmap-label-text">Added</span>
                <span className="cmap-color-box cmap-color-added" />
              </label>
            </li>
            <li>
              <label className="cmap-hlist-item cmap-noselect cmap-pointer">
                <input
                  type="checkbox"
                  value="modified"
                  defaultChecked="true"
                  onChange={this.onChange}
                  id="cmap-layer-selector-modified"
                />
                <span className="cmap-label-text">Modified</span>
                <span className="cmap-color-box cmap-color-modified-old" />
                <span className="cmap-unicode">→</span>
                <span className="cmap-color-box cmap-color-modified-new" />
              </label>
            </li>
            <li>
              <label className="cmap-hlist-item cmap-noselect cmap-pointer">
                <input
                  type="checkbox"
                  value="deleted"
                  defaultChecked="true"
                  onChange={this.onChange}
                  id="cmap-layer-selector-deleted"
                />
                <span className="cmap-label-text">Deleted</span>
                <span className="cmap-color-box cmap-color-deleted" />
              </label>
            </li>
          </ul>
        </section>
        <section className="cmap-filter-type-section">
          <h6 className="cmap-heading pointer txt-bold">Filter by type</h6>
          <ul className="cmap-hlist">
            <li>
              <label className="cmap-hlist-item cmap-noselect cmap-pointer">
                <input
                  type="checkbox"
                  value="nodes"
                  defaultChecked="true"
                  id="cmap-type-selector-nodes"
                  onChange={this.onChange}
                />
                <span className="cmap-label-text">Nodes</span>
              </label>
            </li>
            <li>
              <label className="cmap-hlist-item cmap-noselect cmap-pointer">
                <input
                  type="checkbox"
                  value="ways"
                  defaultChecked="true"
                  id="cmap-type-selector-ways"
                  onChange={this.onChange}
                />
                <span className="cmap-label-text">Ways</span>
              </label>
            </li>
            <li>
              <label className="cmap-hlist-item cmap-noselect cmap-pointer">
                <input
                  type="checkbox"
                  value="relations"
                  defaultChecked="true"
                  id="cmap-type-selector-relations"
                  onChange={this.onChange}
                />
                <span className="cmap-label-text">Relations</span>
              </label>
            </li>
          </ul>
        </section>
        <section className="cmap-map-style-section cmap-pb3">
          <h6 className="cmap-heading pointer txt-bold">Map style</h6>
          <Dropdown
            eventTypes={['click', 'touchend']}
            value={this.props.style}
            onAdd={() => {}}
            onRemove={() => {}}
            options={this.layerOptions}
            onChange={this.onLayerChange}
            display={this.getLayerDropdownDisplay(this.props.style)}
            position="left"
          />
        </section>
      </div>
    );
  }
}

MapOptions = connect(
  (state: RootStateType, props) => ({ style: state.mapControls.get('style') }),
  { updateStyle }
)(MapOptions);

export { MapOptions };
