import React from "react";
import Select from "react-select";
import type { Filter } from "./index.ts";

interface RadioProps {
  name: string;
  display: string;
  type: string;
  placeholder: string;
  options: Array<any>;
  value: Filter;
  onChange: (a: string, value?: Filter) => any;
}

export class Radio extends React.PureComponent<RadioProps> {
  onChangeLocal = (data: any) => {
    if (!data || data.value === "") {
      return this.props.onChange(this.props.name);
    }
    this.props.onChange(this.props.name, [data]);
  };

  render() {
    const { name, options, placeholder, value } = this.props;
    return (
      <Select
        className="react-select"
        name={name}
        value={value?.[0] || null}
        options={options}
        placeholder={placeholder}
        onChange={this.onChangeLocal}
        isClearable
      />
    );
  }
}
