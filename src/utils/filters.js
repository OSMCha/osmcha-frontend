// @flow
import { List, Map, fromJS } from 'immutable';
import moment from 'moment';

import { DEFAULT_FROM_DATE } from '../config/constants';

export function validateFilters(
  filters: Map<string, List<Map<string, *>>>
): boolean {
  if (!Map.isMap(filters)) return false;
  let valid = true;
  filters.forEach((v, k) => {
    if (!List.isList(v)) {
      // check for list
      valid = false;
    } else {
      v.forEach(vv => {
        if (!(Map.isMap(vv) && vv.has('label') && vv.has('value'))) {
          valid = false;
        }
        if (!Map.isMap(vv)) {
          valid = false;
        }
      });
    }
  });
  return valid;
}

export function getDefaultFromDate(): Map<string, *> {
  const defaultDate = moment()
    .subtract(DEFAULT_FROM_DATE, 'days')
    .format('YYYY-MM-DD');
  return fromJS({
    date__gte: [
      {
        label: defaultDate,
        value: defaultDate
      }
    ]
  });
}
