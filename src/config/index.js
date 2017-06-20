// @flow
export const isDev = process.env.REACT_APP_STACK === 'DEV';
export const isStaging = process.env.REACT_APP_STACK === 'STAGING';
export const isProd = process.env.REACT_APP_STACK === 'PRODUCTION';
export const isLocal = process.env.NODE_ENV === 'development';
export const stack = process.env.REACT_APP_STACK;
export const appVersion = process.env.REACT_APP_VERSION;

let url = 'https://osmcha-django-staging.tilestream.net/api/v1';

if (isProd) {
  url = 'https://osmcha.mapbox.com/api/v1';
}

window.debug_info = () =>
  `isDev${isDev} isStaging${isStaging} isProd${isProd} isLocal${isLocal} stack${stack} appVersion${appVersion} url${url}`;

export const API_URL = url;
