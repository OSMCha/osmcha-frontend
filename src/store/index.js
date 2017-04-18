// @flow
import {combineReducers, createStore, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import {Map} from 'immutable';
import safeStorage from '../utils/safe_storage';
import {routerReducer, routerMiddleware} from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import createSagaMiddleware from 'redux-saga';

// Reducers
import {userReducer} from './user_reducer';
import {changesetsReducer} from './changesets_page_reducer';
// Sages
import sagas from './sagas';

// Root reducer
const reducers = combineReducers({
  user: userReducer,
  changesets: changesetsReducer,
  routing: routerReducer,
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
    token: safeStorage.get('token'),
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

  if (token !== safeStorage.get('token')) {
    safeStorage.set('token', token);
  }
});

sagaMiddleware.run(sagas);

export {store, history};
