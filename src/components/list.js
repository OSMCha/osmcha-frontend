// @flow
import React from 'react';
import {Link} from 'react-router-dom';
import {List as ImmutableList, Map} from 'immutable';
import {Tooltip} from 'react-tippy';
import {ListItemMulti} from './list_item_multi_row';
import moment from 'moment';

class LisstItem extends React.PureComponent {
  render() {
    return (
      <Tooltip
        position="right"
        theme="osmcha"
        interactive
        delay={500}
        arrow
        animation="perspective"
        html={
          <div
            className="flex-parent flex-parent--column color-gray align-items--start"
          >
            <span className="flex-child txt-bold txt-l">
              Changeset: {this.props.id}
            </span>
            {this.props.properties.get('reasons').size > 0
              ? <span className="flex-child txt-em mb6 px6 txt-underline">
                  {this.props.properties.get('reasons').join(', ')}
                </span>
              : null}
            <span className="flex-child">
              by
              {' '}
              <span className="txt-em">
                {this.props.properties.get('user')}
              </span>
            </span>
            <span className="flex-child align-items--start txt-truncate">
              using <span className="txt-em">
                {this.props.properties.get('editor')}
                /
                {this.props.properties.get('source')}
              </span>
            </span>
            <span className="flex-child txt-em my6">
              "{this.props.properties.get('comment')}"
            </span>
            <span className="flex-child">
              Created:
              {' '}
              <span className="txt-em">
                {this.props.properties.get('create')}
              </span>
              , Modified:
              {' '}
              <span className="txt-em">
                {this.props.properties.get('modify')}
              </span>
              , Deleted:
              {' '}
              <span className="txt-em">
                {this.props.properties.get('delete')}
              </span>
            </span>
          </div>
        }
        className={
          ` ${this.props.active ? 'bg-green-faint' : ''} transition flex-parent p12 flex-parent--center-cross justify--space-between transition bg-gray-light-on-hover h36 border-b border--gray-light border--1`
        }
      >
        <Link
          className={
            `
            flex-child
            ${this.props.isBold ? 'txt-bold' : ''}
            `
          }
          to={`/changesets/${this.props.id}`}
        >
          {this.props.id}
        </Link>
        <div className="flex-child w96 wmin96">
          <div
            className="bg-green-faint mr3 color-green inline-block px6 py3 txt-xs txt-bold round-full"
          >
            {this.props.properties.get('create')}
          </div>
          <div
            className="bg-orange-faint mr3 color-orange inline-block px6 py3 txt-xs txt-bold round-full"
          >
            {this.props.properties.get('modify')}
          </div>
          <div
            className="bg-red-faint mr3 color-red inline-block px6 py3 txt-xs txt-bold round-full"
          >
            {this.props.properties.get('delete')}
          </div>
        </div>
      </Tooltip>
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
export class List extends React.PureComponent {
  props: {
    data: ImmutableList<Map<string, *>>,
    fetchChangeset: (number) => any,
    activeChangesetId: ?number,
    cachedChangesets: Map<string, *>,
  };
  render() {
    return (
      <ul className="flex-parent flex-parent--column">
        {this.props.data.map((f, k) => (
          <Link to={`/changesets/${f.get('id')}`}>
            <ListItemMulti
              onClick={() => console.log('clicked')}
              active={f.get('id') === this.props.activeChangesetId}
              title={
                <span
                  className="flex-parent flex-parent--row flex-parent--center-cross flex-parent--wrap"
                >
                  <span className="txt-m txt-bold mt3 mr6">
                    {f.get('properties').get('user')}
                  </span>
                  <span>
                    {f.get('properties').get('reasons').map((r, k) => (
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
                    create={f.get('properties').get('create')}
                    modify={f.get('properties').get('modify')}
                    delete={f.get('properties').get('delete')}
                  />
                </span>
              }
              minor={
                <span className="flex-parent flex-parent--row txt-light txt-s">
                  <span>
                    Changeset {f.get('id')} created &nbsp;
                  </span>
                  <span>
                    {moment(f.get('properties').get('date')).fromNow()}
                  </span>
                </span>
              }
              secondary={
                <span className="flex-parent flex-parent--column">
                  <p className="flex-child truncate-2-lines my3 txt-em">
                    {f.get('properties').get('comment')}
                  </p>
                </span>
              }
              key={k}
              right={<div />}
            />
          </Link>
        ))}
      </ul>
    );
  }
}
