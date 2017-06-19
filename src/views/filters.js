import React from 'react';
import { connect } from 'react-redux';
import { Map, List, Set } from 'immutable';
import { Link } from 'react-router-dom';

import { Text, Radio, MultiSelect, Wrapper } from '../components/filters';

import { Button } from '../components/button';
import { BBoxPicker } from '../components/bbox_picker';

import { getItem, setItem } from '../utils/safe_storage';
import { gaSendEvent } from '../utils/analytics';

import filters from '../config/filters.json';

import { applyFilters } from '../store/changesets_page_actions';

import type { RootStateType } from '../store';

var filtersData = filters.filter(f => {
  return !f.ignore;
});

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
  state = {
    filters: this.props.filters,
    active: filtersData[0].name
  };
  handleFocus = (name: string) => {
    this.setState({
      active: name
    });
  };
  handleApply = () => {
    this.props.applyFilters(this.state.filters, '/');
    const filters: Map<string, List<*>> = this.state.filters;
    filters.forEach((v, k) => {
      v.forEach(vv => {
        gaSendEvent({
          category: 'Filters',
          action: k,
          label: vv.get('label')
        });
      });
    });
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
    this.props.applyFilters(
      new Map(),
      '/changesets/' + (this.props.lastChangesetID || 49174123) + ''
    );
  };
  renderFilters = (f: Object, k: number) => {
    if (f.range) {
      return (
        <Wrapper
          name={f.name}
          handleFocus={this.handleFocus}
          display={f.display}
          key={k}
          description={this.state.active === f.name && f.description}
        >
          <span className="flex-parent flex-parent--row  ">
            <Text
              type={f.type}
              className="mr3"
              value={this.state.filters.get(f.name + '__gte')}
              name={f.name + '__gte'}
              display={f.display}
              placeholder={'from'}
              onChange={this.handleChange}
            />
            <Text
              type={f.type}
              value={this.state.filters.get(f.name + '__lte')}
              name={f.name + '__lte'}
              display={f.display}
              placeholder={'to'}
              onChange={this.handleChange}
            />
          </span>
        </Wrapper>
      );
    }
    if (f.type === 'text') {
      return (
        <Wrapper
          display={f.display}
          key={k}
          name={f.name}
          handleFocus={this.handleFocus}
          description={this.state.active === f.name && f.description}
        >
          <Text
            type={f.type}
            value={this.state.filters.get(f.name)}
            name={f.name}
            display={f.display}
            placeholder={f.placeholder}
            onChange={this.handleChange}
          />
        </Wrapper>
      );
    }
    if (f.type === 'radio') {
      return (
        <Wrapper
          display={f.display}
          key={k}
          name={f.name}
          handleFocus={this.handleFocus}
          description={this.state.active === f.name && f.description}
        >
          <Radio
            name={f.name}
            type={f.type}
            display={f.display}
            value={this.state.filters.get(f.name)}
            placeholder={f.placeholder}
            options={f.options || []}
            onChange={this.handleChange}
          />
        </Wrapper>
      );
    }
    if (f.type === 'text_comma') {
      return (
        <Wrapper
          display={f.display}
          key={k}
          name={f.name}
          handleFocus={this.handleFocus}
          description={this.state.active === f.name && f.description}
        >
          <MultiSelect
            name={f.name}
            display={f.display}
            value={this.state.filters.get(f.name)}
            placeholder={f.placeholder}
            options={f.options || []}
            onChange={this.handleChange}
            dataURL={f.data_url}
          />
        </Wrapper>
      );
    }
    if (f.type === 'map') {
      return (
        <Wrapper
          display={f.display}
          key={k}
          name={f.name}
          handleFocus={this.handleFocus}
          description={
            this.state.active === f.name &&
            <BBoxPicker
              onChange={this.handleChange}
              name={f.name}
              value={this.state.filters.get(f.name)}
            />
          }
        >
          <Text
            type={f.type}
            value={this.state.filters.get(f.name)}
            name={f.name}
            display={f.display}
            placeholder={f.placeholder}
            onChange={this.handleChange}
          />
        </Wrapper>
      );
    }
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
        className={`flex-parent flex-parent--column changesets-filters bg-white ${width <
          800
          ? 'viewport-full'
          : ''}`}
      >
        <header className="h55 hmin55 flex-parent px12 bg-gray-faint flex-parent--center-cross justify--space-between color-gray border-b border--gray-light border--1">
          <span className="txt-l color-gray--dark">
            Filters{' '}
            <a
              onClick={this.handleClear}
              className="pointer mx6 txt-s txt-underline"
            >
              Reset
            </a>
          </span>
          <span className="txt-l color-gray--dark">
            <a onClick={this.handleApply} className="mx6 ">
              <Button className="bg-white-on-hover">
                Apply
              </Button>
            </a>
            <Link
              to={{ search: this.props.location.search, pathname: '/' }}
              className="mx6"
            >
              <svg className="icon icon--l inline-block align-middle color-gray-dark-on-hover ">
                <use xlinkHref="#icon-close" />
              </svg>
            </Link>
          </span>
        </header>

        <div className="pl24 flex-child scroll-auto">
          <h2 className="txt-l mr6 txt-bold mt24   border-b border--gray-light border--1">
            Basic
          </h2>
          {filtersData
            .slice(0, 3)
            .map((f: Object, k) => this.renderFilters(f, k))}
          <h2 className="txt-l mr6 txt-bold mt30  border-b border--gray-light border--1">
            Validation
          </h2>
          {filtersData
            .slice(3, 6)
            .map((f: Object, k) => this.renderFilters(f, k))}
          <span className="flex-child flex-child--grow wmin420 wmax435" />
          <h2 className="txt-l mr6 txt-bold mt30  border-b border--gray-light border--1">
            Changeset Data
          </h2>
          {filtersData.slice(6).map((f: Object, k) => this.renderFilters(f, k))}
          <span className="flex-child flex-child--grow wmin420 wmax435" />
        </div>
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
