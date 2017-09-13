// @flow
import React from 'react';
import { fromJS } from 'immutable';
import type { filterType } from './';

export class Text extends React.Component {
  props: {
    name: string,
    display: string,
    type: string,
    placeholder: string,
    value: filterType,
    className: string,
    onChange: (string, value?: filterType) => any,
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
      return this.props.onChange(name);
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
      type,
      placeholder,
      display,
      value,
      className,
      min,
      max
    } = this.props;
    const { isValid } = this.state;
    const errorClass = 'border border--1 border--red';
    return (
      <input
        name={name}
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
