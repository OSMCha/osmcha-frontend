// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Map, List, Set, fromJS } from 'immutable';
import { Link } from 'react-router-dom';

import { Filter } from '../components/filter';
import { Range, Text, Radio, MultiSelect } from '../components/filters';

import { Button } from '../components/button';
import { getItem, setItem } from '../utils/safe_storage';
import { gaSendEvent } from '../utils/analytics';

import filters from '../config/filters.json';

import { applyFilters } from '../store/changesets_page_actions';

import type { RootStateType } from '../store';

const USERS_LIMIT = 200;
export class _Filters extends React.PureComponent {
  props: {
    filters: Map<string, any>,
    location: Object,
    features: ?List<Map<string, any>>,
    lastChangesetID: number,
    applyFilters: (Object, string) => mixed
  };
  static defaultProps = {
    filters: new Map()
  };
  state = { filters: this.props.filters };
  scrollable = null;
  handleApply = () => {
    this.props.applyFilters(this.state.filters, '/');
    const filters = this.state.filters;
    //  filters.keySeq().forEach(f => {
    //     if (filters.get(f) && filters.get(f).isOrdered()) {
    //       filters.get(f).forEach((e, i) => {
    //         gaSendEvent({
    //           category: 'Filters',
    //           action: f,
    //           value: parseInt(this.state[f][i].value, 10),
    //           label: this.state[f][i].label
    //         });
    //       });
    //     } else {
    //       gaSendEvent({
    //         category: 'Filters',
    //         action: f,
    //         value: parseInt(this.state[f], 10),
    //         label: f
    //       });
    //     }
    //   });
  };
  handleChange = (name: string, values: ?List<*>) => {
    if (!values) {
      return this.setState({
        filters: this.state.filters.delete(name)
      });
    }
    return this.setState({
      filters: this.state.filters.set(name, values)
    });
  };
  handleClear = () => {
    // var keys = this.state.filters.keySeq();
    // var newState = {};
    // keys.forEach(k => (newState[k] = undefined));
    // console.log(newState);
    this.props.applyFilters(
      new Map(),
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
        className={`flex-parent flex-parent--column changesets-filters bg-gray-faint ${width <
          800
          ? 'viewport-full'
          : ''}`}
      >
        <header className="hmin55 h55 p12 pb24 border-b border--gray-light bg-gray-faint txt-s flex-parent justify--space-around">
          Filters
        </header>
        <div
          className="m12 flex-child scroll-auto wmax960 "
          style={{ alignSelf: 'center' }}
        >
          {filters
            .filter(f => {
              return !f.ignore;
            })
            .map((f: Object, k) => {
              if (f.range) {
                return (
                  <Range
                    key={k}
                    type={f.type}
                    gte={this.state.filters.get(f.name + '__gte')}
                    lte={this.state.filters.get(f.name + '__lte')}
                    name={f.name}
                    display={f.display}
                    placeholder={f.placeholder}
                    onChange={this.handleChange}
                  />
                );
              }
              if (f.type === 'text') {
                return (
                  <Text
                    key={k}
                    type={f.type}
                    value={this.state.filters.get(f.name)}
                    name={f.name}
                    display={f.display}
                    placeholder={f.placeholder}
                    onChange={this.handleChange}
                  />
                );
              }
              if (f.type === 'radio') {
                return (
                  <Radio
                    key={k}
                    name={f.name}
                    type={f.type}
                    display={f.display}
                    value={this.state.filters.get(f.name)}
                    placeholder={f.placeholder}
                    options={f.options || []}
                    onChange={this.handleChange}
                  />
                );
              }
              if (f.type === 'text_comma')
                return (
                  <MultiSelect
                    key={k}
                    name={f.name}
                    display={f.display}
                    value={this.state.filters.get(f.name)}
                    placeholder={f.placeholder}
                    options={f.options || []}
                    onChange={this.handleChange}
                    usersAutofill={usersAutofill}
                  />
                );
            })}
          <span className="flex-child flex-child--grow wmin420 wmax435" />
        </div>
        <div className="flex-parent flex-parent--column justify--space-around  flex-child--grow" />
        <footer className="hmin55 p12 pb24 border-t border--gray-light bg-gray-faint txt-s flex-parent justify--space-around">
          <Link to={{ search: this.props.location.search, pathname: '/' }}>
            <Button className="bg-white-on-hover">
              Close
            </Button>
          </Link>

          <a onClick={this.handleClear}>
            <Button className="bg-white-on-hover">
              Clear
            </Button>
          </a>
          <a onClick={this.handleApply}>
            <Button className="bg-white-on-hover">
              Apply
            </Button>
          </a>
        </footer>
      </div>
    );
  }
}

const Filters = connect(
  (state: RootStateType, props) => ({
    filters: state.changesetsPage.get('filters'),
    features: state.changesetsPage.getIn(['currentPage', 'features']),
    lastChangesetID:
      state.changeset.get('changesetId') ||
        state.changesetsPage.getIn(['currentPage', 'features', 0, 'id']),
    location: props.location
  }),
  {
    applyFilters
  }
)(_Filters);

export { Filters };
