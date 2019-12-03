import { createBrowserHistory } from 'history';
import { isDev } from '../config';
let historyConfig = {};
if (isDev) {
  historyConfig.basename = '/osmcha-frontend';
}

const history = createBrowserHistory(historyConfig);
export { history };
