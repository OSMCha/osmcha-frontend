// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {requestLogin} from './store/user_actions';
import {Route} from 'react-router-dom';
import {Navbar} from './components/Navbar';
import {Changesets} from './views/changesets';
import {About} from './views/about';
import {Stats} from './views/stats';
import {Features} from './views/features';

class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Route exact path="/" component={Changesets} />
        <Route path="/about" component={About} />
        <Route path="/stats" component={Stats} />
        <Route path="/features" component={Features} />
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
