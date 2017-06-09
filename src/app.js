// @flow
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { ToastContainer, ToastMessage } from 'react-toastr';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import Mousetrap from 'mousetrap';

import { Changeset } from './views/changeset';
import { About } from './views/about';
import { Stats } from './views/stats';
import { Filters } from './views/filters';
import { ChangesetsList } from './views/changesets_list';
import { CMap } from './views/map';
import { NavbarChangeset } from './views/navbar_changeset';
import { NavbarSidebar } from './views/navbar_sidebar';
import { Sidebar } from './components/sidebar';
import { Navbar } from './components/navbar';
import { gaPageView } from './utils/analytics';
import { getFiltersFromUrl } from './utils/query_params';

var ToastMessageFactory = React.createFactory(ToastMessage.animation);

class App extends Component {
  resize = null;
  componentDidMount() {
    if (document && document.body) {
      var filters = getFiltersFromUrl();
      if (filters && Object.keys(filters).length > 0) {
        filters = Object.keys(filters)
          .sort((a, b) => a.localeCompare(b))
          .join(',');
        gaPageView(`/?filters=${filters}`);
      } else {
        gaPageView('/');
      }
      Mousetrap.bind('\\', () => {
        if (
          this.props.history.location &&
          this.props.history.location.pathname === '/filters'
        ) {
          this.props.history.push('/');
        } else {
          this.props.history.push('/filters');
        }
      });
    }
  }
  // trigger it via events
  showToast = (event: Object) => {
    const message = event.detail;
    const messageType: 'warning' | 'error' | 'success' | 'info' = message.type;

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
    if (width > 800) {
      return (
        <Route
          render={({ location }) =>
            <div className="viewport-full clip">
              <div className="grid">
                <div className="col col--3-mxl col--4-ml bg-white clip">
                  <NavbarSidebar />
                  <ChangesetsList style={{ height: 'calc(vh - 55px)' }} />
                </div>
                <div className="col col--9-mxl col--8-ml col--12-mm clip bg-black ">
                  <Route
                    path="/changesets"
                    // Need to use render to avoid unmounting of
                    // CMap Ref: https://reacttraining.com/react-router/web/api/Route/render-func
                    // CMap and views/changeset.js are clubbed so they can be
                    // loaded on demand in future.
                    component={NavbarChangeset}
                  />
                  <CSSTransitionGroup
                    transitionName="filters"
                    transitionAppearTimeout={500}
                    transitionAppear={true}
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={400}
                  >
                    <Route
                      location={location}
                      path="/filters"
                      render={({ location }) => <Filters location={location} />}
                      key={location.key}
                    />
                  </CSSTransitionGroup>

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
                    render={() => <CMap className="z0 fixed bottom right" />}
                  />
                  <Route path={'/changesets/:id'} component={Changeset} />
                  <Route path="/about" component={About} />
                  <Route path="/stats" component={Stats} />
                </div>
              </div>
              <ToastContainer
                ref="toastr"
                toastMessageFactory={ToastMessageFactory}
                className="toast-top-right"
              />
            </div>}
        />
      );
    } else {
      return (
        <div className="viewport-full clip">
          <div className="col clip">
            <Route exact path="/" component={ChangesetsList} />
            <Route
              path="/changesets"
              // Need to use render to avoid unmounting of
              // CMap Ref: https://reacttraining.com/react-router/web/api/Route/render-func
              // CMap and views/changeset.js are clubbed so they can be
              // loaded on demand in future.
              render={() => <CMap className="z0 fixed bottom right" />}
            />
            <Route path={'/changesets/:id'} component={Changeset} />
            <Route path="/about" component={About} />
            <Route path="/stats" component={Stats} />
            <Route path="/filters" component={Filters} />
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
