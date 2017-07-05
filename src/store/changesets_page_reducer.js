/* @flow */
import { List, Map, fromJS } from 'immutable';

import { CHANGESETS_PAGE, FILTERS } from './changesets_page_actions';

export type ChangesetsPageType = Map<
  | 'currentPage'
  | 'pageIndex'
  | 'loading'
  | 'error'
  | 'filters'
  | 'diff'
  | 'diffLoading',
  any
>;

const changesetsInitial: ChangesetsPageType = fromJS({
  pageIndex: 0,
  currentPage: {},
  filters: {},
  loading: false,
  error: null,
  diff: 0, // difference between the number of changesets in cache and the currentPage.
  diffLoading: false // indicator to show background update is going on.
});

export function changesetsPageReducer(
  state: ChangesetsPageType = changesetsInitial,
  action: Object
): ChangesetsPageType {
  switch (action.type) {
    case FILTERS.set: {
      return state.set('filters', action.filters);
    }
    case CHANGESETS_PAGE.updateNewCount: {
      return state.set('diff', action.diff).set('diffLoading', false);
    }
    case CHANGESETS_PAGE.checkNewLoading: {
      return state.set('diffLoading', true);
    }
    case CHANGESETS_PAGE.loading: {
      return state
        .set('pageIndex', action.pageIndex)
        .set('loading', true)
        .set('diff', 0)
        .set('diffLoading', false)
        .set('error', null);
    }
    case CHANGESETS_PAGE.fetched: {
      return state
        .set('currentPage', action.data)
        .set('pageIndex', action.pageIndex)
        .set('loading', false)
        .set('error', null);
    }
    case CHANGESETS_PAGE.error: {
      return state
        .set('pageIndex', action.pageIndex)
        .set('diff', 0)
        .set('loading', false)
        .set('error', action.error);
    }
    default: {
      return state;
    }
  }
}
