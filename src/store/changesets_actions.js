// @flow
import {put, takeLatest, select} from 'redux-saga/effects';
import {API_URL} from '../config';

export const CHANGESETS_PAGE_FETCH_ASYNC = 'CHANGESETS_PAGE_FETCH_ASYNC';
export const CHANGESETS_PAGE_FETCHED = 'CHANGESETS_PAGE_FETCHED';
export const CHANGESETS_CHANGE_PAGE = 'CHANGESETS_CHANGE_PAGE';
export const CHANGESETS_PAGE_LOADING = 'CHANGESETS_PAGE_LOADING';

import {PAGE_SIZE} from '../config/constants';

export function action(type: string, payload: ?Object) {
  return {type, ...payload};
}

// public
export const fetchChangesets = (pageIndex: number) =>
  action(CHANGESETS_PAGE_FETCH_ASYNC, {pageIndex});

export function* watchFetchChangesets(): any {
  yield takeLatest(CHANGESETS_PAGE_FETCH_ASYNC, fetchChangesetsAsync);
}

/** Sagas **/
export function* fetchChangesetsAsync(
  {pageIndex = 0}: {pageIndex: number},
): Object {
  console.log(pageIndex);
  // check if it already exists
  let thisPage = yield select(state =>
    state.changesets.get('pages').get(pageIndex));

  if (thisPage) {
    yield put(
      action(CHANGESETS_CHANGE_PAGE, {
        pageIndex,
      }),
    );
  } else {
    yield put(
      action(CHANGESETS_PAGE_LOADING, {
        pageIndex,
      }),
    );
    try {
      thisPage = yield fetch(
        `${API_URL}/changesets?page=${pageIndex + 1}&page_size=${PAGE_SIZE}`,
      ).then(res => res.json());
    } catch (e) {
      if (e) {
        console.error(e);
      }
    }

    yield put(
      action(CHANGESETS_PAGE_FETCHED, {
        data: thisPage,
        pageIndex,
      }),
    );
  }
}
