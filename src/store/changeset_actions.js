// @flow
import {
  put,
  call,
  take,
  takeLatest,
  select,
  takeEvery
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { fromJS, Map } from 'immutable';

import { fetchChangeset, setHarmful } from '../network/changeset';
import { getChangeset as getCMapData } from 'changeset-map';

import type { RootStateType } from './';

export const CHANGESET_FETCH_ASYNC = 'CHANGESET_FETCH_ASYNC';
export const CHANGESET_FETCHED = 'CHANGESET_FETCHED';
export const CHANGESET_CHANGE = 'CHANGESET_CHANGE';
export const CHANGESET_LOADING = 'CHANGESET_LOADING';
export const CHANGESET_ERROR = 'CHANGESET_ERROR';

export const CHANGESET_MAP_LOADING = 'CHANGESET_MAP_FETCH_LOADING';
export const CHANGESET_MAP_FETCHED = 'CHANGESET_MAP_FETCHED';
export const CHANGESET_MAP_ERROR = 'CHANGESET_MAP_ERROR';
export const CHANGESET_MAP_CHANGE = 'CHANGESET_MAP_CHANGE';

export const CHANGESET_MODIFY_HARMFUL = 'CHANGESET_MODIFY_HARMFUL';
export const CHANGESET_MODIFY = 'CHANGESET_MODIFY';
export const CHANGESET_MODIFY_REVERT = 'CHANGESET_MODIFY_REVERT';

export function action(type: string, payload: ?Object) {
  return { type, ...payload };
}

// public
// starting point for react component to start fetch
export const getChangeset = (changesetId: number) =>
  action(CHANGESET_FETCH_ASYNC, { changesetId });

export const handleChangesetModify = (
  changesetId: number,
  changeset: Map<string, *>,
  harmful: boolean
) => action(CHANGESET_MODIFY_HARMFUL, { changesetId, changeset, harmful });

// watches for CHANGESET_FETCH_ASYNC and only
// dispatches latest tofetchChangesetsPageAsync
export function* watchChangeset(): any {
  yield [
    takeLatest(CHANGESET_FETCH_ASYNC, fetchChangesetAndChangesetMapAction),
    modifyChangeset()
  ]; // on forking or not https://github.com/redux-saga/redux-saga/issues/178
}

export function* modifyChangeset(): any {
  while (true) {
    const modifyAction = yield take([CHANGESET_MODIFY_HARMFUL]);

    const changesetId = modifyAction.changesetId;
    let oldChangeset = modifyAction.changeset;
    let token = yield select((state: RootStateType) => state.auth.get('token')); // TOFIX handle token not existing

    console.log('here', changesetId, oldChangeset, token);

    if (!oldChangeset || !token) {
      continue;
    }
    try {
      switch (modifyAction.type) {
        case CHANGESET_MODIFY_HARMFUL: {
          console.log('here');
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
      console.log(error);
      yield put(
        action(CHANGESET_MODIFY_REVERT, {
          changesetId,
          changeset: oldChangeset
        })
      );
    }

    // yield fork(fetchPosts, action);
  }
}

/** Sagas **/
export function* fetchChangesetAndChangesetMapAction({
  changesetId
}: {
  changesetId: number
}): Object {
  // run both in parallel
  yield [
    call(fetchChangesetAction, { changesetId }),
    call(fetchChangesetMapAction, { changesetId })
  ];
}

export function* fetchChangesetAction({
  changesetId
}: {
  changesetId: number
}): Object {
  // check if the changeset already exists
  let changeset = yield select((state: RootStateType) =>
    state.changeset.get('changesets').get(changesetId)
  );

  if (changeset) {
    yield put(
      action(CHANGESET_CHANGE, {
        changesetId
      })
    );
  } else {
    yield put(
      action(CHANGESET_LOADING, {
        changesetId
      })
    );

    try {
      let token = yield select((state: RootStateType) =>
        state.auth.get('token')
      );
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
}

export function* fetchChangesetMapAction({
  changesetId
}: {
  changesetId: number
}): Object {
  let changesetMap = yield select((state: RootStateType) =>
    state.changeset.get('changesetMap').get(changesetId)
  );
  if (changesetMap) {
    yield put(
      action(CHANGESET_MAP_CHANGE, {
        changesetId
      })
    );
  } else {
    try {
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
  console.log(newChangeset.toJS());
  yield put(
    action(CHANGESET_MODIFY, {
      changesetId,
      changeset: newChangeset
    })
  );
  yield call(setHarmful, changesetId, token, harmful);
}
