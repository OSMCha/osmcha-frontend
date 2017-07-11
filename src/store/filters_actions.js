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

import { fetchAOI } from '../network/aoi';

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

export function action(type: string, payload: ?Object) {
  return { type, ...payload };
}

export const applyFilters = (filters: filtersType, pathname: ?string) =>
  action(FILTERS.apply, { filters, pathname });

export function* watchFilters(): any {
  yield all([
    watchLocationChange(),
    takeLatest(FILTERS.apply, applyFilterSaga)
  ]);
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
    let { filters, aoiId } = getSearchObj(location.search).toObject();

    if (!filters) filters = Map();

    if (aoiId) {
      filters = yield call(aoiSaga, aoiId);
    }
    // `validateFilters` will change location.search
    // if invalid filters, i.e. current filtersProcessSaga
    // would get cancelled.
    yield call(validateFiltersSaga, filters);
    yield put(
      action(FILTERS.set, {
        filters
      })
    );
    yield put(action(CHANGESETS_PAGE.fetch, { pageIndex: 0, filters }));
  } catch (e) {
    console.error(e);
  }
}

// let changesetTask;
// let changesetMapTask;

// export function* filtersProcess
export function* aoiSaga(aoiId: number): any {
  try {
    const data = yield call(fetchAOI, aoiId);
  } catch (e) {
    console.log(e);
  }
}
export const locationSelector = (state: RootStateType) =>
  state.routing.location;

/** Sagas **/
// export function* filtersSaga({
//   filters,
//   pathname
// }: {
//   filters: filtersType,
//   pathname: ?Object
// }): Object {
//   try {
//     yield call(validateFiltersSaga, filters);
//     filters = appendDefaultDate(filters);
//     const search = getObjAsQueryParam('filters', filters.toJS());
//     let location = yield select(locationSelector);
//     // console.log(location);
//     location = {
//       ...location,
//       pathname: pathname || location.pathname,
//       search // update the search
//     };
//     // fill the empty Obj with default `from_date`
//     if (filters && filters.size === 0) {
//       filters = getDefaultFromDate();
//     }
//     // documentation is spotty about push,
// I could find one comment on `push(location)` in the readme
// ref: https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux
//     yield all([
//       put(push(location)),
//       put(
//         action(FILTERS.set, {
//           filters
//         })
//       )
//     ]);

//     // update the results, using `put` so that
//     // watchChangesetsPage's `takeLatest` can avoid repititions
//     yield put(action(CHANGESETS_PAGE.fetch, { pageIndex: 0 }));
//   } catch (e) {
//     console.error(e);
//   }
// }

export function* validateFiltersSaga(filters: filtersType): any {
  const valid = validateFilters(filters);
  if (!valid) {
    const location = yield select(locationSelector);
    location.search = '';
    yield all([
      put(
        modal({
          error: Error('The filters that you applied were not correct.')
        })
      ),
      put(push(location))
    ]);
  }
}

export const filtersSelector = (state: RootStateType) =>
  state.filters.get('filters');
