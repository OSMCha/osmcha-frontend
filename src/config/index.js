if (process.env.NODE_ENV === 'production') {
  module.exports = require('./config_production');
} else {
  module.exports = require('./config_development');
}
