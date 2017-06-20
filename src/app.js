// @flow
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import { Changeset } from './views/changeset';
import { About } from './views/about';
import { Stats } from './views/stats';
import { Filters } from './views/filters';
import { ChangesetsList } from './views/changesets_list';
import { CMap } from './views/map';
import { NavbarChangeset } from './views/navbar_changeset';
import { NavbarSidebar } from './views/navbar_sidebar';
import { Home } from './views/home';
import { Modal } from './views/modal';

import { gaPageView } from './utils/analytics';
import { getFiltersFromUrl } from './utils/query_params';

export class App extends Component {
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
    }
  }
  render() {
    const width = window.innerWidth;
    if (width > 800) {
      return (
        <div className="viewport-full">
          <div className="grid">
            <div className="col col--3-mxl col--4-ml bg-white border-r border--gray-light border--1 ">
              <NavbarSidebar />
              <ChangesetsList style={{ height: 'calc(vh - 55px)' }} />
            </div>
            <div className="col col--9-mxl col--8-ml col--12-mm">
              <Route
                render={({ location }) =>
                  <CSSTransitionGroup
                    transitionName="filters"
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={300}
                  >
                    <Route exact path="/" component={Home} />
                    <Route
                      location={location}
                      path="/filters"
                      component={Filters}
                      key={location.key}
                    />
                    <Route path="/changesets" component={NavbarChangeset} />
                    <Route
                      path="/changesets"
                      // Need to use render to avoid unmounting of
                      // CMap Ref: https://reacttraining.com/react-router/web/api/Route/render-func
                      // CMap and views/changeset.js are clubbed so they can be
                      // loaded on demand in future.
                      render={() => <CMap className="z0 fixed bottom right" />}
                    />
                    <Route path="/changesets/:id" component={Changeset} />
                    <Route path="/about" component={About} />
                    <Route path="/stats" component={Stats} />
                  </CSSTransitionGroup>}
              />
            </div>
          </div>
          <Modal />
        </div>
      );
    } else {
      return (
        <div className="viewport-full">
          <div className="col">
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
          <Modal />
        </div>
      );
    }
  }
}
