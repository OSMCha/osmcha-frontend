import {osmchaSocialTokenUrl} from '../config/constants';
import request from 'superagent';

export function postTokensOSMCha(body: Object) {
  let oAuthTokens;

  if (body) {
    oAuthTokens = body.oAuthObj;
    return request
      .post(
        'https://osmcha-django-api-test.tilestream.net/api/v1/login/social/token/openstreetmap/',
      )
      .type('form')
      .send({oauth_token: oAuthTokens.oauth_token})
      .send({oauth_verifier: oAuthTokens.oauth_verifier})
      .then(r => {
        console.log('fina;l', r.body);
        return r.body;
      });
    // content.body = creatForm(oAuthTokens);
  }

  return request
    .post(
      'https://osmcha-django-api-test.tilestream.net/api/v1/login/social/token/openstreetmap/',
    )
    .type('form')
    .then(r => r.body);
}
