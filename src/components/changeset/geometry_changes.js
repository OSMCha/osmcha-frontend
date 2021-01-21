// @flow
import React from 'react';
import { connect } from 'react-redux';

import { is } from 'immutable';

import type { RootStateType } from '../store';
import { selectFeature } from '../../views/map';
import { getFeatures } from './tag_changes';

function processFeatures(features) {
  const finalReport = new Map();
  const keys = ['node', 'way', 'relation'];
  keys.map(key =>
    finalReport.set(
      key,
      features
        .filter(item => item[0].properties.action === 'modify')
        .filter(item => item[0].properties.type === key)
        .filter(
          item =>
            JSON.stringify(item[0].geometry) !==
            JSON.stringify(item[1].geometry)
        )
        .map(item => ({ id: item[0].properties.id }))
    )
  );
  return finalReport;
}

function GeometryChangesListItem({ id }) {
  return (
    <li>
      <span className="pointer" onClick={() => selectFeature(id)}>
        {id}
      </span>
    </li>
  );
}

class GeometryChangesItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      opened: false
    };
    this.tag = props.action[0];
    this.value = props.action[1];
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange() {
    this.setState({ opened: !this.state.opened });
  }
  render() {
    const titles = { node: 'Nodes', way: 'Ways', relation: 'Relations' };
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
          <span>{titles[this.tag]}</span>
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
          {this.value.map((item, k) => (
            <GeometryChangesListItem id={item.id} key={k} />
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

class GeometryChanges extends React.PureComponent<void, propsType> {
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
    let changeReport = [];
    if (
      this.state &&
      this.state.changes &&
      this.state.changes.get(this.props.changesetId)
    ) {
      const changes = this.state.changes.get(this.props.changesetId)[
        'featureMap'
      ];
      processFeatures(getFeatures(changes)).forEach((featureIDs, tag) =>
        changeReport.push([tag, featureIDs])
      );
    }
    changeReport = changeReport.filter(changeType => changeType[1].length);
    return (
      <div className="px12 py6">
        <h2 className="txt-m txt-uppercase txt-bold mr6 mb3">
          Geometry Changes
        </h2>
        {changeReport.length ? (
          changeReport.map((changeType, k) => (
            <GeometryChangesItem key={k} action={changeType} />
          ))
        ) : (
          <span>No geometry changes in this changeset.</span>
        )}
      </div>
    );
  }
}

GeometryChanges = connect((state: RootStateType, props) => ({
  changes: state.changeset.get('changesetMap')
}))(GeometryChanges);

export { GeometryChanges };
