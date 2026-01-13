import { handleErrors } from './aoi';
import { API_URL } from '../config';

export function fetchWatchList(token: string): Promise<any> {
  return fetch(`${API_URL}/blacklisted-users/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : '',
    },
  })
    .then(handleErrors)
    .then((res) => res.json())
    .then((res) => res.results);
}

export function deleteFromWatchList(token: string, uid: string): Promise<any> {
  return fetch(`${API_URL}/blacklisted-users/${uid}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : '',
    },
  }).then(handleErrors);
}

export function postUserToWatchList(token: string, data: any): Promise<any> {
  return fetch(`${API_URL}/blacklisted-users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : '',
    },
    body: JSON.stringify({
      username: data.watchlist_user.username,
      uid: data.watchlist_user.uid,
    }),
  })
    .then(handleErrors)
    .then((res) => {
      return res.json();
    });
}
