// @flow
import React from 'react';
import {connect} from 'react-redux';

class List extends React.Component {
  constructor() {
    super();
  }
  render() {
    return <li>hi</li>;
  }
}

List = connect(state => state.routing.location)(List);
export {List};
