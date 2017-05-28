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
    console.log('rendering', this.props.changesetId);
    const { properties, changesetId, active, inputRef, ...other } = this.props;
    if (!this.wasOpen) {
      // way to show read/unread state without
      // performance compromise. The moment component
      // gets active we set wasOpen to true and never
      // toggle it back to any other state.
      this.wasOpen = this.props.active;
    }
    return (
      <Link to={`/changesets/${changesetId}`}>
        <div
          className={`${active ? 'bg-green-faint bg-green-faint-on-hover' : ' bg-gray-faint-on-hover '} transition`}
          ref={inputRef}
        >
          <div
            {...other}
            className={
              'ml12 cursor-pointer flex-parent flex-parent--row justify--space-between border-b py6 border-b--1 border--gray-light'
            }
          >
            <div className="flex-parent flex-parent--row">
              <div className="txt-mono">{this.wasOpen ? '\u00a0' : '•'}</div>
              <div className="flex-parent flex-parent--column">
                <div>
                  <Title properties={properties} wasOpen={this.wasOpen} />
                </div>
                <div>
                  <PrimaryLine comment={properties.get('comment')} />
                </div>
                <div>
                  <SecondaryLine
                    changesetId={changesetId}
                    date={properties.get('date')}
                  />
                </div>
              </div>
            </div>
            <div />
          </div>
        </div>
      </Link>
    );
  }
}
