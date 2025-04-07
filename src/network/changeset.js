// @flow
import adiffParser from '@osmcha/osm-adiff-parser';
import { parse, subSeconds } from 'date-fns';

import { API_URL } from '../config';
import { adiffServiceUrl, apiOSM, overpassBase } from '../config/constants.js';
import { handleErrors } from './aoi';

export function fetchChangeset(id: number, token: ?string) {
  return fetch(`${API_URL}/changesets/${id}/`, {
    method: 'GET',
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

export async function fetchAndParseAugmentedDiff(id: number) {
  let xml = await fetchAugmentedDiff(id);
  let adiff = await adiffParser(xml);
  return adiff;
}

/// Fetch an augmented diff for the given changeset ID. Tries to fetch from the
/// configured adiff service (if it exists) and falls back to using the configured
/// Overpass server if that fails.
async function fetchAugmentedDiff(id: number) {
  try {
    return await fetchAugmentedDiffFromAdiffService(id);
  } catch (err) {
    console.error(err);
    return await fetchAugmentedDiffFromOverpass(id);
  }
}

async function fetchAugmentedDiffFromAdiffService(id: number) {
  let res = await fetch(`${adiffServiceUrl}/changesets/${id}.adiff`);
  if (res.status !== 200) {
    throw new Error(
      `GET /changesets/${id}.adiff returned ${res.status} ${res.statusText}`
    );
  }
  return await res.text();
}

async function fetchAugmentedDiffFromOverpass(id: number) {
  let res = await fetch(`${apiOSM}/changeset/${id}.json`);
  let { changeset } = await res.json();
  let createdAt = parse(
    changeset.created_at,
    "yyyy-MM-dd'T'HH:mm:ssX",
    new Date()
  );
  let closedAt =
    changeset.closed_at &&
    parse(changeset.closed_at, "yyyy-MM-dd'T'HH:mm:ssX", new Date());

  let adiffArgs = [subSeconds(createdAt, 1), closedAt]
    .filter(Boolean)
    .map(d => `"${d.toISOString()}"`)
    .join(',');

  let data = `[out:xml][adiff:${adiffArgs}];`;
  data +=
    '(node(bbox)(changed);way(bbox)(changed);relation(bbox)(changed););out meta geom(bbox);';

  let epsilon = 0.00001;
  let bbox = [
    changeset.min_lon - epsilon || -180,
    changeset.min_lat - epsilon || -90,
    changeset.max_lon + epsilon || 180,
    changeset.max_lat + epsilon || 90
  ];

  res = await fetch(
    `${overpassBase}?data=${encodeURIComponent(data)}&bbox=${bbox.join(',')}`
  );
  return await res.text();
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

export function flagFeature(changeset: number, feature: string, token: string) {
  return fetch(
    `${API_URL}/changesets/${changeset}/review-feature/${feature.replace(
      '/',
      '-'
    )}`,
    {
      method: 'PUT',
      headers: { Authorization: token ? `Token ${token}` : '' }
    }
  ).then(handleErrors);
}

export function unflagFeature(
  changeset: number,
  feature: string,
  token: string
) {
  return fetch(
    `${API_URL}/changesets/${changeset}/review-feature/${feature.replace(
      '/',
      '-'
    )}`,
    {
      method: 'DELETE',
      headers: { Authorization: token ? `Token ${token}` : '' }
    }
  ).then(handleErrors);
}
