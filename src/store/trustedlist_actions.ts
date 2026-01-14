import { all, call, put, select, takeEvery } from "redux-saga/effects";

import {
  deleteFromTrustedList,
  postUserToTrustedList,
} from "../network/osmcha_trustedlist";
import type { RootStateType } from "./";
import { modal } from "./modal_actions";

export const TRUSTEDLIST = {
  define: "TRUSTEDLIST.define",
  add: "TRUSTEDLIST.add",
  remove: "TRUSTEDLIST.remove",
  clear: "TRUSTEDLIST.clear",
};

export function action(type: string, payload?: any | null) {
  return { type, ...payload };
}

export const tokenSelector = (state: RootStateType) => state.auth.get("token");

export const addToTrustedlist = (trustedlist_user: string) =>
  action(TRUSTEDLIST.add, { trustedlist_user });

export const removeFromTrustedlist = (trustedlist_user: string) =>
  action(TRUSTEDLIST.remove, { trustedlist_user });

export function* watchTrustedlist(): any {
  yield all([
    takeEvery(TRUSTEDLIST.add, addToTrustedlistSaga as any),
    takeEvery(TRUSTEDLIST.remove, removeFromTrustedlistSaga as any),
  ]);
}

export function* addToTrustedlistSaga({
  trustedlist_user,
}: {
  trustedlist_user: string;
}): any {
  try {
    const token = yield select(tokenSelector);
    yield call(postUserToTrustedList, token, trustedlist_user);
    yield put(
      modal({
        title: "Success",
        description: `User ${trustedlist_user} added to your Trusted Users list.`,
        kind: "success",
      }),
    );
  } catch (e) {
    console.error(e);
    yield put(
      modal({
        error: e as Error,
      }),
    );
  }
}
export function* removeFromTrustedlistSaga({
  trustedlist_user,
}: {
  trustedlist_user: string;
}): any {
  try {
    const token = yield select(tokenSelector);
    yield call(deleteFromTrustedList, token, trustedlist_user);
    yield put(
      modal({
        title: "Success",
        description: `User ${trustedlist_user} removed from your Trusted Users list.`,
        kind: "success",
      }),
    );
  } catch (e) {
    console.error(e);
    yield put(
      modal({
        error: e as Error,
      }),
    );
  }
}
