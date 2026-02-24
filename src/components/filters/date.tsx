import React from "react";
import DatePicker from "react-datepicker";
import type { Filter } from "./index.ts";

import "react-datepicker/dist/react-datepicker.css";

interface DateFieldProps {
  name: string;
  display: string;
  type: string;
  placeholder: string;
  value: Filter;
  className: string;
  onChange: (a: string, value?: Filter) => any;
  min?: Date;
  max?: Date;
}

// Parse a stored UTC timestamp to a local Date for display.
export function parseStoredDate(value?: string): Date | null {
  if (!value) return null;
  let s = value.trim().replace(" ", "T");
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    s += "T00:00:00Z";
  } else if (
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s) &&
    !s.endsWith("Z") &&
    !/[+-]\d{2}:\d{2}$/.test(s)
  ) {
    // Has time but no timezone indicator — treat as UTC (old format).
    s += "Z";
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

export class DateField extends React.Component<DateFieldProps> {
  static defaultProps = {
    className: "",
  };

  handleDateChange = (date: Date | null) => {
    const name = this.props.name;
    if (date) {
      const value = date.toISOString();
      this.props.onChange(name, [{ label: value, value }]);
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
            ? parseStoredDate(dateValue)
            : null
        }
        placeholderText={placeholder || display}
        onChange={this.handleDateChange}
        dateFormat="yyyy-MM-dd"
        minDate={min}
        maxDate={max}
      />
    );
  }
}
