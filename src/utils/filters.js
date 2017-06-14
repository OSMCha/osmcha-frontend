import { List, Map } from 'immutable';

export function validateFilters(filters: Map<string, *>): boolean {
  if (!Map.isMap(filters)) return false;
  let valid = true;
  filters.forEach((v, k) => {
    if (!List.isList(v)) {
      // check for list
      valid = false;
    } else {
      v.forEach(vv => {
        if (!Map.isMap(vv)) {
          valid = false;
        }
      });
    }
  });
  return valid;
}
