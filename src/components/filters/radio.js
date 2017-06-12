// @flow
import React from 'react';
import Select, { Creatable, Async } from 'react-select';
import { Wrapper } from './wrapper';
import { List, fromJS, Map } from 'immutable';
import type { InputType } from './';

export class Radio extends React.PureComponent {
  props: {
    name: string,
    display: string,
    type: string,
    placeholder: string,
    options: Array<Object>,
    value: List<InputType>,
    onChange: (string, ?List<InputType>) => any
  };
  onChangeLocal = (data: Object) => {
    if (!data || data.value === '') {
      return this.props.onChange(this.props.name, null); // always sends 1 size array to keep things consistent with multiselect InputTypes
    }
    this.props.onChange(this.props.name, fromJS([data])); // always sends 1 size array to keep things consistent with multiselect InputTypes
  };
  render() {
    const { name, options, placeholder, value } = this.props;
    return (
      <Select
        name={name}
        value={value && value.get(0) && value.get(0).toJS()} // always takes 1st item array to keep things consistent with multiselect InputTypes
        options={options}
        placeholder={placeholder}
        className=""
        onChange={this.onChangeLocal}
      />
    );
  }
}
