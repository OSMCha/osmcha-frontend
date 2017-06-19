// @flow
import { put, call, takeLatest, select, all } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { fromJS, List, Map } from 'immutable';
import { push } from 'react-router-redux';
import { fetchChangesetsPage } from '../network/changesets_page';
import { getObjAsQueryParam } from '../utils/query_params';
import { validateFilters } from '../utils/filters';

import { modal } from './modal_actions';

import type { RootStateType } from './';
import type { InputType } from '../components/filters';

export const CHANGESET_PAGE_GET = 'CHANGESET_PAGE_GET';

export const CHANGESETS_PAGE_FETCHED = 'CHANGESETS_PAGE_FETCHED';
export const CHANGESETS_PAGE_LOADING = 'CHANGESETS_PAGE_LOADING';
export const CHANGESETS_PAGE_ERROR = 'CHANGESETS_PAGE_ERROR';

export const CHANGESET_PAGE_UPDATE_CACHE = 'CHANGESET_PAGE_UPDATE_CACHE';
export const CHANGESETS_PAGE_NEW_CHECK = 'CHANGESETS_PAGE_NEW_CHECK';
export const CHANGESETS_PAGE_NEW_CHECK_LOADING =
  'CHANGESETS_PAGE_NEW_CHECK_LOADING';

export const FILTERS_SET = 'FILTERS_SET';
export const FILTERS_APPLY = 'FILTERS_APPLY';

export const CHANGESET_PAGE_MODIFY_CHANGESET =
  'CHANGESET_PAGE_MODIFY_CHANGESET';
export function action(type: string, payload: ?Object) {
  return { type, ...payload };
}
// service worker cache update after every X interval
const INTERVAL = 5 * 60 * 1000;

// public
// starting point for react component to start fetch
export const getChangesetsPage = (pageIndex: number, nocache: boolean) =>
  action(CHANGESET_PAGE_GET, { pageIndex, nocache });

export const applyFilters = (
  filters: Map<string, List<InputType>>,
  pathname: ?string
) => action(FILTERS_APPLY, { filters, pathname });

// watches for CHANGESET_PAGE_GET and only
// dispatches latest to fetchChangesetsPageAsync
export function* watchChangesetsPage(): any {
  yield all([
    takeLatest(FILTERS_APPLY, filtersSaga),
    takeLatest(CHANGESET_PAGE_GET, fetchChangesetsPageAsync),
    takeLatest(CHANGESET_PAGE_MODIFY_CHANGESET, modifyChangesetPage),
    takeLatest(CHANGESET_PAGE_UPDATE_CACHE, updateCacheChangesetPage),
    pollChangesetPage()
  ]);
}

/** Sagas **/
export function* filtersSaga({
  filters,
  pathname
}: {
  filters: Map<string, List<InputType>>,
  pathname: ?Object
}): Object {
  try {
    const search = getObjAsQueryParam('filters', filters.toJS());
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
  } catch (e) {
    console.error(e);
  }
}
export function* fetchChangesetsPageAsync({
  pageIndex,
  nocache
}: {
  pageIndex: number,
  nocache: boolean
}): Object {
  // no need to check if changesetPage exists
  // as service worker caches this api request

  let [filters, oldPageIndex] = yield select((state: RootStateType) => [
    state.changesetsPage.get('filters'),
    state.changesetsPage.get('pageIndex')
  ]);
  const valid = validateFilters(filters);
  if (!valid) {
    filters = new Map();
    const location = yield select((state: RootStateType) => ({
      ...state.routing.location, // deep clone it
      search: ''
    }));
    yield all([
      put(
        modal({
          error: Error('The filters that you applied were not correct.')
        })
      ),
      put(push(location)),
      put(action(FILTERS_SET, filters))
    ]);
  }

  if (pageIndex == null) {
    // to check both undefined and null
    pageIndex = oldPageIndex;
  }
  yield put(
    action(CHANGESETS_PAGE_LOADING, {
      pageIndex
    })
  );
  try {
    let token = yield select((state: RootStateType) => state.auth.get('token'));
    let thisPage = yield call(
      fetchChangesetsPage,
      pageIndex,
      filters,
      token,
      nocache
    );
    yield put(
      action(CHANGESETS_PAGE_FETCHED, {
        data: fromJS(thisPage),
        pageIndex
      })
    );
  } catch (error) {
    yield put(
      action(CHANGESETS_PAGE_ERROR, {
        pageIndex: oldPageIndex,
        error
      })
    );
    error.name = `Failed to load page ${pageIndex}`;
    yield put(
      modal({
        error,
        callback: action,
        callbackLabel: 'Retry',
        callbackArgs: [CHANGESET_PAGE_GET, { pageIndex }]
      })
    );
  }
}

export function* modifyChangesetPage({ changesetId, changeset }: Object): any {
  try {
    // try to modify the changeset inside the page
    // to reflect any kind of changes in the changesetList
    let [currentPage, pageIndex] = yield select((state: RootStateType) => [
      state.changesetsPage.getIn(['currentPage'], Map()),
      state.changesetsPage.getIn(['pageIndex'], 0)
    ]);

    let features: List<Map<string, *>> = currentPage.get('features');

    const index = features.findIndex(f => f.get('id') === changesetId);
    if (index > -1) {
      currentPage = currentPage.setIn(['features', index], changeset);
      yield put(
        action(CHANGESETS_PAGE_FETCHED, {
          data: currentPage,
          pageIndex
        })
      );
      yield put(action(CHANGESET_PAGE_UPDATE_CACHE));
    }
  } catch (e) {
    console.error(e);
  }
}
export function* updateCacheChangesetPage({
  nocache
}: {
  nocache: boolean
}): any {
  try {
    yield put(action(CHANGESETS_PAGE_NEW_CHECK_LOADING));
    yield call(delay, 3000 + Math.random() * 2000);
    const [
      filters: Map<string, List<InputType>>,
      pageIndex: number,
      token
    ] = yield select((state: RootStateType) => [
      state.changesetsPage.get('filters'),
      state.changesetsPage.get('pageIndex'),
      state.auth.get('token')
    ]);
    let newData = yield call(
      fetchChangesetsPage,
      pageIndex,
      filters,
      token,
      nocache
    );
    let oldData = yield select((state: RootStateType) =>
      state.changesetsPage.get('currentPage')
    );
    newData = fromJS(newData.features.map(f => f.id)).toSet();
    oldData = oldData.get('features').map(f => f.get('id')).toSet();
    yield put(
      action(CHANGESETS_PAGE_NEW_CHECK, {
        diff: newData.subtract(oldData).size
      })
    );
  } catch (e) {
    console.error(e);
  }
}
export function* pollChangesetPage(): any {
  yield call(delay, 2000);
  yield put(action(CHANGESET_PAGE_UPDATE_CACHE, { nocache: true })); // check for stale data, if cold reload
  while (true) {
    yield call(delay, INTERVAL);
    yield put(action(CHANGESET_PAGE_UPDATE_CACHE)); // periodically check for new data
  }
}
