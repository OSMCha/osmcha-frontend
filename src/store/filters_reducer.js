/* @flow */
import { Map, fromJS } from 'immutable';

import { FILTERS, AOI } from './filters_actions';

export type filtersReducerType = Map<
  'loading' | 'error' | 'filters' | 'aoi',
  any
>;

const filtersInitial: filtersReducerType = fromJS({
  filters: {},
  aoi: {},
  loading: false,
  error: null
});

export function filtersReducer(
  state: filtersReducerType = filtersInitial,
  action: Object
): filtersReducerType {
  switch (action.type) {
    case FILTERS.set: {
      return state.set('filters', action.filters).set('loading', false);
    }
    case AOI.loading: {
      return state.set('loading', true);
    }
    case AOI.clear: {
      return state.set('aoi', Map()).set('loading', false).set('error', null);
    }
    case AOI.fetched: {
      return state
        .set('loading', false)
        .set('error', null)
        .set('aoi', action.aoi);
    }
    default:
      return state;
  }
}
