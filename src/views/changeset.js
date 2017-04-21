// @flow
import React from 'react';
import {connect} from 'react-redux';
import {fetchChangeset} from '../store/changeset_actions';
import {Changeset as ChangesetDumb} from '../components/changeset';
import {Navbar} from '../components/navbar';
import {Map} from 'immutable';
import type {ChangesetType} from '../store/changeset_reducer';
import type {RootStateType} from '../store';
class Changeset extends React.PureComponent {
  props: {
    changeset: ChangesetType,
    paramsId: number, // is also the changesetId
    match: Object,
    fetchChangeset: (number) => mixed,
  };
  state = {
    filter: false,
  };
  constructor(props) {
    super(props);

    var changesetId = this.props.paramsId;
    if (!Number.isNaN(changesetId)) {
      this.props.fetchChangeset(changesetId);
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
    }
  }
  showChangeset = () => {
    const {match, changeset} = this.props;
    const currentChangeset: Map<string, *> = changeset.get('currentChangeset');
    const currentChangesetMap: Object = changeset.get('currentChangesetMap');
    if (changeset.get('loading')) {
      return <div className="loading" />;
    }
    if (match.path !== '/changesets/:id') {
      return <div> batpad, please select a changeset </div>;
    }
    return (
      <ChangesetDumb
        changesetId={this.props.paramsId}
        currentChangeset={currentChangeset}
        errorChangeset={changeset.get('errorChangeset')}
        errorChangesetMap={changeset.get('errorChangesetMap')}
        currentChangesetMap={currentChangesetMap}
      />
    );
  };
  toggleFilter = () => {
    this.setState({
      filter: !this.state.filter,
    });
  };
  render() {
    return (
      <div>
        <Navbar
          className="bg-white color-gray-dark border border--gray-light border--1 "
          title={<span className="txt-bold">{this.props.paramsId}</span>}
          buttons={
            <a
              className={
                `${this.state.filter ? 'is-active' : ''} flex-parent-inline btn color-gray-dark color-gray-dark-on-active bg-transparent bg-darken5-on-hover bg-gray-light-on-active txt-s ml3`
              }
              href="#"
              onClick={this.toggleFilter}
            >
              <svg className="icon"><use xlinkHref="#icon-osm" /></svg>
            </a>
          }
        />
        {this.showChangeset()}
      </div>
    );
  }
}

Changeset = connect(
  (state: RootStateType, props) => ({
    changeset: state.changeset,
    paramsId: parseInt(props.match.params.id, 10),
  }),
  {fetchChangeset},
)(Changeset);

export {Changeset};
