// @flow
import { API_URL } from '../config';
import { createForm } from './changeset';
import { Iterable, Map, List } from 'immutable';
import type { filtersType, filterType } from '../components/filters';
export function handleErrors(response: Object) {
  if (!response.ok) {
    return response.json().then(r => {
      if (r && r.detail) throw new Error(r.detail);
      if (response.statusText) throw new Error(response.statusText);
      return Promise.reject('network request failed');
    });
  }
  return response;
}

export function createAOI(
  token: string,
  name: string,
  filters: filtersType
): Promise<*> {
  let serverFilters = {};
  filters.forEach((v: filterType, k: string) => {
    if (!Iterable.isIterable(v)) return;
    let filter = v;
    serverFilters[k] = filter
      .filter(x => Iterable.isIterable(x) && x.get('value') !== '')
      .map(x => x.get('value'))
      .join(',');
  });
  return fetch(`${API_URL}/aoi/?date__gte=2017-07-03`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    },
    body: JSON.stringify({
      name,
      filters: serverFilters
    })
  })
    .then(handleErrors)
    .then(res => {
      return res.json();
    });
}
export function fetchAOI(token: string, aoiId: number): Promise<*> {
  return fetch(`${API_URL}/aoi/${aoiId}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    }
  })
    .then(handleErrors)
    .then(res => {
      return res.json();
    });
}

export function fetchAllAOIs(token?: string): Promise<*> {
  if (token == null) return Promise.resolve();
  return fetch(`${API_URL}/aoi/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    }
  })
    .then(handleErrors)
    .then(res => {
      return res.json();
    });
}

export function updateAOI(
  token: string,
  aoiId: number,
  name: string,
  filters: string
): Promise<*> {
  let serverFilters = {};
  filters.forEach((v: filterType, k: string) => {
    if (!Iterable.isIterable(v)) return;
    let filter = v;
    serverFilters[k] = filter
      .filter(x => Iterable.isIterable(x) && x.get('value') !== '')
      .map(x => x.get('value'))
      .join(',');
  });
  return fetch(`${API_URL}/aoi/${aoiId}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    },
    body: JSON.stringify({
      name,
      filters: serverFilters
    })
  })
    .then(handleErrors)
    .then(res => {
      return res.json();
    });
}

export function deleteAOI(token: string, aoiId: string): Promise<*> {
  return fetch(`${API_URL}/aoi/${aoiId}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    }
  }).then(handleErrors);
}
