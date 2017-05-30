// @flow
import { API_URL } from '../config';
import { PAGE_SIZE } from '../config/constants';

export function fetchChangesetsPage(
  pageIndex: number,
  filters: Object = {},
  token: ?string
) {
  let flatFilters = '';
  Object.keys(filters).forEach(f => {
    let filter = filters[f];
    if (Array.isArray(filter)) {
      filter = filter.map(x => x.value).join(',');
    }
    flatFilters += `&${f}=${filter}`;
  });
  console.log(flatFilters);
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
