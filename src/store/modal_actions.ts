import { call, delay, put, take, takeEvery } from "redux-saga/effects";

export const SHOW_MODAL = "SHOW_MODAL";
export const INIT_MODAL = "INIT_MODAL";
export const ACTIVATE_MODAL_CALLBACK = "ACTIVATE_MODAL_CALLBACK";
export const DISMISS_MODAL = "DISMISS_MODAL";

// public
// starting point for react component to start fetch

export function modal({
  kind = "error",
  error,
  title,
  dismiss = true,
  autoDismiss = 5,
  position = "tr",
  description = "Please reload the application. If it still doesnt work please refer to usage guide.",
  callback,
  callbackArgs,
  callbackLabel,
}: {
  kind?: string;
  error?: Error;
  title?: string;
  dismiss?: boolean;
  autoDismiss?: number;
  position?: string;
  description?: string;
  callback?: Function;
  callbackArgs?: Array<any>;
  callbackLabel?: string;
}) {
  if (error && error.message) {
    description = error.message;
  }
  if (error && error.name) {
    title = error.name;
  }
  if (kind === "error") {
    autoDismiss = 10;
  }
  return {
    type: "INIT_MODAL",
    payload: {
      kind,
      error,
      callbackLabel,
      title,
      dismiss,
      autoDismiss,
      position,
      description,
    },
    callback,
    callbackArgs,
  };
}

export function action(type: string, payload?: any | null) {
  return { type, ...payload };
}

export const activateModalCallback = (uid: number) =>
  action(ACTIVATE_MODAL_CALLBACK, { uid });

export const dismissModalCallback = (uid: number) =>
  action(DISMISS_MODAL, { uid });

export function* watchModal(): any {
  yield takeEvery("INIT_MODAL", handleModal);
}

function* handleModal({ payload, callback, callbackArgs }: any): any {
  var uidOriginal = Date.now() + Math.floor(1000 * Math.random());
  payload.uid = uidOriginal;
  yield put(action(SHOW_MODAL, payload));
  if (!callback) return;
  while (true) {
    const { type, uid } = yield take([ACTIVATE_MODAL_CALLBACK, DISMISS_MODAL]);
    if (type === DISMISS_MODAL && uidOriginal === uid) {
      return;
    }
    if (type === ACTIVATE_MODAL_CALLBACK && uidOriginal === uid) {
      yield call(delay, 500);
      yield put(callback(...callbackArgs));
      return;
    }
  }
}
