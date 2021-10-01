// @flow
import React from 'react';
import { API_URL } from '../../config';
import { Map } from 'immutable';
import { Dropdown } from '../dropdown';
import { cancelablePromise } from '../../utils/promise';

// TOFIX Needs cleanup.

let cacheTagsData;
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
  tagsData = cacheTagsData;
  componentDidMount() {
    this.getAsyncOptions();
  }
  getAsyncOptions = () => {
    if (!this.tagsData) {
      this.tagsData = cancelablePromise(
        fetch(`${API_URL}/tags/`).then(response => {
          return response.json();
        })
      );
    }
    return this.tagsData.promise
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
      })
      .catch(e => {});
  };
  componentWillUnmount() {
    if (this.tagsData) {
      cacheTagsData = this.tagsData;
      this.tagsData.cancel();
    }
  }
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
  defaultValue = new Map();
  render() {
    if (!this.props.currentChangeset) return null;

    const value = this.props.currentChangeset
      .getIn(['properties', 'tags'], this.defaultValue)
      .toJS()
      .map(t => ({
        value: t.id,
        label: t.name
      }));

    if (this.state.options) {
      return (
        <Dropdown
          eventTypes={['click', 'touchend']}
          multi
          onAdd={this.onAdd}
          onRemove={this.onRemove}
          disabled={this.props.disabled}
          className={`${this.props.disabled ? 'cursor-notallowed' : ''}`}
          value={value}
          options={this.state.options}
          onChange={() => {}}
          display={`Tags${value.length > 0 ? ` (${value.length})` : ''}`}
          position="right"
        />
      );
    } else {
      return null;
    }
  }
}
