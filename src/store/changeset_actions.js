// @flow
import { put, call, take, fork, select, cancel } from 'redux-saga/effects';

import { fromJS, Map, List } from 'immutable';
import { LOCATION_CHANGE, replace, push } from 'react-router-redux';
import notifications from '../config/notifications';

import {
  fetchChangeset,
  fetchAndParseAugmentedDiff,
  setHarmful,
  setTag
} from '../network/changeset';
import { fetchChangesetMetadata } from '../network/openstreetmap';

import {
  getChangesetIdFromLocation,
  checkForLegacyURL
} from '../utils/routing';

import type { RootStateType } from './';
import { modal } from './modal_actions';

import { CHANGESETS_PAGE } from './changesets_page_actions';

export const CHANGESET = {
  fetch: 'CHANGESET.fetch',
  fetched: 'CHANGESET.fetched',
  change: 'CHANGESET.change',
  loading: 'CHANGESET.loading',
  error: 'CHANGESET.error'
};
export const CHANGESET_MODIFY = {
  modify: 'CHANGESET_MODIFY.modify',
  harmful: 'CHANGESET_MODIFY.harmful',
  revert: 'CHANGESET_MODIFY.revert',
  tag: 'CHANGESET_MODIFY.tag'
};
export const CHANGESET_MAP = {
  fetched: 'CHANGESET_MAP.fetched',
  loading: 'CHANGESET_MAP.loading',
  change: 'CHANGESET_MAP.change',
  error: 'CHANGESET_MAP.error'
};

export function action(type: string, payload: ?Object) {
  return { type, ...payload };
}

// public
// starting point for react component to start fetch
export const getChangeset = (changesetId: number) =>
  action(CHANGESET.fetch, { changesetId });

export const handleChangesetModifyHarmful = (
  changesetId: number,
  changeset: Map<string, *>,
  harmful: boolean | -1
) =>
  action(CHANGESET_MODIFY.harmful, {
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
  action(CHANGESET_MODIFY.tag, {
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
    const { payload: location } = yield take(LOCATION_CHANGE);
    const changesetId = yield call(shouldUpdateSaga, location);
    if (changesetId) {
      /**
       *  cancel any existing changeset tasks,
       *  even if it doesnt change to `changesets/:id`
       *  we anway would like to suspend the ongoing task
       *  to save resouces
       */
      if (changesetTask) yield cancel(changesetTask);
      if (changesetMapTask) yield cancel(changesetMapTask);

      changesetTask = yield fork(fetchChangesetAction, changesetId);
      changesetMapTask = yield fork(fetchChangesetMapAction, changesetId);
    }
  }
}

export function* shouldUpdateSaga(location: Object): any {
  // checks for the old osmcha style urls
  // eg osmcha.org/34354242 and redirects them
  // to osmcha.org/changesets/3432434
  const legacy = checkForLegacyURL(location);
  if (legacy) {
    yield put(
      replace({
        ...location,
        pathname: '/changesets/' + legacy
      })
    );
    return false;
  }
  let changesetId = getChangesetIdFromLocation(location);

  if (!changesetId) return false;

  let oldChangesetId = yield select(
    (state: RootStateType) =>
      !state.changeset.get('errorChangeset') &&
      !state.changeset.get('errorChangesetMap') &&
      state.changeset.get('changesetId')
  );

  if (oldChangesetId !== changesetId) {
    return changesetId;
  }
}

export function* watchModifyChangeset(): any {
  while (true) {
    const modifyAction = yield take([
      CHANGESET_MODIFY.harmful,
      CHANGESET_MODIFY.tag
    ]); // scope for multiple modify actions in future
    const { token, username } = yield select((state: RootStateType) => ({
      token: state.auth.get('token'),
      username: state.auth.getIn(['userDetails', 'username'])
    }));
    if (!token) {
      yield put(
        modal({
          ...notifications.NOT_LOGGED_IN
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
        case CHANGESET_MODIFY.harmful: {
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
        case CHANGESET_MODIFY.tag: {
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
        action(CHANGESET_MODIFY.revert, {
          changesetId,
          changeset: oldChangeset
        })
      );
      yield put(
        modal({
          error
        })
      );
    }
    // update the change in changeset list also aka changesetP
    if (newChangeset) {
      yield put(
        action(CHANGESETS_PAGE.modify, {
          changesetId,
          changeset: newChangeset
        })
      );
    }
  }
}

export const changesetsSelector = (state: RootStateType) => {
  return state.changeset.getIn(['changesets'], Map());
};
export const tokenSelector = (state: RootStateType) => state.auth.get('token');
export const locationSelector = (state: RootStateType) =>
  state.routing.location;

/** Sagas **/
export function* fetchChangesetAction(changesetId: number): Object {
  let changesets = yield select(changesetsSelector);
  let changeset = changesets.get(changesetId);
  // check if the changeset already exists
  // if it does! make it active and exit
  if (changeset) {
    yield put(
      action(CHANGESET.change, {
        changesetId
      })
    );
    return;
  }

  yield put(
    action(CHANGESET.loading, {
      changesetId
    })
  );

  try {
    let token = yield select(tokenSelector);
    changeset = yield call(fetchChangeset, changesetId, token);
    yield put(
      action(CHANGESET.fetched, {
        data: fromJS(changeset),
        changesetId
      })
    );
  } catch (error) {
    yield put(
      action(CHANGESET.error, {
        changesetId,
        error
      })
    );
    const location = yield select(locationSelector);
    error.name = `Changeset:${changesetId} failed`;
    yield put(
      modal({
        error,
        callback: push,
        callbackArgs: [location],
        callbackLabel: 'Retry'
      })
    );
  }
}

export const changesetMapSelector = (state: RootStateType) =>
  state.changeset.getIn(['changesetMap'], Map());

export function* fetchChangesetMapAction(changesetId: number): Object {
  const changesetMaps = yield select(changesetMapSelector);
  let changesetMap = changesetMaps.get(changesetId);

  if (changesetMap) {
    yield put(
      action(CHANGESET_MAP.change, {
        changesetId
      })
    );
    return;
  }
  yield put(
    action(CHANGESET_MAP.loading, {
      changesetId
    })
  );
  try {
    let metadata = yield call(fetchChangesetMetadata, changesetId);
    let adiff = yield call(fetchAndParseAugmentedDiff, changesetId);

    yield put(
      action(CHANGESET_MAP.fetched, {
        data: { metadata, adiff },
        changesetId
      })
    );
  } catch (error) {
    yield put(
      action(CHANGESET_MAP.error, {
        changesetId,
        error
      })
    );
    const location = yield select(locationSelector);
    error.name = `Changeset:${changesetId} Map failed`;
    yield put(
      modal({
        error,
        callback: push,
        callbackArgs: [location],
        callbackLabel: 'Retry'
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
    action(CHANGESET_MODIFY.modify, {
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
      action(CHANGESET_MODIFY.modify, {
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
