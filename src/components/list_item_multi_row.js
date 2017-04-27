// @flow
import React, {Element} from 'react';
import moment from 'moment';
import {Tooltip} from 'react-tippy';
import {Link} from 'react-router-dom';
import {Map} from 'immutable';
export class ListItemMulti extends React.PureComponent {
  props: {
    properties: Map<string, *>,
    active: ?boolean,
    changesetId: number,
  };
  shouldComponentUpdate(nextProps: Object) {
    return nextProps.changesetId !== this.props.changesetId ||
      this.props.active ||
      nextProps.active;
  }
  wasOpen = false;
  render() {
    const {
      properties,
      changesetId,
      active,
      ...other
    } = this.props;

    // way to show read/unread state without
    // performance issue. The moment component
    // gets active we set wasOpen to true and never
    // toggle it back to any other state.
    if (!this.wasOpen) {
      this.wasOpen = this.props.active;
    }
    return (
      <Link to={`/changesets/${changesetId}`}>
        <div
          className={
            `${active ? 'bg-green-faint bg-green-faint-on-hover' : ' bg-gray-faint-on-hover '} transition`
          }
        >
          <div
            {...other}
            className={
              `ml12 cursor-pointer flex-parent flex-parent--row justify--space-between border-b py6 border-b--1 border--gray-light`
            }
          >
            <div className="flex-parent flex-parent--row">
              <div className="txt-mono">{this.wasOpen ? '\u00a0' : '•'}</div>
              <div className="flex-parent flex-parent--column">
                <div>
                  <ChangesetListTitle
                    properties={properties}
                    wasOpen={this.wasOpen}
                  />
                </div>
                <div>
                  <ChangesetListComment comment={properties.get('comment')} />
                </div>
                <div>
                  <ChangesetListMinorDetails
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
function CDM(props) {
  return (
    <div
      className={
        `flex-parent flex-parent--row flex-parent--wrap ${props.className}`
      }
    >
      {props.create > 0 &&
        <Tooltip
          position="bottom"
          theme="osmcha"
          delay={300}
          arrow
          className="flex-child"
          html={<span className="color-gray">Number of objects Created</span>}
          animation="perspective"
        >
          <div
            className="bg-green-faint mr3 color-green inline-block px6 py3 txt-xs txt-bold round-full"
          >
            {props.create}
          </div>
        </Tooltip>}
      {props.modify > 0 &&
        <Tooltip
          position="bottom"
          theme="osmcha"
          delay={300}
          arrow
          className="flex-child"
          html={<span className="color-gray">Number of objects Modified</span>}
          animation="perspective"
        >
          <div
            className="bg-orange-faint mr3 color-orange inline-block px6 py3 txt-xs txt-bold round-full"
          >
            {props.modify}
          </div>{' '}
        </Tooltip>}
      {props.delete > 0 &&
        <Tooltip
          position="bottom"
          theme="osmcha"
          delay={300}
          arrow
          className="flex-child"
          html={<span className="color-gray">Number of objects Deleted</span>}
          animation="perspective"
        >
          <div
            className="bg-red-faint color-red inline-block px6 py3 txt-xs txt-bold round-full"
          >
            {props.delete}
          </div>{' '}
        </Tooltip>}
    </div>
  );
}
function ChangesetListTitle({properties, wasOpen}) {
  return (
    <span
      className="flex-parent flex-parent--row flex-parent--center-cross flex-parent--wrap"
    >
      <span className={`txt-m ${wasOpen ? '' : 'txt-bold'} mt3 mr6`}>
        {properties.get('user')}
      </span>
      <span>
        {properties.get('reasons').map((r, k) => (
          <div
            key={k}
            className="bg-blue-faint mr3 color-blue inline-block px6 py3 txt-xs txt-bold round-full"
          >
            {r}
          </div>
        ))}
      </span>
      <CDM
        className="mr3"
        create={properties.get('create')}
        modify={properties.get('modify')}
        delete={properties.get('delete')}
      />
    </span>
  );
}
function ChangesetListMinorDetails({changesetId, date}) {
  return (
    <span className="flex-parent flex-parent--row txt-light txt-s">
      <span>
        Changeset {changesetId} created &nbsp;
      </span>
      <span>
        {moment().fromNow()}
      </span>
    </span>
  );
}
function ChangesetListComment({comment}) {
  return (
    <span className="flex-parent flex-parent--column">
      <p className="flex-child truncate-2-lines my3 txt-em">
        {comment}
      </p>
    </span>
  );
}
