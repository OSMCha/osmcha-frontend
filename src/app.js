// @flow
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import debounce from 'lodash.debounce';

import { Changeset } from './views/changeset';
import { About } from './views/about';
import { Stats } from './views/stats';
import { Features } from './views/features';
import { ChangesetsList } from './views/changesets_list';
import { Sidebar } from './components/sidebar';
import { ToastContainer, ToastMessage } from 'react-toastr';
import { Navbar } from './components/navbar';
import { CMap } from './components/changeset/map';
var ToastMessageFactory = React.createFactory(ToastMessage.animation);

class App extends Component {
  resize = null;
  constructor() {
    super();
  }

  componentDidMount() {
    if (document && document.body) {
      document.body.addEventListener('showToast', this.showToast);
    }
  }
  // trigger it via events
  showToast = (event: Object) => {
    const message = event.detail;
    const messageType: "warning" | "error" | "success" | "info" = message.type;

    this.refs.toastr[messageType](message.title, message.content, {
      timeOut: message.timeOut,
      extendedTimeOut: 4000,
      closeButton: true,
      showAnimation: 'animated slideInDown',
      hideAnimation: 'animated fadeOut'
    });
  };
  render() {
    const width = window.innerWidth;
    const RightSide = ({ match }) => (
      <div>
        <CMap className="fixed bottom right" />
        <Route path={`${match.url}/:id`} component={Changeset} />
      </div>
    );
    if (width > 800) {
      return (
        <div className="viewport-full clip">
          <div className="grid">
            <Sidebar
              className="col col--3-mxl col--3-ml"
              title={
                <Navbar
                  className="bg-white border-b border--gray-light border--1"
                  title={
                    <span className="txt-fancy color-gray txt-xl">
                      <span className="color-green txt-bold">
                        OSM
                      </span>
                      {' '}
                      CHA
                    </span>
                  }
                />
              }
            >
              <ChangesetsList style={{ height: 'calc(vh - 55px)' }} />
            </Sidebar>
            <div className="col col--9-mxl col--9-ml col--12-mm clip">
              <Route
                exact
                path="/"
                render={() => <div> please select changeset</div>}
              />
              <Route
                path="/changesets"
                // Need to use render to avoid unmounting of
                // CMap Ref: https://reacttraining.com/react-router/web/api/Route/render-func
                // CMap and views/changeset.js are clubbed so they can be
                // loaded on demand in future.
                render={RightSide}
              />
              <Route path="/about" component={About} />
              <Route path="/stats" component={Stats} />
              <Route path="/features" component={Features} />
            </div>
          </div>
          <ToastContainer
            ref="toastr"
            toastMessageFactory={ToastMessageFactory}
            className="toast-top-right"
          />
        </div>
      );
    } else {
      return (
        <div className="viewport-full clip">
          <div className="col clip">
            <Route
              exact
              path="/"
              render={({ match }) => <ChangesetsList match={match} />}
            />
            <Route path="/changesets" render={RightSide} />
            <Route path="/about" component={About} />
            <Route path="/stats" component={Stats} />
            <Route path="/features" component={Features} />
          </div>
          <ToastContainer
            ref="toastr"
            toastMessageFactory={ToastMessageFactory}
            className="toast-top-right"
          />
        </div>
      );
    }
  }
}

export default App;
