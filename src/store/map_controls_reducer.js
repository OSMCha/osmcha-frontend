/* @flow */
import { Map, fromJS } from 'immutable';

import { MAPCONTROLS } from './map_controls_actions';

export type mapControlsReducerType = Map<'style', any>;

const mapControlsInitial: mapControlsReducerType = fromJS({
  style: 'satellite'
});

export function mapControlsReducer(
  state: filtersReducerType = mapControlsInitial,
  action: Object
): mapControlsReducerType {
  switch (action.type) {
    case MAPCONTROLS.setStyle: {
      return state.set('style', action.style);
    }
    default:
      return state;
  }
}
