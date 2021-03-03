// @flow
import React from 'react';
import { connect } from 'react-redux';

import { is } from 'immutable';

import type { RootStateType } from '../store';
import { selectFeature } from '../../views/map';
import { getFeatures } from './tag_changes';

function processFeatures(features) {
  const finalReport = new Map();
  features = features.map(item => item[0]);
  const keys = ['create', 'delete'];
  keys.map(key =>
    finalReport.set(
      key,
      features
        .filter(item => item.properties.action === key)
        .map(item => ({ id: item.properties.id, type: item.properties.type }))
    )
  );
  finalReport.set(
    'modify',
    features
      .filter(item => item.properties.action === 'modify')
      .filter(item => item.properties.type === 'relation')
      .map(item => ({ id: item.properties.id, type: item.properties.type }))
  );
  return finalReport;
}

function OtherFeaturesListItem({ id, type }) {
  return (
    <li>
      <span className="pointer" onClick={() => selectFeature(id)}>
        {id} ({type})
      </span>
    </li>
  );
}

class ActionItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      opened: props.opened || false
    };
    this.tag = props.action[0];
    this.value = props.action[1];
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
    const titles = {
      create: 'Created',
      modify: 'Modified Relations',
      delete: 'Deleted'
    };
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
          <span className="txt-bold">{titles[this.tag]}</span>
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
            <OtherFeaturesListItem id={item.id} type={item.type} key={k} />
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

class OtherFeatures extends React.PureComponent<void, propsType> {
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
      processFeatures(getFeatures(changes)).forEach((featureIDs, tag) =>
        changeReport.push([tag, featureIDs])
      );
    }
    return (
      <div className="px12 py6">
        <div className="pb6">
          <h2 className="inline txt-m txt-uppercase txt-bold mr6 mb3">
            Other features
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
            .filter(changeType => changeType[1].length)
            .map((changeType, k) => (
              <ActionItem
                key={k}
                action={changeType}
                opened={this.state.openAll}
              />
            ))
        ) : (
          <span>No created and deleted features in this changeset.</span>
        )}
      </div>
    );
  }
}

OtherFeatures = connect((state: RootStateType, props) => ({
  changes: state.changeset.get('changesetMap')
}))(OtherFeatures);

export { OtherFeatures };
