// @flow
import React from 'react';

import {
  Text,
  Radio,
  MappingTeamMultiSelect,
  MultiSelect,
  Wrapper,
  Meta,
  DateField,
  LocationSelect
} from './';

import { loadingEnhancer } from '../loading_enhancer';
import filters from '../../config/filters.json';
import { getDefaultFromDate } from '../../utils/filters';
import type { filterType, filtersType } from './';

const defaultDate = getDefaultFromDate().getIn(['date__gte']);

var filtersData = filters.filter(f => {
  return !f.ignore;
});
type propsType = {|
  filters: filtersType,
  loading: boolean,
  active: string,
  token: string,
  handleChange: (name: string, values?: filterType) => void,
  handleFocus: (name: string) => void,
  replaceFiltersState: (filters: filtersType) => void,
  handleToggleAll: (name: string, values?: filterType) => void
|};
class FiltersList extends React.PureComponent<void, propsType, *> {
  renderFilters = (f: Object, k: number) => {
    const propsToSend = {
      name: f.name,
      type: f.type,
      display: f.display,
      value: this.props.filters.get(f.name),
      placeholder: f.placeholder,
      options: f.options,
      onChange: this.props.handleChange,
      dataURL: f.data_url,
      min: f.min,
      max: f.max
    };
    const wrapperProps = {
      name: f.name,
      handleFocus: this.props.handleFocus,
      hasValue: this.props.filters.has(f.name),
      display: f.display,
      key: k,
      description: this.props.active === f.name && f.description
    };
    if (f.range && f.type === 'number') {
      const gteValue = this.props.filters.get(f.name + '__gte');
      const lteValue = this.props.filters.get(f.name + '__lte');
      return (
        <Wrapper
          {...wrapperProps}
          hasValue={
            this.props.filters.has(f.name + '__gte') ||
            this.props.filters.has(f.name + '__lte')
          }
        >
          <span className="flex-parent flex-parent--row">
            <Text
              {...propsToSend}
              className="mr3"
              name={f.name + '__gte'}
              value={gteValue}
              placeholder={'from'}
              max={lteValue && lteValue.getIn([0, 'value'])}
              min="0"
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
    if (!f.range && f.type === 'number') {
      return (
        <Wrapper {...wrapperProps}>
          <Text {...propsToSend} className="mr3" min={1} max={100} />
        </Wrapper>
      );
    }
    if (f.range && f.type === 'date') {
      let gteValue = this.props.filters.get(f.name + '__gte');
      if (f.name === 'date') {
        gteValue = this.props.filters.get(f.name + '__gte') || defaultDate;
      }
      const lteValue = this.props.filters.get(f.name + '__lte');
      const today = new Date();
      return (
        <Wrapper
          {...wrapperProps}
          hasValue={
            this.props.filters.has(f.name + '__gte') ||
            this.props.filters.has(f.name + '__lte')
          }
        >
          <span className="flex-parent flex-parent--row h36">
            <DateField
              {...propsToSend}
              name={f.name + '__gte'}
              value={gteValue}
              className="mr3"
              placeholder={'From'}
              max={(lteValue && lteValue.getIn([0, 'value'])) || today}
            />
            <DateField
              {...propsToSend}
              name={f.name + '__lte'}
              value={lteValue}
              className="ml3"
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
          hasValue={f.metaOf.find(fi => this.props.filters.has(fi))}
        >
          <Meta
            {...propsToSend}
            replaceFiltersState={this.props.replaceFiltersState}
            metaOf={f.metaOf}
            activeFilters={this.props.filters}
          />
        </Wrapper>
      );
    }
    if (f.type === 'text_comma') {
      let { name, value, onChange } = propsToSend;
      if (f.all) {
        onChange = this.props.handleToggleAll;
      }
      if (f.all && this.props.filters.has(`all_${f.name}`)) {
        name = `all_${f.name}`;
        value = this.props.filters.get(name);
      }

      return (
        <Wrapper
          {...wrapperProps}
          name={name}
          hasValue={this.props.filters.has(name)}
          description={this.props.active === f.name && f.description}
        >
          {name.endsWith('_teams') ? (
            <MappingTeamMultiSelect
              {...propsToSend}
              name={name}
              value={value}
              onChange={onChange}
              showAllToggle={f.all}
              token={this.props.token}
            />
          ) : (
            <MultiSelect
              {...propsToSend}
              name={name}
              value={value}
              onChange={onChange}
              showAllToggle={f.all}
              token={this.props.token}
            />
          )}
        </Wrapper>
      );
    }
  };

  render() {
    return (
      <div className="px30 flex-child filters-scroll">
        <h2 className="txt-xl mr6 txt-bold mt24 border-b border--gray-light border--1">
          Basic
        </h2>
        {filtersData
          .slice(0, 2)
          .map((f: Object, k) => this.renderFilters(f, k))}
        <Wrapper
          name="location"
          display="Location"
          hasValue={
            this.props.filters.has('geometry') ||
            this.props.filters.has('in_bbox')
          }
          handleFocus={this.props.handleFocus}
          description={
            this.props.active === 'location' &&
            'Filter changesets whose bounding box intersects a chosen area'
          }
        >
          <LocationSelect
            name="location"
            value={
              this.props.filters.get('geometry') ||
              this.props.filters.get('in_bbox')
            }
            placeholder="Type a place name"
            onChange={this.props.handleChange}
          />
        </Wrapper>
        {filtersData
          .slice(2, 3)
          .map((f: Object, k) => this.renderFilters(f, k))}
        <h2 className="txt-xl mr6 txt-bold mt30  border-b border--gray-light border--1">
          OSM Features
        </h2>
        {filtersData
          .slice(3, 4)
          .map((f: Object, k) => this.renderFilters(f, k))}
        <span className="flex-child flex-child--grow wmin420 wmax435" />
        <h2 className="txt-xl mr6 txt-bold mt30  border-b border--gray-light border--1">
          Flags
        </h2>
        {filtersData
          .slice(4, 6)
          .map((f: Object, k) => this.renderFilters(f, k))}
        <span className="flex-child flex-child--grow wmin420 wmax435" />

        <h2 className="txt-xl mr6 txt-bold mt30  border-b border--gray-light border--1">
          Review
        </h2>
        {filtersData
          .slice(6, 10)
          .map((f: Object, k) => this.renderFilters(f, k))}
        <span className="flex-child flex-child--grow wmin420 wmax435" />

        <h2 className="txt-xl mr6 txt-bold mt30  border-b border--gray-light border--1">
          Users & Teams
        </h2>
        {filtersData
          .slice(10, 17)
          .map((f: Object, k) => this.renderFilters(f, k))}
        <span className="flex-child flex-child--grow wmin420 wmax435" />

        <h2 className="txt-xl mr6 txt-bold mt30  border-b border--gray-light border--1">
          Changeset Details
        </h2>
        {filtersData.slice(17).map((f: Object, k) => this.renderFilters(f, k))}
        <span className="flex-child flex-child--grow wmin420 wmax435" />
      </div>
    );
  }
}
FiltersList = loadingEnhancer(FiltersList);
export { FiltersList };
