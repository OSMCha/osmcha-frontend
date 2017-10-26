// @flow
import {
  put,
  call,
  take,
  fork,
  select,
  cancel,
  all,
  takeLatest
} from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS, List, Map } from 'immutable';
import { push } from 'react-router-redux';

import { getSearchObj, getObjAsQueryParam } from '../utils/query_params';
import { validateFilters } from '../utils/filters';
import { tokenSelector } from './auth_actions';

import {
  fetchAOI,
  fetchAllAOIs,
  createAOI,
  updateAOI,
  deleteAOI
} from '../network/aoi';

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

export const FILTERS = {
  set: 'FILTERS_SET',
  apply: 'FILTERS_APPLY'
};

export const AOI = {
  fetch: 'AOI.fetch',
  clear: 'AOI.clear',
  fetched: 'AOI.fetched',
  update: 'AOI.update',
  loading: 'AOI.loading',
  error: 'AOI.error'
};

export function action(type: string, payload: ?Object) {
  return { type, ...payload };
}

export const applyFilters = (filters: filtersType, pathname: ?string) =>
  action(FILTERS.apply, { filters, pathname });

export const applyUpdateAOI = (
  aoiId: string,
  name: string,
  filters: filtersType
) => action(AOI.update, { aoiId, name, filters });

export function* watchFilters(): any {
  yield all([
    watchLocationChange(),
    takeLatest(FILTERS.apply, applyFilterSaga)
  ]);
}

export function* watchAOI(): any {
  yield all([watchLocationChange(), takeLatest(AOI.update, applyUpdateAOI)]);
}

export function* watchLocationChange(): any {
  let lastTask;
  let lastSearchString;
  while (true) {
    const action = yield take(LOCATION_CHANGE);
    const location = action.payload;

    if (lastSearchString === location.search) {
      continue;
    }
    lastSearchString = location.search;

    if (lastTask) {
      yield cancel(lastTask);
    }
    lastTask = yield fork(filtersSaga, location);
  }
}

export function* applyFilterSaga({
  filters,
  pathname
}: {
  filters: filtersType,
  pathname: string
}): any {
  const search = getObjAsQueryParam('filters', filters.toJS());
  let location = yield select(locationSelector);
  // I could find one comment on `push(location)` in the readme
  // ref: https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux
  yield put(
    push({
      ...location,
      pathname: pathname || location.pathname,
      search // update the search
    })
  );
}

export function* filtersSaga(location: Object): any {
  try {
    // the url can only contain two things `filters` or `aoiId`
    let { filters, aoi: aoiId } = getSearchObj(location.search).toObject();

    if (!filters) filters = Map();

    if (aoiId) {
      filters = yield call(fetchAOISaga, aoiId);
    } else {
      // if there is no active AOI in use
      // we might want to clear so that other
      // sagas continue using regular filters.
      yield put(action(AOI.clear));
    }
    // NOTE! `validateFilters` will throw an Error if invalid
    yield call(validateFilters, filters);
    yield put(
      action(FILTERS.set, {
        filters
      })
    );
    yield put(action(CHANGESETS_PAGE.fetch, { pageIndex: 0, filters }));
  } catch (e) {
    console.error(e);
    const location = yield select(locationSelector);
    location.search = '';
    yield all([
      put(
        modal({
          error: e
        })
      ),
      put(push(location))
    ]);
  }
}

// let changesetTask;
// let changesetMapTask;

// export function* filtersProcess
export function* fetchAOISaga(aoiId: string): any {
  yield put(action(AOI.loading, { loading: true }));
  const token = yield select(tokenSelector);
  const data = yield call(fetchAOI, token, aoiId);
  const aoi = fromJS(data);
  yield put(action(AOI.fetched, { aoi }));
  let filters = aoi.getIn(['properties', 'filters'], Map());
  filters = filters.map((v, k) => {
    const options = v.split(',');
    return fromJS(
      options.map(o => ({
        value: o,
        label: o
      }))
    );
  });
  return filters;
}

export function* updateAOISaga({
  aoiId,
  name,
  filters
}: {
  aoiId: string,
  name: string,
  filters: filtersType
}): any {
  yield put(action(AOI.loading, { loading: true }));
  const token = yield select(tokenSelector);
  const data = yield call(updateAOI, token, aoiId, name, filters);
  const aoi = fromJS(data);
  yield put(action(AOI.updated, { aoi }));
  let new_filters = aoi.getIn(['properties', 'filters'], Map());
  new_filters = filters.map((v, k) => {
    const options = v.split(',');
    return fromJS(
      options.map(o => ({
        value: o,
        label: o
      }))
    );
  });
  return new_filters;
}

export const locationSelector = (state: RootStateType) =>
  state.routing.location;

/** Sagas **/

export const filtersSelector = (state: RootStateType) =>
  state.filters.get('filters');
