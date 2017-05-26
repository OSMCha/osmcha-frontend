// @flow
import React from 'react';
import { List as ImmutableList, Map } from 'immutable';
import R from 'ramda';
import { Row } from './row';
import { elementInViewport } from '../../utils/element_in_view';
import { PageRange } from './page_range';
import { Loading } from '../loading';
const RANGE = 6;

export class List extends React.PureComponent {
  props: {
    data: ImmutableList<Map<string, *>>,
    getChangeset: number => any,
    activeChangesetId: ?number,
    cachedChangesets: Map<string, *>,
    getChangesetsPage: number => mixed, // base 0
    pageIndex: number,
    loading: boolean
  };
  shouldComponentUpdate(nextProps: Object) {
    return (
      nextProps.loading !== this.props.loading ||
      nextProps.activeChangesetId !== this.props.activeChangesetId ||
      nextProps.data !== this.props.data
    );
  }
  handleScroll = (r: HTMLElement) => {
    if (!r) return;
    if (!elementInViewport(r)) {
      r.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
  };
  render() {
    const base = parseInt(this.props.pageIndex / RANGE, 10) * RANGE;
    console.log('render');
    return (
      <div>
        <ul
          className="flex-parent flex-parent--column scroll-auto"
          style={{ height: window.innerHeight - 55 * 3 }}
        >
          {this.props.loading
            ? <Loading />
            : this.props.data.map((f, k) => (
                <Row
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
        </ul>
        <footer className="p12 pb24 border-t border--gray-light bg-gray-faint txt-s flex-parent justify--space-around bottom relative">
          <PageRange
            page={'<'}
            pageIndex={this.props.pageIndex - 1}
            getChangesetsPage={this.props.getChangesetsPage}
          />
          {R.range(base, base + RANGE).map(n => (
            <PageRange
              key={n}
              page={n}
              pageIndex={n}
              active={n === this.props.pageIndex}
              getChangesetsPage={this.props.getChangesetsPage}
            />
          ))}
          <PageRange
            page={'>'}
            pageIndex={this.props.pageIndex + 1}
            getChangesetsPage={this.props.getChangesetsPage}
          />
        </footer>
      </div>
    );
  }
}
