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

export function postUserToBlackList(token: string, data: object): Promise<*> {
  return fetch(`${API_URL}/blacklisted-users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    },
    body: JSON.stringify({
      username: data.blacklist_user.username,
      uid: data.blacklist_user.uid
    })
  })
    .then(handleErrors)
    .then(res => {
      return res.json();
    });
}
