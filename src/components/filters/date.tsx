import { format, parse } from "date-fns";
import { fromJS } from "immutable";
import React from "react";
import DatePicker from "react-datepicker";
import type { filterType } from "./";

import "react-datepicker/dist/react-datepicker.css";

interface DateFieldProps {
  name: string;
  display: string;
  type: string;
  placeholder: string;
  value: filterType;
  className: string;
  onChange: (a: string, value?: filterType) => any;
  min: string | undefined | null;
  max: string | undefined | null;
}

export class DateField extends React.Component<DateFieldProps> {
  static defaultProps = {
    className: "",
  };
  handleDateChange = (date) => {
    const name = this.props.name;
    if (date) {
      const value = format(date, "yyyy-MM-dd");
      this.props.onChange(
        name,
        fromJS([
          // allways sends 1 size array to keep things consistent
          {
            label: value,
            value,
          },
        ]),
      );
    } else {
      this.props.onChange(name);
    }
  };
  render() {
    const { placeholder, display, value, className, min, max } = this.props;
    const hasValue = value && value.getIn([0, "value"]);
    return (
      <DatePicker
        className={`input ${className}`}
        isClearable={true}
        selected={
          hasValue
            ? parse(value.getIn([0, "value"]), "yyyy-MM-dd", new Date())
            : null
        }
        placeholderText={placeholder || display}
        onChange={this.handleDateChange}
        dateFormat="yyyy-MM-dd"
        minDate={min && Date.parse(min)}
        maxDate={max && Date.parse(max)}
      />
    );
  }
}
