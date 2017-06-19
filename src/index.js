// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import debounce from 'lodash.debounce';
import ReactGA from 'react-ga';
import Raven from 'raven-js';
import { history } from './store/history';
import { store } from './store';

import { registerServiceWorker } from './serviceworker';

import './assets/index.css';
import 'animate.css/animate.css';
import 'react-select/dist/react-select.css';
import './assets/0.13.0.assembly.min.css';
import './assets/0.13.0.assembly';

import { App } from './app';

ReactGA.initialize('UA-100686765-1', {
  gaOptions: {
    anonymizeIp: true,
    screenResolution: `${window.screen.availWidth}X${window.screen
      .availHeight}`,
    appName: process.env.NODE_ENV
  }
});

Raven.config('https://5637ef87f5794e2fb9e1e5fe9119688d@sentry.io/175926', {
  release: process.env.REACT_APP_VERSION,
  environment: process.env.NODE_ENV,
  debug: process.env.NODE_ENV === 'production' ? true : true // TOFIX remove this
}).install();

if (process.env.NODE_ENV !== 'production') {
  // const { whyDidYouUpdate } = require('why-did-you-update');
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
