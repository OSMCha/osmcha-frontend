import { fromJS, Map } from "immutable";
import { TRUSTEDLIST } from "./trustedlist_actions";

export type trustedlistReducerType = Map<"trustedlist" | "loading", any>;

const initialState: trustedlistReducerType = fromJS({
  trustedlist: null,
  loading: false,
});

export function trustedlistReducer(
  state: trustedlistReducerType = initialState,
  action: any,
): trustedlistReducerType {
  switch (action.type) {
    case TRUSTEDLIST.define: {
      return state.set("trustedlist", action.trustedlist).set("loading", false);
    }
    case TRUSTEDLIST.add: {
      return state
        .set(
          "trustedlist",
          state.get("trustedlist").concat([action.trustedlist_user]),
        )
        .set("loading", false);
    }
    case TRUSTEDLIST.remove: {
      return state
        .set(
          "trustedlist",
          state
            .get("trustedlist")
            .filter((item) => item !== action.trustedlist_user),
        )
        .set("loading", false);
    }
    case TRUSTEDLIST.clear: {
      return state.set("trustedlist", Map()).set("loading", false);
    }
    default:
      return state;
  }
}
