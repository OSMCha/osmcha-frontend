// @flow
import React from 'react';

export class List extends React.PureComponent {
  props: {
    changesets: Array<Object>,
  };
  render() {
    return (
      <div>
        {this.props.changesets.map((f, k) => <div key={k}>{f.id}</div>)}
      </div>
    );
  }
}
