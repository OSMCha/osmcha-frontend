// @flow
import React from 'react';
import {Link} from 'react-router-dom';
import {List as ImmutableList, Map} from 'immutable';
class ListItem extends React.PureComponent {
  render() {
    return (
      <Link
        className={`flex-child ${this.props.active ? 'color-red' : ''}`}
        to={`/changesets/${this.props.id}`}
      >
        {this.props.id}
      </Link>
    );
  }
}
export class List extends React.PureComponent {
  props: {
    changesets: ImmutableList<Map<string, *>>,
    fetchChangeset: (number) => any,
    activeChangesetId: ?number,
  };
  render() {
    return (
      <ul className="flex-parent flex-parent--column">
        {this.props.changesets.map((f, k) => (
          <ListItem
            key={k}
            id={f.get('id')}
            active={f.get('id') === this.props.activeChangesetId}
            fetchChangeset={this.props.fetchChangeset}
          />
        ))}
      </ul>
    );
  }
}
