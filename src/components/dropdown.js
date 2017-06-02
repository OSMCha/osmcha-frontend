// @flow
import React from 'react';
import './dropdown.css';
export class Dropdown extends React.PureComponent {
  props: {
    className: ?string,
    disabled: boolean,
    loadOptions: () => Promise<any>,
    value: Array<Object>,
    onChange: () => any,
    options: ?Array<Object>,
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
  componentDidMount() {
    this.setAsyncOptions(this.props.loadOptions);
  }
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
        <span key={k} onClick={this.handleClick} className="cursor-pointer">
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
            className={`${this.isActive(i) ? 'is-active color-red' : ''}`}
            data-label={i.label}
            data-payload={JSON.stringify(i)}
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
      var label = e.target.getAttribute('data-label');
      if (!this.props.value || !this.props.onChange) return;
      const propsValue = this.props.value.slice(0).filter(x => x);
      var valueClone;
      for (let x = 0; x < propsValue.length; x++) {
        if (propsValue[x].label === label) {
          valueClone = propsValue
            .slice(0, x)
            .concat(propsValue.slice(x + 1, propsValue.length))
            .filter(x => x);

          return this.props.onChange(valueClone);
        }
      }
      valueClone = propsValue.slice(0);
      if (valueClone.length === 0) {
        return this.props.onChange([
          JSON.parse(e.target.getAttribute('data-payload'))
        ]);
      }
      valueClone.push(JSON.parse(e.target.getAttribute('data-payload')));

      return this.props.onChange(valueClone.filter(x => x));
    }
  };
  render() {
    return (
      <div className="dropdown">
        <button
          className={`${this.props.className} btn btn--s round color-gray btn--gray-faint`}
          onClick={this.toggleDropdown}
        >
          {this.props.display}
        </button>
        <div
          className="dropdown-content"
          style={{ display: this.state.display }}
        >
          {this.renderOptions(this.props.options || this.state.loadedOptions)}
        </div>
      </div>
    );
  }
}
