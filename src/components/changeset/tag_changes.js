// @flow
import React from 'react';
import { Map } from 'immutable';
import { selectFeature } from '../../views/map';

function FeatureListItem(props) {
  return (
    <li>
      <span className="pointer " onClick={() => selectFeature(props.id)}>
        {props.id}
      </span>
    </li>
  );
}

export class ChangeItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      opened: false
    };
    this.tag = props.tag;
    this.value = props.features;
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange() {
    this.setState({ opened: !this.state.opened });
  }
  render() {
    return (
      <div>
        <h7 className="cmap-sub-heading pointer" onClick={this.handleChange}>
          {this.state.opened ? '▼' : '▶'}
          {this.tag}
        </h7>
        <ul
          className="cmap-vlist"
          style={{ display: this.state.opened ? 'block' : 'none' }}
        >
          {Array.from(this.value).map((id, k) => (
            <FeatureListItem id={id} key={k} />
          ))}
        </ul>
      </div>
    );
  }
}

export class TagChanges extends React.PureComponent {
  constructor(props) {
    super(props);
    this.tags = document.querySelector('.cmap-filter-changes-section');
    this.state = { data: [] };
  }
  componentDidMount() {
    this.data = [];
    if (this.tags) {
      for (let n of this.tags.children[1].children) {
        var item = {};
        item.name = n.children[0].textContent.slice(1);
        item.features = new Set();
        for (let id of n.children[1].children) {
          item.features.add(id.textContent);
        }
        this.data.push(item);
      }
      console.log(this.data);
    }
    this.setState({ data: this.data });
  }

  render() {
    return (
      <div className="px12 py6">
        <h2 className="txt-m txt-uppercase txt-bold mr6 mb3">Tag changes</h2>
        {this.tags ? this.state.data.length ? (
          this.state.data.map((item, key) => (
            <ChangeItem tag={item.name} features={item.features} key={key} />
          ))
        ) : (
          <span>No tags were changed in this changeset.</span>
        ) : (
          <div>
            Wait for the page to finish loading and click again on this tab.
          </div>
        )}
      </div>
    );
  }
}
