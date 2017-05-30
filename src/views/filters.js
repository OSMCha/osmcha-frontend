// @flow
import React from 'react';
import Mousetrap from 'mousetrap';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { Link } from 'react-router-dom';

import { Navbar } from '../components/navbar';
import { Filter } from '../components/filter';
import { Button } from '../components/button';

import filters from '../config/filters.json';

import { getChangesetsPage } from '../store/changesets_page_actions';

import type { RootStateType } from '../store';

class Filters extends React.PureComponent {
  props: {
    getChangesetsPage: (number, Object) => mixed // base 0
  };
  state = {};
  scrollable = null;
  componentDidMount() {
    // Mousetrap.bind(FILTER_BINDING, () => {
    //   this.toggleFilter();
    // });
  }
  handleFormChange = (event: any) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };
  handleApply = () => {
    this.props.getChangesetsPage(0, this.state);
  };
  render() {
    const width = window.innerWidth;
    return (
      <div
        className={`flex-parent flex-parent--column changesets-list bg-gray-faint ${width < 800 ? 'viewport-full' : ''}`}
      >
        <header className="hmin55 h55 p12 pb24 border-b border--gray-light bg-gray-faint txt-s flex-parent justify--space-around">
          some header
        </header>
        <div className="m12 flex-parent flex-parent--row flex-parent--wrap justify--space-around scroll-auto ">
          {filters.map((f, k) => (
            <Filter
              data={f}
              value={this.state[f.name]}
              key={k}
              onChange={this.handleFormChange}
            />
          ))}
          <span className="flex-child flex-child--grow wmin420 wmax435" />
        </div>
        <div className="flex-parent flex-parent--column justify--space-around  flex-child--grow" />
        <footer className="hmin55 p12 pb24 border-t border--gray-light bg-gray-faint txt-s flex-parent justify--space-around">
          <Button onClick={this.handleApply}>Apply</Button>
        </footer>
      </div>
    );
  }
}

Filters = connect((state: RootStateType, props) => ({}), {
  getChangesetsPage
})(Filters);

export { Filters };
