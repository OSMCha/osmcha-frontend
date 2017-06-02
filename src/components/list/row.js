// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { Map } from 'immutable';

import { SecondaryLine } from './secondary_line';
import { PrimaryLine } from './primary_line';
import { Title } from './title';

export class Row extends React.PureComponent {
  props: {
    properties: Map<string, *>,
    active: ?boolean,
    changesetId: number,
    inputRef: ?(any) => any
  };
  shouldComponentUpdate(nextProps: Object) {
    return (
      nextProps.properties !== this.props.properties ||
      this.props.active ||
      nextProps.active
    );
  }
  wasOpen = false;
  render() {
    const { properties, changesetId, active, inputRef, ...other } = this.props;
    if (!this.wasOpen) {
      // way to show read/unread state without
      // performance compromise. The moment component
      // gets active we set wasOpen to true and never
      // toggle it back to any other state.
      this.wasOpen = this.props.active;
    }

    let borderClass = 'border-l border-color-neutral';
    if (properties.get('harmful') === true)
      borderClass = 'border-l border-color-bad';
    if (properties.get('harmful') === false)
      borderClass = 'border-l border-color-good';

    let backgroundClass = '';
    backgroundClass = active ? 'light-blue' : 'light-blue-on-hover';
    backgroundClass += this.wasOpen ? ' bg-darken5' : '';

    return (
      <Link to={`/changesets/${changesetId}`}>
        <div
          className={`${backgroundClass} ${borderClass} transition`}
          ref={inputRef}
        >
          <div
            {...other}
            className={
              'ml12 cursor-pointer flex-parent flex-parent--column border-b py6 border-b--1 border--gray-light'
            }
          >
            <div className="flex-parent flex-parent--column">
              <div>
                <Title properties={properties} wasOpen={this.wasOpen} />
              </div>
              <div>
                <PrimaryLine
                  reasons={properties.get('reasons')}
                  comment={properties.get('comment')}
                />
              </div>
              <div>
                <SecondaryLine
                  changesetId={changesetId}
                  date={properties.get('date')}
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }
}
