// @flow
import { put, call, takeLatest, select } from 'redux-saga/effects';
import { fromJS } from 'immutable';

import { fetchChangesetsPage } from '../network/changesets_page';

import type { RootStateType } from './';

export const CHANGESET_PAGE_GET = 'CHANGESET_PAGE_GET';
export const CHANGESETS_PAGE_FETCHED = 'CHANGESETS_PAGE_FETCHED';
export const CHANGESETS_PAGE_CHANGE = 'CHANGESETS_PAGE_CHANGE';
export const CHANGESETS_PAGE_LOADING = 'CHANGESETS_PAGE_LOADING';
export const CHANGESETS_PAGE_ERROR = 'CHANGESETS_PAGE_ERROR';
export const FILTERS_SET = 'FILTERS_SET';

export function action(type: string, payload: ?Object) {
  return { type, ...payload };
}

// public
// starting point for react component to start fetch
export const getChangesetsPage = (pageIndex: number, filters: ?Object) =>
  action(CHANGESET_PAGE_GET, { pageIndex, filters });

// watches for CHANGESET_PAGE_GET and only
// dispatches latest to fetchChangesetsPageAsync
export function* watchChangesetsPage(): any {
  yield takeLatest(CHANGESET_PAGE_GET, fetchChangesetsPageAsync);
}

/** Sagas **/
export function* fetchChangesetsPageAsync({
  pageIndex,
  filters
}: {
  pageIndex: number,
  filters: ?Object
}): Object {
  // no need to check if changesetPage exists
  // as service worker caches this api request
  if (!filters) {
    filters = yield select((state: RootStateType) =>
      state.changesetsPage.get('filters')
    );
  } else {
    yield put(
      action(FILTERS_SET, {
        filters
      })
    );
  }
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
