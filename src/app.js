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

var ToastMessageFactory = React.createFactory(ToastMessage.animation);

class App extends Component {
  resize = null;
  constructor() {
    super();
    this.resize = debounce(this.reload, 700);
  }

  componentDidMount() {
    if (document && document.body) {
      document.body.addEventListener('showToast', this.showToast);
      window.onresize = this.resize;
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
  reload = () => {
    this.forceUpdate();
  };
  render() {
    return (
      <div className="viewport-full  clip">
        <div className="grid">
          <Sidebar
            className="col col--3-mxl col--3-ml h-full hmax-full sidebar"
            title={
              <Navbar
                className="bg-white  border-b border--gray-light border--1"
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
            <ChangesetsList />
          </Sidebar>
          <div className="col col--9-mxl col--9-ml col--12-mm clip">
            <Route exact path="/" component={Changeset} />
            <Route path="/changesets/:id" component={Changeset} />
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
  }
}

export default App;
