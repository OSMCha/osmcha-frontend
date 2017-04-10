// @flow
import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {Map} from 'immutable';
import safeStorage from '../utils/safe_storage';

// Reducers
import {userReducer} from './user_reducer';

// Root reducer
const reducers = combineReducers({
  user: userReducer,
});

// Middlewares
const middlewares = [thunk];

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

export {store};
