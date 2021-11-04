//@flow
import { API_URL } from './';

export const credentialsPolicy =
    process.env.REACT_APP_CREDENTIALS_POLICY || (process.env.NODE_ENV === 'development' ? 'include' : 'same-origin');
export const mapboxAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN ||
  'pk.eyJ1Ijoib3BlbnN0cmVldG1hcCIsImEiOiJjam10OXpmc2YwMXI5M3BqeTRiMDBqMHVyIn0.LIcIDe3TZLSDdTWDoojzNg';
export const nominatimBaseUrl = process.env.REACT_APP_NOMINATIM_BASE_URL || 'https://nominatim.openstreetmap.org';
export const nominatimCredentials = (process.env.REACT_APP_NOMINATIM_CREDENTIALS === 'enabled' ? credentialsPolicy : 'omit');
export const overpassApiUrl = process.env.REACT_APP_OVERPASS_API_URL || 'https://overpass-api.de/api/interpreter';
export const overpassCredentials = (process.env.REACT_APP_OVERPASS_CREDENTIALS === 'enabled' ? credentialsPolicy : 'omit');
export const osmBaseUrl = process.env.REACT_APP_OSM_BASE_URL || 'https://www.openstreetmap.org';
export const osmApiUrl = process.env.REACT_APP_OSM_API_URL || 'https://api.openstreetmap.org';
export const osmAuthUrl = process.env.REACT_APP_OSM_AUTH_URL || `${osmBaseUrl}/oauth/authorize`;
export const osmTileUrl = process.env.REACT_APP_OSM_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
export const osmchaSocialTokenUrl = `${API_URL}/social-auth/`;
export const whosThat =
  'https://rksbsqdel4.execute-api.us-east-1.amazonaws.com/testing?action=names&id=';

// set a default from date x days before today
export const DEFAULT_FROM_DATE = 2;
// exclude changesets newer than x minutes. It's needed because of the difference
// between the time a changeset is processed by OSMCha and the time its map
// visualization is available
export const DEFAULT_TO_DATE = 5;
export const PAGE_SIZE = 75;
