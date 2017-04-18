/* @flow */
import {
  CHANGESETS_PAGE_FETCHED,
  CHANGESETS_PAGE_CHANGE,
  CHANGESETS_PAGE_LOADING,
  CHANGESETS_PAGE_ERROR,
} from './changesets_page_actions';
import {List, Map} from 'immutable';

const changesetsInitial = new Map({
  pageIndex: 0,
  currentPage: null,
  pages: new List(),
  loading: false,
});

function changesetsReducer(
  state: Map<string, any> = changesetsInitial,
  action: Object,
): Map<string, any> {
  switch (action.type) {
    case CHANGESETS_PAGE_LOADING: {
      return state
        .set('pageIndex', action.pageIndex)
        .set('currrentPage', null)
        .set('loading', true)
        .set('error', null);
    }
    case CHANGESETS_PAGE_FETCHED: {
      const pages = state.get('pages').set(action.pageIndex, action.data);
      return state
        .set('pages', pages)
        .set('pageIndex', action.pageIndex)
        .set('currrentPage', action.data)
        .set('loading', false)
        .set('error', null);
    }
    case CHANGESETS_PAGE_CHANGE: {
      const pages = state.get('pages');
      return state
        .set('pageIndex', action.pageIndex)
        .set('currrentPage', pages.get(action.pageIndex))
        .set('loading', false)
        .set('error', null);
    }
    case CHANGESETS_PAGE_ERROR: {
      return state
        .set('pageIndex', action.pageIndex)
        .set('currentPage', null)
        .set('loading', false)
        .set('error', action.error);
    }
    default: {
      return state;
    }
  }
}

export {changesetsReducer};
