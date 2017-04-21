import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import {Provider} from 'react-redux';
import {store, history} from './store';
import {ConnectedRouter} from 'react-router-redux';
import './index.css';

require('changeset-map');
require('changeset-map/css/style.css');

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);
