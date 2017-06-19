// @flow
import React from 'react';
import { List } from 'immutable';
import moment from 'moment';

export class Discussions extends React.PureComponent {
  props: {
    discussions: List<*>,
    changesetId: number
  };
  render() {
    return (
      <div className="p18">
        <h2 className="txt-l mr6 txt-bold">
          Discussions
        </h2>
        <div className="">
          {this.props.discussions.map((f, k) =>
            <div
              key={k}
              className="flex-parent flex-parent--column justify--space-between border border--gray-light round p6 my6 mt12"
            >
              <div className="flex-parent flex-parent--row justify--space-between txt-s ">
                <span>
                  By <span className="txt-bold">{f.get('userName')}&nbsp;</span>
                </span>
                <span>{moment(f.get('timestamp')).fromNow()}</span>
              </div>
              <div className="flex-parent flex-parent--column mt6">
                <p>
                  {f.get('comment')}
                  <a
                    target="_blank"
                    title="Translate"
                    href={`http://translate.google.com/#auto/en/${encodeURIComponent(
                      f.get('comment')
                    )}`}
                    className="pointer"
                  >
                    <svg className="icon inline-block align-middle ">
                      <use xlinkHref="#icon-share" />
                    </svg>
                  </a>
                </p>
              </div>

            </div>
          )}
          {this.props.discussions.size === 0 &&
            `No discussions for ${this.props.changesetId}.`}
        </div>
      </div>
    );
  }
}
