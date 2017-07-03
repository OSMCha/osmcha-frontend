import createHistory from 'history/createBrowserHistory';
import { isDev } from '../config';
let historyConfig = {};
if (isDev) {
  historyConfig.basename = '/osmcha-frontend';
}

const history = createHistory(historyConfig);
export { history };
