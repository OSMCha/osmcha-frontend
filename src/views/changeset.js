// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import Mousetrap from 'mousetrap';

import { Changeset as ChangesetDumb } from '../components/changeset';

import { dispatchEvent } from '../utils/dispatch_event';

import { applyFilters } from '../store/changesets_page_actions';
import { FILTER_BY_USER } from '../config/bindings';
import type { RootStateType } from '../store';

class Changeset extends React.PureComponent {
  props: {
    errorChangeset: ?Object, // error of the latest that changeset failed
    location: Object,
    loading: boolean, // loading of the selected changesetId
    currentChangeset?: Map<string, *>,
    changesetId: number,
    applyFilters: (Map<string, *>) => mixed // base 0
  };
  componentDidMount() {
    Mousetrap.bind(FILTER_BY_USER.bindings, this.filterChangesetsByUser);
  }
  componentWillUnmount() {
    FILTER_BY_USER.bindings.forEach(k => Mousetrap.unbind(k));
  }
  filterChangesetsByUser = () => {
    if (this.props.currentChangeset) {
      const userName = this.props.currentChangeset.getIn([
        'properties',
        'user'
      ]);
      this.props.applyFilters(
        new Map().set(
          'users',
          fromJS([
            {
              label: userName,
              value: userName
            }
          ])
        )
      );
    }
  };
  showChangeset = () => {
    const {
      loading,
      errorChangeset,
      currentChangeset,
      changesetId
    } = this.props;
    if (loading || !currentChangeset) {
      return null;
    }

    if (errorChangeset) {
      dispatchEvent('showToast', {
        title: `changeset:${changesetId} failed to load`,
        content: 'Try reloading osmcha',
        timeOut: 5000,
        type: 'error'
      });
      console.error(errorChangeset);
      return null;
    }
    return (
      <ChangesetDumb
        uid={parseInt(currentChangeset.getIn(['properties', 'uid'], null), 10)}
        user={currentChangeset.getIn(['properties', 'user'], null)}
        changesetId={changesetId}
        currentChangeset={currentChangeset}
        errorChangeset={errorChangeset}
        filterChangesetsByUser={this.filterChangesetsByUser}
      />
    );
  };
  render() {
    return (
      <div>
        <div className="flex-parent flex-parent--column clip">
          {this.showChangeset()}
        </div>
      </div>
    );
  }
}

Changeset = connect(
  (state: RootStateType, props) => ({
    changeset: state.changeset,
    location: props.location,
    changesetId: parseInt(props.match.params.id, 10),
    currentChangeset: state.changeset.getIn([
      'changesets',
      parseInt(props.match.params.id, 10)
    ]),
    errorChangeset: state.changeset.get('errorChangeset'),
    loading: state.changeset.get('loading')
  }),
  { applyFilters }
)(Changeset);

export { Changeset };
