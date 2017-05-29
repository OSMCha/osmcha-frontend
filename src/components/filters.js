// @flow
import React from 'react';
import { Tooltip } from 'react-tippy';

import filters from '../config/filters.json';

class Filter extends React.PureComponent {
  props: {
    data: Object
  };
  showForm = () => {
    const { display, type, icontains, name, range, all } = this.props.data;
    if (type === 'text') {
      return (
        <input
          type={type}
          className="input wmin300 wmax300"
          placeholder={display}
        />
      );
    }
    if (range) {
      return (
        <span className="flex-parent flex-parent--row  wmin300 wmax300">
          <input type={type} className="input mr3" placeholder="min" />{' '}
          <input type={type} className="input" placeholder="max" />{' '}
        </span>
      );
    }
  };
  render() {
    return (
      <div className="flex-child my6">
        <div className="flex-parent flex-parent--row justify--space-between align-items--center">

          <span className="flex-parent flex-parent--row">
            {this.props.data.display}
            {' '}
            <Tooltip
              position="top"
              theme="osmcha"
              arrow
              animation="fade"
              delay={200}
              html={
                <span className="flex-child color-gray">
                  {this.props.data.description}
                </span>
              }
            >
              <svg className="icon icon--s mr3">
                <use xlinkHref="#icon-question" />
              </svg>
            </Tooltip>
          </span>
          <span>{this.showForm()}</span>
        </div>
      </div>
    );
  }
}

export class Filters extends React.PureComponent {
  render() {
    return (
      <div className="flex-parent flex-parent--column scroll-auto px18 mt12">
        {filters.map((f, k) => <Filter data={f} key={k} />)}
      </div>
    );
  }
}
