import { parse, stringify } from 'query-string';

export function getFiltersFromUrl(): Object {
  const parsed = parse(window.location.search);
  if (parsed.filters) {
    let filterObj;
    try {
      filterObj = JSON.parse(parsed.filters);
    } catch (e) {
      console.error(e);
    } finally {
      return filterObj;
    }
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
