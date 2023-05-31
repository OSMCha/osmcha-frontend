import ReactGA from 'react-ga4';

import { isProd } from '../config';

export function gaPageView(page: string) {
  if (isProd) {
    ReactGA.send(page);
  }
}

export function gaSendEvent(obj: Object) {
  if (isProd) {
    ReactGA.event(obj);
  }
}
