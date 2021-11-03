export const config = {
  overpassApiUrl: process.REACT_APP_OVERPASS_API_URL || 'https://overpass.maptime.in/api/interpreter',
  osmchaApiUrl: process.env.REACT_APP_OSMCHA_API_URL || 'https://osmcha.org',
  osmchaBaseUrl: process.env.REACT_APP_OSMCHA_URL || 'https://osmcha.org',
  osmApiUrl: process.env.REACT_APP_OSM_API_URL || 'https://api.openstreetmap.org',
  S3_URL: 'https://invalid.arpa',
  mapboxAccessToken:
    'pk.eyJ1Ijoib3BlbnN0cmVldG1hcCIsImEiOiJjam10OXpmc2YwMXI5M3BqeTRiMDBqMHVyIn0.LIcIDe3TZLSDdTWDoojzNg'
};
