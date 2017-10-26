import { all } from 'redux-saga/effects';
import { watchChangesetsPage } from './changesets_page_actions';
import { watchChangeset, watchModifyChangeset } from './changeset_actions';
import { watchAuth } from './auth_actions';
import { watchModal } from './modal_actions';
import { watchFilters, watchAOI } from './filters_actions';
export default function* rootSaga() {
  yield all([
    watchChangesetsPage(),
    watchFilters(),
    watchAOI(),
    watchChangeset(),
    watchAuth(),
    watchModifyChangeset(),
    watchModal()
  ]);
}
