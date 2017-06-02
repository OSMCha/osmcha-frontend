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

class NavbarChangeset extends React.PureComponent {
  props: {
    changesetId: number,
    location: Object,
    currentChangeset: Map<string, *>,
    handleChangesetModifyTag: (
      number,
      Map<string, *>,
      number,
      boolean
    ) => mixed,
    handleChangesetModifyHarmful: (number, Map<string, *>, boolean) => mixed
  };
  handleVerify = (arr: Array<Object>) => {
    console.log(arr);
    if (arr.length === 1) {
      this.props.handleChangesetModifyHarmful(
        this.props.changesetId,
        this.props.currentChangeset,
        arr[0].value === 'true' ? true : false // whether harmful is true or false
      );
    }
    // this.props.handleChangesetModifyHarmful(
    //   this.props.changesetId,
    //   this.props.currentChangeset,
    //   e.target.value === 'true' ? true : false // whether harmful is true or false
    // );
  };
  render() {
    const width = window.innerWidth;
    return (
      <Navbar
        className="bg-white color-gray border-b border--gray-light border--1 border-t--0"
        title={
          <div className="flex-parent flex-parent--row justify--space-between flex-parent--wrap">

            <span>
              {width < 800 &&
                <Link
                  to={{ search: this.props.location.search, pathname: '/' }}
                >
                  {'<  '}
                </Link>}
              <span className="txt-l">
                Changeset:
                {' '}
                <span className="txt-em">{this.props.changesetId}</span>
              </span>
            </span>
            <span>

              {this.props.currentChangeset &&
                <span>
                  <OpenIn changesetId={this.props.changesetId} />
                  <Verify
                    changeset={this.props.currentChangeset}
                    placeholder="Verify"
                    value={[]}
                    onChange={this.handleVerify}
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
                  <Tags
                    changesetId={this.props.changesetId}
                    currentChangeset={this.props.currentChangeset}
                    disabled={false}
                    handleChangesetModifyTag={
                      this.props.handleChangesetModifyTag
                    }
                  />
                </span>}

            </span>
          </div>
        }
        buttons={
          <a
            className={`${false ? 'is-active' : ''} flex-parent-inline btn color-gray-dark color-gray-dark-on-active bg-transparent bg-darken5-on-hover bg-gray-light-on-active txt-s ml3`}
            href="#"
            onClick={() => {}}
          >
            <svg className="icon"><use xlinkHref="#icon-osm" /></svg>
          </a>
        }
      />
    );
  }
}

NavbarChangeset = connect(
  (state: RootStateType, props) => ({
    location: props.location,
    changesetId: parseInt(state.changeset.get('changesetId'), 10),
    currentChangeset: state.changeset.getIn([
      'changesets',
      parseInt(state.changeset.get('changesetId'), 10)
    ])
  }),
  { handleChangesetModifyTag, handleChangesetModifyHarmful }
)(NavbarChangeset);

export { NavbarChangeset };
