import { API_URL } from "./";

export const PAGE_SIZE = Number(window.env.OSMCHA_PAGE_SIZE) || 25;
export const overpassBase =
  window.env.OSMCHA_OVERPASS_BASE || "https://overpass-api.de/api/interpreter";
export const statusUrl =
  "https://raw.githubusercontent.com/osmcha/osmcha-frontend/status/status.json";

export const osmchaSocialTokenUrl = `${API_URL}/social-auth/`;

export const osmUrl =
  window.env.OSMCHA_OSM_URL || "https://www.openstreetmap.org";
export const apiOSM =
  window.env.OSMCHA_OSM_API || "https://api.openstreetmap.org/api/0.6";
export const adiffServiceUrl =
  window.env.OSMCHA_ADIFF_SERVICE_URL || "https://adiffs.osmcha.org";

export const whosThat =
  "https://whosthat.osmz.ru/whosthat.php?action=names&id=";

export const nominatimUrl =
  window.env.OSMCHA_NOMINATIM_URL ||
  "https://nominatim.openstreetmap.org/search.php";

// set a default from date x days before today
export const DEFAULT_FROM_DATE =
  Number(window.env.OSMCHA_DEFAULT_FROM_DATE) || 2;
// exclude changesets newer than x minutes. It's needed because of the difference
// between the time a changeset is processed by OSMCha and the time its map
// visualization is available
export const DEFAULT_TO_DATE = Number(window.env.OSMCHA_DEFAULT_TO_DATE) || 5;
