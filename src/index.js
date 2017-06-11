// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import debounce from 'lodash.debounce';

import { registerServiceWorker } from './serviceworker';

import './css/index.css';
import 'react-tippy/dist/tippy.css';
import 'animate.css/animate.css';
import 'react-select/dist/react-select.css';
import './css/2.1.3.toastr.min.css';
import './css/0.13.0.assembly.min.css';
import './0.13.0.assembly';

import App from './app';
import { history } from './store/history';
import { store } from './store';

var ReactGA = require('react-ga');
ReactGA.initialize('UA-100686765-1', {
  debug: true,
  gaOptions: {
    anonymizeIp: true,
    screenResolution: `${window.screen.availWidth}X${window.screen
      .availHeight}`,
    appName: process.env.NODE_ENV
  }
});

if (process.env.NODE_ENV === 'production') {
  var Raven = require('raven-js');
  Raven.config('https://5637ef87f5794e2fb9e1e5fe9119688d@sentry.io/175926', {
    release: process.env.REACT_APP_VERSION,
    environment: process.env.NODE_ENV
  }).install();
  // window.addEventListener('unhandledrejection', function(event) {
  //   Raven.captureException(event.reason);
  // });
}

if (process.env.NODE_ENV !== 'production') {
  // const {whyDidYouUpdate} = require('why-did-you-update');
  // whyDidYouUpdate(React);
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
const reload = debounce(() => window.location.reload(), 400);
window.onresize = reload;
