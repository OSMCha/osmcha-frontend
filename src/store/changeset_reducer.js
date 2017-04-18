/* @flow */
import {
  CHANGESET_CHANGE,
  CHANGESET_ERROR,
  CHANGESET_LOADING,
  CHANGESET_FETCHED,
} from './changeset_actions';
import {List, Map} from 'immutable';

export type ChangesetType = Map<
  | 'currentChangeset'
  | 'changesets'
  | 'changesetId' // of the currentChangeset
  | 'loading'
  | 'error', any>;

const initial: ChangesetType = new Map({
  changesetId: null,
  currentChangeset: null,
  changesets: new Map(),
  loading: false,
  error: null,
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
    default: {
      return state;
    }
  }
}
