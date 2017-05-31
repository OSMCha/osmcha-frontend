import { parse, stringify } from 'query-string';

export function getFiltersFromUrl(): Object {
  const parsed = parse(window.location.search);
  console.log(parsed.filters);
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
  return stringify({
    [key]: JSON.stringify(obj)
  });
}
