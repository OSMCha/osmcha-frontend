import { matchPath } from "react-router";

function _getParam(param: string, location: any, path: string) {
  if (!location || !location.pathname) return null;
  const match = matchPath(path, location.pathname);
  if (!match) return null;
  return match.params[param];
}
