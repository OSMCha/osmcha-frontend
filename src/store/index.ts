import { Map } from "immutable";
import { applyMiddleware, combineReducers, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import * as safeStorage from "../utils/safe_storage";
import type { aoiReducerType } from "./aoi_reducer";
import { aoiReducer } from "./aoi_reducer";
import type { AuthType } from "./auth_reducer";
// Reducers
import { authReducer } from "./auth_reducer";
import type { watchlistReducerType } from "./blacklist_reducer";
import { watchlistReducer } from "./blacklist_reducer";
import type { ChangesetType } from "./changeset_reducer";
import { changesetReducer } from "./changeset_reducer";
import type { ChangesetsPageType } from "./changesets_page_reducer";
import { changesetsPageReducer } from "./changesets_page_reducer";
import type { filtersReducerType } from "./filters_reducer";
import { filtersReducer } from "./filters_reducer";
import { createReduxHistory, routerMiddleware, routerReducer } from "./history";
import type { mapControlsReducerType } from "./map_controls_reducer";
import { mapControlsReducer } from "./map_controls_reducer";
import type { ModalType } from "./modal_reducer";
import { modalReducer } from "./modal_reducer";
// Sagas
import sagas from "./sagas";
import type { trustedlistReducerType } from "./trustedlist_reducer";
import { trustedlistReducer } from "./trustedlist_reducer";

export type RootStateType = {
  auth: AuthType;
  changesetsPage: ChangesetsPageType;
  filters: filtersReducerType;
  aoi: aoiReducerType;
  changeset: ChangesetType;
  modal: ModalType;
  router: any;
  trustedlist: trustedlistReducerType;
  watchlist: watchlistReducerType;
  mapControls: mapControlsReducerType;
};

// Root reducer
const reducers = combineReducers({
  changesetsPage: changesetsPageReducer,
  changeset: changesetReducer,
  filters: filtersReducer,
  mapControls: mapControlsReducer,
  aoi: aoiReducer,
  router: routerReducer,
  auth: authReducer,
  modal: modalReducer,
  trustedlist: trustedlistReducer,
  watchlist: watchlistReducer,
});

const sagaMiddleware = createSagaMiddleware();
// Middlewares
const middlewares = [sagaMiddleware, routerMiddleware];

const appliedMiddlewares = applyMiddleware(...middlewares);

// Persisted state
const persistedState = {
  auth: Map({
    token: safeStorage.getItem("token"),
    oAuthToken: safeStorage.getItem("oauth_token"),
    oAuthTokenSecret: safeStorage.getItem("oauth_token_secret"),
    error: null,
  }) as any,
};

// Store
const store = createStore(reducers, persistedState, appliedMiddlewares);
sagaMiddleware.run(sagas);

// Create history after store initialization (required by redux-first-history)
const history = createReduxHistory(store);

export { store, history };
