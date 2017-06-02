// @flow
import React from 'react';
import Mousetrap from 'mousetrap';
import { connect } from 'react-redux';
import { Map, List, Set } from 'immutable';
import { Link } from 'react-router-dom';

import { Navbar } from '../components/navbar';
import { Filter } from '../components/filter';
import { Button } from '../components/button';
import { getItem, setItem } from '../utils/safe_storage';

import filters from '../config/filters.json';

import { applyFilters } from '../store/changesets_page_actions';

import type { RootStateType } from '../store';
const USERS_LIMIT = 200;
class Filters extends React.PureComponent {
  props: {
    filters: Object,
    location: Object,
    features: List<Map<string, any>>,
    applyFilters: (Object, string) => mixed // base 0
  };
  state = { ...this.props.filters };
  scrollable = null;
  componentDidMount() {
    // Mousetrap.bind(FILTER_BINDING, () => {
    //   this.toggleFilter();
    // });
  }
  handleSelectChange = (name, obj) => {
    if (Array.isArray(obj)) {
      return this.setState({
        [name]: obj.map(o => ({ label: o.label, value: o.value })) || []
      });
    }
    return this.setState({
      [name]: (obj && obj.value) || ''
    });
  };
  handleFormChange = (event: any) => {
    let value;
    let name;
    const target = event.target;
    value = target.type === 'checkbox' ? target.checked : target.value;
    name = target.name;
    this.setState({
      [name]: value
    });
  };
  handleApply = () => {
    this.props.applyFilters(this.state, '/');
  };
  handleClear = () => {
    var keys = Object.keys(this.state);
    var newState = {};
    keys.forEach(k => (newState[k] = undefined));
    console.log(newState);
    this.props.applyFilters(
      {},
      '/changesets/' + (this.props.lastChangesetID || 49174123) + ''
    );
  };
  render() {
    const width = window.innerWidth;
    let usersAutofill;
    if (this.props.features) {
      let merged = [];
      let fromNetwork = Set(
        this.props.features.map(f => f.getIn(['properties', 'user']))
      ).toJS();

      if (getItem('usersAutofill')) {
        let cached = [];
        try {
          cached = JSON.parse(getItem('usersAutofill') || '');
        } catch (e) {
          console.error(e);
        }
        if (Array.isArray(cached)) {
          merged = Array.from(Set(fromNetwork.concat(cached)));
          merged.slice(0, USERS_LIMIT);
        }
      } else {
        merged = fromNetwork;
      }
      setItem('usersAutofill', JSON.stringify(merged));
      usersAutofill = merged.map(u => ({ label: u, value: u }));
    }
    return (
      <div
        className={`flex-parent flex-parent--column changesets-filters bg-gray-faint ${width < 800 ? 'viewport-full' : ''}`}
      >
        <header className="hmin55 h55 p12 pb24 border-b border--gray-light bg-gray-faint txt-s flex-parent justify--space-around">
          some header
        </header>
        <div className="m12 flex-parent flex-parent--row flex-parent--wrap justify--space-around scroll-auto wmax960 ">
          {filters
            .filter(f => {
              return !f.ignore;
            })
            .map((f, k) => (
              <Filter
                data={f}
                value={
                  f.range
                    ? {
                        __gte: this.state[f.name + '__gte'],
                        __lte: this.state[f.name + '__lte']
                      }
                    : this.state[f.name]
                }
                key={k}
                onChange={this.handleFormChange}
                onSelectChange={this.handleSelectChange}
                usersAutofill={usersAutofill}
              />
            ))}
          <span className="flex-child flex-child--grow wmin420 wmax435" />
        </div>
        <div className="flex-parent flex-parent--column justify--space-around  flex-child--grow" />
        <footer className="hmin55 p12 pb24 border-t border--gray-light bg-gray-faint txt-s flex-parent justify--space-around">
          <Link to={{ search: this.props.location.search, pathname: '/' }}>
            Close
          </Link>
          <a onClick={this.handleClear}>
            Clear
          </a>
          <a onClick={this.handleApply}>
            Apply
          </a>
        </footer>
      </div>
    );
  }
}

Filters = connect(
  (state: RootStateType, props) => ({
    filters: state.changesetsPage.get('filters') || {},
    features: state.changesetsPage.getIn(['pages', 0, 'features']),
    lastChangesetID: state.changeset.get('changesetId') ||
      state.changesetsPage.getIn(['pages', 0, 'features', 0, 'id']),
    location: props.location
  }),
  {
    applyFilters
  }
)(Filters);

export { Filters };
