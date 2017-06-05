// @flow
import React from 'react';
import { Async } from 'react-select';
import { API_URL } from '../../config';
import { Map, Set, fromJS } from 'immutable';
import { Dropdown } from '../dropdown';

// TOFIX This whole code is a complete shit
// please rewrite it asap.
export class Tags extends React.PureComponent {
  props: {
    changesetId: number,
    disabled: boolean,
    currentChangeset: Map<string, *>,
    handleChangesetModifyTag: (number, Map<string, *>, Object, boolean) => mixed
  };
  state: {
    options: Array<any>,
    allTags: Array<any>
  };
  state = {
    allTags: {},
    options: []
  };
  componentDidMount() {
    this.getAsyncOptions();
  }
  getAsyncOptions = () => {
    return fetch(`${API_URL}/tags/`)
      .then(response => {
        return response.json();
      })
      .then(json => {
        let data = {};
        let selectData = json.filter(d => d.is_visible && d.for_changeset);

        selectData.forEach(d => {
          data[d.name] = { ...d, value: d.id, label: d.name };
        });
        this.setState({
          allTags: data,
          options: selectData.map(d => ({ label: d.name, value: d.id }))
        });
      });
  };
  onAdd = (obj: Object) => {
    if (!obj) return;
    const {
      changesetId,
      currentChangeset,
      handleChangesetModifyTag
    } = this.props;
    handleChangesetModifyTag(changesetId, currentChangeset, obj, false);
  };
  onRemove = (obj: Object) => {
    if (!obj) return;
    const {
      changesetId,
      currentChangeset,
      handleChangesetModifyTag
    } = this.props;
    handleChangesetModifyTag(changesetId, currentChangeset, obj, true);
  };

  render() {
    if (!this.props.currentChangeset) return null;
    const value = this.props.currentChangeset
      .getIn(['properties', 'tags'])
      .toJS()
      .map(t => ({
        value: t.id,
        label: t.name
      }));
    if (this.state.options) {
      return (
        <Dropdown
          multi
          onAdd={this.onAdd}
          onRemove={this.onRemove}
          disabled={this.props.disabled}
          className={`${this.props.disabled ? 'cursor-notallowed' : ''}`}
          value={value}
          options={this.state.options}
          onChange={() => {}}
          display={`Tags${value.length > 0 ? ` (${value.length})` : ''}`}
        />
      );
    } else {
      return null;
    }
  }
}
