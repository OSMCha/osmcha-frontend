// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { Map } from 'immutable';

import { SecondaryLine } from './secondary_line';
import { PrimaryLine } from './primary_line';
import { Title } from './title';
import { history } from '../../store/history';
import { BASE_PATH } from '../../config'

export class Row extends React.Component {
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

    let borderClass = 'border-l border-l--4 border-color-neutral';
    if (properties.get('harmful') === true)
      borderClass = 'border-l border-l--4 border-color-bad';
    if (properties.get('harmful') === false)
      borderClass = 'border-l border-l--4 border-color-good';

    let backgroundClass = '';

    backgroundClass += active ? 'light-blue' : this.wasOpen ? 'bg-darken5' : '';
    return (
      <div
        onClick={() =>
          history.push({
            search: window.location.search,
            pathname: `${BASE_PATH}/changesets/${changesetId}`
          })
        }
      >
        <div className={`${backgroundClass} ${borderClass}`} ref={inputRef}>
          <div
            {...other}
            className="p12 cursor-pointer flex-parent flex-parent--column border-b border-b--1 border--gray-light flex-parent flex-parent--column"
          >
            <Link
              to={{
                search: window.location.search,
                pathname: `${BASE_PATH}/changesets/${changesetId}`
              }}
            >
              <Title
                properties={properties}
                wasOpen={this.wasOpen}
                date={properties.get('date')}
              />
              <PrimaryLine
                reasons={properties.get('reasons')}
                tags={properties.get('tags')}
                comment={properties.get('comment')}
              />
            </Link>
            <SecondaryLine
              changesetId={changesetId}
              properties={properties}
              date={properties.get('date')}
            />
          </div>
        </div>
      </div>
    );
  }
}
