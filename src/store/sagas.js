import {watchFetchChangesetsPage} from './changesets_page_actions';
import {watchFetchChangeset} from './changeset_actions';
import {watchAuth} from './auth_actions';

export default function* rootSaga() {
  yield [watchFetchChangesetsPage(), watchFetchChangeset(), watchAuth()];
}
