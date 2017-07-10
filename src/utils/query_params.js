// @flow
import { parse, stringify } from 'query-string';
import { getDefaultFromDate } from './filters';
import { fromJS, Map } from 'immutable';

export function getFiltersFromUrl(searchParam: string): Map<string, *> {
  let filterObj = {};
  try {
    const parsed = parse(searchParam);
    if (parsed.filters) {
      filterObj = JSON.parse(parsed.filters);
    }
  } catch (e) {
    window.location.search = '';
    console.error(e);
  }
  filterObj = fromJS(filterObj);
  if (!filterObj.has('date__gte') && !filterObj.has('date__lte')) {
    filterObj = getDefaultFromDate();
  }
  return filterObj;
}

export function getObjAsQueryParam(key: string, obj: Object) {
  if (!obj || Object.keys(obj).length === 0) {
    return '';
  }
  return stringify({
    [key]: JSON.stringify(obj)
  });
}
