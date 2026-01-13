import { handleErrors } from './aoi';
import { API_URL } from '../config';

export function fetchTrustedList(token: string): Promise<any> {
  return fetch(`${API_URL}/whitelist-user/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : '',
    },
  })
    .then(handleErrors)
    .then((res) => {
      return res.json();
    });
}

export function deleteFromTrustedList(
  token: string,
  username: string
): Promise<any> {
  return fetch(`${API_URL}/whitelist-user/${username}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : '',
    },
  }).then(handleErrors);
}

export function postUserToTrustedList(
  token: string,
  whitelist_user: string
): Promise<any> {
  return fetch(`${API_URL}/whitelist-user/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : '',
    },
    body: JSON.stringify({
      whitelist_user,
    }),
  })
    .then(handleErrors)
    .then((res) => {
      return res.json();
    });
}
