// @flow
import React from 'react';
import {connect} from 'react-redux';
import Mousetrap from 'mousetrap';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import {fetchChangeset} from '../store/changeset_actions';
import {Changeset as ChangesetDumb} from '../components/changeset';
import {Navbar} from '../components/navbar';
import {Sidebar} from '../components/sidebar';
import {Loading} from '../components/loading';
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
  componentDidMount() {
    Mousetrap.bind('\\', () => {
      this.toggleFilter();
    });
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
      return <Loading />;
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
      <div className="flex-parent flex-parent--column h-full hmax-full">
        <Navbar
          className="bg-white color-gray-dark border-b border--gray-light border--1 "
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
        <div className="flex-parent flex-parent--rowh">
          {this.showChangeset()}
          <CSSTransitionGroup
            transitionName="filters-bar"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={400}
          >
            {this.state.filter
              ? <Sidebar
                  key={0}
                  className="transition 480 wmin480 absolute bottom right z6 h-full"
                  title={
                    <Navbar
                      title={
                        <span
                          className="flex-parent flex-parent--center-cross justify--space-between txt-fancy color-gray txt-l"
                        >
                          <span className="txt-bold">Filters</span>
                          <span className="flex-child flex-child--grow" />
                          <a
                            className={
                              `flex-parent-inline btn color-white bg-transparent bg-gray-on-hover ml3`
                            }
                            href="#"
                            onClick={this.toggleFilter}
                          >
                            <svg className="icon">
                              <use xlinkHref="#icon-close" />
                            </svg>
                          </a>
                        </span>
                      }
                    />
                  }
                >
                  Holla
                </Sidebar>
              : null}
          </CSSTransitionGroup>
        </div>
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
