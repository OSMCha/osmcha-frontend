import { all } from 'redux-saga/effects';
import { watchChangesetsPage } from './changesets_page_actions';
import { watchChangeset } from './changeset_actions';
import { watchAuth } from './auth_actions';
export default function* rootSaga() {
  yield all([watchChangesetsPage(), watchChangeset(), watchAuth()]);
}
