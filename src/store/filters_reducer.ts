import { fromJS, type Map } from "immutable";

import { FILTERS } from "./filters_actions";

export type filtersReducerType = Map<
  "loading" | "error" | "filters" | "aoi",
  any
>;

const filtersInitial: filtersReducerType = fromJS({
  filters: {},
  aoi: {},
  loading: false,
  error: null,
});

export function filtersReducer(
  state: filtersReducerType = filtersInitial,
  action: any,
): filtersReducerType {
  switch (action.type) {
    case FILTERS.set: {
      return state.set("filters", action.filters).set("loading", false);
    }
    default:
      return state;
  }
}
