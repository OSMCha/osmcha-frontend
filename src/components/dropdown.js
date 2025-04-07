// @flow
import React from 'react';
import './dropdown.css';
import onClickOutside from 'react-click-outside';
import { Button } from './button';

class DropdownContent extends React.PureComponent {
  isActive = (obj: Object) => {
    if (!this.props.value) return false;

    for (let v of this.props.value) {
      if (v.label === obj.label) {
        return true;
      }
    }
    return false;
  };

  handleClick = (data: Object) => {
    if (data) {
      var label = data.label;
      if (!label || !this.props.value || !this.props.onChange) return;
      const value = this.props.value;
      let ourObj = data;
      if (!ourObj) return;

      let isRemove = false;
      for (let x = 0; x < value.length; x++) {
        if (value[x].label === label) {
          isRemove = true;
          this.props.onRemove(ourObj);
          this.props.onChange(value.slice(0, x).concat(value.slice(x + 1)));
        }
      }

      if (!isRemove) {
        let newArray = value.slice(0, value.length);
        if (!this.props.multi) {
          newArray = [];
        }
        newArray.push(ourObj);
        this.props.onAdd(ourObj);
        this.props.onChange(newArray);
      }
    }
    if (!this.props.multi) {
      this.props.toggleDropdown();
    }
  };

  render() {
    return (
      <ul
        className="dropdown-content wmin96 round wmax240"
        style={this.props.styles}
      >
        {this.props.options.map((i, k) => (
          <li
            key={k}
            onClick={this.handleClick.bind(null, i)}
            className="dropdown-content-item flex-parent flex-parent--row flex-parent--center-cross py6 px12"
          >
            {this.props.multi && (
              <input
                data-label={i.label}
                data-payload={JSON.stringify(i)}
                type="checkbox"
                checked={this.isActive(i)}
                value={i.label}
                className="cursor-pointer mt6"
              />
            )}
            {i.href ? (
              <a
                target={'_blank'}
                rel="noopener noreferrer"
                href={i.href}
                onClick={this.props.toggleDropdown}
                className={`txt-nowrap flex-child--grow cursor-pointer color-gray ${
                  this.isActive(i) ? 'is-active txt-bold' : ''
                }`}
              >
                {i.label}
              </a>
            ) : (
              <span
                onClick={
                  this.props.multi ? () => {} : this.props.toggleDropdown
                }
                className={`txt-nowrap flex-child--grow cursor-pointer color-gray ${
                  this.isActive(i) ? 'is-active txt-bold' : ''
                }`}
              >
                {i.label}
              </span>
            )}
            {this.props.deletable && (
              <span
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  this.props.toggleDropdown();
                  this.props.deletable(i.value);
                }}
              >
                x
              </span>
            )}
          </li>
        ))}
      </ul>
    );
  }
}

export class _Dropdown extends React.PureComponent {
  props: {
    className: string,
    disabled: boolean,
    value: Array<Object>,
    onChange: (Array<Object>) => any,
    onAdd: (?Object) => any,
    onRemove: (?Object) => any,
    options: Array<Object>,
    display: string,
    deletable?: (value: string) => any,
    multi: boolean,
    position: string
  };

  state = {
    display: false
  };

  handleClickOutside = () => {
    this.setState({
      display: false
    });
  };

  toggleDropdown = () => {
    this.setState({
      display: !this.state.display
    });
  };

  isActive = (obj: Object) => {
    for (let v of this.props.value) {
      if (v.label === obj.label) {
        return true;
      }
    }
    return false;
  };

  render() {
    return (
      <div className={`dropdown pointer ${this.props.className || ''}`}>
        <Button
          iconName="chevron-down"
          onClick={this.toggleDropdown}
          className="wmin96"
        >
          <span>{this.props.display}</span>
        </Button>
        {this.state.display && (
          <DropdownContent
            {...this.props}
            eventTypes={['click', 'touchend']}
            toggleDropdown={this.toggleDropdown}
            styles={
              this.props.position === 'right' ? { right: 0 } : { left: 0 }
            }
          />
        )}
      </div>
    );
  }
}

export const Dropdown = onClickOutside(_Dropdown);
