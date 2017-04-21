// @flow
import React from 'react';
import {Link} from 'react-router-dom';
import {List as ImmutableList, Map} from 'immutable';
class ListItem extends React.PureComponent {
  render() {
    return (
      <div
        className={
          ` ${this.props.active ? 'bg-green-faint' : ''} transition flex-parent p12 flex-parent--center-cross transition bg-gray-light-on-hover h36 border-b border--gray-light border--1`
        }
      >
        <Link
          className={
            `
            flex-child
            ${this.props.isBold ? 'txt-bold' : ''}
            `
          }
          to={`/changesets/${this.props.id}`}
        >
          {this.props.id}
        </Link>
      </div>
    );
  }
}
export class List extends React.PureComponent {
  props: {
    data: ImmutableList<Map<string, *>>,
    fetchChangeset: (number) => any,
    activeChangesetId: ?number,
    cachedChangesets: Map<string, *>,
  };
  render() {
    return (
      <ul className="flex-parent flex-parent--column">
        {this.props.data.map((f, k) => (
          <ListItem
            key={k}
            id={f.get('id')}
            active={f.get('id') === this.props.activeChangesetId}
            fetchChangeset={this.props.fetchChangeset}
            isBold={!this.props.cachedChangesets.has(f.get('id'))}
          />
        ))}
      </ul>
    );
  }
}
