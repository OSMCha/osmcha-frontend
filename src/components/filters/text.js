// @flow
import React from 'react';
import { Wrapper } from './wrapper';
import { List, fromJS, Map } from 'immutable';
import type { InputType } from './';

export class Text extends React.Component {
  props: {
    name: string,
    display: string,
    type: string,
    placeholder: string,
    value: List<InputType>,
    className: string,
    disabled: ?boolean,
    onChange: (string, ?List<InputType>) => any,
    min: ?string,
    max: ?string
  };
  static defaultProps = {
    className: ''
  };
  state = {
    isValid: true
  };
  handleFormChange = (event: any) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({ isValid: target.validity.valid });
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
      className,
      disabled,
      min,
      max
    } = this.props;
    const { isValid } = this.state;
    const errorClass = 'border border--1 border--red';
    return (
      <input
        name={name}
        disabled={disabled}
        className={`input ${className} ${isValid ? '' : errorClass}`}
        value={(value && value.getIn([0, 'value'])) || ''} // allways sends 1 size array to keep things consistent
        onChange={this.handleFormChange}
        type={type}
        placeholder={placeholder || display}
        min={min}
        max={max}
      />
    );
  }
}
