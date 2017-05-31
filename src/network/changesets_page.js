// @flow
import { API_URL } from '../config';
import { PAGE_SIZE } from '../config/constants';

export function fetchChangesetsPage(
  pageIndex: number,
  filters: Object = {},
  token: ?string
) {
  let flatFilters = '';
  Object.keys(filters)
    .filter(f => {
      let filter = filters[f];
      return filter && filter !== '';
    })
    .forEach(f => {
      let filter: Array<{ name: string, value: string }> | string = filters[f];
      if (Array.isArray(filter)) {
        filter = filter.filter(x => x.value).map(x => x.value).join(',');
      }
      flatFilters += `&${f}=${filter}`;
    });

  return fetch(
    `${API_URL}/changesets/?page=${pageIndex + 1}&page_size=${PAGE_SIZE}&${flatFilters}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Token ${token}` : ''
      }
    }
  ).then(res => res.json());
}
