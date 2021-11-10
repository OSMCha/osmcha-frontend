import { Map, List, fromJS } from 'immutable';
import { WATCHLIST } from './watchlist_actions';

export type watchlistReducerType = Map<'watchlist', 'loading', any>;

const initialState: watchlistReducerType = fromJS({
  watchlist: List(),
  loading: false
});

export function watchlistReducer(
  state: watchlistReducerType = initialState,
  action: Object
): WatchlistType {
  switch (action.type) {
    case WATCHLIST.define: {
      return state.set('watchlist', action.watchlist).set('loading', false);
    }
    case WATCHLIST.add: {
      return state
        .set(
          'watchlist',
          state
            .get('watchlist')
            .concat([fromJS(action.watchlist_user)])
        )
        .set('loading', false);
    }
  case WATCHLIST.remove: {
      console.log(state.getIn(['watchlist', 'results']));
      return state
        .set(
          'watchlist',
          state
            .getIn(['watchlist', 'results'])
            .filter(item => item.get('uid') !== action.watchlist_user)
        )
        .set('loading', false);
    }
    case WATCHLIST.clear: {
      return state.set('watchlist', Map()).set('loading', false);
    }
    default:
      return state;
  }
}
