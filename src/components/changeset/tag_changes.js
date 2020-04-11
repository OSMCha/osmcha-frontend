// @flow
import React from 'react';
import { connect } from 'react-redux';

import { is } from 'immutable';

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
    .set('addedTags', addedTags.map(tag => `Added tag ${tag}`))
    .set('deletedTags', deletedTags.map(tag => `Deleted tag ${tag}`))
    .set(
      'changedValues',
      changedValues.map(tag => `Changed value of tag ${tag}`)
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
          {this.tag.slice(0, last_space)}
          <span className="txt-code">{this.tag.slice(last_space)}</span>
          <strong className="bg-blue-faint color-blue-dark mx6 px6 py3 txt-s round">
            {this.value.length}
          </strong>
        </span>
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

type propsType = {|
  changesetId: string,
  changes: Object
|};

class TagChanges extends React.PureComponent<void, propsType> {
  state = {
    changesetId: this.props.changesetId,
    changes: this.props.changes
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
      processFeatures(
        getFeatures(changes).filter(
          item => item.length === 2 && item[0].properties.action === 'modify'
        )
      ).forEach((featureIDs, tag) => changeReport.push([tag, featureIDs]));
    }
    return (
      <div className="px12 py6">
        <h2 className="txt-m txt-uppercase txt-bold mr6 mb3">Tag changes</h2>
        {changeReport.length ? (
          changeReport
            .sort()
            .map((change, k) => <ChangeItem key={k} change={change} />)
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
