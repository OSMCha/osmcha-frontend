// @flow
import {combineReducers, createStore, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import {Map} from 'immutable';
import {routerReducer, routerMiddleware} from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import createSagaMiddleware from 'redux-saga';

import * as safeStorage from '../utils/safe_storage';

// Reducers
import {userReducer} from './user_reducer';
import {changesetsPageReducer} from './changesets_page_reducer';
import {changesetReducer} from './changeset_reducer';

import type {ChangesetsPageType} from './changesets_page_reducer';
import type {ChangesetType} from './changeset_reducer';

// Sages
import sagas from './sagas';

export type RootStateType = {
  user: Object,
  changesetsPage: ChangesetsPageType,
  changeset: ChangesetType,
  routing: Object,
};

// Root reducer
const reducers = combineReducers({
  changesetsPage: changesetsPageReducer,
  changeset: changesetReducer,
  routing: routerReducer,
  user: userReducer,
});

const history = createHistory();
const sagaMiddleware = createSagaMiddleware();
// Middlewares
const middlewares = [sagaMiddleware, routerMiddleware(history)];

if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger();
  middlewares.push(logger);
}

// Persisted state
const persistedState = {
  user: Map({
    token: safeStorage.getItem('token'),
  }),
};

// Store
const store = createStore(
  reducers,
  persistedState,
  applyMiddleware(...middlewares),
);

// Persist change to local storage
store.subscribe(() => {
  const {user} = store.getState();
  const token = user.get('token');

  if (token !== safeStorage.getItem('token')) {
    safeStorage.setItem('token', token);
  }
});

sagaMiddleware.run(sagas);

export {store, history};
