/* @flow */
import { List, Map, fromJS } from 'immutable';

import {
  CHANGESETS_PAGE_FETCHED,
  CHANGESETS_PAGE_LOADING,
  CHANGESETS_PAGE_ERROR,
  CHANGESETS_PAGE_NEW_CHECK,
  FILTERS_SET
} from './changesets_page_actions';

export type ChangesetsPageType = Map<
  'currentPage' | 'pageIndex' | 'loading' | 'error' | 'filters' | 'diff',
  any
>;

const changesetsInitial: ChangesetsPageType = fromJS({
  pageIndex: 0,
  currentPage: new Map(),
  loading: false,
  error: null,
  diff: 0 // difference between the number of changesets in cache and the currentPage.
});

export function changesetsPageReducer(
  state: ChangesetsPageType = changesetsInitial,
  action: Object
): ChangesetsPageType {
  switch (action.type) {
    case FILTERS_SET: {
      return state.set('filters', action.filters);
    }
    case CHANGESETS_PAGE_NEW_CHECK: {
      return state.set('diff', action.diff);
    }
    case CHANGESETS_PAGE_LOADING: {
      return state
        .set('pageIndex', action.pageIndex)
        .set('loading', true)
        .set('diff', 0)
        .set('error', null);
    }
    case CHANGESETS_PAGE_FETCHED: {
      return state
        .set('currentPage', action.data)
        .set('pageIndex', action.pageIndex)
        .set('loading', false)
        .set('error', null);
    }
    case CHANGESETS_PAGE_ERROR: {
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
