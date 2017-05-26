// @flow
import React from 'react';
import { Map } from 'immutable';

type Props = {
  properties: Map<string, *>,
  changesetId: number
};

type State = {
  discussions: Array<Object>
};

export class Discussions extends React.PureComponent<void, Props, State> {
  state = {
    discussions: []
  };
  constructor(props: Props) {
    super(props);
    this.getData(props.changesetId);
  }
  getData = (changesetId: number) => {
    fetch(
      `https://osm-comments-api.mapbox.com/api/v1/changesets/${changesetId}`
    )
      .then(r => r.json())
      .then(x => {
        if (x && x.properties && Array.isArray(x.properties.comments)) {
          this.setState({
            discussions: x.properties.comments
          });
        }
      });
  };
  componentWillReceiveProps(nextProps: Props) {
    this.getData(nextProps.changesetId);
  }
  render() {
    return (
      <div className="p12">
        <h2 className="txt-l mr6 txt-bold">
          Discussions
        </h2>
        <div className="ml6">
          {this.state.discussions.map((f, k) => (
            <div
              key={k}
              className="flex-parent flex-parent--row justify--space-between border-b border--gray-light pb3"
            >
              <span className="wmin96 txt-em">{f.userName}&nbsp; -</span>
              <span className="wmin240 txt-break-word">
                {f.comment}
              </span>
            </div>
          ))}
          {this.state.discussions.length === 0 &&
            `Nobody discussed for poor ${this.props.changesetId}`}
        </div>
      </div>
    );
  }
}
