// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {requestLogin} from './store/user_actions';
import {Route} from 'react-router-dom';
import {Navbar} from './components/Navbar';

class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Route exact path="/" render={() => <p>Home</p>} />
        <Route path="/about" render={() => <p>About</p>} />
        <Route path="/stats" render={() => <p>stats</p>} />
        <Route path="/features" render={() => <p>features</p>} />
      </div>
    );
  }
}
App = connect(
  state => state,
  dispatch => ({
    actions: bindActionCreators({requestLogin}, dispatch),
  }),
)(App);

export default App;
