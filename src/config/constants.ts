import { API_URL } from "./";

export const PAGE_SIZE = Number(import.meta.env.VITE_PAGE_SIZE) || 25;
export const overpassBase =
  import.meta.env.VITE_OVERPASS_BASE ||
  "https://overpass-api.de/api/interpreter";
export const statusUrl =
  "https://raw.githubusercontent.com/osmcha/osmcha-frontend/status/status.json";
export const enableRealChangesets = !import.meta.env
  .VITE_DISABLE_REAL_CHANGESETS;

export const osmchaSocialTokenUrl = `${API_URL}/social-auth/`;
export const osmchaUrl = API_URL.replace("api/v1", "");

export const osmUrl =
  import.meta.env.VITE_OSM_URL || "https://www.openstreetmap.org";
export const isOfficialOSM = osmUrl === "https://www.openstreetmap.org";
export const apiOSM =
  import.meta.env.VITE_OSM_API || "https://api.openstreetmap.org/api/0.6";
export const adiffServiceUrl =
  import.meta.env.VITE_ADIFF_SERVICE_URL || "https://adiffs.osmcha.org";

export const whosThat =
  "https://whosthat.osmz.ru/whosthat.php?action=names&id=";

export const nominatimUrl =
  import.meta.env.VITE_NOMINATIM_URL ||
  "https://nominatim.openstreetmap.org/search.php";

// set a default from date x days before today
export const DEFAULT_FROM_DATE =
  Number(import.meta.env.VITE_DEFAULT_FROM_DATE) || 2;
// exclude changesets newer than x minutes. It's needed because of the difference
// between the time a changeset is processed by OSMCha and the time its map
// visualization is available
export const DEFAULT_TO_DATE =
  Number(import.meta.env.VITE_DEFAULT_TO_DATE) || 5;
