// @flow
import { matchPath } from 'react-router';
import { BASE_PATH } from '../config'

export function getParam(param: string, location: Object, path: string) {
  const match = matchPath(location.pathname, path);
  if (!match) return null;
  return match.params[param];
}

export function getChangesetIdFromLocation(location: Object) {
  const changesetId = parseInt(getParam('id', location, `${BASE_PATH}/changesets/:id`), 10);
  if (!changesetId || Number.isNaN(changesetId)) {
    return null;
  }
  return changesetId;
}

export function checkForLegacyURL(location: Object) {
  const changesetId = parseInt(getParam('id', location, `${BASE_PATH}/:id`), 10);
  if (!changesetId || Number.isNaN(changesetId)) {
    return null;
  }
  return changesetId;
}
