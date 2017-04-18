// @flow
import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {Changeset} from './views/changeset';
import {About} from './views/about';
import {Stats} from './views/stats';
import {Features} from './views/features';
import {Sidebar} from './components/sidebar';

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
          <Route exact path="/" component={Changeset} />
          <Route path="/changesets/:id" component={Changeset} />
          <Route path="/about" component={About} />
          <Route path="/stats" component={Stats} />
          <Route path="/features" component={Features} />
        </div>
      </div>
    );
  }
}

export default App;
