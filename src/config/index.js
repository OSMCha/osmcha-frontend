// @flow
export const isDev = process.env.REACT_APP_STACK === 'DEV';
export const isStaging = process.env.REACT_APP_STACK === 'STAGING';
export const isProd = process.env.REACT_APP_STACK === 'PRODUCTION';
export const isLocal = process.env.NODE_ENV === 'development';
export const stack = process.env.REACT_APP_STACK;
export const appVersion = process.env.REACT_APP_VERSION;
export const credentialsPolicy =
    process.env.REACT_APP_CREDENTIALS_POLICY || (process.env.NODE_ENV === 'development' ? 'include' : 'same-origin');
export const apiCredentials = (process.env.REACT_APP_OSMCHA_CREDENTIALS === 'enabled' ? credentialsPolicy : 'omit');
export const API_URL = process.env.REACT_APP_API_URL || (isProd ? 'https://osmcha.org/api/v1' : 'https://staging.osmcha.org/api/v1');
export const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL || '';
export const BASE_PATH = PUBLIC_URL.startsWith('http') ? new URL(PUBLIC_URL).pathname : '';

window.debug_info = () =>
  `isDev=${isDev.toString()} isStaging=${isStaging.toString()} isProd=${isProd.toString()} isLocal=${isLocal.toString()} stack=${stack ||
    'null'} appVersion=${appVersion || 'null'} url=${API_URL}`;
