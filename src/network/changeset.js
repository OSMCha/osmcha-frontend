// @flow
import { API_URL } from '../config';

export function fetchChangeset(id: number, token: ?string) {
  return fetch(`${API_URL}/changesets/${id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    }
  }).then(res => res.json());
}

export function setHarmful(id: number, token: string, tags: ?Array<string>) {
  return fetch(`${API_URL}/changesets/${id}/set-harmful/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    }
  }).then(res => res.json());
}

export function setGood(id: number, token: string, tags: ?Array<string>) {
  return fetch(`${API_URL}/changesets/${id}/set-good/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    }
  }).then(res => res.json());
}

window.setHarmful = setHarmful;
window.setGood = setGood;
