// @flow
import React from 'react';
import Mousetrap from 'mousetrap';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import {
  getChangeset,
  handleChangesetModify
} from '../store/changeset_actions';
import { Changeset as ChangesetDumb } from '../components/changeset';
import { Navbar } from '../components/navbar';
import { Sidebar } from '../components/sidebar';
import { Loading } from '../components/loading';
import { Filters } from '../components/filters';
import { Verify } from '../components/changeset/verify';

import { FILTER_BINDING } from '../config/bindings';
import { dispatchEvent } from '../utils/dispatch_event';

import type { ChangesetType } from '../store/changeset_reducer';
import type { RootStateType } from '../store';

class Changeset extends React.PureComponent {
  props: {
    changeset: ChangesetType,
    currentChangeset: Object,
    changesetId: number, // is also the the param :id
    match: Object,
    getChangeset: number => mixed,
    handleChangesetModify: (number, Map<string, *>, boolean) => mixed
  };
  state = {
    filter: false,
    dimensions: {
      width: -1,
      height: -1
    }
  };
  constructor(props) {
    super(props);
    var changesetId = this.props.changesetId;
    if (!Number.isNaN(changesetId)) {
      this.props.getChangeset(changesetId);
    }
  }
  componentDidMount() {
    Mousetrap.bind(FILTER_BINDING, () => {
      this.toggleFilter();
    });
    Mousetrap.bind('f', () => {
      var cmapSidebar = document.getElementsByClassName('cmap-sidebar')[0];
      if (cmapSidebar) {
        cmapSidebar.style.visibility = cmapSidebar.style.visibility === 'hidden'
          ? 'visible'
          : 'hidden';
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    var newId = nextProps.changesetId;
    var oldId = this.props.changesetId;
    if (Number.isNaN(newId)) {
      return;
    }
    if (newId !== oldId) {
      this.props.getChangeset(newId);
    }
  }
  showChangeset = () => {
    const { match, changeset, currentChangeset } = this.props;
    const currentChangesetMap: Object = changeset.get('currentChangesetMap');
    if (match.path !== '/changesets/:id' || !this.props.changesetId) {
      return <div> batpad, please select a changeset </div>;
    }
    if (changeset.get('loading') || !currentChangeset) {
      return <Loading />;
    }
    if (changeset.get('errorChangeset')) {
      dispatchEvent('showToast', {
        title: 'changeset failed to load',
        content: 'Try reloading osmcha',
        timeOut: 5000,
        type: 'error'
      });
      console.error(changeset.get('errorChangeset'));
      return null;
    }
    return (
      <ChangesetDumb
        changesetId={this.props.changesetId}
        currentChangeset={currentChangeset}
        errorChangeset={changeset.get('errorChangeset')}
        errorChangesetMap={changeset.get('errorChangesetMap')}
        currentChangesetMap={currentChangesetMap}
        dimensions={this.state.dimensions}
        scrollUp={this.scrollUp}
        scrollDown={this.scrollDown}
      />
    );
  };
  toggleFilter = () => {
    this.setState({
      filter: !this.state.filter
    });
  };
  scrollDown = () => {
    if (this.scrollable) {
      window.s = this.scrollable;
      this.scrollable.scrollTop = window.innerHeight;
    }
  };
  scrollUp = () => {
    if (this.scrollable) {
      this.scrollable.scrollTop = 0;
    }
  };
  handleVerify = e => {
    this.props.handleChangesetModify(
      this.props.changesetId,
      this.props.currentChangeset,
      e.target.value === 'true' ? true : false
    );
  };
  scrollable = null;
  render() {
    if (this.props.currentChangeset) {
      console.log(this.props.currentChangeset.toJS().properties);
    }
    return (
      <div className="flex-parent flex-parent--column bg-gray-faint clip transition border border-l--0 border--gray-light border--1">
        <Navbar
          className="bg-white color-gray border-b border--gray-light border--1"
          title={
            <div className="flex-parent flex-parent--row justify--space-between flex-parent--wrap">
              <span className="txt-l">
                Changeset:
                {' '}
                <span className="txt-em">{this.props.changesetId}</span>
              </span>
              <span>

                <button
                  className={'btn btn--pill btn--s color-gray btn--gray-faint'}
                >
                  <a
                    target="_blank"
                    href={`http://127.0.0.1:8111/import?url=http://www.openstreetmap.org/api/0.6/changeset/${this.props.changesetId}/download`}
                  >
                    HDYC
                  </a>
                </button>
                <button
                  className={'btn btn--pill btn--s color-gray btn--gray-faint'}
                >
                  <a target="_blank" href={'http://hdyc.neis-one.org/?'}>
                    JOSM
                  </a>
                </button>
                {this.props.currentChangeset &&
                  this.props.currentChangeset.getIn(['properties', 'checked'])
                  ? <button
                      className={
                        'btn btn--pill btn--s color-gray btn--gray-faint'
                      }
                    >
                      <a target="_blank" href={'http://hdyc.neis-one.org/?'}>
                        {this.props.currentChangeset.getIn([
                          'properties',
                          'harmful'
                        ])
                          ? 'Harmful'
                          : 'Good'}
                      </a>
                    </button>
                  : <Verify
                      placeholder="Verify"
                      onChange={this.handleVerify}
                      value=""
                      options={[
                        {
                          value: false,
                          display: 'Good'
                        },
                        {
                          value: true,
                          display: 'Bad'
                        }
                      ]}
                      className="select--s"
                    />}

              </span>

            </div>
          }
          buttons={
            <a
              className={`${this.state.filter ? 'is-active' : ''} flex-parent-inline btn color-gray-dark color-gray-dark-on-active bg-transparent bg-darken5-on-hover bg-gray-light-on-active txt-s ml3`}
              href="#"
              onClick={this.toggleFilter}
            >
              <svg className="icon"><use xlinkHref="#icon-osm" /></svg>
            </a>
          }
        />
        <div
          className="flex-parent flex-parent--row justify--center scroll-auto transition"
          ref={r => (this.scrollable = r)}
          style={{
            height: false ? window.innerHeight : window.innerHeight - 55
          }}
        >
          {this.showChangeset()}
          <CSSTransitionGroup
            transitionName="filters-bar"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={400}
          >
            {this.state.filter
              ? <Sidebar
                  key={0}
                  className="transition 480 wmin480 absolute bottom right z6 h-full bg-white"
                  title={
                    <Navbar
                      title={
                        <span className="flex-parent flex-parent--center-cross justify--space-between txt-fancy color-gray txt-l">
                          <span className="txt-bold select-none">
                            Filters
                          </span>
                          <span className="flex-child flex-child--grow" />
                          <a
                            className={
                              'flex-parent-inline btn color-white bg-transparent bg-gray-on-hover ml3'
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
                  <Filters />
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
    changesetId: parseInt(props.match.params.id, 10),
    currentChangeset: state.changeset.getIn([
      'changesets',
      parseInt(props.match.params.id, 10)
    ])
  }),
  { getChangeset, handleChangesetModify }
)(Changeset);

export { Changeset };
