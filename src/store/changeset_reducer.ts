import { fromJS, Map } from "immutable";

import {
  CHANGESET,
  CHANGESET_MAP,
  CHANGESET_MODIFY,
} from "./changeset_actions";

export type ChangesetType = Map<
  | "changesets" // of the currentChangeset
  | "changesetId"
  | "loading"
  | "loadingChangesetMap"
  | "changesetMap"
  | "errorChangesetMap"
  | "errorChangeset",
  any
>;

const initial: ChangesetType = fromJS({
  changesetId: null,
  changesets: Map(),
  loading: false,
  errorChangeset: null,
  changesetMap: Map(),
  loadingChangesetMap: false,
  errorChangesetMap: null,
});

export function changesetReducer(
  state: ChangesetType = initial,
  action: any,
): ChangesetType {
  switch (action.type) {
    case CHANGESET.change: {
      return state
        .set("changesetId", action.changesetId)
        .set("loading", false)
        .set("errorChangeset", null)
        .set("errorChangesetMap", null);
    }
    case CHANGESET.loading: {
      return state
        .set("changesetId", action.changesetId)
        .set("loading", true)
        .set("errorChangeset", null);
    }
    case CHANGESET.fetched: {
      const changesets = state
        .get("changesets")
        .set(action.changesetId, action.data);
      return state
        .set("changesets", changesets)
        .set("changesetId", action.changesetId)
        .set("loading", false)
        .set("errorChangeset", null);
    }
    case CHANGESET.error: {
      return state
        .set("changesetId", action.changesetId)
        .set("loading", false)
        .set("errorChangeset", action.error);
    }
    case CHANGESET_MAP.change: {
      return state
        .set("changesetId", action.changesetId)
        .set("errorChangesetMap", null)
        .set("loadingChangesetMap", false);
    }
    case CHANGESET_MAP.fetched: {
      const changesetMap = state
        .get("changesetMap")
        .set(action.changesetId, action.data);
      return state
        .set("changesetMap", changesetMap)
        .set("changesetId", action.changesetId)
        .set("loadingChangesetMap", false)
        .set("errorChangesetMap", null);
    }
    case CHANGESET_MAP.loading: {
      return state
        .set("changesetId", action.changesetId)
        .set("loadingChangesetMap", true)
        .set("errorChangesetMap", null);
    }
    case CHANGESET_MAP.error: {
      return state
        .set("changesetId", action.changesetId)
        .set("loadingChangesetMap", false)
        .set("errorChangesetMap", action.error);
    }
    case CHANGESET_MODIFY.modify: {
      const changesets = state
        .get("changesets")
        .set(action.changesetId, action.changeset);
      return state.set("changesets", changesets);
    }
    case CHANGESET_MODIFY.revert: {
      const changesets = state
        .get("changesets")
        .set(action.changesetId, action.changeset);
      return state
        .set("changesets", changesets)
        .set("errorChangeset", action.error);
    }
    default: {
      return state;
    }
  }
}
