/* @flow */
import { List, Map, fromJS } from 'immutable';

import { FILTERS } from './filters_actions';

export type filtersReducerType = Map<'loading' | 'error' | 'filters', any>;

const filtersInitial: filtersReducerType = fromJS({
  filters: {},
  loading: false,
  error: null
});

export function filtersReducer(
  state: filtersReducerType = filtersInitial,
  action: Object
): filtersReducerType {
  switch (action.type) {
    case FILTERS.set: {
      return state.set('filters', action.filters);
    }
    default:
      return state;
  }
}
