// @flow
import React from 'react';
import {connect} from 'react-redux';
import {fetchChangeset} from '../store/changeset_actions';
import type {ChangesetType} from '../store/changeset_reducer';
import type {RootStateType} from '../store';
class Changeset extends React.PureComponent {
  props: {
    changeset: ChangesetType,
    match: Object,
    fetchChangeset: (number) => mixed,
  };
  constructor(props) {
    super(props);
    var changesetId = parseInt(this.props.match.params.id, 10);
    if (!Number.isNaN(changesetId)) {
      this.props.fetchChangeset(changesetId);
    }
  }
  componentWillReceiveProps(nextProps) {
    var newId = parseInt(nextProps.match.params.id, 10);
    var oldId = parseInt(this.props.match.params.id, 10);
    if (Number.isNaN(newId) || Number.isNaN(oldId)) {
      return;
    }
    if (newId !== oldId) {
      this.props.fetchChangeset(newId);
    }
  }
  render() {
    const {match, changeset} = this.props;
    if (match.path !== '/changesets/:id') {
      return <div> batpad, please select a changeset </div>;
    }
    if (changeset.get('loading')) {
      return <div className="loading" />;
    }
    if (changeset.get('currentChangeset')) {
      return <div>{JSON.stringify(changeset.get('currentChangeset'))}</div>;
    }
    if (changeset.get('error')) {
      return <div>{JSON.stringify(changeset.get('error'))}</div>;
    }
    return <div> error of unknown kind  here </div>;
  }
}

Changeset = connect(
  (state: RootStateType) => ({
    changeset: state.changeset,
  }),
  {fetchChangeset},
)(Changeset);

export {Changeset};
