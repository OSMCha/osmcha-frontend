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
    handleChangesetModifyTag: (number, Map<string, *>, number, boolean) => mixed
  };
  state: {
    selectedTags: Array<any>,
    allTags: Array<any>
  };
  state = {
    allTags: {},
    selectedTags: []
  };
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
          allTags: data
        });
        return {
          options: selectData.map(d => ({ label: d.name, value: d.name }))
        };
      });
  };
  onSelectChange = (data: Array<any>) => {
    const {
      changesetId,
      currentChangeset,
      handleChangesetModifyTag
    } = this.props;
    data = data.map(d => ({ value: d.value, label: d.label }));
    var newTags = Set(fromJS(data));
    var oldTags = Set(
      fromJS(
        this.props.currentChangeset
          .getIn(['properties', 'tags'])
          .toJS()
          .map(t => ({ label: t, value: t }))
      )
    );
    newTags.subtract(oldTags).forEach(t => {
      handleChangesetModifyTag(
        changesetId,
        currentChangeset,
        this.state.allTags[t.toJS().label],
        false
      );
    });
    oldTags.subtract(newTags).forEach(t => {
      handleChangesetModifyTag(
        changesetId,
        currentChangeset,
        this.state.allTags[t.toJS().label],
        true
      );
    });
  };
  render() {
    if (!this.props.currentChangeset) return null;
    return (
      <Dropdown
        multi
        disabled={this.props.disabled}
        className={`${this.props.disabled ? 'cursor-notallowed' : ''}`}
        value={this.props.currentChangeset
          .getIn(['properties', 'tags'])
          .toJS()
          .map(t => ({ label: t, value: t }))}
        loadOptions={this.getAsyncOptions}
        onChange={this.onSelectChange}
        display="Tags"
      />
    );
  }
}
