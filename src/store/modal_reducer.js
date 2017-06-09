// @flow
import { Map, fromJS } from 'immutable';
import { SHOW_MODAL } from './modal_actions';

export type ModalType = Map<
  'error' | 'kind' | 'duration' | 'description' | 'callback',
  any
>; // osmcha uses this

const initialState: ModalType = fromJS({
  error: null,
  kind: null,
  duration: null,
  callback: null,
  description: null
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
        .set('description', action.description);
    }
    default:
      return state;
  }
}
