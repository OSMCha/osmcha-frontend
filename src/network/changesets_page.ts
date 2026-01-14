import { Iterable, Map } from "immutable";
import type { filtersType, filterType } from "../components/filters";
import { API_URL } from "../config";
import { PAGE_SIZE } from "../config/constants";
import { appendDefaultDate } from "../utils/filters";
import { getString, handleErrors } from "./aoi";

export function fetchChangesetsPage(
  pageIndex: number,
  filters: filtersType = Map(),
  token: string | undefined | null,
  nocache: boolean,
  aoiId?: string | null,
) {
  let flatFilters = "";
  filters = appendDefaultDate(filters);
  filters.forEach((v: filterType | undefined, k: string | undefined) => {
    if (!Iterable.isIterable(v) || !k) return;
    const filter = v!;
    const filterJoined = filter
      .filter((x) => !!x && Iterable.isIterable(x) && x.get("value") !== "")
      .map((x) => getString(x?.get("value")))
      .join(",");

    if (filterJoined === "") return;
    flatFilters += `&${k}=${encodeURIComponent(filterJoined)}`;
  });
  let url = `${API_URL}/changesets/?${
    nocache // for cache busting of this pattern /\/changesets\/#nocache\?page=/
      ? `page_size=${PAGE_SIZE}&page=${pageIndex + 1}`
      : `page=${pageIndex + 1}&page_size=${PAGE_SIZE}`
  }${flatFilters}`;
  if (aoiId) {
    url = `${API_URL}/aoi/${aoiId}/changesets/?${
      nocache
        ? `page_size=${PAGE_SIZE}&page=${pageIndex + 1}`
        : `page=${pageIndex + 1}&page_size=${PAGE_SIZE}`
    }`;
  }
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Token ${token}` : "",
    },
  }).then((res) => {
    if (res.status === 401) {
      return Promise.reject(
        Error("Authentication error. Sign in again and repeat the operation."),
      );
    }
    if (res.status === 403) {
      return Promise.reject(Error("Operation not allowed."));
    }
    if (res.status >= 400 && res.status < 600) {
      return Promise.reject(
        Error(
          "Bad request. Please check your filters or your network connection.",
        ),
      );
    }
    return res.json();
  });
}

export function fetchAOIChangesetPage(
  pageIndex: number,
  aoiId: string,
  token: string,
) {
  return fetch(
    `${API_URL}/aoi/${aoiId}/changesets/?page_size=${PAGE_SIZE}&page=${
      pageIndex + 1
    }`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Token ${token}` : "",
      },
    },
  )
    .then(handleErrors)
    .then((res) => {
      return res.json();
    });
}
