/* @flow */
import {
  CHANGESETS_PAGE_FETCHED,
  CHANGESETS_CHANGE_PAGE,
  CHANGESETS_PAGE_LOADING,
} from './changesets_actions';
import {List, Map} from 'immutable';

const changesetsInitial = new Map({
  pageIndex: 0,
  currentPage: null,
  pages: new List(),
  loading: false,
});

function changesetsReducer(
  state: Map<*, any> = changesetsInitial,
  action: Object,
): Map<*, any> {
  switch (action.type) {
    case CHANGESETS_PAGE_LOADING: {
      return state
        .set('pageIndex', action.pageIndex)
        .set('loading', true)
        .set('currrentPage', null);
    }
    case CHANGESETS_PAGE_FETCHED: {
      const pages = state.get('pages').set(action.pageIndex, action.data);
      return state
        .set('pages', pages)
        .set('pageIndex', action.pageIndex)
        .set('currrentPage', action.data)
        .set('loading', false);
    }
    case CHANGESETS_CHANGE_PAGE: {
      const pages = state.get('pages');
      return state
        .set('pageIndex', action.pageIndex)
        .set('currrentPage', pages.get(action.pageIndex))
        .set('loading', false);
    }
    default: {
      return state;
    }
  }
}

export {changesetsReducer};
