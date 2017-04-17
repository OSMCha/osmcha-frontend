import {delay} from 'redux-saga';
import {put, takeEvery} from 'redux-saga/effects';
import {watchFetchChangesets} from './changesets_actions';

export default function* rootSaga() {
  yield [watchFetchChangesets()];
}
