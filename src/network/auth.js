// @flow
import request from 'superagent';
import {osmchaSocialTokenUrl, osmChaUrl} from '../config/constants';

export function postTokensOSMCha(
  oauth_token: ?string,
  oauth_verifier: ?string,
) {
  if (oauth_token && oauth_verifier) {
    return request
      .post(osmchaSocialTokenUrl)
      .type('form')
      .send({oauth_token: oauth_token})
      .send({oauth_verifier: oauth_verifier})
      .then(r => {
        return r.body;
      })
      .catch(e => {
        console.error(e);
        return Promise.reject(e);
      });
  }

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
  return fetch(`${osmChaUrl}/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : '',
    },
  }).then(res => res.json());
}
