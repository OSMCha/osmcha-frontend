import React from 'react';
import { connect } from 'react-redux';
import { Map, List, fromJS } from 'immutable';
import moment from 'moment';

import 'date-input-polyfill';

import { Link } from 'react-router-dom';

import {
  Text,
  Radio,
  MultiSelect,
  Wrapper,
  Meta,
  Date
} from '../components/filters';

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

export class _Filters extends React.PureComponent {
  props: {
    filters: Map<string, any>,
    location: Object,
    features: ?List<Map<string, any>>,
    lastChangesetID: number,
    applyFilters: (Object, string) => mixed
  };
  static defaultProps = {
    filters: new Map(),
    toggleAll: new Map()
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
      if (name === 'date__gte') {
        return this.setState({
          filters: this.state.filters.set(
            name,
            fromJS([{ label: '', value: null }])
          )
        });
      }
      return this.setState({
        filters: this.state.filters.delete(name)
      });
    }
    return this.setState({
      filters: this.state.filters.set(name, values)
    });
  };
  handleToggleAll = (name: string, values: ?List<*>) => {
    let filters = this.state.filters;
    const isAll = name.slice(0, 4) === 'all_';
    //  delete the opposite value
    if (isAll) {
      filters = filters.delete(name.slice(4));
    } else {
      filters = filters.delete('all_' + name);
    }
    // regularly handle change
    if (!values) {
      return this.setState({
        filters: filters.delete(name)
      });
    }
    return this.setState({ filters: filters.set(name, values) });
  };
  handleMetaChange = filters => {
    this.setState({ filters });
  };
  handleClear = () => {
    this.props.applyFilters(new Map(), '/');
  };
  renderFilters = (f: Object, k: number) => {
    const propsToSend = {
      name: f.name,
      type: f.type,
      display: f.display,
      value: this.state.filters.get(f.name),
      placeholder: f.placeholder,
      options: f.options || [],
      onChange: this.handleChange,
      dataURL: f.data_url,
      min: f.min,
      max: f.max
    };
    const wrapperProps = {
      name: f.name,
      handleFocus: this.handleFocus,
      hasValue: this.state.filters.has(f.name),
      display: f.display,
      key: k,
      description: this.state.active === f.name && f.description
    };
    if (f.range && f.type === 'number') {
      const gteValue = this.state.filters.get(f.name + '__gte');
      const lteValue = this.state.filters.get(f.name + '__lte');
      return (
        <Wrapper
          {...wrapperProps}
          hasValue={
            this.state.filters.has(f.name + '__gte') ||
            this.state.filters.has(f.name + '__lte')
          }
        >
          <span className="flex-parent flex-parent--row  ">
            <Text
              {...propsToSend}
              className="mr3"
              name={f.name + '__gte'}
              value={gteValue}
              placeholder={'from'}
              min={0}
              max={lteValue && lteValue.getIn([0, 'value'])}
            />
            <Text
              {...propsToSend}
              name={f.name + '__lte'}
              value={lteValue}
              placeholder={'to'}
              min={gteValue && gteValue.getIn([0, 'value'])}
            />
          </span>
        </Wrapper>
      );
    }
    if (f.range && f.type === 'date') {
      const gteValue = this.state.filters.get(f.name + '__gte');
      const lteValue = this.state.filters.get(f.name + '__lte');
      const today = moment().format('YYYY-MM-DD');
      return (
        <Wrapper
          {...wrapperProps}
          hasValue={
            this.state.filters.has(f.name + '__gte') ||
            this.state.filters.has(f.name + '__lte')
          }
        >
          <span className="flex-parent flex-parent--row h36">
            <Date
              {...propsToSend}
              name={f.name + '__gte'}
              value={gteValue}
              placeholder={'From'}
              max={(lteValue && lteValue.getIn([0, 'value'])) || today}
            />
            <Date
              {...propsToSend}
              name={f.name + '__lte'}
              value={lteValue}
              placeholder={'To'}
              min={gteValue && gteValue.getIn([0, 'value'])}
              max={today}
            />
          </span>
        </Wrapper>
      );
    }
    if (f.type === 'text') {
      return (
        <Wrapper {...wrapperProps}>
          <Text {...propsToSend} />
        </Wrapper>
      );
    }
    if (f.type === 'radio') {
      return (
        <Wrapper {...wrapperProps}>
          <Radio {...propsToSend} />
        </Wrapper>
      );
    }
    if (f.type === 'meta') {
      return (
        <Wrapper
          {...wrapperProps}
          hasValue={f.metaOf.find(fi => this.state.filters.has(fi))}
        >
          <Meta
            {...propsToSend}
            onChange={this.handleMetaChange}
            metaOf={f.metaOf}
            activeFilters={this.state.filters}
          />
        </Wrapper>
      );
    }
    if (f.type === 'text_comma') {
      let { name, value, onChange } = propsToSend;
      if (f.all) {
        onChange = this.handleToggleAll;
      }
      if (f.all && this.state.filters.has(`all_${f.name}`)) {
        name = `all_${f.name}`;
        value = this.state.filters.get(name);
      }

      return (
        <Wrapper
          {...wrapperProps}
          name={name}
          hasValue={this.state.filters.has(name)}
          description={this.state.active === f.name && f.description}
        >
          <MultiSelect
            {...propsToSend}
            name={name}
            value={value}
            onChange={onChange}
            showAllToggle={f.all}
          />
        </Wrapper>
      );
    }
    if (f.type === 'map') {
      return (
        <Wrapper
          {...wrapperProps}
          description={
            this.state.active === f.name &&
            <BBoxPicker
              onChange={this.handleChange}
              name={f.name}
              value={this.state.filters.get(f.name)}
            />
          }
        >
          <Text {...propsToSend} />
        </Wrapper>
      );
    }
  };
  render() {
    const width = window.innerWidth;
    return (
      <div
        className={`flex-parent flex-parent--column changesets-filters bg-white ${width <
          800
          ? 'viewport-full'
          : ''}`}
      >
        <header className="h55 hmin55 flex-parent px30 bg-gray-faint flex-parent--center-cross justify--space-between color-gray border-b border--gray-light border--1">
          <span className="txt-l txt-bold color-gray--dark">
            Filters
          </span>
          <span className="txt-l color-gray--dark">
            <Button
              className="border--0 bg-transparent"
              onClick={this.handleClear}
            >
              Reset
            </Button>
            <Button onClick={this.handleApply} className="mx3">Apply</Button>
            <Link
              to={{ search: this.props.location.search, pathname: '/' }}
              className="mx3 pointer"
            >
              <svg className="icon icon--m inline-block align-middle bg-gray-faint color-darken25 color-darken50-on-hover transition">
                <use xlinkHref="#icon-close" />
              </svg>
            </Link>
          </span>
        </header>

        <div className="px30 flex-child filters-scroll">
          <h2 className="txt-xl mr6 txt-bold mt24   border-b border--gray-light border--1">
            Basic
          </h2>
          {filtersData
            .slice(0, 3)
            .map((f: Object, k) => this.renderFilters(f, k))}
          <h2 className="txt-xl mr6 txt-bold mt30  border-b border--gray-light border--1">
            Flags
          </h2>
          {filtersData
            .slice(3, 5)
            .map((f: Object, k) => this.renderFilters(f, k))}
          <span className="flex-child flex-child--grow wmin420 wmax435" />
          <h2 className="txt-xl mr6 txt-bold mt30  border-b border--gray-light border--1">
            Review
          </h2>
          {filtersData
            .slice(5, 9)
            .map((f: Object, k) => this.renderFilters(f, k))}
          <span className="flex-child flex-child--grow wmin420 wmax435" />
          <h2 className="txt-xl mr6 txt-bold mt30  border-b border--gray-light border--1">
            Changeset Details
          </h2>
          {filtersData.slice(9).map((f: Object, k) => this.renderFilters(f, k))}
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

/*
<div className="flex-parent flex-parent--column align-items--center justify--space-between">
  <div className="mb12">
    <Avatar url={this.props.avatar} />
    <div className="txt-s txt-bold color-gray">{this.props.username}</div>
  </div>
  <Button onClick={this.props.logUserOut} className="bg-white-on-hover">
    Logout
  </Button>
</div>

<a
  target="_blank"
  title="Add a comment on OSM"
  href={`https://openstreetmap.org/changeset/${changesetId}`}
  className="btn btn--s border border--1 border--darken5 border--darken25-on-hover round bg-darken10 bg-darken5-on-hover color-gray transition pl12 pr6"
>
  Add a comment on OSM
  <svg className="icon inline-block align-middle pl3 pb3">
    <use xlinkHref="#icon-share" />
  </svg>
</a>
*/
