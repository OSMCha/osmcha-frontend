//@flow
import { API_URL } from './';

export const PAGE_SIZE = 75;
export const overpassBase = '//overpass.maptime.in/api/interpreter';
export const osmBase = '//www.openstreetmap.org/api/0.6/';
export const mapboxAccessToken =
  'pk.eyJ1Ijoib3BlbnN0cmVldG1hcCIsImEiOiJjam10OXpmc2YwMXI5M3BqeTRiMDBqMHVyIn0.LIcIDe3TZLSDdTWDoojzNg';
export const statusUrl =
  'https://raw.githubusercontent.com/mapbox/osmcha-frontend/status/status.json';

export const osmchaSocialTokenUrl = `${API_URL}/social-auth/`;

export const osmAuthUrl = 'https://www.openstreetmap.org/oauth/authorize';
export const apiOSM = 'https://api.openstreetmap.org/api/0.6';

export const whosThat =
  'https://rksbsqdel4.execute-api.us-east-1.amazonaws.com/testing?action=names&id=';

export const nominatimUrl = 'https://nominatim.openstreetmap.org/search.php';

export const DEFAULT_FROM_DATE = 7;

// exclude changesets newer than x minutes. It's needed because of the difference
// between the time a changeset is processed by OSMCha and the time its map
// visualization is available
export const DELAY_TO_EXCLUDE = 5;
