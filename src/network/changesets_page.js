// @flow
import { API_URL } from '../config';
import { PAGE_SIZE } from '../config/constants';

export function fetchChangesetsPage(
  pageIndex: number,
  filters: Object = {},
  token: ?string
) {
  const filterParams = Object.keys(filters)
    .map(f => `${f}=${filters[f] || ''}`)
    .join('&');
  return fetch(
    `${API_URL}/changesets/?page=${pageIndex + 1}&page_size=${PAGE_SIZE}&${filterParams}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Token ${token}` : ''
      }
    }
  ).then(res => res.json());
}
