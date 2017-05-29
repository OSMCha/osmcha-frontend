// @flow
import React from 'react';
import { Tooltip } from 'react-tippy';

export class Filter extends React.PureComponent {
  props: {
    data: Object,
    value: ?string,
    onChange: () => any
  };
  showForm = () => {
    const {
      display,
      placeholder,
      type,
      icontains,
      name,
      range,
      all
    } = this.props.data;
    if (type === 'text' || type === 'text_comma') {
      return (
        <input
          name={name}
          value={this.props.value}
          onChange={this.props.onChange}
          type={type}
          className="input wmin300 wmax300"
          placeholder={placeholder || display}
        />
      );
    }
    if (range) {
      return (
        <span className="flex-parent flex-parent--row  wmin300 wmax300">
          <input
            type={type}
            value={this.props.value}
            onChange={this.props.onChange}
            className="input mr3"
            name={`${name}__gte`}
            placeholder="min"
          />
          {' '}
          <input
            value={this.props.value}
            onChange={this.props.onChange}
            type={type}
            className="input"
            name={`${name}__lte`}
            placeholder="max"
          />
          {' '}
        </span>
      );
    }
  };
  render() {
    return (
      <div className="wmin435 wmax435 ml3 my12 flex-parent flex-parent--row">
        <span className="flex-child flex-child--grow">&nbsp;</span>
        <span className="flex-parent flex-parent--row flex-parent--center-cross">
          <span className="txt-bold txt-truncate">
            {this.props.data.display}:
          </span>
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
    );
  }
}
