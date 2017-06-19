// @flow
import { put, call, take, select, takeEvery } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { fromJS } from 'immutable';

import type { RootStateType } from './';

export const SHOW_MODAL = 'SHOW_MODAL';
export const INIT_MODAL = 'INIT_MODAL';
export const ACTIVATE_MODAL_CALLBACK = 'ACTIVATE_MODAL_CALLBACK';
export const DISMISS_MODAL = 'DISMISS_MODAL';

// public
// starting point for react component to start fetch

export function modal({
  kind = 'error',
  error,
  title,
  autoDismiss = 5,
  dismiss = true,
  description = 'Please reload the application. If it still doesnt work please refer to usage guide.',
  callback,
  callbackArgs,
  callbackLabel
}: {
  kind?: string,
  error?: Error,
  title?: string,
  dismiss?: boolean,
  autoDismiss?: number,
  description?: string,
  callback?: Function,
  callbackArgs?: Array<any>,
  callbackLabel?: string
}) {
  if (error && error.message) {
    description = error.message;
  }
  if (error && error.name) {
    title = error.name;
  }
  if (kind === 'error') {
    autoDismiss = 10;
  }
  return {
    type: 'INIT_MODAL',
    payload: {
      kind,
      error,
      callbackLabel,
      title,
      autoDismiss,
      dismiss,
      description
    },
    callback,
    callbackArgs
  };
}

export function action(type: string, payload: ?Object) {
  return { type, ...payload };
}

export const activateModalCallback = (uid: number) =>
  action(ACTIVATE_MODAL_CALLBACK, { uid });

export const dismissModalCallback = (uid: number) =>
  action(DISMISS_MODAL, { uid });

export function* watchModal(): any {
  yield takeEvery('INIT_MODAL', handleModal);
}

function* handleModal({ payload, callback, callbackArgs }: Object): any {
  var uidOriginal = new Date().getTime() + parseInt(1000 * Math.random(), 10);
  payload.uid = uidOriginal;
  yield put(action(SHOW_MODAL, payload));
  if (!callback) return;
  while (true) {
    const { type, uid } = yield take([ACTIVATE_MODAL_CALLBACK, DISMISS_MODAL]);
    console.log(`${uidOriginal} received`, uid, type);
    if (type === DISMISS_MODAL && uidOriginal === uid) {
      console.log(`${uidOriginal} is dismissing `, uid);
      return;
    }
    if (type === ACTIVATE_MODAL_CALLBACK && uidOriginal === uid) {
      console.log(`${uidOriginal} is activating callback for `, uid);
      yield call(delay, 500);
      yield put(callback(...callbackArgs));
      console.log(`${uidOriginal} finished calling args=`, callbackArgs);
      return;
    }
  }
}
