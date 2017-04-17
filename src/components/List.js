// @flow
import React from 'react';
import {connect} from 'react-redux';
import {fetchChangesets} from '../store/changesets_actions';
class List extends React.Component {
  constructor(props) {
    super(props);
    props.fetchChangesets();
    console.log(props);
  }
  render() {
    return <li>{this.props.changesets.get('count')}</li>;
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
