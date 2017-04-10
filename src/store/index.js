import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import safeStorage from './utils/safe_storage';

// Reducers
import user from './user_reducer';

// Root reducer
const rootReducer = combineReducers({
  user,
});

// Middlewares
const middlewares = [thunk];

if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger();
  middlewares.push(logger);
}

// Persisted state
const persistedState = {
  user: {
    isAuthenticated: false,
    token: safeStorage.get('token') || null,
  },
};

// Store
const store = createStore(
  rootReducer,
  persistedState,
  applyMiddleware(...middlewares)
);

// Persist change to local storage
store.subscribe(() => {
  const state = store.getState();
  const { token } = state.user;

  if (token !== safeStorage.get('token')) {
    safeStorage.set('token', token);
  }
});

export default store;
