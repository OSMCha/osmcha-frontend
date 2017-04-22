// @flow
import React from 'react';
import {Link} from 'react-router-dom';
import {List as ImmutableList, Map} from 'immutable';
import {Tooltip} from 'react-tippy';

class ListItem extends React.PureComponent {
  render() {
    return (
      <Tooltip
        title="Welcome to React"
        position="right"
        arrow
        animation="perspective"
        html={
          <div className="flex-parent flex-parent--column">
            <span className="flex-child txt-bold txt-l">
              Changeset: {this.props.id}
            </span>
            <span className="flex-child">
              by
              {' '}
              <span className="txt-em">
                {this.props.properties.get('user')}
              </span>
            </span>
            <span className="flex-child">
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
          <ListItem
            key={k}
            id={f.get('id')}
            properties={f.get('properties')}
            active={f.get('id') === this.props.activeChangesetId}
            fetchChangeset={this.props.fetchChangeset}
            isBold={!this.props.cachedChangesets.has(f.get('id'))}
          />
        ))}
      </ul>
    );
  }
}
