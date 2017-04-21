/* @flow */
import {
  CHANGESET_CHANGE,
  CHANGESET_ERROR,
  CHANGESET_LOADING,
  CHANGESET_FETCHED,
  CHANGESET_MAP_CHANGE,
  CHANGESET_MAP_ERROR,
  CHANGESET_MAP_FETCHED,
  CHANGESET_MAP_LOADING,
  CHANGESET_MAP_RESET,
} from './changeset_actions';
import {List, Map} from 'immutable';

export type ChangesetType = Map<
  | 'currentChangeset'
  | 'changesets'
  | 'changesetId' // of the currentChangeset
  | 'loading'
  | 'loadingChangesetMap'
  | 'changesetMap'
  | 'currentChangesetMap'
  | 'errorChangesetMap'
  | 'error', any>;

const initial: ChangesetType = new Map({
  changesetId: null,
  currentChangeset: null,
  currentChangesetMap: null,
  changesets: new Map(),
  changesetMap: new Map(),
  loading: false,
  loadingChangesetMap: false,
  error: null,
  errorChangesetMap: null,
});

export function changesetReducer(
  state: ChangesetType = initial,
  action: Object,
): ChangesetType {
  switch (action.type) {
    case CHANGESET_CHANGE: {
      const changesets = state.get('changesets');
      return state
        .set('changesetId', action.changesetId)
        .set('currentChangeset', changesets.get(action.changesetId))
        .set('loading', false)
        .set('error', null);
    }
    case CHANGESET_LOADING: {
      return state
        .set('changesetId', action.changesetId)
        .set('currentChangeset', null)
        .set('loading', true)
        .set('error', null);
    }
    case CHANGESET_FETCHED: {
      const changesets = state
        .get('changesets')
        .set(action.changesetId, action.data);
      return state
        .set('changesets', changesets)
        .set('changesetId', action.changesetId)
        .set('currentChangeset', action.data)
        .set('loading', false)
        .set('error', null);
    }
    case CHANGESET_ERROR: {
      return state
        .set('changesetId', action.changesetId)
        .set('currentChangeset', null)
        .set('loading', false)
        .set('error', action.error);
    }
    case CHANGESET_MAP_CHANGE: {
      const changesetMap = state.get('changesetMap');
      return state
        .set('changesetId', action.changesetId)
        .set('currentChangesetMap', changesetMap.get(action.changesetId))
        .set('errorChangesetMap', null);
    }
    case CHANGESET_MAP_FETCHED: {
      const changesetMap = state
        .get('changesetMap')
        .set(action.changesetId, action.data);
      return state
        .set('changesetMap', changesetMap)
        .set('changesetId', action.changesetId)
        .set('currentChangesetMap', action.data)
        .set('errorChangesetMap', null);
    }
    case CHANGESET_MAP_RESET: {
      return state
        .set('currentChangesetMap', null)
        .set('errorChangesetMap', null);
    }
    case CHANGESET_MAP_LOADING: {
      return state
        .set('changesetId', action.changesetId)
        .set('loadingChangesetMap', true);
    }
    case CHANGESET_MAP_ERROR: {
      return state
        .set('changesetId', action.changesetId)
        .set('currentChangesetMap', null)
        .set('errorChangesetMap', action.error);
    }
    default: {
      return state;
    }
  }
}
