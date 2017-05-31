import createHistory from 'history/createBrowserHistory';

let historyConfig = {};
if (process.env.NODE_ENV === 'production') {
  historyConfig.basename = '/osmcha-frontend';
}

const history = createHistory(historyConfig);
export { history };
