// @flow
import React from 'react';
import Mousetrap from 'mousetrap';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import { Changeset as ChangesetDumb } from '../components/changeset';

import {
  handleChangesetModifyHarmful,
  handleChangesetModifyTag
} from '../store/changeset_actions';
import { FILTER_BINDING } from '../config/bindings';
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
  componentDidMount() {
    Mousetrap.bind('f', () => {
      var cmapSidebar = document.getElementsByClassName('cmap-sidebar')[0];
      if (cmapSidebar) {
        cmapSidebar.style.visibility = cmapSidebar.style.visibility === 'hidden'
          ? 'visible'
          : 'hidden';
      }
    });
  }
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
  handleVerify = e => {
    this.props.handleChangesetModifyHarmful(
      this.props.changesetId,
      this.props.currentChangeset,
      e.target.value === 'true' ? true : false // whether harmful is true or false
    );
  };
  render() {
    return (
      <div className="flex-parent flex-parent--column bg-gray-faint clip transition border border-l--0 border--gray-light border--1">
        <div className="flex-parent flex-parent--row justify--center transition">
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
  { handleChangesetModifyHarmful }
)(Changeset);

export { Changeset };
