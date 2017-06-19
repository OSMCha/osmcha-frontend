// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import { Changeset as ChangesetDumb } from '../components/changeset';

import { dispatchEvent } from '../utils/dispatch_event';

import type { RootStateType } from '../store';

class Changeset extends React.PureComponent {
  props: {
    errorChangeset: ?Object, // error of the latest that changeset failed
    location: Object,
    loading: boolean, // loading of the selected changesetId
    currentChangeset: Map<string, *>,
    changesetId: number
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
        changesetId={changesetId}
        currentChangeset={currentChangeset}
        errorChangeset={errorChangeset}
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

Changeset = connect((state: RootStateType, props) => ({
  changeset: state.changeset,
  location: props.location,
  changesetId: parseInt(props.match.params.id, 10),
  currentChangeset: state.changeset.getIn([
    'changesets',
    parseInt(props.match.params.id, 10)
  ]),
  errorChangeset: state.changeset.get('errorChangeset'),
  loading: state.changeset.get('loading')
}))(Changeset);

export { Changeset };
