// @flow
import { API_URL, apiCredentials } from '../config';
import { handleErrors } from './aoi';

export function fetchChangeset(id: number, token: ?string) {
  return fetch(`${API_URL}/changesets/${id}/`, {
    method: 'GET',
    credentials: apiCredentials,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    }
  })
    .then(handleErrors)
    .then(res => {
      return res.json();
    });
}

export function setHarmful(id: number, token: string, harmful: boolean | -1) {
  // -1 is for unsetting
  let url;
  if (harmful === -1) {
    url = `${API_URL}/changesets/${id}/uncheck/`;
  } else {
    url = `${API_URL}/changesets/${id}/${
      harmful ? 'set-harmful' : 'set-good'
    }/`;
  }

  return fetch(url, {
    method: 'PUT',
    credentials: apiCredentials,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    }
  })
    .then(handleErrors)
    .then(res => {
      return res.json();
    });
}

export const createForm = (obj: Object) => {
  var formData = new FormData();
  Object.keys(obj).forEach(k => {
    formData.append(k, obj[k]);
  });
  return formData;
};

export function setTag(
  id: number,
  token: string,
  tag: Object,
  remove: boolean = false
) {
  if (Number.isNaN(parseInt(tag.value, 10))) {
    throw new Error('tag is not a valid number');
  }
  return fetch(`${API_URL}/changesets/${id}/tags/${tag.value}/`, {
    method: remove ? 'DELETE' : 'POST',
    credentials: apiCredentials,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    },
    body: createForm({
      tag_pk: tag,
      id
    })
  })
    .then(handleErrors)
    .then(res => {
      return res.json();
    });
}

export function postComment(id: number, token: string, comment: string) {
  return fetch(`${API_URL}/changesets/${id}/comment/`, {
    method: 'POST',
    credentials: apiCredentials,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Token ${token}` : ''
    },
    body: JSON.stringify({
      comment: comment
    })
  })
    .then(handleErrors)
    .then(res => {
      return res.json();
    });
}
