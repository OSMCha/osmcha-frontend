// @flow
import { put, call, select, all, takeLatest } from 'redux-saga/effects';
import { fromJS, Map } from 'immutable';
import { push } from 'react-router-redux';

import { tokenSelector } from './auth_actions';
import { fetchAOI, createAOI, updateAOI } from '../network/aoi';
import type { filtersType } from '../components/filters';
import type { RootStateType } from './';

export const AOI = {
  fetch: 'AOI.fetch',
  clear: 'AOI.clear',
  fetched: 'AOI.fetched',
  create: 'AOI.create',
  update: 'AOI.update',
  loading: 'AOI.loading',
  error: 'AOI.error'
};

export function action(type: string, payload: ?Object) {
  return { type, ...payload };
}

export const applyUpdateAOI = (
  aoiId: string,
  name: string,
  filters: filtersType
) => action(AOI.update, { aoiId, name, filters });

export const applyCreateAOI = (name: string, filters: filtersType) =>
  action(AOI.create, { name, filters });

export function* watchAOI(): any {
  yield all([
    takeLatest(AOI.update, updateAOISaga),
    takeLatest(AOI.create, createAOISaga)
  ]);
}

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

export function* createAOISaga({
  name,
  filters
}: {
  name: string,
  filters: filtersType
}): any {
  yield put(action(AOI.loading, { loading: true }));
  const token = yield select(tokenSelector);
  const data = yield call(createAOI, token, name, filters);
  const aoi = fromJS(data);
  yield put(action(AOI.fetched, { aoi }));
  let location = yield select(locationSelector);
  const aoiId = aoi.id;
  yield put(
    push({
      ...location,
      pathname: location.pathname,
      search: `aoi=${aoiId}`
    })
  );
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
  yield put(action(AOI.fetched, { aoi }));
}

export const locationSelector = (state: RootStateType) =>
  state.routing.location;
