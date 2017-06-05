// @flow
import React from 'react';
import { Map } from 'immutable';
import moment from 'moment';

type Props = {
  discussions: List<*>,
  changesetId: number
};

type State = {
  discussions: Array<Object>
};

export class Discussions extends React.PureComponent<void, Props, State> {
  render() {
    return (
      <div className="p18">
        <h2 className="txt-l mr6 txt-bold">
          Discussions
        </h2>
        <div className="">
          {this.props.discussions.map((f, k) => (
            <div
              key={k}
              className="flex-parent flex-parent--column justify--space-between border border--gray-light round p6 my6 mt12"
            >
              <div className="flex-parent flex-parent--row justify--space-between txt-s ">
                <span>
                  By <span className="txt-bold">{f.get('userName')}&nbsp;</span>
                </span>
                <span>{moment(f.get('date')).fromNow()}</span>
              </div>

              <div className="flex-parent flex-parent--column mt6">
                <p>
                  {f.get('comment')}
                </p>
              </div>

            </div>
          ))}
          {this.props.discussions.size === 0 &&
            `No discussions for ${this.props.changesetId}.`}
        </div>
      </div>
    );
  }
}
