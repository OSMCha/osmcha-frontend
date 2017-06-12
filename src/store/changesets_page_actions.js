// @flow
import { put, call, takeLatest, select, all } from 'redux-saga/effects';
import { fromJS, List, Map } from 'immutable';
import { push } from 'react-router-redux';
import { fetchChangesetsPage } from '../network/changesets_page';
import { getObjAsQueryParam } from '../utils/query_params';

import { INIT_MODAL } from './modal_actions';

import type { RootStateType } from './';
import type { InputType } from '../components/filters';

export const CHANGESET_PAGE_GET = 'CHANGESET_PAGE_GET';
export const CHANGESETS_PAGE_FETCHED = 'CHANGESETS_PAGE_FETCHED';
export const CHANGESETS_PAGE_LOADING = 'CHANGESETS_PAGE_LOADING';
export const CHANGESETS_PAGE_ERROR = 'CHANGESETS_PAGE_ERROR';

export const FILTERS_SET = 'FILTERS_SET';
export const FILTERS_APPLY = 'FILTERS_APPLY';

export const CHANGESET_PAGE_MODIFY_CHANGESET =
  'CHANGESET_PAGE_MODIFY_CHANGESET';
export function action(type: string, payload: ?Object) {
  return { type, ...payload };
}

// public
// starting point for react component to start fetch
export const getChangesetsPage = (pageIndex: number) =>
  action(CHANGESET_PAGE_GET, { pageIndex });

export const applyFilters = (
  filters: Map<string, List<InputType>>,
  pathname: ?string
) => action(FILTERS_APPLY, { filters, pathname });

// watches for CHANGESET_PAGE_GET and only
// dispatches latest to fetchChangesetsPageAsync
export function* watchChangesetsPage(): any {
  yield all([
    takeLatest(FILTERS_APPLY, filtersSaga),
    takeLatest(CHANGESET_PAGE_GET, fetchChangesetsPageAsync),
    takeLatest(CHANGESET_PAGE_MODIFY_CHANGESET, modifyChangesetPage)
  ]);
}

/** Sagas **/
export function* filtersSaga({
  filters,
  pathname
}: {
  filters: Map<string, List<InputType>>,
  pathname: ?Object
}): Object {
  const search = getObjAsQueryParam('filters', filters.toJS());
  const location = yield select((state: RootStateType) => ({
    ...state.routing.location, // deep clone it
    pathname: pathname || state.routing.location.pathname,
    search // update the search
  }));
  // documentation is spotty about push,
  // I could find one comment on `push(location)` in the readme
  // ref: https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux
  yield all([
    put(push(location)),
    put(
      action(FILTERS_SET, {
        filters
      })
    )
  ]);
  // update the results, using dispatch
  // since changeset_list might get remounted
  yield put(action(CHANGESET_PAGE_GET, { pageIndex: 0 }));
}
export function* fetchChangesetsPageAsync({
  pageIndex
}: {
  pageIndex: number
}): Object {
  // no need to check if changesetPage exists
  // as service worker caches this api request
  const filters: Map<
    string,
    List<InputType>
  > = yield select((state: RootStateType) =>
    state.changesetsPage.get('filters')
  );
  yield put(
    action(CHANGESETS_PAGE_LOADING, {
      pageIndex
    })
  );
  try {
    let token = yield select((state: RootStateType) => state.auth.get('token'));
    let thisPage = yield call(fetchChangesetsPage, pageIndex, filters, token);
    yield put(
      action(CHANGESETS_PAGE_FETCHED, {
        data: fromJS(thisPage),
        pageIndex
      })
    );
  } catch (error) {
    console.log(error);
    yield put(
      action(CHANGESETS_PAGE_ERROR, {
        pageIndex,
        error
      })
    );
    yield put(
      action(INIT_MODAL, {
        payload: {
          error,
          autoDismiss: 0,
          title: 'Changesets List Failed',
          description: `Changesets List for page: ${pageIndex} failed to load, please wait for a while or retry.`,
          callbackLabel: 'Retry'
        },
        callback: action,
        callbackArgs: [CHANGESET_PAGE_GET, { pageIndex }]
      })
    );
  }
}

export function* modifyChangesetPage({ changesetId, changeset }: Object): any {
  try {
    // try to modify the changeset inside the page
    // to reflect any kind of changes in the changesetList
    let [currentPage, pageIndex] = yield select((state: RootStateType) => [
      state.changesetsPage.getIn(['currentPage'], Map()),
      state.changesetsPage.getIn(['pageIndex'], 0)
    ]);

    let features: List<Map<string, *>> = currentPage.get('features');
    const index = features.findIndex(f => f.get('id') === changesetId);
    if (index > -1) {
      currentPage = currentPage.setIn(['features', index], changeset);
      yield put(
        action(CHANGESETS_PAGE_FETCHED, {
          data: currentPage,
          pageIndex
        })
      );
    }
  } catch (e) {
    console.error(e);
  }
}
