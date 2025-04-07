import { fromJS, Map } from 'immutable';
import { apiOSM } from '../config/constants';
import { API_URL } from '../config';

export async function fetchChangesetMetadata(id: number): Map<'string', *> {
  let res = await fetch(
    `${apiOSM}/changeset/${id}.json?include_discussion=true`
  );
  let metadata = await res.json();
  return metadata;
}

export function getUserDetails(uid: number, token: string): Map<'string', *> {
  const user = { uid: uid };
  const fromOSM = fetch(`${apiOSM}/user/${uid}.json`)
    .then(r => r.json())
    .then(r => {
      const u = r.user;
      user.count = u.changesets.count;
      user.accountCreated = u.account_created;
      user.description = u.description;
      user.img = u.img && u.img.href;
      user.name = u.display_name;
      return fromJS(user);
    })
    .catch(e => user);

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
