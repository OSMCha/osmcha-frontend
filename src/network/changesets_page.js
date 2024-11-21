// @flow
import { Iterable, List, Map } from 'immutable';
import { API_URL, apiCredentials } from '../config';
import { PAGE_SIZE } from '../config/constants';
import { appendDefaultDate } from '../utils/filters';
import { handleErrors, getString } from './aoi';
import type { filtersType } from '../components/filters';

export function fetchChangesetsPage(
  pageIndex: number,
  filters: filtersType = Map(),
  token: ?string,
  nocache: boolean,
  aoiId: ?string
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
  let url = `${API_URL}/changesets/?${nocache // for cache busting of this pattern /\/changesets\/#nocache\?page=/
      ? `page_size=${PAGE_SIZE}&page=${pageIndex + 1}`
      : `page=${pageIndex + 1}&page_size=${PAGE_SIZE}`
    }${flatFilters}`;
  if (aoiId) {
    url = `${API_URL}/aoi/${aoiId}/changesets/?${nocache
        ? `page_size=${PAGE_SIZE}&page=${pageIndex + 1}`
        : `page=${pageIndex + 1}&page_size=${PAGE_SIZE}`
      }`;
  }
  return fetch(url, {
    method: 'GET',
    credentials: apiCredentials,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    }
  }).then(res => {
    if (res.status === 401) {
      return Promise.reject(
        Error('Authentication error. Sign in again and repeat the operation.')
      );
    }
    if (res.status === 403) {
      return Promise.reject(Error('Authentication error. Sign in again and repeat the operation.'));
    }
    if (res.status >= 400 && res.status < 600) {
      return Promise.reject(
        Error(
          'Bad request. Please check your filters or your network connection.'
        )
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
      credentials: apiCredentials,
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
