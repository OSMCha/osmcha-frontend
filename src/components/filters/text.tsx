import React from "react";
import type { filterType } from "./";

interface TextProps {
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

interface TextState {
  isValid: boolean;
}

export class Text extends React.Component<TextProps, TextState> {
  static defaultProps = {
    className: "",
  };
  state: TextState = {
    isValid: true,
  };
  handleFormChange = (event: any) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({ isValid: target.validity.valid });
    if (!value || value === "") {
      return this.props.onChange(name);
    }
    this.props.onChange(name, [
      {
        label: value,
        value,
      },
    ]);
  };
  render() {
    const { name, type, placeholder, display, value, className, min, max } =
      this.props;
    const { isValid } = this.state;
    const errorClass = "border border--1 border--red";
    return (
      <input
        name={name}
        className={`input ${className} ${isValid ? "" : errorClass}`}
        value={value?.[0]?.value || ""}
        onChange={this.handleFormChange}
        type={type}
        placeholder={placeholder || display}
        min={min ?? undefined}
        max={max ?? undefined}
      />
    );
  }
}
