import { API_URL } from './';

export const PAGE_SIZE = Number(process.env.REACT_APP_PAGE_SIZE) || 25;
export const overpassBase =
  process.env.REACT_APP_OVERPASS_BASE ||
  'https://overpass-api.de/api/interpreter';
export const statusUrl =
  'https://raw.githubusercontent.com/osmcha/osmcha-frontend/status/status.json';
export const enableRealChangesets =
  !process.env.REACT_APP_DISABLE_REAL_CHANGESETS;

export const osmchaSocialTokenUrl = `${API_URL}/social-auth/`;
export const osmchaUrl = API_URL.replace('api/v1', '');

export const osmUrl =
  process.env.REACT_APP_OSM_URL || 'https://www.openstreetmap.org';
export const isOfficialOSM = osmUrl === 'https://www.openstreetmap.org';
export const apiOSM =
  process.env.REACT_APP_OSM_API || 'https://api.openstreetmap.org/api/0.6';
export const adiffServiceUrl =
  process.env.REACT_APP_ADIFF_SERVICE_URL || 'https://adiffs.osmcha.org';

export const whosThat =
  'https://whosthat.osmz.ru/whosthat.php?action=names&id=';

export const nominatimUrl =
  process.env.REACT_APP_NOMINATIM_URL ||
  'https://nominatim.openstreetmap.org/search.php';

// set a default from date x days before today
export const DEFAULT_FROM_DATE = Number(process.env.REACT_APP_DEFAULT_FROM_DATE) || 2;
// exclude changesets newer than x minutes. It's needed because of the difference
// between the time a changeset is processed by OSMCha and the time its map
// visualization is available
export const DEFAULT_TO_DATE = Number(process.env.REACT_APP_DEFAULT_TO_DATE) || 5;
