// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {requestLogin} from './store/user_actions';
import {Route} from 'react-router-dom';
import {Tabs} from './components/Tabs';
import {Changesets} from './views/changesets';
import {About} from './views/about';
import {Stats} from './views/stats';
import {Features} from './views/features';
import {Sidebar} from './components/Sidebar';
import {User} from './components/User';
class App extends Component {
  render() {
    return (
      <div className="flex-parent viewport-full relative clip">
        <div className="flex-child w-full w300-ml absolute static-ml left top">
          <Sidebar />
        </div>
        <div
          className="flex-child flex-child--grow bg-darken10 viewport-twothirds viewport-full-ml"
        >
          <Route exact path="/" component={Changesets} />
          <Route path="/about" component={About} />
          <Route path="/stats" component={Stats} />
          <Route path="/features" component={Features} />
        </div>
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
