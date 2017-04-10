import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {requestLogin} from './store/user_actions';
class App extends Component {
  render() {
    return <p>Hello OSMCHA!</p>;
  }
}
App = connect(
  state => state,
  dispatch => ({
    actions: bindActionCreators({requestLogin}, dispatch),
  }),
)(App);

export default App;
