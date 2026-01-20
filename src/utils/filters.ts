import { format, sub } from "date-fns";
import { DEFAULT_FROM_DATE, DEFAULT_TO_DATE } from "../config/constants";

export function validateFilters(filters: any): boolean {
  if (!filters || typeof filters !== "object") {
    throw new Error("The filters that you applied were not correct.");
  }

  let valid = true;
  Object.keys(filters).forEach((key) => {
    const value = filters[key];

    // Each filter value should be an array
    if (!Array.isArray(value)) {
      valid = false;
      return;
    }

    // Each item in the array should have label and value
    value.forEach((item) => {
      if (
        !item ||
        typeof item !== "object" ||
        !("label" in item) ||
        !("value" in item)
      ) {
        valid = false;
      }
    });
  });

  if (!valid) {
    console.log(filters);
    throw new Error("The filters that you applied were not correct.");
  }

  return true;
}

export function getDefaultFromDate(extraDays = 0): any {
  const defaultDate = format(
    sub(new Date(), { days: DEFAULT_FROM_DATE + extraDays }),
    "yyyy-MM-dd",
  );
  return {
    date__gte: [
      {
        label: defaultDate,
        value: defaultDate,
      },
    ],
  };
}

function getDefaultToDate(): any {
  const now = new Date();
  const defaultDate = format(
    sub(new Date(now.getTime() + now.getTimezoneOffset() * 60 * 1000), {
      minutes: DEFAULT_TO_DATE,
    }),
    "yyyy-MM-dd HH:mm",
  );
  return {
    date__lte: [
      {
        label: "",
        value: defaultDate,
      },
    ],
  };
}

export function appendDefaultDate(filters: any) {
  // Set From date to 2 days behind if there isn't a date query.
  // In case of a users or uids query, set the From date to 30 days behind
  let result = { ...filters };

  if (filters && !("date__gte" in filters) && !("date__lte" in filters)) {
    const filterKeys = Object.keys(filters);
    if (
      filterKeys.length === 1 &&
      (filterKeys.includes("users") || filterKeys.includes("uids"))
    ) {
      result = { ...result, ...getDefaultFromDate(28) };
    } else {
      result = { ...result, ...getDefaultFromDate() };
    }
  }

  if (filters && !("date__lte" in filters)) {
    result = { ...result, ...getDefaultToDate() };
  }

  return result;
}

function getString(input: any): string {
  if (typeof input === "object") {
    return JSON.stringify(input);
  }
  return String(input);
}

export function deserializeFiltersFromObject(
  apiFilters: Record<string, string>,
): any {
  const result: any = {};

  Object.keys(apiFilters).forEach((k) => {
    const v = apiFilters[k];
    if (typeof v !== "string" || !k) return;

    // Empty string should be converted to empty array with one empty item
    if (v === "") {
      result[k] = [{ label: "", value: "" }];
      return;
    }

    // Split comma-separated values and convert to array of objects
    const values = v.split(",").map((val) => ({
      label: val.trim(),
      value: val.trim(),
    }));

    result[k] = values;
  });

  return result;
}

export function serializeFiltersToObject(filters: any): Record<string, string> {
  const result: Record<string, string> = {};

  Object.keys(filters).forEach((k) => {
    const v = filters[k];
    if (!Array.isArray(v) || !k) return;

    const serialized = v
      .filter((x) => !!x && typeof x === "object" && x.value !== "")
      .map((x) => getString(x.value))
      .join(",");

    if (serialized) {
      result[k] = serialized;
    }
  });

  return result;
}

export function serializeFiltersToQuery(filters: any): string {
  let query = "";

  Object.keys(filters).forEach((k) => {
    const v = filters[k];
    if (!Array.isArray(v) || !k) return;

    const filterJoined = v
      .filter((x) => !!x && typeof x === "object" && x.value !== "")
      .map((x) => String(x.value))
      .join(",");

    if (filterJoined === "") return;
    query += `&${k}=${encodeURIComponent(filterJoined)}`;
  });

  return query;
}
