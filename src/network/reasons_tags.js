// @flow
import { API_URL, apiCredentials } from '../config';
import { handleErrors } from './aoi';

export function fetchReasons(token: ?string) {
  return fetch(`${API_URL}/suspicion-reasons/`, {
    credentials: apiCredentials,
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

export function fetchTags(token: ?string) {
  return fetch(`${API_URL}/tags/`, {
    credentials: apiCredentials,
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
