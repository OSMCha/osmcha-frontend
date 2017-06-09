// @flow
import { put, call, take, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { fromJS } from 'immutable';

import type { RootStateType } from './';

export const SHOW_MODAL = 'SHOW_MODAL';

// public
// starting point for react component to start fetch

export function action(type: string, payload: ?Object) {
  return { type, ...payload };
}

export function* watchModal(): any {}
