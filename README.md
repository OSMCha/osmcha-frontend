# osmcha-frontend
[![CircleCI](https://circleci.com/gh/mapbox/osmcha-frontend.svg?style=svg)](https://circleci.com/gh/mapbox/osmcha-frontend)

OSMCha is composed by a group of softwares that together has the aim to make it
easier to monitor and validate the changes in OpenStreetMap.

This repository contains the frontend code. Check the [Repositories section](#other-repositories)
to see the other softwares we use in OSMCha.

To learn how to use OSMCha, see the [ABOUT.md](ABOUT.md) file.

- Production instance: https://osmcha.mapbox.com
- Test instance: http://osmcha-django-staging.tilestream.net/


## Setting up editor

### Prettier
This repository uses [prettier](https://github.com/prettier/prettier) to keep the code consistent and formatted. You can config your favourite editor by the following links
- Atom users can simply install the [prettier-atom](https://atom.io/packages/prettier-atom) package and use Ctrl+Alt+F to format a file (or format on save if enabled).
- Visual Studio Code users can Search for Prettier - JavaScript formatter.

### Prerequisite
- Make sure your node version is *9.1*.
- Install `yarn` globally using `brew install yarn`.
- Install `watchman` globally with `brew install watchman`.

### Local development
1. `yarn start`
1. Open [https://localhost:3000/?filters={%22date__gte%22%3A[{%22label%22%3A%222017-05-01%22%2C%22value%22%3A%222017-05-01%22}]}](https://localhost:3000/?filters={%22date__gte%22%3A[{%22label%22%3A%222017-05-01%22%2C%22value%22%3A%222017-05-01%22}]})
  - The app runs with https; Firefox is recommended since it allows self signed certificates.
  - The staging database only has changesets until mid 2017; without the filter you will not see any changesets.

*To sign in:*

1. After loading the page in your browser, inspect the request made to `social-auth/` and copy the `oauth_token`;
1. In other browser tab, access `https://www.openstreetmap.org/oauth/authorize?oauth_token=<oauth_token>` and give authorization in the OpenStreetMap page that will load;
1. You will be redirected to a blank page that has a `oauth_verifier` in the url. Copy the `oauth_verifier`;
1. Click on the `Sign in` button on your local OSMCha instance, paste the `oauth_verifier` and you will be logged in.

### Local testing
Test the application before commiting any changes. If you encounter any error make sure you have `watchman` installed. [Installation Guide](https://facebook.github.io/watchman/docs/install.html).

```bash
yarn test
```

## Deploy/Release
- There are three stacks to deploy to
- `yarn deploy:dev` deploys it to `mapbox.github.io`
- `yarn deploy:staging` deploys it to `osmcha-django-staging.tilestream.net`
- `yarn deploy:prod` deploys it to `osmcha.mapbox.com`

1. Run the tests with `yarn test`

2. (optional) before deploy, you might want to increment the version number of application.
    * We use `minor` for all non-drastic changes.
    * The `patch` is reserved for minor changes.
    * We try to stick to sem-ver.
```bash
npm version minor
```


3. Then build the app with the following command.
```bash
yarn build:<stack>
```
    * here stack could be `dev`, `staging`, `prod`. Refer to package.json for more info.

4. The next step involves deploying the `build` folder to github. If you get an error like this `error: failed to push some refs to 'git'` while doing the deploy step. Run `rm -rf node_modules/gh-pages/.cache/`.
```
yarn deploy:<stack>
```
    * here stack could be `dev`, `staging`, `prod`. Refer to package.json for more info.
    * `oh-pages` branch handles the build for `staging`, `prod` stacks.
    * `gh-pages` branch handles the build for `dev` stack.


5. (optional) If you want to see the new changes on a `staging` or `prod` stack. You will need to draft a new github release. The convention is to append `-staging` or `-production` or just `-server` to the current version tag for the server to consume the build and separate concerns.
    * for eg. if the version npm module version was `v0.16.3`.
    * draft a github release with a tag `v0.16.3-staging`. (Note the name spacing)
    * supply this version tag to the server.
    * Refer to githubs [article](https://help.github.com/articles/creating-releases/) for creating releases.


## Other repositories

* [OSMCha backend code](https://github.com/willemarcel/osmcha-django)
* [OSMCha python library](https://github.com/willemarcel/osmcha) _(used to analyse the OSM changesets)_
* [osm-compare](https://github.com/mapbox/osm-compare) _(used to analyse the OSM features)_

## Issues and feature requests

If you have any error reports of want to request new features, please
[read our contribution guide to file an issue](CONTRIBUTING.md).
