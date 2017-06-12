// @flow
import React from 'react';
import { List, fromJS, Map } from 'immutable';
import { Creatable, Async } from 'react-select';
import { Wrapper } from './wrapper';
import type { InputType } from './';
import { API_URL } from '../../config';

export class MultiSelect extends React.PureComponent {
  props: {
    name: string,
    display: string,
    value: List<InputType>,
    type: string,
    placeholder: string,
    options: Array<Object>,
    dataURL: ?string,
    onChange: (string, List<InputType>) => any
  };
  getAsyncOptions = () => {
    if (!this.props.dataURL) return;
    return fetch(`${API_URL}/${this.props.dataURL}/`)
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
  onChangeLocal = (data: ?Array<Object>) => {
    if (!Array.isArray(data)) return;
    if (data.length === 0) return this.props.onChange(this.props.name, null);
    var processed = data.map(o => ({ label: o.label, value: o.value })); // remove any bogus keys
    this.props.onChange(this.props.name, fromJS(processed));
  };
  render() {
    const { name, options, placeholder, value, display, dataURL } = this.props;
    if (dataURL)
      return (
        <Async
          multi
          promptTextCreator={label => `Add ${label} to ${display}`}
          name={name}
          className=""
          value={value && value.toJS()}
          loadOptions={this.getAsyncOptions}
          onChange={this.onChangeLocal} // have to add an identifier for filter name
          placeholder={placeholder}
        />
      );
    return (
      <Creatable
        multi
        promptTextCreator={label => `Add ${label} to ${display}`}
        name={name}
        value={value && value.toJS()}
        options={options}
        onChange={this.onChangeLocal}
        placeholder={placeholder}
      />
    );
  }
}

//  options={
//             name === 'users' || name === 'checked_by'
//               ? this.props.usersAutofill
//               : []
//           }
