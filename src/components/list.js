// @flow
import React from 'react';
import {Link} from 'react-router-dom';
import {List as ImmutableList, Map} from 'immutable';
import {Tooltip} from 'react-tippy';
import R from 'ramda';
import moment from 'moment';
import {ListItemMulti} from './list_item_multi_row';
import {elementInViewport} from '../utils/element_in_view';
const RANGE = 6;
class RangeItem extends React.PureComponent {
  render() {
    return (
      <button
        onClick={this._onClick}
        disabled={this.props.page === '<' && this.props.pageIndex === -1}
        className={
          `flex-child btn btn--s  color-gray-dark 
          ${this.props.active ? 'is-active bg-gray-light' : 'bg-gray-faint'}
          `
        }
      >
        {this.props.page}
      </button>
    );
  }
  _onClick = () => {
    this.props.fetchChangesetsPage(this.props.pageIndex);
  };
}

export class List extends React.PureComponent {
  props: {
    data: ImmutableList<Map<string, *>>,
    fetchChangeset: (number) => any,
    activeChangesetId: ?number,
    cachedChangesets: Map<string, *>,
    fetchChangesetsPage: (number) => mixed, // base 0
    pageIndex: number,
  };
  shouldComponentUpdate(nextProps: Object) {
    return nextProps.activeChangesetId !== this.props.activeChangesetId ||
      nextProps.data !== this.props.data;
  }
  handleScroll = (r: HTMLElement) => {
    if (!r) return;
    if (!elementInViewport(r)) {
      r.scrollIntoView({block: 'end', behavior: 'smooth'});
    }
  };
  render() {
    const base = parseInt(this.props.pageIndex / RANGE, 10) * RANGE;
    return (
      <ul className="flex-parent flex-parent--column">
        {this.props.data.map((f, k) => (
          <ListItemMulti
            active={f.get('id') === this.props.activeChangesetId}
            properties={f.get('properties')}
            changesetId={f.get('id')}
            inputRef={
              f.get('id') === this.props.activeChangesetId // only saves the ref of currently active changesetId
                ? this.handleScroll
                : null
            }
            key={k}
          />
        ))}
        <footer
          className="p12 pb24 bg-gray-faint txt-s flex-parent justify--space-around"
        >
          <RangeItem
            page={'<'}
            pageIndex={this.props.pageIndex - 1}
            fetchChangesetsPage={this.props.fetchChangesetsPage}
          />
          {R.range(base, base + RANGE).map(n => (
            <RangeItem
              key={n}
              page={n}
              pageIndex={n}
              active={n === this.props.pageIndex}
              fetchChangesetsPage={this.props.fetchChangesetsPage}
            />
          ))}
          <RangeItem
            page={'>'}
            pageIndex={this.props.pageIndex + 1}
            fetchChangesetsPage={this.props.fetchChangesetsPage}
          />
        </footer>
      </ul>
    );
  }
}
