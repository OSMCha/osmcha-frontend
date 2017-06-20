import { isProd } from '../config';
let ReactGA;

if (isProd) {
  ReactGA = require('react-ga');
}

export function gaPageView(page: string) {
  if (ReactGA) {
    ReactGA.pageview(page);
  }
}

export function gaSendEvent(obj: Object) {
  if (ReactGA) {
    ReactGA.event(obj);
  }
}
