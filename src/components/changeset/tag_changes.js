// @flow
import React from 'react';
import { connect } from 'react-redux';

import { is, OrderedSet } from 'immutable';

import type { RootStateType } from '../store';
import { selectFeature } from '../../views/map';

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
        if (finalReport.get(tag[0])) {
          finalReport.set(
            tag[0],
            finalReport
              .get(tag[0])
              .concat([{ id: item.get('id'), value: tag[1] }])
          );
        } else {
          finalReport.set(tag[0], [{ id: item.get('id'), value: tag[1] }]);
        }
      })
    )
  );
  return finalReport;
}

export function analyzeFeature(newVersion, oldVersion) {
  const oldVersionKeys = Object.keys(oldVersion.properties.tags);
  const newVersionKeys = Object.keys(newVersion.properties.tags);
  const addedTags = newVersionKeys.filter(tag => !oldVersionKeys.includes(tag));
  const deletedTags = oldVersionKeys.filter(
    tag => !newVersionKeys.includes(tag)
  );
  const changedValues = newVersionKeys
    .filter(tag => !addedTags.includes(tag) && !deletedTags.includes(tag))
    .filter(
      tag => newVersion.properties.tags[tag] !== oldVersion.properties.tags[tag]
    );
  const result = new Map();
  result
    .set('id', newVersion.properties.id)
    .set(
      'addedTags',
      addedTags.map(tag => [
        `Added tag ${tag}`,
        newVersion.properties.tags[tag]
      ])
    )
    .set(
      'deletedTags',
      deletedTags.map(tag => [
        `Deleted tag ${tag}`,
        oldVersion.properties.tags[tag]
      ])
    )
    .set(
      'changedValues',
      changedValues.map(tag => [
        `Changed value of tag ${tag}`,
        [oldVersion.properties.tags[tag], newVersion.properties.tags[tag]]
      ])
    );
  return result;
}

function FeatureListItem(props) {
  return (
    <li>
      <span className="pointer" onClick={() => selectFeature(props.id)}>
        {props.id}
      </span>
    </li>
  );
}

function ChangeTitle({ value, type }) {
  if (type.startsWith('Added')) {
    return <span className="txt-code cmap-bg-create-light">{value}</span>;
  }
  if (type.startsWith('Deleted')) {
    return <span className="txt-code cmap-bg-delete-light">{value}</span>;
  }
  if (type.startsWith('Changed')) {
    const [oldValue, newValue] = value;
    return (
      <span>
        <span className="txt-code cmap-bg-modify-old-light">{oldValue}</span>
        <strong> ➜ </strong>
        <span className="txt-code cmap-bg-modify-new-light">{newValue}</span>
      </span>
    );
  }
  return <div></div>;
}

export class ChangeItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      opened: props.opened || false
    };
    this.tag = props.change[0];
    this.features = props.change[1];
    this.values = new OrderedSet(this.features.map(feature => feature.value));
    this.handleChange = this.handleChange.bind(this);
  }
  componentWillReceiveProps(nextProps: propsType) {
    if (!is(this.props.opened, nextProps.opened)) {
      this.setState({
        opened: nextProps.opened
      });
    }
  }
  handleChange() {
    this.setState({ opened: !this.state.opened });
  }
  render() {
    var last_space = this.tag.lastIndexOf(' ') + 1;
    return (
      <div>
        <span className="pointer" onClick={this.handleChange}>
          {this.state.opened ? (
            <svg
              className="icon h18 w18 inline-block"
              style={{ verticalAlign: 'text-bottom' }}
            >
              <use xlinkHref={'#icon-chevron-down'} />
            </svg>
          ) : (
            <svg
              className="icon h18 w18 inline-block"
              style={{ verticalAlign: 'text-bottom' }}
            >
              <use xlinkHref={'#icon-chevron-right'} />
            </svg>
          )}
          <span className="txt-bold">{this.tag.slice(0, last_space)}</span>
          <span className="txt-code">{this.tag.slice(last_space)}</span>
          <strong className="bg-blue-faint color-blue-dark mx6 px6 py3 txt-s round">
            {this.features.length}
          </strong>
        </span>
        {this.values.map((value, n) => (
          <div
            className="ml18 py3"
            style={{ display: this.state.opened ? 'block' : 'none' }}
            key={n}
          >
            <ChangeTitle value={value} type={this.tag} />
            <ul className="ml6">
              {this.features
                .filter(feature => feature.value === value)
                .map((feature, k) => (
                  <FeatureListItem
                    id={feature.id}
                    value={feature.value}
                    key={k}
                  />
                ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }
}

type propsType = {|
  changesetId: string,
  changes: Object
|};

class TagChanges extends React.PureComponent<void, propsType> {
  state = {
    changesetId: this.props.changesetId,
    changes: this.props.changes,
    openAll: false
  };

  componentWillReceiveProps(nextProps: propsType) {
    if (!is(this.props.changes, nextProps.changes)) {
      this.setState({
        changes: nextProps.changes
      });
    }
  }

  render() {
    const changeReport = [];
    if (
      this.state &&
      this.state.changes &&
      this.state.changes.get(this.props.changesetId)
    ) {
      const changes = this.state.changes.get(this.props.changesetId)[
        'featureMap'
      ];
      const processed = processFeatures(
        getFeatures(changes).filter(
          item => item.length === 2 && item[0].properties.action === 'modify'
        )
      );
      processed.forEach((featureIDs, tag) =>
        changeReport.push([tag, featureIDs])
      );
    }
    return (
      <div className="px12 py6">
        <div className="pb6">
          <h2 className="inline txt-m txt-uppercase txt-bold mr6 mb3">
            Tag changes
          </h2>
          <div className="inline-block fr">
            <label class="inline-block txt-s checkbox-container">
              <input
                type="checkbox"
                className="pointer align-b"
                onChange={() => this.setState({ openAll: !this.state.openAll })}
              />
              <span className="txt-s">
                {this.state.openAll ? 'Close all' : 'Open all'}
              </span>
            </label>
          </div>
        </div>
        {changeReport.length ? (
          changeReport
            .sort()
            .map((change, k) => (
              <ChangeItem key={k} change={change} opened={this.state.openAll} />
            ))
        ) : (
          <span>No tags were changed in this changeset.</span>
        )}
      </div>
    );
  }
}

TagChanges = connect((state: RootStateType, props) => ({
  changes: state.changeset.get('changesetMap')
}))(TagChanges);

export { TagChanges };
