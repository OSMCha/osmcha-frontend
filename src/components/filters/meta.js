// @flow
import React from 'react';
import { Map, fromJS } from 'immutable';
import Select from 'react-select';
import type { filtersType } from './';

export class Meta extends React.PureComponent {
  options: Array<*>;
  props: {
    placeholder: string,
    name: string,
    activeFilters: filtersType,
    metaOf: Array<string>,
    options: Array<Object>,
    replaceFiltersState: filtersType => void
  };
  handleChange = (data: Object) => {
    let { activeFilters } = this.props;
    if (!activeFilters) activeFilters = new Map();
    this.props.metaOf.forEach(f => {
      activeFilters = activeFilters.delete(f);
    });
    if (data && data.value) {
      activeFilters = activeFilters.merge(fromJS(data.value));
    }
    this.props.replaceFiltersState(activeFilters);
  };
  findCurrentValue = () => {
    const { activeFilters } = this.props;
    let value;
    if (activeFilters) {
      activeFilters.forEach((v, k) => {
        this.props.options.forEach(option => {
          if (
            Object.keys(option.value)[0] === k &&
            v.getIn([0, 'value']) === option.value[k][0].value
          ) {
            value = option;
          }
        });
      });
    }
    return value;
  };
  render() {
    const { name, placeholder } = this.props;
    let value = this.findCurrentValue();
    return (
      <Select
        className="react-select"
        name={name}
        value={value} // always takes 1st item array to keep things consistent with multiselect InputTypes
        options={this.props.options}
        placeholder={placeholder}
        onChange={this.handleChange}
        isClearable={true}
      />
    );
  }
}
