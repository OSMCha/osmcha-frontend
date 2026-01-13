import request from 'superagent';
import { osmchaSocialTokenUrl } from '../config/constants';
import { API_URL } from '../config';
import { handleErrors } from './aoi';

export function postFinalTokensOSMCha(code: string) {
  return request
    .post(osmchaSocialTokenUrl)
    .type('form')
    .send({ code: code })
    .then((r) => {
      return r.body;
    })
    .catch((e) => {
      console.error(e);
      return Promise.reject(e);
    });
}

export function getAuthUrl() {
  return fetch(`${API_URL}/social-auth/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(handleErrors)
    .then((res) => {
      return res.json();
    });
}

export function fetchUserDetails(token: string) {
  return fetch(`${API_URL}/users/`, {
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

export function updateUserDetails(
  token: string,
  message_good: string,
  message_bad: string,
  comment_feature: boolean
) {
  return fetch(`${API_URL}/users/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : '',
    },
    body: JSON.stringify({
      message_good,
      message_bad,
      comment_feature,
    }),
  })
    .then(handleErrors)
    .then((res) => {
      return res.json();
    });
}
