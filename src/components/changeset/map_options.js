// @flow
import React from 'react';
import { importChangesetMap } from '../../utils/cmap';

export class MapOptions extends React.PureComponent {
  state = {
    actions: true,
    type: true,
    mapStyle: true,
    user: true
  };
  onChange = () => {
    importChangesetMap('getMapInstance').then(
      r => r && r() && r().filterLayers()
    );
  };
  toggleSatellite = () => {
    importChangesetMap('getMapInstance').then(
      r =>
        r &&
        r() &&
        r().renderMap('mapbox://styles/openstreetmap/cjnd8lj0e10i42spfo4nsvoay')
    );
  };
  toggleDark = () => {
    importChangesetMap('getMapInstance').then(
      r => r && r() && r().renderMap('mapbox://styles/mapbox/dark-v9')
    );
  };
  toggleStreet = () => {
    importChangesetMap('getMapInstance').then(
      r => r && r() && r().renderMap('mapbox://styles/mapbox/streets-v9')
    );
  };
  toggleBing = () => {
    const bingStyle = {
      version: 8,
      sources: {
        'raster-tiles': {
          type: 'raster',
          tiles: [
            'https://ecn.t0.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z',
            'https://ecn.t1.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z',
            'https://ecn.t2.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z',
            'https://ecn.t3.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z'
          ],
          attribution:
            '© <a href="https://blog.openstreetmap.org/2010/11/30/microsoft-imagery-details">Microsoft Corporation</a>'
        }
      },
      layers: [
        {
          id: 'simple-tiles',
          type: 'raster',
          source: 'raster-tiles',
          minzoom: 0,
          maxzoom: 22
        }
      ]
    };
    importChangesetMap('getMapInstance').then(
      r => r && r() && r().renderMap(bingStyle)
    );
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

          <ul className="cmap-hlist">
            <li>
              <label className="cmap-hlist-item cmap-noselect pointer">
                <input
                  type="radio"
                  value="satellite"
                  defaultChecked="true"
                  name="baselayer"
                  id="cmap-baselayer-satellite"
                  onClick={this.toggleSatellite}
                />
                <span className="cmap-label-text">Satellite</span>
              </label>
            </li>
            <li>
              <label className="cmap-hlist-item cmap-noselect pointer">
                <input
                  type="radio"
                  value="streets"
                  name="baselayer"
                  id="cmap-baselayer-streets"
                  onClick={this.toggleStreet}
                />
                <span className="cmap-label-text">Streets</span>
              </label>
            </li>
            <li>
              <label className="cmap-hlist-item cmap-noselect pointer">
                <input
                  type="radio"
                  value="dark"
                  name="baselayer"
                  id="cmap-baselayer-dark"
                  onClick={this.toggleDark}
                />
                <span className="cmap-label-text">Dark</span>
              </label>
            </li>
            <li>
              <label className="cmap-hlist-item cmap-noselect pointer">
                <input
                  type="radio"
                  value="bing"
                  name="baselayer"
                  id="cmap-baselayer-bing"
                  onClick={this.toggleBing}
                />
                <span className="cmap-label-text cmap-pointer">Bing</span>
              </label>
            </li>
          </ul>
        </section>
      </div>
    );
  }
}
