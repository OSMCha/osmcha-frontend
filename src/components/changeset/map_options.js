// @flow
import React from 'react';

export class MapOptions extends React.PureComponent {
  state = {
    actions: true,
    type: true,
    mapStyle: true,
    user: true
  };
  getMapInstance = null;
  onChange = () => {
    this.importChangesetMap().then(r => r && r() && r().filterLayers());
  };
  toggleSatellite = () => {
    this.importChangesetMap().then(
      r =>
        r &&
        r() &&
        r().renderMap('mapbox://styles/rasagy/cizp6lsah00ct2snu6gi3p16q')
    );
  };
  toggleDark = () => {
    this.importChangesetMap().then(
      r => r && r() && r().renderMap('mapbox://styles/mapbox/dark-v9')
    );
  };
  toggleStreet = () => {
    this.importChangesetMap().then(
      r => r && r() && r().renderMap('mapbox://styles/mapbox/streets-v9')
    );
  };
  importChangesetMap() {
    if (this.getMapInstance) return Promise.resolve(this.getMapInstance);
    console.log('fetcgubg new cmp');
    return import('changeset-map')
      .then(module => {
        this.getMapInstance = module.getMapInstance;
        return module.getMapInstance;
      })
      .catch(function(err) {
        console.error(err);
        console.log('Failed to load module changeset-map');
      });
  }
  render() {
    return (
      <div className="px12 py6">
        <h2 className="txt-m txt-uppercase txt-bold mr6 mb3">
          Map Controls
        </h2>
        <section className="cmap-filter-action-section cmap-pt3">
          <h6 className="cmap-heading pointer txt-bold">
            Filter by actions
          </h6>

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
                <span className="cmap-label-text">
                  Added
                </span>
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
                <span className="cmap-label-text">
                  Modified
                </span>
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
                <span className="cmap-label-text">
                  Deleted
                </span>
                <span className="cmap-color-box cmap-color-deleted" />
              </label>
            </li>
          </ul>
        </section>
        <section className="cmap-filter-type-section">
          <h6 className="cmap-heading pointer txt-bold">
            Filter by type
          </h6>
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
                <span className="cmap-label-text">
                  Nodes
                </span>
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
                <span className="cmap-label-text">
                  Ways
                </span>
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
                <span className="cmap-label-text">
                  Relations
                </span>
              </label>
            </li>
          </ul>
        </section>
        <section className="cmap-map-style-section cmap-pb3">
          <h6 className="cmap-heading pointer txt-bold">
            Map style
          </h6>

          <ul className="cmap-hlist">
            <li>
              <label className="cmap-hlist-item cmap-noselect cmap-pointer">
                <input
                  type="radio"
                  value="satellite"
                  defaultChecked="true"
                  name="baselayer"
                  id="cmap-baselayer-satellite"
                  onChange={this.toggleSatellite}
                />
                <span className="cmap-label-text">
                  Satellite
                </span>
              </label>
            </li>
            <li>
              <label className="cmap-hlist-item cmap-noselect cmap-pointer">
                <input
                  type="radio"
                  value="streets"
                  name="baselayer"
                  id="cmap-baselayer-streets"
                  onChange={this.toggleStreet}
                />
                <span className="cmap-label-text">
                  Streets
                </span>
              </label>
            </li>
            <li>
              <label className="cmap-hlist-item cmap-noselect cmap-pointer">
                <input
                  type="radio"
                  value="dark"
                  name="baselayer"
                  id="cmap-baselayer-dark"
                  onChange={this.toggleDark}
                />
                <span className="cmap-label-text">
                  Dark
                </span>
              </label>
            </li>
          </ul>
        </section>
      </div>
    );
  }
}
