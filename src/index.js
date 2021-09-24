// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import { history } from './store/history';
import { store } from './store';
import { unregisterServiceWorker } from './serviceworker';

import './assets/index.css';
import 'animate.css/animate.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import 'react-select/dist/react-select.css';

import { App } from './app';

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
