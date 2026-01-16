import { format, parse } from "date-fns";
import React from "react";
import DatePicker from "react-datepicker";
import type { Filter } from "./";

import "react-datepicker/dist/react-datepicker.css";

interface DateFieldProps {
  name: string;
  display: string;
  type: string;
  placeholder: string;
  value: Filter;
  className: string;
  onChange: (a: string, value?: Filter) => any;
  min?: string;
  max?: string;
}

export class DateField extends React.Component<DateFieldProps> {
  static defaultProps = {
    className: "",
  };
  handleDateChange = (date: Date | null) => {
    const name = this.props.name;
    if (date) {
      const value = format(date, "yyyy-MM-dd");
      this.props.onChange(name, [
        {
          label: value,
          value,
        },
      ]);
    } else {
      this.props.onChange(name);
    }
  };
  render() {
    const { placeholder, display, value, className, min, max } = this.props;
    const dateValue = value?.[0]?.value;
    return (
      <DatePicker
        className={`input ${className}`}
        isClearable={true}
        selected={
          dateValue && typeof dateValue === "string"
            ? parse(dateValue, "yyyy-MM-dd", new Date())
            : null
        }
        placeholderText={placeholder || display}
        onChange={this.handleDateChange}
        dateFormat="yyyy-MM-dd"
        minDate={min ? new Date(min) : undefined}
        maxDate={max ? new Date(max) : undefined}
      />
    );
  }
}
