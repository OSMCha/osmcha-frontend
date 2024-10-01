import { createBrowserHistory } from 'history';
import { isDev } from '../config';
let historyConfig = {};
const history = createBrowserHistory(historyConfig);
export { history };
