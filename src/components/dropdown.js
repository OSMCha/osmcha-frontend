// @flow
import React from 'react';
import './dropdown.css';
export class Dropdown extends React.PureComponent {
  props: {
    className: ?string,
    disabled: boolean,
    value: Array<Object>,
    onChange: () => any,
    onAdd: (?Object) => any,
    onRemove: (?Object) => any,
    options: Array<Object>,
    display: string,
    multi: boolean
  };

  state = {
    display: 'none',
    loadedOptions: null
  };

  optionsActiveState = {};

  toggleDropdown = () => {
    this.setState({
      display: this.state.display === 'none' ? 'block' : 'none'
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
  renderOptions = data => {
    if (data) {
      return data.map((i, k) => (
        <span key={k} onClick={this.handleClick}>
          {this.props.multi &&
            <input
              data-label={i.label}
              data-payload={JSON.stringify(i)}
              type="checkbox"
              checked={this.isActive(i)}
              value={i.label}
              className="cursor-pointer"
            />}
          <a
            target={i.href ? '_black' : '_self'}
            href={i.href || '#'}
            className={`cursor-pointer ${this.isActive(i) ? 'is-active color-red' : ''}`}
          >
            {i.label}
          </a>
        </span>
      ));
    }
  };
  setAsyncOptions = promFunc => {
    if (promFunc) {
      promFunc().then(data => {
        this.setState({
          loadedOptions: data.options
        });
      });
    }
  };
  handleClick = (e: Event) => {
    if (e.target) {
      var label = e.target.value || e.target.text;
      if (!label || !this.props.value || !this.props.onChange) return;
      const options = this.props.options;
      const value = this.props.value;
      let ourObj: Object;
      for (let x = 0; x < options.length; x++) {
        if (options[x].label === label) {
          ourObj = options[x];
        }
      }
      if (!ourObj) return;
      let isRemove = false;
      for (let x = 0; x < value.length; x++) {
        if (value[x].label === label) {
          isRemove = true;
          this.props.onRemove(ourObj);
          this.props.onChange(
            value.slice(0, x).concat(value.slice(x + 1, value.length))
          );
        }
      }
      if (!isRemove) {
        const newArray = value.slice(0, value.length);
        newArray.push(ourObj);
        this.props.onAdd(ourObj);
        this.props.onChange(newArray);
      }
    }
  };
  render() {
    return (
      <div className="dropdown">
        <button
          className={`${this.props.className} btn btn--pill btn--s mr3`}
          onClick={this.toggleDropdown}
        >
          {this.props.display}
        </button>
        <div
          className="dropdown-content"
          style={{ display: this.state.display }}
        >
          {this.renderOptions(this.props.options)}
        </div>
      </div>
    );
  }
}
