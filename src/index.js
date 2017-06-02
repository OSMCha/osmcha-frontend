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

// if (process.env.NODE_ENV === 'production') {
//   const {whyDidYouUpdate} = require('why-did-you-update');
//   whyDidYouUpdate(React);
// }

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
