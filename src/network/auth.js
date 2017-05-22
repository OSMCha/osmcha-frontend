// @flow
import {osmchaSocialTokenUrl} from '../config/constants';
import request from 'superagent';

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
      });
  }

  return request.post(osmchaSocialTokenUrl).type('form').then(r => r.body);
}
