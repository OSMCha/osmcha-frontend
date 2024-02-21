// @flow
import { API_URL } from '../config';
import { handleErrors } from './aoi';

export function fetchReasons(token: ?string) {
  return fetch(`${API_URL}/suspicion-reasons/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    }
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(res => res.results);
}

export function fetchTags(token: ?string) {
  return fetch(`${API_URL}/tags/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    }
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(res => res.results);
}
