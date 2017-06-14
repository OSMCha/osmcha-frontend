import { parse, stringify } from 'query-string';

export function getFiltersFromUrl(): Object {
  try {
    const parsed = parse(window.location.search);
    if (parsed.filters) {
      let filterObj = {};
      filterObj = JSON.parse(parsed.filters);
      return filterObj;
    }
  } catch (e) {
    window.location.search = '';
    console.error(e);
  }
}

export function getObjAsQueryParam(key: string, obj: Object) {
  if (!obj || Object.keys(obj).length === 0) {
    return '';
  }
  return stringify({
    [key]: JSON.stringify(obj)
  });
}
