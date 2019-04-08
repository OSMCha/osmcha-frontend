import { select } from 'redux-saga/effects';

import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';

import { fromJS, Map, List } from 'immutable';
import { fetchChangeset, setHarmful, setTag } from '../../network/changeset';

import {
  action,
  fetchChangesetAction,
  fetchChangesetMapAction,
  setHarmfulAction,
  setTagActions,
  changesetMapModule,
  changesetsSelector,
  tokenSelector,
  locationSelector,
  changesetMapSelector,
  CHANGESET,
  CHANGESET_MODIFY,
  CHANGESET_MAP
} from '../changeset_actions';

describe('fetchChangesetAction', () => {
  const changesetId = 50052312;
  const token = '2d2289bd78985b2b46af29607ee50fa37cb1723a';
  const changesets = Map();
  const changeset = {
    test: 'test'
  };
  const location = {
    pathname: '/changesets/50052312',
    search: '',
    hash: '',
    key: 'kyi6uj'
  };

  it('when existing changesetId', async () => {
    var changesets = Map().set(changesetId, {});
    return await expectSaga(fetchChangesetAction, changesetId)
      .provide([[select(changesetsSelector), changesets]])
      .put(
        action(CHANGESET.change, {
          changesetId
        })
      )
      .run();
  });
  it('when new changesetId', async () => {
    return await expectSaga(fetchChangesetAction, changesetId)
      .provide([
        [select(changesetsSelector), changesets],
        [select(tokenSelector), token],
        [matchers.call.fn(fetchChangeset), changeset]
      ])
      .put(
        action(CHANGESET.loading, {
          changesetId
        })
      )
      .put(
        action(CHANGESET.fetched, {
          data: fromJS(changeset),
          changesetId
        })
      )
      .run();
  });
  it('when network throws error', async () => {
    const error = new Error('error');
    return await expectSaga(fetchChangesetAction, changesetId)
      .provide([
        [select(changesetsSelector), changesets],
        [select(tokenSelector), token],
        [select(locationSelector), location],
        [matchers.call.fn(fetchChangeset), throwError(error)]
      ])
      .put(
        action(CHANGESET.loading, {
          changesetId
        })
      )
      .put(
        action(CHANGESET.error, {
          changesetId,
          error
        })
      )
      .put.actionType('INIT_MODAL')
      .run();
  });
});

describe('fetchChangesetMapAction', () => {
  const changesetId = 50052312;
  const changesetMap = Map();

  const location = {
    pathname: '/changesets/50052312',
    search: '',
    hash: '',
    key: 'kyi6uj'
  };

  it('existing changesetId', async () => {
    let newChangesetMap = changesetMap.set(changesetId, {});
    return await expectSaga(fetchChangesetMapAction, changesetId)
      .provide([[select(changesetMapSelector), newChangesetMap]])
      .put(
        action(CHANGESET_MAP.change, {
          changesetId
        })
      )
      .run();
  });
  it('when new changesetId', async () => {
    const mockChangesetMap = {
      geojson: {},
      featureMap: {},
      changeset: {}
    };
    return await expectSaga(fetchChangesetMapAction, changesetId)
      .provide([
        [select(changesetMapSelector), changesetMap],
        [matchers.call.fn(changesetMapModule), mockChangesetMap]
      ])
      .put(
        action(CHANGESET_MAP.loading, {
          changesetId
        })
      )
      .put(
        action(CHANGESET_MAP.fetched, {
          data: mockChangesetMap,
          changesetId
        })
      )
      .run();
  });
  it('when network throws error', async () => {
    const error = new Error('error');
    return await expectSaga(fetchChangesetMapAction, changesetId)
      .provide([
        [select(changesetMapSelector), changesetMap],
        [select(locationSelector), location],
        [matchers.call.fn(changesetMapModule), throwError(error)]
      ])
      .put(
        action(CHANGESET_MAP.loading, {
          changesetId
        })
      )
      .put(
        action(CHANGESET_MAP.error, {
          changesetId,
          error
        })
      )
      .put.actionType('INIT_MODAL')
      .run();
  });
});

