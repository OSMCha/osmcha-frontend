// @flow
import request from 'superagent';
import { osmchaSocialTokenUrl } from '../config/constants';
import { API_URL } from '../config';
import { handleErrors } from './aoi';

export function postFinalTokensOSMCha(
  oauth_token: string,
  oauth_token_secret: string,
  oauth_verifier: string
) {
  return request
    .post(osmchaSocialTokenUrl)
    .type('form')
    .send({ oauth_token: oauth_token })
    .send({ oauth_verifier: oauth_verifier })
    .send({ oauth_token_secret: oauth_token_secret })
    .then(r => {
      return r.body;
    })
    .catch(e => {
      console.error(e);
      return Promise.reject(e);
    });
}
export function postTokensOSMCha() {
  return request
    .post(osmchaSocialTokenUrl)
    .type('form')
    .then(r => r.body)
    .catch(e => {
      console.error(e);
      return Promise.reject(e);
    });
}

export function fetchUserDetails(token: string) {
  return fetch(`${API_URL}/users/`, {
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
      Authorization: token ? `Token ${token}` : ''
    },
    body: JSON.stringify({
      message_good,
      message_bad,
      comment_feature
    })
  })
    .then(handleErrors)
    .then(res => {
      return res.json();
    });
}
