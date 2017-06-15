// @flow
import { Map, fromJS } from 'immutable';
import { SHOW_MODAL } from './modal_actions';

export type ModalType = Map<
  | 'error'
  | 'kind'
  | 'duration'
  | 'title'
  | 'description'
  | 'callback'
  | 'callbackLabel'
  | 'dismiss',
  any
>; // osmcha uses this

const initialState: ModalType = fromJS({
  error: null,
  kind: null,
  duration: null,
  title: null,
  dismiss: true,
  autoDismiss: 5, // number
  description: null,
  uid: null // number
});

export function modalReducer(
  state: ModalType = initialState,
  action: Object
): ModalType {
  switch (action.type) {
    case SHOW_MODAL: {
      return state
        .set('kind', action.kind)
        .set('error', action.error)
        .set('callbackLabel', action.callbackLabel)
        .set('title', action.title)
        .set('dismiss', action.dismiss)
        .set('uid', action.uid)
        .set('autoDismiss', action.autoDismiss)
        .set('description', action.description);
    }
    default:
      return state;
  }
}
