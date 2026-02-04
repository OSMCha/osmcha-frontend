import React from "react";
import Select from "react-select";
import type { Filters } from "./";

interface MetaProps {
  placeholder: string;
  name: string;
  activeFilters: Filters;
  metaOf: Array<string>;
  options: Array<any>;
  replaceFiltersState: (a: Filters) => void;
}

export class Meta extends React.PureComponent<MetaProps> {
  handleChange = (data: any) => {
    let activeFilters = { ...this.props.activeFilters };
    if (!activeFilters) activeFilters = {};

    for (const f of this.props.metaOf) {
      delete activeFilters[f];
    }

    if (data?.value) {
      activeFilters = { ...activeFilters, ...data.value };
    }

    this.props.replaceFiltersState(activeFilters);
  };

  findCurrentValue = () => {
    const { activeFilters } = this.props;
    if (!activeFilters) return null;

    for (const [k, v] of Object.entries(activeFilters)) {
      for (const option of this.props.options) {
        if (
          v &&
          Object.keys(option.value)[0] === k &&
          v?.[0]?.value === option.value[k][0].value
        ) {
          return option;
        }
      }
    }
    return null;
  };

  render() {
    const { name, placeholder } = this.props;
    const value = this.findCurrentValue();
    return (
      <Select
        className="react-select"
        name={name}
        value={value}
        options={this.props.options}
        placeholder={placeholder}
        onChange={this.handleChange}
        isClearable={true}
      />
    );
  }
}
