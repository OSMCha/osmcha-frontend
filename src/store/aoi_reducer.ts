import { Map, fromJS } from 'immutable';

import { AOI } from './aoi_actions';

export type aoiReducerType = Map<'loading' | 'error' | 'aoi', any>;

const aoiInitial: aoiReducerType = fromJS({
  aoi: {},
  loading: false,
  error: null,
});

export function aoiReducer(
  state: aoiReducerType = aoiInitial,
  action: any
): aoiReducerType {
  switch (action.type) {
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
