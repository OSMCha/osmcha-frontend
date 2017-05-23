// @flow
import {osmchaSocialTokenUrl} from '../config/constants';
import request from 'superagent';
window.request = request;
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
