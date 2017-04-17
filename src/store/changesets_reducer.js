/* @flow */
import {CHANGESETS_FETCHED} from './changesets_actions';
import {List} from 'immutable';

const changesetsInitial = new List();

function changesetsReducer(
  state: List<Object> = changesetsInitial,
  action: Object,
): List<Object> {
  switch (action.type) {
    case CHANGESETS_FETCHED: {
      console.log(action);
      return state.set(action.page - 1, action.data);
    }
    default:
      return state;
  }
}

export {changesetsReducer};
