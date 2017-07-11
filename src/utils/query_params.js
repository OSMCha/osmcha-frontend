// @flow
import { parse, stringify } from 'query-string';
import { fromJS, Map } from 'immutable';

export function getSearchObj(searchParam: string = ''): Map<string, *> {
  let result = {};
  try {
    result = parse(searchParam);
    if (result.filters) {
      result.filters = JSON.parse(result.filters);
    }
  } catch (e) {
    console.error(e);
  } finally {
    return fromJS(result);
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
