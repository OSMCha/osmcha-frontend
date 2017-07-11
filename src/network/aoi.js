// @flow
import { API_URL } from '../config';
import { createForm } from './changeset';
export function handleErrors(response: Object) {
  if (!response.ok) {
    return response.json().then(r => {
      if (r && r.detail) throw new Error(r.detail);
      throw Error(response.statusText);
    });
  }
  return response;
}

export function createAOI(
  token: string,
  name: string,
  filters: string
): Promise<*> {
  return fetch(`${API_URL}/aoi/?date__gte=2017-07-03`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`
    },
    body: createForm({
      data: {
        name,
        filters
      }
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
      Authorization: `Token ${token}`
    }
  })
    .then(handleErrors)
    .then(res => {
      return res.json();
    });
}

export function fetchAllAOIs(token: string): Promise<*> {
  return fetch(`${API_URL}/aoi/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`
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
  return fetch(`${API_URL}/aoi/${aoiId}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`
    },
    body: createForm({
      name,
      filters
    })
  })
    .then(handleErrors)
    .then(res => {
      return res.json();
    });
}

export function deleteAOI(token: string, aoiId: number): Promise<*> {
  return fetch(`${API_URL}/aoi/${aoiId}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`
    }
  })
    .then(handleErrors)
    .then(res => res.json());
}
