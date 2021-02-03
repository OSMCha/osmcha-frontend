import { Map, List, fromJS } from 'immutable';
import { BLACKLIST } from './blacklist_actions';

export type blacklistReducerType = Map<'blacklist', 'loading', any>;

const initialState: blacklistReducerType = fromJS({
  blacklist: List(),
  loading: false
});

export function blacklistReducer(
  state: blacklistReducerType = initialState,
  action: Object
): BlacklistType {
  switch (action.type) {
    case BLACKLIST.define: {
      return state.set('blacklist', action.blacklist).set('loading', false);
    }
    case BLACKLIST.add: {
      return state
        .set(
          'blacklist',
          state.get('blacklist').concat([fromJS(action.blacklist_user)])
        )
        .set('loading', false);
    }
    case BLACKLIST.remove: {
      return state
        .set(
          'blacklist',
          state
            .get('blacklist')
            .filter(item => item.get('uid') !== action.blacklist_user)
        )
        .set('loading', false);
    }
    case BLACKLIST.clear: {
      return state.set('blacklist', Map()).set('loading', false);
    }
    default:
      return state;
  }
}
