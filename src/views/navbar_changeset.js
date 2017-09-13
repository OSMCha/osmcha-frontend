// @flow
import React from 'react';
import { connect } from 'react-redux';
import { is, Map } from 'immutable';

import { keyboardToggleEnhancer } from '../components/keyboard_enhancer';
import { Tags } from '../components/changeset/tags';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/navbar';
import { Verify } from '../components/changeset/verify';
import { OpenIn } from '../components/changeset/open_in';

import {
  VERIFY_BAD,
  VERIFY_GOOD,
  VERIFY_CLEAR,
  OPEN_IN_JOSM,
  OPEN_IN_HDYC
} from '../config/bindings';

import {
  handleChangesetModifyTag,
  handleChangesetModifyHarmful
} from '../store/changeset_actions';
import type { RootStateType } from '../store';

type propsType = {
  changesetId: number,
  location: Object,
  currentChangeset: Map<string, *>,
  username: ?string,
  lastKeyStroke: Map<string, *>,
  handleChangesetModifyTag: (number, Map<string, *>, Object, boolean) => mixed,
  handleChangesetModifyHarmful: (number, Map<string, *>, boolean | -1) => mixed
};
class NavbarChangeset extends React.PureComponent<void, propsType, *> {
  componentWillReceiveProps(nextProps: propsType) {
    if (!this.props.currentChangeset) return;
    const lastKeyStroke: Map<string, *> = nextProps.lastKeyStroke;
    if (is(this.props.lastKeyStroke, lastKeyStroke)) return;
    switch (lastKeyStroke.keySeq().first()) {
      case VERIFY_BAD.label: {
        this.props.handleChangesetModifyHarmful(
          this.props.changesetId,
          this.props.currentChangeset,
          true
        );
        break;
      }
      case VERIFY_CLEAR.label: {
        this.props.handleChangesetModifyHarmful(
          this.props.changesetId,
          this.props.currentChangeset,
          -1
        );
        break;
      }
      case VERIFY_GOOD.label: {
        this.props.handleChangesetModifyHarmful(
          this.props.changesetId,
          this.props.currentChangeset,
          false
        );
        break;
      }
      case OPEN_IN_JOSM.label: {
        if (!this.props.changesetId) return;
        const url = `https://127.0.0.1:8112/import?url=http://www.openstreetmap.org/api/0.6/changeset/${this
          .props.changesetId}/download`;
        window.open(url, '_blank');
        break;
      }
      case OPEN_IN_HDYC.label: {
        const user: string = this.props.currentChangeset.getIn(
          ['properties', 'user'],
          ''
        );
        const url = `http://hdyc.neis-one.org/?${user}`;
        window.open(url, '_blank');
        break;
      }
      default: {
        return;
      }
    }
  }
  handleVerify = (arr: Array<Object>) => {
    if (arr.length === 1) {
      this.props.handleChangesetModifyHarmful(
        this.props.changesetId,
        this.props.currentChangeset,
        arr[0].value // whether harmful is true or false
      );
    } else if (arr.length > 1) {
      throw new Error('verify array is big');
    }
  };
  handleVerifyClear = () => {
    this.props.handleChangesetModifyHarmful(
      this.props.changesetId,
      this.props.currentChangeset,
      -1
    );
  };
  render() {
    const width = window.innerWidth;
    return (
      <Navbar
        className="bg-gray-faint color-gray border-b border--gray-light border--1 px30"
        title={
          <div className="flex-parent flex-parent--row justify--space-between flex-parent--wrap">
            <span className="flex-parent align-items--center">
              {width < 800 && (
                <Link
                  to={{ search: this.props.location.search, pathname: '/' }}
                >
                  {'<  '}
                </Link>
              )}
              <span className="txt-l color-gray--dark">
                <span className="txt-bold">Changeset:</span>{' '}
                <span className="txt-underline mr12">
                  <a
                    href={`https://openstreetmap.org/changeset/${this.props
                      .changesetId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {this.props.changesetId}
                  </a>
                </span>
              </span>
              <OpenIn
                changesetId={this.props.changesetId}
                className="ml3"
                coordinates={
                  this.props.currentChangeset &&
                  this.props.currentChangeset.getIn([
                    'geometry',
                    'coordinates',
                    0,
                    0
                  ])
                }
              />
            </span>
            <span>
              {this.props.currentChangeset && (
                <span>
                  {this.props.currentChangeset.getIn([
                    'properties',
                    'check_user'
                  ]) && (
                    <Tags
                      changesetId={this.props.changesetId}
                      currentChangeset={this.props.currentChangeset}
                      disabled={false}
                      handleChangesetModifyTag={
                        this.props.handleChangesetModifyTag
                      }
                    />
                  )}
                  <Verify
                    changeset={this.props.currentChangeset}
                    placeholder="Verify"
                    value={[]}
                    onChange={this.handleVerify}
                    onClear={this.handleVerifyClear}
                    username={this.props.username}
                    checkUser={this.props.currentChangeset.getIn([
                      'properties',
                      'check_user'
                    ])}
                    options={[
                      {
                        value: false,
                        label: 'Good'
                      },
                      {
                        value: true,
                        label: 'Bad'
                      }
                    ]}
                    className="select--s"
                  />
                </span>
              )}
            </span>
          </div>
        }
      />
    );
  }
}

NavbarChangeset = keyboardToggleEnhancer(
  false,
  [VERIFY_BAD, VERIFY_GOOD, VERIFY_CLEAR, OPEN_IN_JOSM, OPEN_IN_HDYC],
  NavbarChangeset
);

NavbarChangeset = connect(
  (state: RootStateType, props) => ({
    location: props.location,
    changesetId: parseInt(state.changeset.get('changesetId'), 10),
    currentChangeset: state.changeset.getIn([
      'changesets',
      parseInt(state.changeset.get('changesetId'), 10)
    ]),
    username: state.auth.getIn(['userDetails', 'username'])
  }),
  { handleChangesetModifyTag, handleChangesetModifyHarmful }
)(NavbarChangeset);

export { NavbarChangeset };
