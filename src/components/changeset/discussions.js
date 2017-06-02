// @flow
import React from 'react';
import { Map } from 'immutable';
import moment from 'moment';

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
      <div className="p18">
        <h2 className="txt-l mr6 txt-bold">
          Discussions
        </h2>
        <div className="">
          {this.state.discussions.map((f, k) => (
            <div
              key={k}
              className="flex-parent flex-parent--column justify--space-between border border--gray-light round p6 my6 mt12"
            >
              <div className="flex-parent flex-parent--row justify--space-between txt-s ">
                <span>
                  By <span className="txt-bold">{f.userName}&nbsp;</span>
                </span>
                <span>{moment(f.date).fromNow()}</span>
              </div>

              <div className="flex-parent flex-parent--column mt6">
                <p>
                  {f.comment}
                </p>
              </div>

            </div>
          ))}
          {this.state.discussions.length === 0 &&
            `No discussions for ${this.props.changesetId}.`}
        </div>
      </div>
    );
  }
}
