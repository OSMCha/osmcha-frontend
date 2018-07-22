import { fromJS, Map } from 'immutable';
import { apiOSM } from '../config/constants';
import { API_URL } from '../config';

export function getUserDetails(uid: number, token: string): Map<'string', *> {
  const user = {};
  const fromOSM = fetch(`${apiOSM}/user/${uid}`)
    .then(r => r.text())
    .then(r => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(r, 'text/xml');
      xml.getElementsByTagName('osm');
      const userXml =
        xml.getElementsByTagName('osm')[0] &&
        xml.getElementsByTagName('osm')[0].getElementsByTagName('user')[0];

      user.count =
        userXml.getElementsByTagName('changesets')[0] &&
        userXml.getElementsByTagName('changesets')[0].getAttribute('count');

      user.uid = userXml.getAttribute('id');

      user.accountCreated = userXml.getAttribute('account_created');

      user.description =
        userXml.getElementsByTagName('description')[0] &&
        userXml.getElementsByTagName('description')[0].innerHTML;

      user.img =
        userXml.getElementsByTagName('img')[0] &&
        userXml.getElementsByTagName('img')[0].getAttribute('href');
      user.name = userXml.getAttribute('display_name');

      return user;
    })
    .catch(e => user)
    .then(user => fromJS(user));

  const fromOSMCha = fetch(`${API_URL}/user-stats/${uid}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    }
  })
    .then(r => r.json())
    .then(r => fromJS(r))
    .catch(e => new Map());

  return Promise.all([fromOSMCha, fromOSM]).then(([r1, r2]) => r1.merge(r2));
}
