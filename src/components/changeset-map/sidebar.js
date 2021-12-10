import React from 'react';
import { formatDistanceToNow } from 'date-fns';

import { getBounds } from './helpers';
import { cmap } from './render';
import { osmBaseUrl } from '../../config/constants'

export function getFeatures(features) {
  var keys = Object.keys(features);
  return keys.map(item => features[item]);
}

export function processFeatures(features) {
  const finalReport = new Map();
  const analyzedFeatures = features.map(feature =>
    analyzeFeature(feature[0], feature[1])
  );
  const keys = ['addedTags', 'changedValues', 'deletedTags'];
  analyzedFeatures.map(item =>
    keys.map(key =>
      item.get(key).forEach(tag => {
        if (finalReport.get(tag)) {
          finalReport.set(tag, finalReport.get(tag).concat([item.get('id')]));
        } else {
          finalReport.set(tag, [item.get('id')]);
        }
      })
    )
  );
  return finalReport;
}

export function analyzeFeature(newVersion, oldVersion) {
  var oldVersionKeys = Object.keys(oldVersion.properties.tags);
  var newVersionKeys = Object.keys(newVersion.properties.tags);
  var addedTags = newVersionKeys.filter(
    tag => oldVersionKeys.indexOf(tag) === -1
  );
  var deletedTags = oldVersionKeys.filter(
    tag => newVersionKeys.indexOf(tag) === -1
  );
  var changedValues = newVersionKeys
    .filter(
      tag => addedTags.indexOf(tag) === -1 && deletedTags.indexOf(tag) === -1
    )
    .filter(
      tag => newVersion.properties.tags[tag] !== oldVersion.properties.tags[tag]
    );
  var result = new Map();
  result
    .set('id', newVersion.properties.id)
    .set(
      'addedTags',
      addedTags.map(tag => `Added tag ${tag}`)
    )
    .set(
      'deletedTags',
      deletedTags.map(tag => `Deleted tag ${tag}`)
    )
    .set(
      'changedValues',
      changedValues.map(tag => `Changed value of tag ${tag}`)
    );
  return result;
}

export function selectFeature(id) {
  if (!id || !cmap) return;
  cmap.emit('selectFeature', 'node|way', id);
}

function FeatureListItem(props) {
  return (
    <li>
      <span className="cmap-pointer " onClick={() => selectFeature(props.id)}>
        {props.id}
      </span>
    </li>
  );
}

export class ChangeItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      opened: false
    };
    this.tag = props.change[0];
    this.value = props.change[1];
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange() {
    this.setState({ opened: !this.state.opened });
  }
  render() {
    return (
      <div>
        <h7
          className="cmap-sub-heading cmap-pointer"
          onClick={this.handleChange}
        >
          {this.state.opened ? '▼' : '▶'}
          {this.tag}
        </h7>
        <ul
          className="cmap-vlist"
          style={{
            display: this.state.opened ? 'block' : 'none'
          }}
        >
          {this.value.map((id, k) => (
            <FeatureListItem id={id} key={k} />
          ))}
        </ul>
      </div>
    );
  }
}

