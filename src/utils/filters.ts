import { format, sub } from "date-fns";
import { fromJS, List, Map } from "immutable";
import type { filtersType } from "../components/filters";
import { DEFAULT_FROM_DATE, DEFAULT_TO_DATE } from "../config/constants";

export function validateFilters(filters: filtersType): boolean {
  var test = () => {
    if (!Map.isMap(filters)) return false;
    let valid = true;
    filters.forEach((v, k) => {
      if (!List.isList(v)) {
        // check for list
        valid = false;
      } else {
        v?.forEach((vv) => {
          if (!vv || !(Map.isMap(vv) && vv.has("label") && vv.has("value"))) {
            valid = false;
          }
          if (!Map.isMap(vv)) {
            valid = false;
          }
        });
      }
    });
    return valid;
  };
  if (!test()) {
    throw new Error("The filters that you applied were not correct.");
  } else {
    return true;
  }
}

export function getDefaultFromDate(extraDays = 0): filtersType {
  const defaultDate = format(
    sub(new Date(), { days: DEFAULT_FROM_DATE + extraDays }),
    "yyyy-MM-dd",
  );
  return fromJS({
    date__gte: [
      {
        label: defaultDate,
        value: defaultDate,
      },
    ],
  });
}

export function getDefaultToDate(): filtersType {
  const now = new Date();
  const defaultDate = format(
    sub(new Date(now.getTime() + now.getTimezoneOffset() * 60 * 1000), {
      minutes: DEFAULT_TO_DATE,
    }),
    "yyyy-MM-dd HH:mm",
  );
  return fromJS({
    date__lte: [
      {
        label: "",
        value: defaultDate,
      },
    ],
  });
}

export function appendDefaultDate(filters: filtersType) {
  // Set From date to 2 days behind if there isn't a date query.
  // In case of a users or uids query, set the From date to 30 days behind
  if (filters && !filters.has("date__gte") && !filters.has("date__lte")) {
    if (
      filters.count() === 1 &&
      (filters.has("users") || filters.has("uids"))
    ) {
      filters = filters.merge(getDefaultFromDate(28));
    } else {
      filters = filters.merge(getDefaultFromDate());
    }
  }
  if (filters && !filters.has("date__lte")) {
    filters = filters.merge(getDefaultToDate());
  }
  return filters;
}
