// @flow
import React from 'react';
import { List, fromJS } from 'immutable';
import moment from 'moment';
import type { InputType } from './';
import type Moment from 'moment';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export class Date extends React.Component {
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
  handleDateChange = (momentObj: ?Moment) => {
    const value = momentObj ? momentObj.format('YYYY-MM-DD') : null;
    const name = this.props.name;
    if (value) {
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
    } else {
      this.props.onChange(name, null);
    }
  };
  render() {
    const { placeholder, display, value, className, min, max } = this.props;
    const hasValue = value && value.getIn([0, 'value']);
    return (
      <DatePicker
        className={`input ${className}`}
        dateFormat="DD/MM/YYYY"
        isClearable={true}
        selected={hasValue ? moment(value.getIn([0, 'value'])) : null}
        placeholderText={placeholder || display}
        onChange={this.handleDateChange}
        minDate={min && moment(min)}
        maxDate={max && moment(max)}
      />
    );
  }
}
