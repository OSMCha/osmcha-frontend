// @flow
import React from 'react';
import {connect} from 'react-redux';
import {fetchChangesets} from '../store/changesets_actions';
import R from 'ramda';
import {PAGE_SIZE} from '../config/constants';

class RangeItem extends React.PureComponent {
  render() {
    console.log(this.props);
    return (
      <button
        onClick={this._onClick}
        className={`btn btn--s ${this.props.active ? 'is-active' : ''}`}
      >
        {this.props.page}
      </button>
    );
  }
  _onClick = () => {
    this.props.fetchChangesets(this.props.page);
  };
}

class List extends React.PureComponent {
  props: {
    pathname: string,
    changesets: Object,
    fetchChangesets: (number) => mixed, // base 0
  };
  constructor(props) {
    super(props);
    this.props.fetchChangesets(0);
  }
  render() {
    const currentPage = this.props.changesets.get('currrentPage');
    const pageIndex = this.props.changesets.get('pageIndex');
    const loading = this.props.changesets.get('loading');
    const base = parseInt(pageIndex / 10) * 10;
    console.log(loading);
    return (
      <div className="flex-parent flex-parent--column flex-child--grow">
        {loading ? <div className="loading" /> : null}
        <div className="flex-child flex-child--grow px12 scroll-auto mt12">
          <ul>
            {currentPage &&
              currentPage.features.map((f, k) => <div key={k}>{f.id}</div>)}
          </ul>
        </div>
        <footer className="p12 bg-gray-faint txt-s">
          {R.range(base, base + 10).map(n => (
            <RangeItem
              key={n}
              page={n}
              active={n === pageIndex}
              fetchChangesets={this.props.fetchChangesets}
            />
          ))}
        </footer>
      </div>
    );
  }
}

List = connect(
  state => ({
    pathname: state.routing.location.pathname,
    changesets: state.changesets,
  }),
  {fetchChangesets},
)(List);
export {List};
