import createHistory from 'history/createBrowserHistory';

let historyConfig = {};
if (process.env.REACT_APP_DEPLOY_TARGET !== 'DOTCOM') {
  historyConfig.basename = '/osmcha-frontend';
}

const history = createHistory(historyConfig);
export { history };
