//@flow
import { API_URL, credentialsPolicy } from './';

export const nominatimBaseUrl = process.env.REACT_APP_NOMINATIM_BASE_URL || 'https://nominatim.openstreetmap.org';
export const nominatimCredentials = (process.env.REACT_APP_NOMINATIM_CREDENTIALS === 'enabled' ? credentialsPolicy : 'omit');
export const overpassApiUrl = process.env.REACT_APP_OVERPASS_API_URL || 'https://overpass-api.de/api/interpreter';
export const overpassCredentials = (process.env.REACT_APP_OVERPASS_CREDENTIALS === 'enabled' ? credentialsPolicy : 'omit');
export const osmBaseUrl = process.env.REACT_APP_OSM_BASE_URL || 'https://www.openstreetmap.org';
export const osmApiUrl = process.env.REACT_APP_OSM_API_URL || 'https://api.openstreetmap.org';
export const osmAuthUrl = process.env.REACT_APP_OSM_AUTH_URL || `${osmBaseUrl}/oauth/authorize`;
export const osmCredentials = (process.env.REACT_APP_OSM_CREDENTIALS === 'enabled' ? credentialsPolicy : 'omit');
export const osmchaSocialTokenUrl = `${API_URL}/social-auth/`;

// set a default from date x days before today
export const DEFAULT_FROM_DATE = parseInt(process.env.REACT_APP_DEFAULT_FROM_DATE || 2);
// exclude changesets newer than x minutes. It's needed because of the difference
// between the time a changeset is processed by OSMCha and the time its map
// visualization is available
export const DEFAULT_TO_DATE = parseInt(process.env.REACT_APP_DEFAULT_TO_DATE || 5);
export const PAGE_SIZE = parseInt(process.env.REACT_APP_PAGE_SIZE || 75);
