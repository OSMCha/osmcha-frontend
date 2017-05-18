import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import {Provider} from 'react-redux';
import {store, history} from './store';
import {ConnectedRouter} from 'react-router-redux';
// if (process.env.NODE_ENV === 'production') {
//   const {whyDidYouUpdate} = require('why-did-you-update');
//   whyDidYouUpdate(React);
// }
import './index.css';
import 'react-tippy/dist/tippy.css';
import 'animate.css/animate.css';
import 'changeset-map/public/css/style.css';

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);
