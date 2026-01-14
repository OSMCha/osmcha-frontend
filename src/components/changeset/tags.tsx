import { Map as ImmutableMap } from "immutable";
import React from "react";
import { API_URL } from "../../config";
import { cancelablePromise } from "../../utils/promise";
import { Dropdown } from "../dropdown";

// TOFIX Needs cleanup.

interface TagsProps {
  changesetId: number;
  disabled: boolean;
  currentChangeset: ImmutableMap<string, any>;
  handleChangesetModifyTag: (
    d: number,
    c: ImmutableMap<string, any>,
    b: any,
    a: boolean,
  ) => unknown;
}

interface TagsState {
  options: Array<any>;
  allTags: any;
}

let cacheTagsData;
export class Tags extends React.PureComponent<TagsProps, TagsState> {
  state: TagsState = {
    allTags: {},
    options: [],
  };

  tagsData = cacheTagsData;

  componentDidMount() {
    this.getAsyncOptions();
  }

  getAsyncOptions = () => {
    if (!this.tagsData) {
      this.tagsData = cancelablePromise(
        fetch(`${API_URL}/tags/`).then((response) => {
          return response.json();
        }),
      );
    }

    return this.tagsData.promise
      .then((json) => {
        const data = {};
        const selectData = json.results.filter(
          (d) => d.is_visible && d.for_changeset,
        );

        selectData.forEach((d) => {
          data[d.name] = { ...d, value: d.id, label: d.name };
        });
        this.setState({
          allTags: data,
          options: selectData.map((d) => ({ label: d.name, value: d.id })),
        });
      })
      .catch((e) => {});
  };

  componentWillUnmount() {
    if (this.tagsData) {
      cacheTagsData = this.tagsData;
      this.tagsData.cancel();
    }
  }

  onAdd = (obj: any) => {
    if (!obj) return;
    const { changesetId, currentChangeset, handleChangesetModifyTag } =
      this.props;
    handleChangesetModifyTag(changesetId, currentChangeset, obj, false);
  };

  onRemove = (obj: any) => {
    if (!obj) return;
    const { changesetId, currentChangeset, handleChangesetModifyTag } =
      this.props;
    handleChangesetModifyTag(changesetId, currentChangeset, obj, true);
  };

  defaultValue = ImmutableMap();

  render() {
    if (!this.props.currentChangeset) return null;

    const value = this.props.currentChangeset
      .getIn(["properties", "tags"], this.defaultValue)
      .toJS()
      .map((t) => ({
        value: t.id,
        label: t.name,
      }));

    if (this.state.options) {
      return (
        <Dropdown
          eventTypes={["click", "touchend"]}
          multi
          onAdd={this.onAdd}
          onRemove={this.onRemove}
          disabled={this.props.disabled}
          className={`${
            this.props.disabled ? "cursor-notallowed" : ""
          } flex-parent mr3`}
          value={value}
          options={this.state.options}
          onChange={() => {}}
          display={`Tags${value.length > 0 ? ` (${value.length})` : ""}`}
          position="right"
        />
      );
    } else {
      return null;
    }
  }
}
