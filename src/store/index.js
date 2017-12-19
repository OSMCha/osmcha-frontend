// @flow
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { Map } from 'immutable';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { history } from './history';
import createSagaMiddleware from 'redux-saga';

import * as safeStorage from '../utils/safe_storage';

// Reducers
import { authReducer } from './auth_reducer';
import { changesetsPageReducer } from './changesets_page_reducer';
import { changesetReducer } from './changeset_reducer';
import { modalReducer } from './modal_reducer';
import { filtersReducer } from './filters_reducer';
import { aoiReducer } from './aoi_reducer';

import type { ModalType } from './modal_reducer';
import type { ChangesetsPageType } from './changesets_page_reducer';
import type { ChangesetType } from './changeset_reducer';
import type { AuthType } from './auth_reducer';
import type { filtersReducerType } from './filters_reducer';
import type { aoiReducerType } from './aoi_reducer';
// Sagas
import sagas from './sagas';

export type RootStateType = {
  auth: AuthType,
  changesetsPage: ChangesetsPageType,
  filters: filtersReducerType,
  aoi: aoiReducerType,
  changeset: ChangesetType,
  modal: ModalType,
  routing: Object
};

// Root reducer
const reducers = combineReducers({
  changesetsPage: changesetsPageReducer,
  changeset: changesetReducer,
  filters: filtersReducer,
  aoi: aoiReducer,
  routing: routerReducer,
  auth: authReducer,
  modal: modalReducer
});

const sagaMiddleware = createSagaMiddleware();
// Middlewares
const middlewares = [sagaMiddleware, routerMiddleware(history)];

let appliedMiddlewares = applyMiddleware(...middlewares);
if (process.env.NODE_ENV !== 'production') {
  // const { createLogger } = require('redux-logger');

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
    newsAlertShowCount: safeStorage.getItem('news_alert_show_count'),
    error: null
  })
};

// Store
const store = createStore(reducers, persistedState, appliedMiddlewares);
sagaMiddleware.run(sagas);

export { store };