export class Sidebar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      actions: true,
      type: false,
      changes: false,
      mapStyle: false,
      user: false
    };
    this.changeReport = [];
    this.changedFeatures = processFeatures(
      getFeatures(this.props.result.featureMap).filter(
        item => item.length === 2 && item[0].properties.action === 'modify'
      )
    ).forEach((featureIDs, tag) => this.changeReport.push([tag, featureIDs]));

    this.toggleUser = this.toggleUser.bind(this);
    this.toggleActions = this.toggleActions.bind(this);
    this.toggleType = this.toggleType.bind(this);
    this.toggleChanges = this.toggleChanges.bind(this);
    this.toggleMapStyle = this.toggleMapStyle.bind(this);
  }
  toggleUser() {
    this.setState({
      user: !this.state.user
    });
  }
  toggleActions() {
    this.setState({
      actions: !this.state.actions
    });
  }
  toggleType() {
    this.setState({
      type: !this.state.type
    });
  }
  toggleChanges() {
    this.setState({
      changes: !this.state.changes
    });
  }
  toggleMapStyle() {
    this.setState({
      mapStyle: !this.state.mapStyle
    });
  }
  render() {
    const result = this.props.result;
    const changesetId = this.props.changesetId;
    const filterLayers = this.props.filterLayers;
    var date = new Date(
      result.changeset.to ? result.changeset.to : result.changeset.from
    );

    var bbox = result.changeset.bbox;
    var bounds = getBounds(bbox);
    var center = bounds.getCenter();
    var userName = result.changeset.user;
    var userId = result.changeset.uid;
    return (
      <div className="cmap-sidebar">
        <section className="cmap-changeset-section cmap-fill-light cmap-pt3">
          <h6 className="cmap-heading">
            Changeset:
            <em className="cmap-changeset-id pl6">{changesetId}</em>
            <small className="cmap-time pl6" title={date}>
              ({formatDistanceToNow(date, { addSuffix: true })})
            </small>
          </h6>
          <ul className="cmap-hlist">
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="cmap-hlist-item cmap-noselect cmap-pointer cmap-c-link-osm"
                href={`${osmBaseUrl}/changeset/${changesetId}/`}
              >
                OSM
              </a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="cmap-hlist-item cmap-noselect cmap-pointer cmap-c-link-osmcha"
                href={`/changesets/${changesetId}/`}
              >
                OSMCha
              </a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="cmap-hlist-item cmap-noselect cmap-pointer cmap-c-link-achavi"
                href={
                  'https://overpass-api.de/achavi/?changeset=' + changesetId
                }
              >
                Achavi
              </a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="cmap-hlist-item cmap-noselect cmap-pointer cmap-c-link-osmhv"
                href={
                  'http://osmhv.openstreetmap.de/changeset.jsp?id=' +
                  changesetId
                }
              >
                OSM HV
              </a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="cmap-hlist-item cmap-noselect cmap-pointer cmap-c-link-josm"
                href={
                  'http://127.0.0.1:8111/import?url=http://www.openstreetmap.org/api/0.6/changeset/' +
                  changesetId +
                  '/download'
                }
              >
                JOSM
              </a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="cmap-hlist-item cmap-noselect cmap-pointer cmap-c-link-id"
                href={
                  'http://preview.ideditor.com/release#map=15/' +
                  center.lat +
                  '/' +
                  center.lng
                }
              >
                iD
              </a>
            </li>
          </ul>
        </section>
        <section className="cmap-user-section cmap-fill-light cmap-pb3">
          <h6 className="cmap-heading" onClick={this.toggleUser}>
            {this.state.user ? '▼' : '▶'}
            User: <em className="cmap-user-id">{userName}</em>
          </h6>

          <ul
            className="cmap-hlist"
            style={{
              display: this.state.user ? 'block' : 'none'
            }}
          >
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="cmap-hlist-item cmap-noselect cmap-pointer cmap-u-link-osm"
                href={'https://openstreetmap.org/user/' + userName}
              >
                OSM
              </a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="cmap-hlist-item cmap-noselect cmap-pointer cmap-u-link-hdyc"
                href={'http://hdyc.neis-one.org/?' + userName}
              >
                HDYC
              </a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="cmap-hlist-item cmap-noselect cmap-pointer cmap-u-link-disc"
                href={
                  'http://resultmaps.neis-one.org/osm-discussion-comments?uid=' +
                  userId
                }
              >
                Discussions
              </a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="cmap-hlist-item cmap-noselect cmap-pointer cmap-u-link-comm"
                href={
                  'http://resultmaps.neis-one.org/osm-discussion-comments?uid=115894' +
                  userId +
                  '&commented'
                }
              >
                Comments
              </a>
            </li>
          </ul>
        </section>
        <section className="cmap-filter-action-section cmap-pt3">
          <h6 className="cmap-heading pointer" onClick={this.toggleActions}>
            {this.state.actions ? '▼' : '▶'}Filter by actions
          </h6>

          <ul
            style={{
              display: this.state.actions ? 'block' : 'none'
            }}
            className="cmap-hlist"
          >
            <li>
              <label className="cmap-hlist-item cmap-noselect cmap-pointer">
                <input
                  type="checkbox"
                  value="added"
                  defaultChecked="true"
                  id="cmap-layer-selector-added"
                  onChange={filterLayers}
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
                  id="cmap-layer-selector-modified"
                  onChange={filterLayers}
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
                  id="cmap-layer-selector-deleted"
                  onChange={filterLayers}
                />
                <span className="cmap-label-text">Deleted</span>
                <span className="cmap-color-box cmap-color-deleted" />
              </label>
            </li>
          </ul>
        </section>
        <section className="cmap-filter-type-section">
          <h6 className="cmap-heading pointer" onClick={this.toggleType}>
            {this.state.type ? '▼' : '▶'}Filter by type
          </h6>
          <ul
            className="cmap-hlist"
            style={{
              display: this.state.type ? 'block' : 'none'
            }}
          >
            <li>
              <label className="cmap-hlist-item cmap-noselect cmap-pointer">
                <input
                  type="checkbox"
                  value="nodes"
                  defaultChecked="true"
                  id="cmap-type-selector-nodes"
                  onClick={filterLayers}
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
                  onChange={filterLayers}
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
                  onChange={filterLayers}
                />
                <span className="cmap-label-text">Relations</span>
              </label>
            </li>
          </ul>
        </section>
        <section className="cmap-filter-changes-section cmap-pb3">
          <h6 className="cmap-heading pointer" onClick={this.toggleChanges}>
            {this.state.changes ? '▼' : '▶'}Tags added / updated / deleted
          </h6>
          <ul
            className="cmap-sub-hlist"
            style={{ display: this.state.changes ? 'block' : 'none' }}
          >
            {this.changeReport.sort().map((change, k) => (
              <ChangeItem key={k} change={change} />
            ))}
          </ul>
        </section>
        <section className="cmap-map-style-section cmap-pb3">
          <h6 className="cmap-heading pointer" onClick={this.toggleMapStyle}>
            {this.state.mapStyle ? '▼' : '▶'}Map style
          </h6>

          <ul
            className="cmap-hlist"
            style={{
              display: this.state.mapStyle ? 'block' : 'none'
            }}
          >
            <li>
              <label className="cmap-hlist-item cmap-noselect cmap-pointer">
                <input
                  type="radio"
                  value="satellite"
                  defaultChecked="true"
                  name="baselayer"
                  id="cmap-baselayer-satellite"
                  onChange={this.props.toggleLayer}
                />
                <span className="cmap-label-text">Satellite</span>
              </label>
            </li>
            <li>
              <label className="cmap-hlist-item cmap-noselect cmap-pointer">
                <input
                  type="radio"
                  value="streets"
                  name="baselayer"
                  id="cmap-baselayer-streets"
                  onChange={this.props.toggleLayer}
                />
                <span className="cmap-label-text">Streets</span>
              </label>
            </li>
            <li>
              <label className="cmap-hlist-item cmap-noselect cmap-pointer">
                <input
                  type="radio"
                  value="dark"
                  name="baselayer"
                  id="cmap-baselayer-dark"
                  onChange={this.props.toggleLayer}
                />
                <span className="cmap-label-text">Dark</span>
              </label>
            </li>
          </ul>
        </section>
      </div>
    );
  }
}
