import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-click-outside';

class DropdownContent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.isActive = obj => {
      for (let v of this.props.value) {
        if (v.label === obj.label) {
          return true;
        }
      }
      return false;
    };

    this.handleClick = data => {
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
  }

  render() {
    return (
      <ul className="cmap-dropdown-content">
        {this.props.options.map((i, k) => (
          <li
            className="cmap-dropdown-content-item"
            key={k}
            onClick={this.handleClick.bind(null, i)}
          >
            {this.props.multi && (
              <input
                data-label={i.label}
                data-payload={JSON.stringify(i)}
                type="checkbox"
                checked={this.isActive(i)}
                value={i.label}
              />
            )}
            {i.href ? (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={i.href}
                onClick={this.props.toggleDropdown}
                className={`${this.isActive(i) ? 'is-active' : ''}`}
              >
                {i.label}
              </a>
            ) : (
              <a
                onClick={this.props.toggleDropdown}
                className={`${this.isActive(i) ? 'is-active' : ''}`}
              >
                {i.label}
              </a>
            )}
            {this.props.deletable && (
              <a
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  this.props.toggleDropdown();
                  this.props.deletable(i.value);
                }}
              >
                x
              </a>
            )}
          </li>
        ))}
      </ul>
    );
  }
}

DropdownContent.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.array,
  onChange: PropTypes.func,
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
  toggleDropdown: PropTypes.func,
  options: PropTypes.array,
  display: PropTypes.string,
  deletable: PropTypes.func,
  multi: PropTypes.bool
};

DropdownContent.defaultProps = {
  value: [],
  onAdd: () => {},
  onRemove: () => {}
};

export class _Dropdown extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      display: false
    };
    this.handleClickOutside = () => {
      this.setState({
        display: false
      });
    };
    this.toggleDropdown = () => {
      this.setState({
        display: !this.state.display
      });
    };

    this.isActive = obj => {
      for (let v of this.props.value) {
        if (v.label === obj.label) {
          return true;
        }
      }
      return false;
    };
  }

  render() {
    return (
      <div className={`cmap-dropdown ${this.props.className || ''}`}>
        <button className="cmap-dropbtn" onClick={this.toggleDropdown}>
          <span>{this.props.display}</span>
          <span className="cmap-dropdown-icon" />
        </button>
        {this.state.display && (
          <DropdownContent
            {...this.props}
            toggleDropdown={this.toggleDropdown}
          />
        )}
      </div>
    );
  }
}

_Dropdown.propTypes = {
  className: PropTypes.string,
  value: PropTypes.array,
  display: PropTypes.string
};

export const Dropdown = onClickOutside(_Dropdown);
