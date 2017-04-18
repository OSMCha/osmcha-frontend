import {call, put, select} from 'redux-saga/effects';
import {fetchChangesetsPageAsync, networkCall} from './changesets_page_actions';

const iterator = fetchChangesetsPageAsync({pageIndex: 2});

it('follows correct async flow ', () => {
  iterator.next();
  iterator.next();
  expect(iterator.next().value).toEqual(call(networkCall, 2));
});
