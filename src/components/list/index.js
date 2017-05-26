// @flow
import React from 'react';
import { List as ImmutableList, Map } from 'immutable';
import R from 'ramda';
import { Row } from './row';
import { elementInViewport } from '../../utils/element_in_view';
import { PageRange } from './page_range';
import { Loading } from '../loading';

export class List extends React.PureComponent {
  props: {
    data: ImmutableList<Map<string, *>>,
    getChangeset: number => any,
    activeChangesetId: ?number,
    cachedChangesets: Map<string, *>,
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
    console.log('render');
    return (
      <ul className="flex-parent flex-parent--column scroll-auto">
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
    );
  }
}
