import { parse, subSeconds } from 'date-fns';
import { osmApiUrl } from '../../config/constants';

export function query(changesetID) {
  var url = `${osmApiUrl}/api/0.6/changeset/${changesetID}.json?include_discussion=true`;
  var options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  };
  return fetch(url, options)
    .then(r => r.json())
    .then(r => {
      const cs = r.elements[0];
      return {
        id: changesetID,
        uid: cs.uid,
        user: cs.user,
        from: subSeconds(
          parse(cs.created_at, 'yyyy-MM-dd\'T\'HH:mm:ssX', new Date()),
          1
        ).toISOString(),
        to: cs.closed_at || null,
        comments: r.elements[0].discussion || [],
        bbox: {
          left: cs.minlon || -180,
          bottom: cs.minlat || -90,
          right: cs.maxlon || 180,
          top: cs.maxlat || 90
        }
      };
    });
}
