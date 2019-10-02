// @flow
import { put, call, select, all, takeLatest } from 'redux-saga/effects';
import { fromJS, Map } from 'immutable';
import { push } from 'react-router-redux';

import { fetchAOI, createAOI, updateAOI } from '../network/aoi';
import { fetchReasons, fetchTags } from '../network/reasons_tags';
import { validateFilters } from '../utils/filters';
import { CHANGESETS_PAGE, FILTERS } from './filters_actions';
import { tokenSelector } from './auth_actions';
import { modal } from './modal_actions';
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
  const reasons = yield call(fetchReasons, token);
  const tags = yield call(fetchTags, token);
  const aoi = fromJS(data);
  yield put(action(AOI.fetched, { aoi }));
  let filters = aoi.getIn(['properties', 'filters'], Map());
  filters = filters.map((v, k) => {
    if (k === 'reasons') {
      return fromJS(
        v.split(',').map(o => ({
          value: o,
          label: reasons.filter(i => i.id == o)[0]['name']
        }))
      );
    }
    if (k === 'tags') {
      return fromJS(
        v.split(',').map(o => ({
          value: o,
          label: tags.filter(i => i.id == o)[0]['name']
        }))
      );
    }
    try {
      if (JSON.parse(v) && JSON.parse(v).hasOwnProperty('coordinates')) {
        return fromJS([
          {
            value: JSON.parse(v),
            label: JSON.parse(v)
          }
        ]);
      } else {
        throw SyntaxError;
      }
    } catch (e) {
      const options = v.split(',');
      return fromJS(
        options.map(o => ({
          value: o,
          label: o
        }))
      );
    }
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
  try {
    yield put(action(AOI.loading, { loading: true }));
    const token = yield select(tokenSelector);
    const data = yield call(createAOI, token, name, filters);
    const aoi = fromJS(data);
    yield put(action(AOI.fetched, { aoi }));
    let location = yield select(locationSelector);
    yield put(
      push({
        ...location,
        pathname: location.pathname,
        search: `aoi=${data.id}`
      })
    );
  } catch (e) {
    console.error(e);
    yield put(
      modal({
        error: e
      })
    );
  }
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
  try {
    yield put(action(AOI.loading, { loading: true }));
    const token = yield select(tokenSelector);
    const data = yield call(updateAOI, token, aoiId, name, filters);
    const aoi = fromJS(data);
    yield put(action(AOI.fetched, { aoi }));
    yield call(validateFilters, filters);
    yield put(
      action(FILTERS.set, {
        filters
      })
    );
    yield put(
      action(CHANGESETS_PAGE.fetch, { pageIndex: 0, aoiId: aoiId, filters })
    );
  } catch (e) {
    console.error(e);
    yield put(
      modal({
        error: e
      })
    );
  }
}

export const locationSelector = (state: RootStateType) =>
  state.routing.location;
