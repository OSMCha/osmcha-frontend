/* config-overrides.js */

const NAVIGATE_FALLBACK_WHITELIST = [
  /^(?!.*\.html$|\/data\/|\/admin|\/api-docs|\/api\/).*/
];

const RUNTIME_CACHING = [
  {
    urlPattern: /\/changesets\/\?page=/,
    handler: 'fastest',
    options: {
      cache: {
        maxEntries: 10,
        name: 'changesets-page-cache'
      }
    }
  },
  {
    urlPattern: /\/changesets\/[0-9]+\//,
    handler: 'networkFirst',
    options: {
      cache: {
        maxEntries: 10,
        name: 'changesets-cache'
      }
    }
  },
  {
    urlPattern: /s3.amazonaws.com\/mapbox\/real-changesets\/production\//,
    handler: 'cacheFirst',
    options: {
      cache: {
        maxEntries: 50,
        name: 'cmap-cache'
      }
    }
  },
  {
    urlPattern: /\/tags\//,
    handler: 'fastest',
    options: {
      cache: {
        maxEntries: 2,
        name: 'filters-tags-cache'
      }
    }
  },
  {
    urlPattern: /\/suspicion-reasons\//,
    handler: 'fastest',
    options: {
      cache: {
        maxEntries: 2,
        name: 'filters-reasons-cache'
      }
    }
  }
];

function overrideSWPrecacheWebpackPlugin(config) {
  const pluginIndex = config.plugins.findIndex(
    x => x.constructor.name === 'SWPrecacheWebpackPlugin'
  );
  config.plugins[
    pluginIndex
  ].options.navigateFallbackWhitelist = NAVIGATE_FALLBACK_WHITELIST;

  config.plugins[pluginIndex].options.runtimeCaching = RUNTIME_CACHING;
  return config;
}

module.exports = function override(config, env) {
  if (env === 'production') {
    config = overrideSWPrecacheWebpackPlugin(config);
  }
  return config;
};
