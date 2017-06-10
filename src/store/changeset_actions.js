// @flow
import { put, call, take, fork, select, cancel } from 'redux-saga/effects';

import { fromJS, Map, List } from 'immutable';
import { LOCATION_CHANGE, push } from 'react-router-redux';

import { fetchChangeset, setHarmful, setTag } from '../network/changeset';
import * as errorMessages from '../config/error_messages';

import { getChangesetIdFromLocation } from '../utils/routing';

import type { RootStateType } from './';

import { CHANGESET_PAGE_MODIFY_CHANGESET } from './changesets_page_actions';
import { INIT_MODAL } from './modal_actions';

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
export const CHANGESET_MODIFY_TAG = 'CHANGESET_MODIFY_TAG';

export function action(type: string, payload: ?Object) {
  return { type, ...payload };
}

// public
// starting point for react component to start fetch
export const getChangeset = (changesetId: number) =>
  action(CHANGESET_GET, { changesetId });

export const handleChangesetModifyHarmful = (
  changesetId: number,
  changeset: Map<string, *>,
  harmful: boolean | -1
) =>
  action(CHANGESET_MODIFY_HARMFUL, {
    oldChangeset: changeset,
    changesetId,
    harmful
  });

export const handleChangesetModifyTag = (
  changesetId: number,
  changeset: Map<string, *>,
  tag: Object,
  remove: boolean
) =>
  action(CHANGESET_MODIFY_TAG, {
    oldChangeset: changeset,
    changesetId,
    tag,
    remove
  });

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

    let oldChangesetId = yield select(
      (state: RootStateType) =>
        !state.changeset.get('errorChangeset') &&
        !state.changeset.get('errorChangesetMap') &&
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
    const modifyAction = yield take([
      CHANGESET_MODIFY_HARMFUL,
      CHANGESET_MODIFY_TAG
    ]); // scope for multiple modify actions in future
    const { token, username } = yield select((state: RootStateType) => ({
      token: state.auth.get('token'),
      username: state.auth.getIn(['userDetails', 'username'])
    }));
    if (!token) {
      yield put(
        action(INIT_MODAL, {
          payload: {
            kind: 'warning',
            dismiss: true,
            autoDismiss: 5,
            title: errorMessages.NOT_LOGGED_IN.title,
            description: errorMessages.NOT_LOGGED_IN.description()
          }
        })
      );
      continue;
    }
    // all modify actions should have changesetId, oldChangeset
    const { changesetId, oldChangeset } = modifyAction;

    if (!oldChangeset) {
      continue;
    }
    let newChangeset;
    try {
      switch (modifyAction.type) {
        case CHANGESET_MODIFY_HARMFUL: {
          const harmful = modifyAction.harmful;
          newChangeset = yield call(setHarmfulAction, {
            changesetId,
            oldChangeset,
            token,
            harmful,
            username
          });
          break;
        }
        case CHANGESET_MODIFY_TAG: {
          const { tag, remove } = modifyAction;
          newChangeset = yield call(setTagActions, {
            changesetId,
            oldChangeset,
            token,
            tag,
            remove
          });
          break;
        }
        default: {
          continue;
        }
      }
    } catch (error) {
      yield put(
        action(CHANGESET_MODIFY_REVERT, {
          changesetId,
          changeset: oldChangeset
        })
      );
      var messageToDisplay;
      switch (error.message) {
        case errorMessages.ADD_TAG_TO_UNCHECKED.serverMessage:
          messageToDisplay = errorMessages.ADD_TAG_TO_UNCHECKED;
          break;
        case errorMessages.ADD_TAG_TO_CHECKED_BY_OTHER.serverMessage:
          messageToDisplay = errorMessages.ADD_TAG_TO_CHECKED_BY_OTHER;
          break;
        case errorMessages.ADD_TAG_NO_PERMISSION.serverMessage:
          messageToDisplay = errorMessages.ADD_TAG_NO_PERMISSION;
          break;
        default:
          messageToDisplay = errorMessages.ADD_TAG_DEFAULT;
      }
      yield put(
        action(INIT_MODAL, {
          payload: {
            error,
            kind: 'error',
            dismiss: true,
            autoDismiss: 0,
            title: messageToDisplay.title,
            description: messageToDisplay.description(changesetId)
          }
        })
      );
    }
    // update the change in changeset list also aka changesetP
    if (newChangeset) {
      yield put(
        action(CHANGESET_PAGE_MODIFY_CHANGESET, {
          changesetId,
          changeset: newChangeset
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
    yield put(
      action(CHANGESET_ERROR, {
        changesetId,
        error
      })
    );
    const location = yield select(
      (state: RootStateType) => state.routing.location
    );
    yield put(
      action(INIT_MODAL, {
        payload: {
          error,
          kind: 'error',
          dismiss: true,
          autoDismiss: 0,
          title: 'Changeset Details Failed',
          description: `Changeset Details for ID: ${changesetId} failed to load, please wait for a while and click retry.`,
          callbackLabel: `Retry ${changesetId}`
        },
        callback: push,
        callbackArgs: [location]
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
    yield put(
      action(CHANGESET_MAP_ERROR, {
        changesetId,
        error
      })
    );
    const location = yield select(
      (state: RootStateType) => state.routing.location
    );
    yield put(
      action(INIT_MODAL, {
        payload: {
          error,
          kind: 'error',
          dismiss: true,
          autoDismiss: 0,
          title: 'Changeset Map Failed',
          description: `Changeset map for ID: ${changesetId} failed to load, please wait for a while and click retry.`,
          callbackLabel: `Retry ${changesetId}`
        },
        callback: push,
        callbackArgs: [location]
      })
    );
  }
}

export function* setHarmfulAction({
  changesetId,
  oldChangeset,
  token,
  harmful,
  username
}: Object): any {
  const newChangeset = oldChangeset
    .setIn(['properties', 'check_user'], harmful === -1 ? null : username)
    // .setIn(
    //   ['properties', 'tags'],
    //   harmful === -1 ? List() : oldChangeset.getIn(['properties', 'tags'])
    // )
    .setIn(['properties', 'checked'], harmful === -1 ? false : true)
    .setIn(['properties', 'harmful'], harmful === -1 ? null : harmful);

  // update changeset list

  yield put(
    action(CHANGESET_MODIFY, {
      changesetId,
      changeset: newChangeset
    })
  );
  yield call(setHarmful, changesetId, token, harmful);
  return newChangeset;
}

export function* setTagActions({
  changesetId,
  oldChangeset,
  token,
  tag,
  remove
}: Object): any {
  if (oldChangeset.getIn(['properties', 'checked'])) {
    // TOFIX also check for user
    let newChangeset = oldChangeset;
    let existingTags: List<*>;
    if (remove) {
      existingTags = oldChangeset.getIn(['properties', 'tags']);
      let key;
      existingTags.forEach((t, i) => {
        if (t.get('id') === tag.value) {
          key = i;
        }
      });
      newChangeset = oldChangeset.setIn(
        ['properties', 'tags'],
        existingTags.delete(key)
      );
    } else {
      // TOFIX consolidate the convention of backend using id and name
      // and I using label and value.
      existingTags = oldChangeset.getIn(['properties', 'tags']);
      newChangeset = oldChangeset.setIn(
        ['properties', 'tags'],
        existingTags.push(new Map().set('id', tag.value).set('name', tag.label))
      );
    }

    yield put(
      action(CHANGESET_MODIFY, {
        changesetId,
        changeset: newChangeset
      })
    );
    yield call(setTag, changesetId, token, tag, remove);
    return newChangeset;
  } else {
    throw new Error('Only allowed on checked changesets');
  }
}
