// @flow
import React from 'react';
import { Wrapper } from './wrapper';
import { List, fromJS, Map } from 'immutable';
import type { InputType } from './';

export class Text extends React.PureComponent {
  props: {
    name: string,
    display: string,
    type: string,
    placeholder: string,
    value: List<InputType>,
    className: string,
    onChange: (string, ?List<InputType>) => any
  };
  static defaultProps = {
    className: ''
  };
  handleFormChange = (event: any) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    if (!value || value === '') {
      return this.props.onChange(name, null);
    }
    this.props.onChange(
      name,
      fromJS([
        // allways sends 1 size array to keep things consistent
        {
          label: value,
          value
        }
      ])
    );
  };
  render() {
    const {
      name,
      onChange,
      type,
      placeholder,
      display,
      value,
      className
    } = this.props;
    return (
      <input
        name={name}
        className={`input ${className}`}
        value={(value && value.getIn([0, 'value'])) || ''} // allways sends 1 size array to keep things consistent
        onChange={this.handleFormChange}
        type={type}
        placeholder={placeholder || display}
      />
    );
  }
}
