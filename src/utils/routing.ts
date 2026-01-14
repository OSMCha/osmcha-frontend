import { matchPath } from "react-router";

export function getParam(param: string, location: any, path: string) {
  if (!location || !location.pathname) return null;
  const match = matchPath(path, location.pathname);
  if (!match) return null;
  return match.params[param];
}

export function getChangesetIdFromLocation(location: any) {
  const param = getParam("id", location, "/changesets/:id");
  if (!param) return null;
  const changesetId = parseInt(param, 10);
  if (!changesetId || Number.isNaN(changesetId)) {
    return null;
  }
  return changesetId;
}

export function checkForLegacyURL(location: any) {
  const param = getParam("id", location, "/:id");
  if (!param) return null;
  const changesetId = parseInt(param, 10);
  if (!changesetId || Number.isNaN(changesetId)) {
    return null;
  }
  return changesetId;
}
