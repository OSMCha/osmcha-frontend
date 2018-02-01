// @flow
import { Iterable, List, Map } from 'immutable';
import { API_URL } from '../config';
import { PAGE_SIZE } from '../config/constants';
import { appendDefaultDate } from '../utils/filters';
import { handleErrors, getString } from './aoi';
import type { filtersType } from '../components/filters';


export function fetchChangesetsPage(
  pageIndex: number,
  filters: filtersType = Map(),
  token: ?string,
  nocache: boolean
) {
  let flatFilters = '';
  filters = appendDefaultDate(filters);
  filters.forEach((v: List<Object>, k: string) => {
    if (!Iterable.isIterable(v)) return;
    let filter = v;
    let filterJoined = filter
      .filter(x => Iterable.isIterable(x) && x.get('value') !== '')
      .map(x => getString(x.get('value')))
      .join(',');

    if (filterJoined === '') return;
    flatFilters += `&${k}=${encodeURIComponent(filterJoined)}`;
  });
  return fetch(
    `${API_URL}/changesets/?${nocache // for cache busting of this pattern /\/changesets\/#nocache\?page=/
      ? `page_size=${PAGE_SIZE}&page=${pageIndex + 1}`
      : `page=${pageIndex + 1}&page_size=${PAGE_SIZE}`}${flatFilters}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Token ${token}` : ''
      }
    }
  ).then(res => {
    if (res.status >= 400 && res.status < 600) {
      return Promise.reject(
        Error('Bad request. Please check filters or your network connection.')
      );
    }
    return res.json();
  });
}

export function fetchAOIChangesetPage(
  pageIndex: number,
  aoiId: string,
  token: string
) {
  return fetch(
    `${API_URL}/aoi/${aoiId}/changesets/?page_size=${PAGE_SIZE}&page=${pageIndex +
      1}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Token ${token}` : ''
      }
    }
  )
    .then(handleErrors)
    .then(res => {
      return res.json();
    });
}
