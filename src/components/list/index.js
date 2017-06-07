// @flow
import React from 'react';
import { List as ImmutableList, Map } from 'immutable';
import R from 'ramda';
import { Row } from './row';
import { elementInViewport } from '../../utils/element_in_view';
import { Loading } from '../loading';

export class List extends React.PureComponent {
  props: {
    currentPage: ?Map<string, *>,
    getChangeset: number => any,
    activeChangesetId: ?number,
    cachedChangesets: Map<string, *>,
    pageIndex: number,
    loading: boolean,
    reloadPage: () => any
  };
  shouldComponentUpdate(nextProps: Object) {
    return (
      nextProps.loading !== this.props.loading ||
      nextProps.activeChangesetId !== this.props.activeChangesetId ||
      nextProps.currentPage !== this.props.currentPage
    );
  }
  handleScroll = (r: HTMLElement) => {
    if (!r) return;
    if (!elementInViewport(r)) {
      r.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
  };
  // TOFIX on invalid token handle error
  render() {
    return (
      <ul className="flex-parent flex-parent--column scroll-auto flex-child--grow">
        {!this.props.currentPage || this.props.loading
          ? <Loading />
          : <div>
              <span className="border-l border-b border-b--1 border-l--4 border-color-neutral px12 py3 bg-gray-faint flex-child flex-child--grow align-items--center">
                <span className="flex-parent flex-parent--row justify--space-between color-gray txt-s txt-bold">
                  <span>Results: {this.props.currentPage.get('count')}</span>
                  <span onClick={this.props.reloadPage}>
                    <svg className="icon inline-block align-middle pointer">
                      <use xlinkHref="#icon-rotate" />
                    </svg>
                  </span>
                </span>
              </span>
              {this.props.currentPage.get('features').map((f, k) =>
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
              )}
            </div>}
      </ul>
    );
  }
}
