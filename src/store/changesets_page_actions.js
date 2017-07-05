// @flow
import { put, call, takeLatest, select, all } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { fromJS, List, Map } from 'immutable';
import { push } from 'react-router-redux';
import { fetchChangesetsPage } from '../network/changesets_page';
import { getObjAsQueryParam } from '../utils/query_params';
import { validateFilters, getDefaultFromDate } from '../utils/filters';

import { modal } from './modal_actions';

import type { RootStateType } from './';
import type { InputType } from '../components/filters';

export const CHANGESETS_PAGE = {
  fetch: 'CHANGESETS_PAGE_FETCH',
  fetched: 'CHANGESETS_PAGE_FETCHED',
  modify: 'CHANGESETS_PAGE_MODIFY_CHANGESET',
  loading: 'CHANGESETS_PAGE_LOADING',
  error: 'CHANGESETS_PAGE_ERROR',
  checkNew: 'CHANGESETS_PAGE_CHECK_NEW_CHANGESETS',
  updateNewCount: 'CHANGESETS_PAGE_UPDATE_NEW_COUNT',
  checkNewLoading: 'CHANGESETS_PAGE_CHECK_NEW_LOADING'
};

export const FILTERS = {
  set: 'FILTERS_SET',
  apply: 'FILTERS_APPLY'
};

export function action(type: string, payload: ?Object) {
  return { type, ...payload };
}

// public
// starting point for react component to start fetch
export const getChangesetsPage = (pageIndex: number, nocache: boolean) =>
  action(CHANGESETS_PAGE.fetch, { pageIndex, nocache });

// this just checks for new changesets and updates the
// `changesetsPage/diff` in the store.
// @param nocache - to avoid cache busting.
export const checkForNewChangesets = (nocache: boolean) =>
  action(CHANGESETS_PAGE.checkNew, { nocache });

export const applyFilters = (
  filters: Map<string, List<InputType>>,
  pathname: ?string
) => action(FILTERS.apply, { filters, pathname });

// watches for CHANGESET_PAGE_GET and only
// dispatches latest to fetchChangesetsPageSaga
export function* watchChangesetsPage(): any {
  yield all([
    takeLatest(FILTERS.apply, filtersSaga),
    takeLatest(CHANGESETS_PAGE.fetch, fetchChangesetsPageSaga),
    takeLatest(CHANGESETS_PAGE.modify, modifyChangesetPageSaga),
    takeLatest(CHANGESETS_PAGE.checkNew, checkForNewChangesetsSaga)
  ]);
}

export const locationSelector = (state: RootStateType) =>
  state.routing.location;

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
    let location = yield select(locationSelector);

    location = {
      ...location,
      pathname: pathname || location.pathname,
      search // update the search
    };
    // fill the empty Obj with default `from_date`
    if (filters && filters.size === 0) {
      filters = getDefaultFromDate();
    }
    // documentation is spotty about push,
    // I could find one comment on `push(location)` in the readme
    // ref: https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux
    yield all([
      put(push(location)),
      put(
        action(FILTERS.set, {
          filters
        })
      )
    ]);
    // update the results, using `put` so that
    // watchChangesetsPage's `takeLatest` can avoid repititions
    yield put(action(CHANGESETS_PAGE.fetch, { pageIndex: 0 }));
  } catch (e) {
    console.error(e);
  }
}

export function* validateFiltersSaga(filters) {
  const valid = validateFilters(filters);
  if (!valid) {
    filters = getDefaultFromDate();
    const location = yield select(locationSelector);
    location.search = '';
    yield all([
      put(
        modal({
          error: Error('The filters that you applied were not correct.')
        })
      ),
      put(push(location)),
      put(action(FILTERS.set, { filters }))
    ]);
  }
  return filters;
}

export const filtersAndPageIndexSelector = (state: RootStateType) => [
  state.changesetsPage.get('filters'),
  state.changesetsPage.get('pageIndex')
];
export const tokenSelector = (state: RootStateType) => state.auth.get('token');
export function* fetchChangesetsPageSaga({
  pageIndex,
  nocache
}: {
  pageIndex: number,
  nocache: boolean
}): Object {
  let [filters, oldPageIndex] = yield select(filtersAndPageIndexSelector);

  filters = yield call(validateFiltersSaga, filters);

  // checks both undefined and null
  if (pageIndex == null) {
    pageIndex = oldPageIndex;
  }
  yield put(
    action(CHANGESETS_PAGE.loading, {
      pageIndex
    })
  );
  try {
    let token = yield select(tokenSelector);
    let thisPage = yield call(
      fetchChangesetsPage,
      pageIndex,
      filters,
      token,
      nocache
    );
    yield put(
      action(CHANGESETS_PAGE.fetched, {
        data: fromJS(thisPage),
        pageIndex
      })
    );
  } catch (error) {
    yield put(
      action(CHANGESETS_PAGE.error, {
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
        callbackArgs: [CHANGESETS_PAGE.fetch, { pageIndex }]
      })
    );
  }
}

export const currentPageAndIndexSelector = (state: RootStateType) => [
  state.changesetsPage.getIn(['currentPage'], Map()),
  state.changesetsPage.getIn(['pageIndex'], 0)
];
export function* modifyChangesetPageSaga({
  changesetId,
  changeset
}: Object): any {
  try {
    // try to modify the changeset inside the page
    // to reflect any kind of changes in the changesetList
    let [currentPage, pageIndex] = yield select(currentPageAndIndexSelector);

    let features: List<Map<string, *>> = currentPage.get('features');

    const index = features.findIndex(f => f.get('id') === changesetId);
    if (index > -1) {
      currentPage = currentPage.setIn(['features', index], changeset);
      yield put(
        action(CHANGESETS_PAGE.fetched, {
          data: currentPage,
          pageIndex
        })
      );
      // check for new changesets
      yield put(action(CHANGESETS_PAGE.checkNew));
    }
  } catch (e) {
    console.error(e);
  }
}

export function* checkForNewChangesetsSaga({
  nocache
}: {
  nocache: boolean
}): any {
  try {
    yield put(action(CHANGESETS_PAGE.checkNewLoading));
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
    let diff = 0;
    if (oldData) {
      newData = fromJS(newData.features.map(f => f.id)).toSet();
      oldData = oldData.get('features').map(f => f.get('id')).toSet();
      diff = newData.subtract(oldData).size;
    }
    yield put(
      action(CHANGESETS_PAGE.updateNewCount, {
        diff
      })
    );
  } catch (e) {
    console.error(e);
  }
}
