// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import { Tags } from '../components/changeset/tags';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/navbar';
import { Verify } from '../components/changeset/verify';
import { Dropdown } from '../components/dropdown';
import { OpenIn } from '../components/changeset/open_in';
import {
  handleChangesetModifyTag,
  handleChangesetModifyHarmful
} from '../store/changeset_actions';
import type { RootStateType } from '../store';

class NavbarSidebar extends React.PureComponent {
  props: {
    changesetId: number,
    location: Object,
    currentChangeset: Map<string, *>,
    username: ?string,
    handleChangesetModifyTag: (
      number,
      Map<string, *>,
      number,
      boolean
    ) => mixed,
    handleChangesetModifyHarmful: (
      number,
      Map<string, *>,
      boolean | -1
    ) => mixed
  };
  render() {
    const width = window.innerWidth;
    return (
      <Navbar
        className="bg-white border-b border--gray-light border--1"
        title={
          <span className="txt-fancy color-gray txt-xl">
            <span className="color-green txt-bold">
              OSM
            </span>
            {' '}
            CHA
          </span>
        }
      />
    );
  }
}

NavbarSidebar = connect(
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
)(NavbarSidebar);

export { NavbarSidebar };
