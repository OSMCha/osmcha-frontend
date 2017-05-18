/* @flow */
import {List, Map} from 'immutable';

import {
  CHANGESETS_PAGE_FETCHED,
  CHANGESETS_PAGE_CHANGE,
  CHANGESETS_PAGE_LOADING,
  CHANGESETS_PAGE_ERROR,
} from './changesets_page_actions';

export type ChangesetsPageType = Map<
  | 'currentPage'
  | 'pages'
  | 'pageIndex'
  | 'loading'
  | 'error', any>;

const changesetsInitial: ChangesetsPageType = new Map({
  pageIndex: 0,
  currentPage: null,
  pages: new List(),
  loading: false,
  error: null,
});

export function changesetsPageReducer(
  state: ChangesetsPageType = changesetsInitial,
  action: Object,
): ChangesetsPageType {
  switch (action.type) {
    case CHANGESETS_PAGE_LOADING: {
      return state
        .set('pageIndex', action.pageIndex)
        .set('loading', true)
        .set('error', null);
    }
    case CHANGESETS_PAGE_FETCHED: {
      const pages = state.get('pages').set(action.pageIndex, action.data);
      return state
        .set('pages', pages)
        .set('pageIndex', action.pageIndex)
        .set('currentPage', action.data)
        .set('loading', false)
        .set('error', null);
    }
    case CHANGESETS_PAGE_CHANGE: {
      const pages = state.get('pages');
      return state
        .set('pageIndex', action.pageIndex)
        .set('currentPage', pages.get(action.pageIndex))
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
