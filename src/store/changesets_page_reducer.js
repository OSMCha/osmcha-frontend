/* @flow */
import { List, Map, fromJS } from 'immutable';

import {
  CHANGESETS_PAGE_FETCHED,
  CHANGESETS_PAGE_LOADING,
  CHANGESETS_PAGE_ERROR,
  FILTERS_SET
} from './changesets_page_actions';

export type ChangesetsPageType = Map<
  'currentPage' | 'pageIndex' | 'loading' | 'error' | 'filters',
  any
>;

const changesetsInitial: ChangesetsPageType = fromJS({
  pageIndex: 0,
  currentPage: new Map(),
  loading: false,
  error: null
});

export function changesetsPageReducer(
  state: ChangesetsPageType = changesetsInitial,
  action: Object
): ChangesetsPageType {
  switch (action.type) {
    case FILTERS_SET: {
      return state.set('filters', action.filters);
    }
    case CHANGESETS_PAGE_LOADING: {
      return state
        .set('pageIndex', action.pageIndex)
        .set('loading', true)
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
        .set('loading', false)
        .set('error', action.error);
    }
    default: {
      return state;
    }
  }
}
