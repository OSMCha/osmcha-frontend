import { fromJS } from 'immutable';

export function getUserDetails(uid: number): Map<'string', *> {
  const user = {};
  return fetch(
    `
      https://api.openstreetmap.org/api/0.6/user/${uid}`
  )
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
}
