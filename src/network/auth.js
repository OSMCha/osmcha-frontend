import {osmchaSocialTokenUrl} from '../config/constants';
import request from 'request';

export function postTokensOSMCha(body: Object) {
  let oAuthTokens;
  let content = {
    method: 'POST',
  };
  if (body) {
    oAuthTokens = body.oAuthObj;
    console.log('here', oAuthTokens);
    // const creatForm = d => {
    //   var formData = new FormData();
    //   Object.keys(d).forEach(k => {
    //     formData.append(k, d[k]);
    //   });
    //   return formData;
    // };
    // console.log(oAuthTokens);
    // var data = `oauth_token=${oAuthTokens.oauth_token}&oauth_verifier=${oAuthTokens.oauth_verifier}`;

    // var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;

    // xhr.addEventListener('readystatechange', function() {
    //   if (this.readyState === 4) {
    //     console.log(this.responseText);
    //   }
    // });

    // xhr.open(
    //   'POST',
    //   'https://osmcha-django-api-test.tilestream.net/api/v1/login/social/token/openstreetmap'
    // );
    // xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    // xhr.setRequestHeader('cache-control', 'no-cache');

    // xhr.send(data);
    return;
    // content.body = creatForm(oAuthTokens);
  }

  console.log('sending', content);
  return fetch(osmchaSocialTokenUrl, content).then(r => r.json());
}
