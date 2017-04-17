/* @flow */
import {CHANGESETS_FETCHED} from './changesets_actions';
import {Map} from 'immutable';

const changesetsInitial = Map({
  count: 0,
});

function changesetsReducer(
  state: Map<string, *> = changesetsInitial,
  action: Object,
): Map<string, *> {
  switch (action.type) {
    case CHANGESETS_FETCHED:
      return state.set('count', action.data);
    default:
      return state;
  }
}

export {changesetsReducer};
