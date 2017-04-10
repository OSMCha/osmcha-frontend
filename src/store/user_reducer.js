/* @flow */
import {Map} from 'immutable';

const userInitialState = Map({
  token: null,
});

function userReducer(
  state: Map<string, *> = userInitialState,
  action: Object,
): Map<string, *> {
  switch (action.type) {
    default:
      return state;
  }
}

export {userReducer};
