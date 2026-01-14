import React from "react";
import Select from "react-select";
import type { filtersType } from "./";

interface MetaProps {
  placeholder: string;
  name: string;
  activeFilters: filtersType;
  metaOf: Array<string>;
  options: Array<any>;
  replaceFiltersState: (a: filtersType) => void;
}

export class Meta extends React.PureComponent<MetaProps> {
  handleChange = (data: any) => {
    let activeFilters = { ...this.props.activeFilters };
    if (!activeFilters) activeFilters = {};

    this.props.metaOf.forEach((f) => {
      delete activeFilters[f];
    });

    if (data && data.value) {
      activeFilters = { ...activeFilters, ...data.value };
    }

    this.props.replaceFiltersState(activeFilters);
  };

  findCurrentValue = () => {
    const { activeFilters } = this.props;
    let value;
    if (activeFilters) {
      Object.entries(activeFilters).forEach(([k, v]) => {
        this.props.options.forEach((option) => {
          if (
            v &&
            Object.keys(option.value)[0] === k &&
            v?.[0]?.value === option.value[k][0].value
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
