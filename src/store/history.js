import createHistory from 'history/createBrowserHistory';

let historyConfig = {};
if (
  process.env.NODE_ENV === 'production' &&
  process.env.REACT_APP_STACK !== 'STAGING'
) {
  historyConfig.basename = '/osmcha-frontend';
}

const history = createHistory(historyConfig);
export { history };
