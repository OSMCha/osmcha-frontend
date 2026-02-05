import { PAGE_SIZE } from "../config/constants.ts";
import {
  appendDefaultDate,
  serializeFiltersToQuery,
} from "../utils/filters.ts";
import { api } from "./request.ts";

export function fetchChangesetsPage(
  pageIndex: number,
  filters: any = {},
  aoiId: string | null,
  nocache?: boolean,
) {
  filters = appendDefaultDate(filters);
  const flatFilters = serializeFiltersToQuery(filters);

  const pageParams = nocache
    ? `page_size=${PAGE_SIZE}&page=${pageIndex + 1}`
    : `page=${pageIndex + 1}&page_size=${PAGE_SIZE}`;

  const endpoint = aoiId
    ? `/aoi/${aoiId}/changesets/?${pageParams}`
    : `/changesets/?${pageParams}${flatFilters}`;

  return api.get(endpoint);
}
