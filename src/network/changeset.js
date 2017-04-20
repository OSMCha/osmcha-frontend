// @flow
import {API_URL} from '../config';

export function networkFetchChangeset(id: number) {
  return fetch(`${API_URL}/changesets/${id}/`, {
    'Content-Type': 'application/json',
  }).then(res => res.json());
}
