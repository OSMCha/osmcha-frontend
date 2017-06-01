// @flow
import React from 'react';
import { Async } from 'react-select-plus';
import { API_URL } from '../config';

export class Tags extends React.PureComponent {
  props: {
    changesetId: number,
    disabled: boolean,
    currentChangeset: Map<string, *>
  };
  getAsyncOptions = () => {
    return fetch(`${API_URL}/tags/`)
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
  onSelectChange = data => {
    console.log(data);
  };
  render() {
    const { changesetId } = this.props;
    return (
      <Async
        multi
        disabled={this.props.disabled}
        promptTextCreator={label => `Add ${label} to ${changesetId}`}
        className={`wmin240 wmax240 ${this.props.disabled ? 'cursor-notallowed' : ''}`}
        loadOptions={this.getAsyncOptions}
        onChange={this.onSelectChange} // have to add an identifier for filter name
        placeholder="Add tags to this changeset"
      />
    );
  }
}
