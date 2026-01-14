import { fromJS, Map } from "immutable";
import { push } from "react-router-redux";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import type { filtersType } from "../components/filters";
import { createAOI, fetchAOI, updateAOI } from "../network/aoi";
import { fetchReasons, fetchTags } from "../network/reasons_tags";
import { validateFilters } from "../utils/filters";
import type { RootStateType } from "./";
import { tokenSelector } from "./auth_actions";
import { CHANGESETS_PAGE, FILTERS } from "./filters_actions";
import { modal } from "./modal_actions";

export const AOI = {
  fetch: "AOI.fetch",
  clear: "AOI.clear",
  fetched: "AOI.fetched",
  create: "AOI.create",
  update: "AOI.update",
  loading: "AOI.loading",
  error: "AOI.error",
};

export function action(type: string, payload?: any | null) {
  return { type, ...payload };
}

export const applyUpdateAOI = (
  aoiId: string,
  name: string,
  filters: filtersType,
) => action(AOI.update, { aoiId, name, filters });

export const applyCreateAOI = (name: string, filters: filtersType) =>
  action(AOI.create, { name, filters });

export function* watchAOI(): any {
  yield all([
    takeLatest(AOI.update, updateAOISaga as any),
    takeLatest(AOI.create, createAOISaga as any),
  ]);
}

export function* fetchAOISaga(aoiId: string): any {
  yield put(action(AOI.loading, { loading: true }));
  const token = yield select(tokenSelector);
  const data = yield call(fetchAOI, token, parseInt(aoiId, 10));
  const reasons = yield call(fetchReasons, token);
  const tags = yield call(fetchTags, token);
  const aoi = fromJS(data);
  yield put(action(AOI.fetched, { aoi }));
  let filters = aoi.getIn(["properties", "filters"], Map());
  filters = filters.map((v, k) => {
    if (k === "reasons") {
      return fromJS(
        v.split(",").map((o) => ({
          value: o,
          label: reasons.filter((i) => i.id === Number(o))[0].name,
        })),
      );
    }
    if (k === "tags") {
      return fromJS(
        v.split(",").map((o) => ({
          value: o,
          label: tags.filter((i) => i.id === Number(o))[0].name,
        })),
      );
    }
    try {
      const parsed = JSON.parse(v);
      if (parsed && "coordinates" in parsed) {
        return fromJS([
          {
            value: parsed,
            label: parsed,
          },
        ]);
      } else {
        throw SyntaxError;
      }
    } catch (_e) {
      const options = v.split(",");
      return fromJS(
        options.map((o) => ({
          value: o,
          label: o,
        })),
      );
    }
  });
  return filters;
}

export function* createAOISaga({
  name,
  filters,
  type,
}: {
  name: string;
  filters: filtersType;
  type?: string;
}): any {
  try {
    yield put(action(AOI.loading, { loading: true }));
    const token = yield select(tokenSelector);
    const data = yield call(createAOI, token, name, filters);
    const aoi = fromJS(data);
    yield put(action(AOI.fetched, { aoi }));
    const location = yield select(locationSelector);
    yield put(
      push({
        ...location,
        pathname: location.pathname,
        search: `aoi=${data.id}`,
      }),
    );
  } catch (e) {
    console.error(e);
    yield put(
      modal({
        error: e as Error,
      }),
    );
  }
}

export function* updateAOISaga({
  aoiId,
  name,
  filters,
  type,
}: {
  aoiId: string;
  name: string;
  filters: filtersType;
  type?: string;
}): any {
  try {
    yield put(action(AOI.loading, { loading: true }));
    const token = yield select(tokenSelector);
    const data = yield call(
      updateAOI,
      token,
      parseInt(aoiId, 10),
      name,
      filters,
    );
    const aoi = fromJS(data);
    yield put(action(AOI.fetched, { aoi }));
    yield call(validateFilters, filters);
    yield put(
      action(FILTERS.set, {
        filters,
      }),
    );
    yield put(
      action(CHANGESETS_PAGE.fetch, { pageIndex: 0, aoiId: aoiId, filters }),
    );
  } catch (e) {
    console.error(e);
    yield put(
      modal({
        error: e as Error,
      }),
    );
  }
}

export const locationSelector = (state: RootStateType) =>
  state.routing.location;
