import createHistory from 'history/createBrowserHistory';

let historyConfig = {};
if (process.env.REACT_APP_STACK !== 'STAGING') {
  historyConfig.basename = '/osmcha-frontend';
}

const history = createHistory(historyConfig);
export { history };
