// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import ReactGA from 'react-ga';
import Raven from 'raven-js';
import { history } from './store/history';
import { store } from './store';
import { isDev, stack, appVersion } from './config';
import { unregisterServiceWorker } from './serviceworker';

import './assets/index.css';
import 'animate.css/animate.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import 'react-select/dist/react-select.css';
import './assets/0.21.0.assembly.min.css';
import './assets/0.21.0.assembly';

import { App } from './app';

ReactGA.initialize('UA-100686765-1', {
  gaOptions: {
    anonymizeIp: true,
    screenResolution: `${window.screen.availWidth}X${
      window.screen.availHeight
    }`,
    appName: stack
  }
});

if (process.env.NODE_ENV === 'production') {
  Raven.config('https://5637ef87f5794e2fb9e1e5fe9119688d@sentry.io/175926', {
    release: appVersion,
    environment: process.env.NODE_ENV,
    debug: isDev
  }).install();
}
// if (process.env.NODE_ENV !== 'production') {
// const { whyDidYouUpdate } = require('why-did-you-update');
// whyDidYouUpdate(React);
// }
ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
unregisterServiceWorker();
