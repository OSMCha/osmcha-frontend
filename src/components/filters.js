import React from 'react';
import filters from '../config/filters.json';
import {Tooltip} from 'react-tippy';

class Filter extends React.PureComponent {
  showForm = () => {
    const {display, type, icontains, name, range, all} = this.props.data;
    if (type === 'string') {
      return <input className="input wmin240 wmax300" placeholder={display} />;
    }
  };
  render() {
    return (
      <div className="flex-child my6">
        <div
          className="flex-parent flex-parent--row justify--space-between align-items--center"
        >

          <span className="flex-parent flex-parent--row">
            {this.props.data.display}
            {' '}
            <Tooltip
              position="top"
              theme="osmcha"
              arrow
              animation="fade"
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
    console.log(filters);
    return (
      <div className="flex-parent flex-parent--column scroll-auto px18 mt12">
        {filters.map((f, k) => <Filter data={f} key={k} />)}
      </div>
    );
  }
}
