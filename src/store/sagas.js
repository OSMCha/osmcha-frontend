import {delay} from 'redux-saga';
import {put, takeEvery} from 'redux-saga/effects';
import {watchFetchChangesets} from './changesets_page_actions';

export default function* rootSaga() {
  yield [watchFetchChangesets()];
}
