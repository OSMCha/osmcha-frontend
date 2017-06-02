// @flow
import React from 'react';
import { Tooltip } from 'react-tippy';
import Select, { Creatable, Async } from 'react-select';
import { API_URL } from '../config';
import { Dropdown } from './dropdown';

export class Filter extends React.PureComponent {
  props: {
    data: Object,
    value: ?string | Object,
    onChange: () => any,
    onSelectChange: (string, Object) => any,
    usersAutofill: ?Array<Object>
  };
  onSelectChange = (value: Object) => {
    if (!this.props.data.name) return;
    this.props.onSelectChange(this.props.data.name, value);
  };
  getAsyncOptions = () => {
    return fetch(`${API_URL}/${this.props.data.data_url}/`)
      .then(response => {
        return response.json();
      })
      .then(json => {
        const data = json
          .filter(d => d.is_visible && d.for_changeset)
          .map(d => ({ ...d, label: d.name, value: d.id }));
        return { options: data };
      });
  };
  showForm = () => {
    const {
      display,
      placeholder,
      type,
      icontains,
      name,
      range,
      all,
      options,
      data_url
    } = this.props.data;
    if (type === 'radio' && options) {
      return (
        <span className="flex-parent flex-parent--row">
          <Select
            name={name}
            value={this.props.value}
            options={options}
            placeholder={placeholder}
            className="wmin300 wmax300"
            onChange={this.onSelectChange} // have to add an identifier for filter name
          />
        </span>
      );
    }
    if (type === 'text_comma' && data_url) {
      return (
        <Async
          multi
          promptTextCreator={label => `Add ${label} to ${display}`}
          name={name}
          className="wmin300 wmax300"
          value={this.props.value}
          loadOptions={this.getAsyncOptions}
          onChange={this.onSelectChange} // have to add an identifier for filter name
          placeholder={placeholder}
        />
      );
    }
    if (type === 'text_comma') {
      return (
        <Creatable
          multi
          promptTextCreator={label => `Add ${label} to ${display}`}
          name={name}
          className="wmin300 wmax300"
          value={this.props.value}
          options={
            name === 'users' || name === 'checked_by'
              ? this.props.usersAutofill
              : []
          }
          onChange={this.onSelectChange} // have to add an identifier for filter name
          placeholder={placeholder}
        />
      );
    }

    if (type === 'text') {
      return (
        <input
          name={name}
          value={this.props.value || ''}
          onChange={this.props.onChange}
          type={type}
          className="input wmin300 wmax300"
          placeholder={placeholder || display}
        />
      );
    }
    if (range) {
      return (
        <span className="flex-parent flex-parent--row  wmin300 wmax300">
          <input
            type={type}
            onChange={this.props.onChange}
            className="input mr3"
            name={`${name}__gte`}
            placeholder="min"
            value={this.props.value.__gte}
          />
          {' '}
          <input
            onChange={this.props.onChange}
            type={type}
            className="input"
            value={this.props.value.__lte}
            name={`${name}__lte`}
            placeholder="max"
          />
          {' '}
        </span>
      );
    }
  };
  render() {
    return (
      <div className="wmin435 wmax435 ml3 my12 flex-parent flex-parent--row">
        <span className="flex-child flex-child--grow">&nbsp;</span>
        <span className="flex-parent flex-parent--row flex-parent--center-cross">
          <Tooltip
            position="top"
            animation="shift"
            animateFill
            delay={100}
            html={
              <span className="flex-child color-white">
                {this.props.data.description}
              </span>
            }
          >
            <span className="txt-bold txt-truncate pointer">
              {this.props.data.display}:&nbsp;
            </span>
          </Tooltip>
        </span>
        <span>{this.showForm()}</span>
      </div>
    );
  }
}
