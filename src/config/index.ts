import pkg from '../../package.json';

export const isDev = import.meta.env.VITE_STACK === 'DEV';
export const isStaging = import.meta.env.VITE_STACK === 'STAGING';
export const isProd = import.meta.env.VITE_STACK === 'PRODUCTION';
export const isLocal = import.meta.env.MODE === 'development';
export const stack = import.meta.env.VITE_STACK;
export const appVersion = pkg.version;

let url =
  import.meta.env.VITE_PRODUCTION_API_URL || 'https://osmcha.org/api/v1';

window.debug_info = () =>
  `isDev=${isDev.toString()} isStaging=${isStaging.toString()} isProd=${isProd.toString()} isLocal=${isLocal.toString()} stack=${
    stack || 'null'
  } appVersion=${appVersion || 'null'} url=${url}`;

export const API_URL = url;
