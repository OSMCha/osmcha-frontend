// @flow
import { API_URL } from '../config';
import { PAGE_SIZE } from '../config/constants';
import { List, Map } from 'immutable';
export function fetchChangesetsPage(
  pageIndex: number,
  filters: Map<string, *>,
  token: ?string
) {
  let flatFilters = '';
  filters.forEach((v: List<Object>, k: string) => {
    let filter = v;
    let filterJoined = filter
      .filter(x => x.get && x.get('value') !== '')
      .map(x => x.get('value'))
      .join(',');

    if (filterJoined === '') return;
    flatFilters += `&${k}=${filterJoined}`;
  });
  Object.keys(filters).forEach(f => {});

  return fetch(
    `${API_URL}/changesets/?page=${pageIndex +
      1}&page_size=${PAGE_SIZE}${flatFilters}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Token ${token}` : ''
      }
    }
  ).then(res => {
    if (res.status >= 400 && res.status < 600) {
      throw new Error(
        'Bad request. Please check filters or your network connection.'
      );
    }
    return res.json();
  });
}
