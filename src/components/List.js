// @flow
import React from 'react';
import {connect} from 'react-redux';
import {fetchChangesets} from '../store/changesets_actions';

class List extends React.PureComponent {
  props: {
    pathname: string,
    changesets: Object,
    fetchChangesets: (number) => mixed,
  };
  state = {
    page: 0,
  };
  constructor(props) {
    super(props);
    this.props.fetchChangesets(0);
  }
  render() {
    return (
      <ul>
        {this.props.changesets.map((v, k) => {
          console.log(v, k);
          return <p key={k}>{v.count}</p>;
        })}
      </ul>
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
