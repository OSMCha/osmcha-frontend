import { Map, fromJS } from 'immutable';
import { WHITELIST } from './whitelist_actions';

export type whitelistReducerType = Map<'whitelist', 'loading', any>;

const initialState: whitelistReducerType = fromJS({
  whitelist: null,
  loading: false
});

export function whitelistReducer(
  state: whitelistReducerType = initialState,
  action: Object
): WhitelistType {
  switch (action.type) {
    case WHITELIST.define: {
      return state.set('whitelist', action.whitelist).set('loading', false);
    }
    case WHITELIST.add: {
      return state
        .set(
          'whitelist',
          state.get('whitelist').concat([action.whitelist_user])
        )
        .set('loading', false);
    }
    case WHITELIST.remove: {
      return state
        .set(
          'whitelist',
          state.get('whitelist').filter(item => item !== action.whitelist)
        )
        .set('loading', false);
    }
    case WHITELIST.clear: {
      return state.set('whitelist', Map()).set('loading', false);
    }
    default:
      return state;
  }
}
