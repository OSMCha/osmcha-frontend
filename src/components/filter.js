// @flow
import React from 'react';
// import { Tooltip } from 'react-tippy';
import Select, { Creatable, Async } from 'react-select';
import { List } from 'immutable';
import { API_URL } from '../config';
import { Dropdown } from './dropdown';
export class Filter extends React.PureComponent {
  props: {
    data: Object,
    value: ?List<any>,
    onChange: () => any,
    onSelectChange: (string, Object) => any,
    usersAutofill: ?Array<Object>
  };
  static defaultProps = {
    value: new List()
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
        <Select
          name={name}
          value={this.props.value}
          options={options}
          placeholder={placeholder}
          className=""
          onChange={this.onSelectChange} // have to add an identifier for filter name
        />
      );
    }
    if (type === 'text_comma' && data_url) {
      return (
        <Async
          multi
          promptTextCreator={label => `Add ${label} to ${display}`}
          name={name}
          className=""
          value={this.props.value.toJS()}
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
          className=""
          value={this.props.value.toJS()}
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
  };
  render() {
    return (
      <div className="ml3 my12  flex-parent flex-parent--column">
        <span className="flex-parent flex-parent--row flex-parent--center-cross">
          <span className="txt-bold txt-truncate pointer">
            {this.props.data.display}:&nbsp;
          </span>
        </span>
        <span>{this.showForm()}</span>
      </div>
    );
  }
}
