// @flow
import { handleErrors } from './aoi';
import { API_URL } from '../config';

export function fetchBlackList(token: string): Promise<*> {
  return fetch(`${API_URL}/blacklisted-users/`, {
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

export function deleteFromBlackList(token: string, uid: string): Promise<*> {
  return fetch(`${API_URL}/blacklisted-users/${uid}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    }
  }).then(handleErrors);
}

export function postUserToBlackList(
  token: string,
  username: string,
  uid: string
): Promise<*> {
  return fetch(`${API_URL}/blacklisted-users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    },
    body: JSON.stringify({
      uid,
      username
    })
  })
    .then(handleErrors)
    .then(res => {
      return res.json();
    });
}