describe('setHarmfulAction', () => {
  const changesetId = 50128523;
  const oldChangeset = fromJS({
    id: 50128523,
    geometry: {},
    properties: {
      check_user: null,
      is_suspect: false,
      check_date: null,
      checked: false,
      harmful: null,
      delete: 1,
      user: 'yasu747',
      reasons: [],
      uid: '105009',
      tags: []
    }
  });
  const token = '2d2289bd78985b2b46af29607ee50fa37cb1723a';
  const username = 'kepta';

  it('marks harmful=false correctly', async () => {
    const harmful = false;
    const newChangeset = oldChangeset
      .setIn(['properties', 'check_user'], username)
      .setIn(['properties', 'checked'], true)
      .setIn(['properties', 'harmful'], harmful);

    return await expectSaga(setHarmfulAction, {
      changesetId,
      oldChangeset,
      token,
      harmful,
      username
    })
      .provide([[matchers.call.fn(setHarmful), null]])
      .put(
        action(CHANGESET_MODIFY.modify, {
          changesetId,
          changeset: newChangeset
        })
      )
      .run();
  });
  it('marks harmful=true correctly', async () => {
    const harmful = true;
    const newChangeset = oldChangeset
      .setIn(['properties', 'check_user'], username)
      .setIn(['properties', 'checked'], true)
      .setIn(['properties', 'harmful'], harmful);
    return await expectSaga(setHarmfulAction, {
      changesetId,
      oldChangeset,
      token,
      harmful,
      username
    })
      .provide([[matchers.call.fn(setHarmful), null]])
      .put(
        action(CHANGESET_MODIFY.modify, {
          changesetId,
          changeset: newChangeset
        })
      )
      .run();
  });
  it('marks harmful=-1 (ie resets) correctly', async () => {
    const harmful = -1;
    const newChangeset = oldChangeset
      .setIn(['properties', 'check_user'], null)
      .setIn(['properties', 'checked'], false)
      .setIn(['properties', 'harmful'], null);
    return await expectSaga(setHarmfulAction, {
      changesetId,
      oldChangeset,
      token,
      harmful,
      username
    })
      .provide([[matchers.call.fn(setHarmful), null]])
      .put(
        action(CHANGESET_MODIFY.modify, {
          changesetId,
          changeset: newChangeset
        })
      )
      .run();
  });
});

describe('setTagActions', () => {
  const changesetId = 50128523;
  const oldChangeset = fromJS({
    id: 50128523,
    geometry: {},
    properties: {
      check_user: null,
      is_suspect: false,
      check_date: null,
      checked: true,
      harmful: null,
      delete: 1,
      user: 'yasu747',
      reasons: [],
      uid: '105009',
      tags: []
    }
  });
  const token = '2d2289bd78985b2b46af29607ee50fa37cb1723a';
  const tag = { label: 'intentional', value: 1 };

  it('adds tag correctly', async () => {
    const remove = false;
    const newTags = Map()
      .set('id', tag.value)
      .set('name', tag.label);
    const newChangeset = oldChangeset.setIn(
      ['properties', 'tags'],
      List().push(newTags)
    );
    return await expectSaga(setTagActions, {
      changesetId,
      oldChangeset,
      token,
      tag,
      remove
    })
      .provide([[matchers.call.fn(setTag), null]])
      .put(
        action(CHANGESET_MODIFY.modify, {
          changesetId,
          changeset: newChangeset
        })
      )
      .run();
  });
  it('adds removes tag correctly', async () => {
    const remove = true;
    const newTags = List().push(
      Map()
        .set('id', tag.value)
        .set('name', tag.label)
    );
    const withTags = oldChangeset.setIn(['properties', 'tags'], newTags);
    return await expectSaga(setTagActions, {
      changesetId,
      oldChangeset: withTags,
      token,
      tag,
      remove
    })
      .provide([[matchers.call.fn(setTag), null]])
      .returns(withTags.setIn(['properties', 'tags'], newTags.delete(0)))
      .run();
  });
});
