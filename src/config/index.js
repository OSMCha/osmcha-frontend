// @flow
export const isDev = process.env.REACT_APP_STACK === 'DEV';
export const isStaging = process.env.REACT_APP_STACK === 'STAGING';
export const isProd = process.env.REACT_APP_STACK === 'PRODUCTION';
export const isLocal = process.env.NODE_ENV === 'development';
export const stack = process.env.REACT_APP_STACK;
export const appVersion = process.env.REACT_APP_VERSION;

let url = 'https://osmcha-org-staging.osmcha.org/api/v1';

if (isProd) {
  url = 'https://osmcha.org/api/v1';
}

window.debug_info = () =>
  `isDev=${isDev.toString()} isStaging=${isStaging.toString()} isProd=${isProd.toString()} isLocal=${isLocal.toString()} stack=${stack ||
    'null'} appVersion=${appVersion || 'null'} url=${url}`;

export const API_URL = url;
