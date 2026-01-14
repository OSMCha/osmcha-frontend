import { all } from "redux-saga/effects";
import { watchAOI } from "./aoi_actions";
import { watchAuth, watchUserDetails } from "./auth_actions";
import { watchChangeset, watchModifyChangeset } from "./changeset_actions";
import { watchChangesetsPage } from "./changesets_page_actions";
import { watchFilters } from "./filters_actions";
import { watchModal } from "./modal_actions";
import { watchTrustedlist } from "./trustedlist_actions";
import { watchWatchlist } from "./watchlist_actions";

export default function* rootSaga() {
  yield all([
    watchChangesetsPage(),
    watchFilters(),
    watchAOI(),
    watchChangeset(),
    watchAuth(),
    watchUserDetails(),
    watchModifyChangeset(),
    watchModal(),
    watchTrustedlist(),
    watchWatchlist(),
  ]);
}
