// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { Map } from 'immutable';

import { Button } from '../button';
import { Dropdown } from '../dropdown';
import { AOIManager } from './aoi_manager';
import { isProd } from '../../config';

class AOIName extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      value: props.name
    };
  }
  ref;
  clicked = false;
  onClick = event => {
    this.clicked = true;
    this.setState({ editing: true });
  };
  onChange = (event: any) => {
    this.setState({ value: event.target.value });
  };
  onKeyDown = event => {
    if (event.keyCode === 13) {
      this.setState({
        editing: false
      });
      this.props.createAOI(this.state.value);
    } else if (event.keyCode === 27) {
      this.setState({
        editing: false,
        value: this.props.name
      });
      this.clicked = false;
    }
  };
  // handleFocus = event => {
  //   event.target.select();
  // };
  render() {
    return (
      <span>
        /
        {this.state.editing
          ? <input
              ref={r => {
                if (this.clicked) {
                  r.select();
                  this.clicked = false;
                }
              }}
              value={this.state.value}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
            />
          : <span onClick={this.onClick}>
              {this.props.name}
            </span>}
      </span>
    );
  }
}

export function FiltersHeader({
  loading,
  search,
  token,
  aoiName,
  createAOI,
  removeAOI,
  handleApply,
  handleClear,
  loadAoiId
}: {
  createAOI: string => void,
  removeAOI: string => void,
  loading: boolean,
  search: string,
  token?: string,
  aoiName?: string,
  handleApply: () => void,
  handleClear: () => void,
  loadAoiId: string => void
}) {
  return (
    <header className="h55 hmin55 flex-parent px30 bg-gray-faint flex-parent--center-cross justify--space-between color-gray border-b border--gray-light border--1">
      <span className="txt-l txt-bold color-gray--dark">
        <span>Filters</span>
        {aoiName && <AOIName name={aoiName} createAOI={createAOI} />}
      </span>
      <span className="txt-l color-gray--dark">
        <Button className="border--0 bg-transparent" onClick={handleClear}>
          Reset
        </Button>
        <Button onClick={handleApply} className="mx3">
          Apply
        </Button>
        <Link to={{ search: search, pathname: '/' }} className="mx3 pointer">
          <svg className="icon icon--m inline-block align-middle bg-gray-faint color-darken25 color-darken50-on-hover transition">
            <use xlinkHref="#icon-close" />
          </svg>
        </Link>
      </span>
    </header>
  );
}
