// @flow
import { put, call, takeLatest, select, all } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { fromJS, List, Map } from 'immutable';
import { fetchChangesetsPage } from '../network/changesets_page';
import { filtersSelector } from './filters_actions';

import { modal } from './modal_actions';

import type { RootStateType } from './';
import type { filtersType } from '../components/filters';

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

export function* watchChangesetsPage(): any {
  yield all([
    takeLatest(CHANGESETS_PAGE.fetch, fetchChangesetsPageSaga),
    takeLatest(CHANGESETS_PAGE.modify, modifyChangesetPageSaga),
    takeLatest(CHANGESETS_PAGE.checkNew, checkForNewChangesetsSaga)
  ]);
}

export const locationSelector = (state: RootStateType) =>
  state.routing.location;

/** Sagas **/

export const pageIndexSelector = (state: RootStateType) =>
  state.changesetsPage.getIn(['pageIndex'], 0);
export const tokenSelector = (state: RootStateType) => state.auth.get('token');

export const aoiIdSelector = (state: RootStateType) =>
  state.aoi.getIn(['aoi', 'id']);

export function* fetchChangesetsPageSaga({
  pageIndex,
  nocache,
  filters,
  aoiId
}: {
  pageIndex?: number,
  nocache: boolean,
  filters?: filtersType,
  aoiId?: string
}): Object {
  if (!filters) {
    filters = yield select(filtersSelector);
  }
  if (!aoiId) {
    aoiId = yield select(aoiIdSelector);
  }
  let oldPageIndex: number = yield select(pageIndexSelector);

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
    let thisPage;
    if (aoiId) {
      thisPage = yield call(
        fetchChangesetsPage,
        pageIndex,
        filters,
        token,
        nocache,
        aoiId
      );
    } else {
      thisPage = yield call(
        fetchChangesetsPage,
        pageIndex,
        filters,
        token,
        nocache
      );
    }
    yield put(
      action(CHANGESETS_PAGE.fetched, {
        data: fromJS(thisPage),
        pageIndex
      })
    );
  } catch (error) {
    const token = yield select(tokenSelector);
    yield put(
      action(CHANGESETS_PAGE.error, {
        pageIndex: oldPageIndex,
        error
      })
    );
    error.name = `Failed to load page ${pageIndex}`;
    if (token) {
      yield put(
        modal({
          error,
          callback: action,
          callbackLabel: 'Retry',
          callbackArgs: [CHANGESETS_PAGE.fetch, { pageIndex }],
          autoDismiss: 1
        })
      );
    }
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
      filters: filtersType,
      pageIndex: number,
      token,
      aoiId
    ] = yield select((state: RootStateType) => [
      state.filters.get('filters'),
      state.changesetsPage.get('pageIndex'),
      state.auth.get('token'),
      state.aoi.get('aoi').get('id')
    ]);
    let newData = yield call(
      fetchChangesetsPage,
      pageIndex,
      filters,
      token,
      nocache,
      aoiId
    );
    let oldData = yield select((state: RootStateType) =>
      state.changesetsPage.get('currentPage')
    );
    let diff = 0;
    if (oldData) {
      newData = fromJS(newData.features.map(f => f.id)).toSet();
      oldData = oldData
        .get('features')
        .map(f => f.get('id'))
        .toSet();
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
