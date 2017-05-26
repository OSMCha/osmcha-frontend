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
    return (
      <div className="viewport-full  clip">
        <ChangesetsList />
      </div>
    );
  }
}

export default App;
