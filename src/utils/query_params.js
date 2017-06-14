import { parse, stringify } from 'query-string';
import moment from 'moment';
const DAYS = 7;
export function getFiltersFromUrl(): Object {
  let filterObj = {};
  try {
    const parsed = parse(window.location.search);
    if (parsed.filters) {
      filterObj = JSON.parse(parsed.filters);
    }
  } catch (e) {
    window.location.search = '';
    console.error(e);
  }
  if (!filterObj['date__gte'] && !filterObj['date__lte']) {
    let lastDate = moment().subtract(DAYS, 'days').format('YYYY-MM-DD');
    filterObj['date__gte'] = [
      {
        label: lastDate,
        value: lastDate
      }
    ];
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
