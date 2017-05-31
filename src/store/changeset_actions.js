// @flow
import { put, call, take, fork, select, cancel } from 'redux-saga/effects';

import { fromJS, Map } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

import { fetchChangeset, setHarmful } from '../network/changeset';
import { getChangesetIdFromLocation } from '../utils/routing';

import type { RootStateType } from './';

export const CHANGESET_GET = 'CHANGESET_GET';
export const CHANGESET_FETCHED = 'CHANGESET_FETCHED';
export const CHANGESET_CHANGE = 'CHANGESET_CHANGE';
export const CHANGESET_LOADING = 'CHANGESET_LOADING';
export const CHANGESET_ERROR = 'CHANGESET_ERROR';

export const CHANGESET_MAP_LOADING = 'CHANGESET_MAP_FETCH_LOADING';
export const CHANGESET_MAP_FETCHED = 'CHANGESET_MAP_FETCHED';
export const CHANGESET_MAP_CHANGE = 'CHANGESET_MAP_CHANGE';
export const CHANGESET_MAP_ERROR = 'CHANGESET_MAP_ERROR';

export const CHANGESET_MODIFY_HARMFUL = 'CHANGESET_MODIFY_HARMFUL';
export const CHANGESET_MODIFY = 'CHANGESET_MODIFY';
export const CHANGESET_MODIFY_REVERT = 'CHANGESET_MODIFY_REVERT';
export function action(type: string, payload: ?Object) {
  return { type, ...payload };
}

// public
// starting point for react component to start fetch
export const getChangeset = (changesetId: number) =>
  action(CHANGESET_GET, { changesetId });

export const handleChangesetModify = (
  changesetId: number,
  changeset: Map<string, *>,
  harmful: boolean
) => action(CHANGESET_MODIFY_HARMFUL, { changesetId, changeset, harmful });

// watches for LOCATION_CHANGE and only
// dispatches the latest one to get changeset
// and cMap details. It cancels the ongoign tasks
// if route changes in between.
export function* watchChangeset(): any {
  let changesetTask;
  let changesetMapTask;
  while (true) {
    const location = yield take(LOCATION_CHANGE);
    // cancel any existing changeset tasks,
    // even if it doesnt change to `changesets/:id`
    // we anway would like to suspend the ongoing task
    // to save resouces
    if (changesetTask) yield cancel(changesetTask);
    if (changesetMapTask) yield cancel(changesetMapTask);

    // extracts the new changesetId param from location object
    let changesetId = getChangesetIdFromLocation(location);
    if (!changesetId) continue; // skip for non changesets/:id routes

    let oldChangesetId = yield select((state: RootStateType) =>
      state.changeset.get('changesetId')
    );

    if (oldChangesetId !== changesetId) {
      // on forking: https://redux-saga.js.org/docs/advanced/Concurrency.html
      changesetTask = yield fork(fetchChangesetAction, changesetId);
      changesetMapTask = yield fork(fetchChangesetMapAction, changesetId);
    }
  }
}

export function* watchModifyChangeset(): any {
  while (true) {
    const modifyAction = yield take([CHANGESET_MODIFY_HARMFUL]); // scope for multiple actions in future
    const token = yield select((state: RootStateType) =>
      state.auth.get('token')
    ); // TOFIX handle token not existing

    // all modify actions should have changesetId, oldChangeset
    const { changesetId, oldChangeset } = modifyAction;

    if (!oldChangeset || !token) {
      continue;
    }
    try {
      switch (modifyAction.type) {
        case CHANGESET_MODIFY_HARMFUL: {
          const harmful = modifyAction.harmful;
          yield call(setHarmfulAction, {
            changesetId,
            oldChangeset,
            token,
            harmful
          });
          break;
        }
        default: {
          continue;
        }
      }
    } catch (error) {
      console.error(error);
      yield put(
        action(CHANGESET_MODIFY_REVERT, {
          changesetId,
          changeset: oldChangeset
        })
      );
    }
  }
}

/** Sagas **/

export function* fetchChangesetAction(changesetId: number): Object {
  let changeset = yield select((state: RootStateType) =>
    state.changeset.get('changesets').get(changesetId)
  );
  // check if the changeset already exists
  // if it does make it active and exit
  if (changeset) {
    yield put(
      action(CHANGESET_CHANGE, {
        changesetId
      })
    );
    return;
  }

  yield put(
    action(CHANGESET_LOADING, {
      changesetId
    })
  );

  try {
    let token = yield select((state: RootStateType) => state.auth.get('token'));
    changeset = yield call(fetchChangeset, changesetId, token);
    yield put(
      action(CHANGESET_FETCHED, {
        data: fromJS(changeset),
        changesetId
      })
    );
  } catch (error) {
    console.log(error);
    yield put(
      action(CHANGESET_ERROR, {
        changesetId,
        error
      })
    );
  }
}

export function* fetchChangesetMapAction(changesetId: number): Object {
  let getCMapData;
  let changesetMap = yield select((state: RootStateType) =>
    state.changeset.get('changesetMap').get(changesetId)
  );
  if (changesetMap) {
    yield put(
      action(CHANGESET_MAP_CHANGE, {
        changesetId
      })
    );
    return;
  }

  yield put(
    action(CHANGESET_MAP_LOADING, {
      changesetId
    })
  );
  try {
    if (!getCMapData) {
      const importPromise = new Promise(resolve =>
        import('changeset-map').then(module => resolve(module.getChangeset))
      );
      const awaitPromise = () => Promise.resolve(importPromise);
      getCMapData = yield call(awaitPromise);
    }
    changesetMap = yield call(getCMapData, changesetId);
    yield put(
      action(CHANGESET_MAP_FETCHED, {
        data: changesetMap,
        changesetId
      })
    );
  } catch (error) {
    console.error(error);
    yield put(
      action(CHANGESET_MAP_ERROR, {
        changesetId,
        error
      })
    );
  }
}

export function* setHarmfulAction({
  changesetId,
  oldChangeset,
  token,
  harmful
}: Object): any {
  const newChangeset = oldChangeset
    .setIn(['properties', 'checked'], true)
    .setIn(['properties', 'harmful'], harmful);
  yield put(
    action(CHANGESET_MODIFY, {
      changesetId,
      changeset: newChangeset
    })
  );
  yield call(setHarmful, changesetId, token, harmful);
}
