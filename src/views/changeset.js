// @flow
import React from 'react';
import {connect} from 'react-redux';
import {fetchChangeset, fetchChangesetMap} from '../store/changeset_actions';
import {Changeset as ChangesetDumb} from '../components/changeset';
import {dispatchEvent} from '../utils/dispatch_event';

import {Map} from 'immutable';
import type {ChangesetType} from '../store/changeset_reducer';
import type {RootStateType} from '../store';
class Changeset extends React.PureComponent {
  props: {
    changeset: ChangesetType,
    paramsId: number,
    match: Object,
    fetchChangeset: (number) => mixed,
    fetchChangesetMap: (number) => mixed,
  };
  constructor(props) {
    super(props);

    var changesetId = this.props.paramsId;
    if (!Number.isNaN(changesetId)) {
      this.props.fetchChangeset(changesetId);
      // this.props.fetchChangesetMap(changesetId);
    }
  }
  componentWillReceiveProps(nextProps) {
    var newId = nextProps.paramsId;
    var oldId = this.props.paramsId;
    if (Number.isNaN(newId)) {
      return;
    }
    if (newId !== oldId) {
      this.props.fetchChangeset(newId);
      // this.props.fetchChangesetMap(newId);
    }
  }
  render() {
    const {match, changeset} = this.props;
    const currentChangeset: Map<string, *> = changeset.get('currentChangeset');
    const currentChangesetMap: Object = changeset.get('currentChangesetMap');
    if (match.path !== '/changesets/:id') {
      return <div> batpad, please select a changeset </div>;
    }
    if (changeset.get('loading')) {
      return <div className="loading" />;
    }
    if (changeset.get('error')) {
      dispatchEvent('showToast', {
        title: 'changeset failed to load',
        content: 'Try reloading osmcha',
        timeOut: 5000,
        type: 'error',
      });
      console.error(changeset.get('error'));
      return null;
    }
    if (changeset.get('errorChangesetMap')) {
      dispatchEvent('showToast', {
        title: 'changesetMap failed to load',
        content: 'Try reloading osmcha',
        timeOut: 5000,
        type: 'error',
      });
    }
    return (
      <ChangesetDumb
        changeset={currentChangeset}
        currentChangesetMap={currentChangesetMap}
      />
    );
  }
}

Changeset = connect(
  (state: RootStateType, props) => ({
    changeset: state.changeset,
    paramsId: parseInt(props.match.params.id, 10),
  }),
  {fetchChangeset, fetchChangesetMap},
)(Changeset);

export {Changeset};
