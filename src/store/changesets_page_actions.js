// @flow
import { put, call, takeLatest, select, all } from 'redux-saga/effects';
import { fromJS } from 'immutable';
import { push } from 'react-router-redux';
import { fetchChangesetsPage } from '../network/changesets_page';
import { getObjAsQueryParam } from '../utils/query_params';

import type { RootStateType } from './';

export const CHANGESET_PAGE_GET = 'CHANGESET_PAGE_GET';
export const CHANGESETS_PAGE_FETCHED = 'CHANGESETS_PAGE_FETCHED';
export const CHANGESETS_PAGE_CHANGE = 'CHANGESETS_PAGE_CHANGE';
export const CHANGESETS_PAGE_LOADING = 'CHANGESETS_PAGE_LOADING';
export const CHANGESETS_PAGE_ERROR = 'CHANGESETS_PAGE_ERROR';
export const FILTERS_SET = 'FILTERS_SET';
export const FILTERS_APPLY = 'FILTERS_APPLY';

export function action(type: string, payload: ?Object) {
  return { type, ...payload };
}

// public
// starting point for react component to start fetch
export const getChangesetsPage = (pageIndex: number) =>
  action(CHANGESET_PAGE_GET, { pageIndex });

export const applyFilters = (filters: ?Object, pathname: ?string) =>
  action(FILTERS_APPLY, { filters, pathname });

// watches for CHANGESET_PAGE_GET and only
// dispatches latest to fetchChangesetsPageAsync
export function* watchChangesetsPage(): any {
  yield all([
    takeLatest(CHANGESET_PAGE_GET, fetchChangesetsPageAsync),
    takeLatest(FILTERS_APPLY, filtersSaga)
  ]);
}

/** Sagas **/
export function* filtersSaga({
  filters,
  pathname
}: {
  filters: Object,
  pathname: ?Object
}): Object {
  const search = getObjAsQueryParam('filters', filters);
  const location = yield select((state: RootStateType) => ({
    ...state.routing.location, // deep clone it
    pathname: pathname || state.routing.location.pathname,
    search // update the search
  }));
  // documentation is spotty about push,
  // I could find one comment on `push(location)` in the readme
  // ref: https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux
  yield all([
    put(push(location)),
    put(
      action(FILTERS_SET, {
        filters
      })
    )
  ]);
  // update the results, using dispatch
  // since changeset_list might get remounted
  yield put(action(CHANGESET_PAGE_GET, { pageIndex: 0 }));
}
export function* fetchChangesetsPageAsync({
  pageIndex
}: {
  pageIndex: number
}): Object {
  // no need to check if changesetPage exists
  // as service worker caches this api request
  const filters = yield select((state: RootStateType) =>
    state.changesetsPage.get('filters')
  );

  yield put(
    action(CHANGESETS_PAGE_LOADING, {
      pageIndex
    })
  );
  try {
    let token = yield select((state: RootStateType) => state.auth.get('token'));
    let thisPage = yield call(fetchChangesetsPage, pageIndex, filters, token);
    yield put(
      action(CHANGESETS_PAGE_FETCHED, {
        data: fromJS(thisPage),
        pageIndex
      })
    );
  } catch (error) {
    console.log(error.stack);
    yield put(
      action(CHANGESETS_PAGE_ERROR, {
        pageIndex,
        error
      })
    );
  }
}
