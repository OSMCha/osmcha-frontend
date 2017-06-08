// @flow
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { Map, Iterable, List } from 'immutable';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { history } from './history';
import createSagaMiddleware from 'redux-saga';

import * as safeStorage from '../utils/safe_storage';
import { getFiltersFromUrl } from '../utils/query_params';

// Reducers
import { authReducer } from './auth_reducer';
import { changesetsPageReducer } from './changesets_page_reducer';
import { changesetReducer } from './changeset_reducer';

import type { ChangesetsPageType } from './changesets_page_reducer';
import type { ChangesetType } from './changeset_reducer';
import type { AuthType } from './auth_reducer';

// Sagas
import sagas from './sagas';

export type RootStateType = {
  auth: AuthType,
  changesetsPage: ChangesetsPageType,
  changeset: ChangesetType,
  routing: Object
};

// Root reducer
const reducers = combineReducers({
  changesetsPage: changesetsPageReducer,
  changeset: changesetReducer,
  routing: routerReducer,
  auth: authReducer
});

const sagaMiddleware = createSagaMiddleware();
// Middlewares
const middlewares = [sagaMiddleware, routerMiddleware(history)];

let appliedMiddlewares = applyMiddleware(...middlewares);
if (process.env.NODE_ENV !== 'production') {
  const { createLogger } = require('redux-logger');

  // const logger = createLogger({
  //   stateTransformer: state => {
  //     let newState = {};

  //     for (var i of Object.keys(state)) {
  //       if (Iterable.isIterable(state[i])) {
  //         newState[i] = state[i].toJS();
  //       } else {
  //         newState[i] = state[i];
  //       }
  //     }
  //     return newState;
  //   }
  // });
  // middlewares.push(logger);
  const { composeWithDevTools } = require('redux-devtools-extension');
  appliedMiddlewares = composeWithDevTools(appliedMiddlewares);
}

// Persisted state
const persistedState = {
  auth: Map({
    token: safeStorage.getItem('token'),
    oAuthToken: safeStorage.getItem('oauth_token'),
    oAuthTokenSecret: safeStorage.getItem('oauth_token_secret'),
    error: null
  }),
  changesetsPage: Map({
    filters: getFiltersFromUrl(),
    pageIndex: 0,
    pages: new List(),
    loading: false,
    error: null
  })
};

// Store
const store = createStore(reducers, persistedState, appliedMiddlewares);
sagaMiddleware.run(sagas);

export { store };
