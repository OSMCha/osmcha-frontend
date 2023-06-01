# osmcha-frontend
[![CircleCI](https://circleci.com/gh/mapbox/osmcha-frontend.svg?style=svg)](https://circleci.com/gh/mapbox/osmcha-frontend)

OSMCha comprises a group of software that aims to make monitoring and validating the changes in OpenStreetMap easier. See our [About](ABOUT.md) page to learn more.

- Production instance: https://osmcha.org
- Test instance: http://osmcha-django-staging.tilestream.net/

This repository contains the frontend code. Other repositories are:

* [OSMCha backend code](https://github.com/willemarcel/osmcha-django)
* [OSMCha python library](https://github.com/willemarcel/osmcha) (analyses the OSM changesets)
* [OSM Compare](https://github.com/mapbox/osm-compare) (analyses OSM features)
* [OSM Changeset Viewer](https://github.com/osmlab/changeset-map) (displays the changeset on the main map


## Setting up editor

### Prettier

This repository uses [prettier](https://github.com/prettier/prettier) to keep the code consistent and formatted. You can config your favourite editor by the following links
- Atom users can install the [prettier-atom](https://atom.io/packages/prettier-atom) package and use Ctrl+Alt+F to format a file (or format on save if enabled).
- Visual Studio Code users can Search for Prettier - JavaScript formatter.

### Prerequisite

1. Install [asdf version manager](https://asdf-vm.com/guide/getting-started.html#getting-started)
1. `asdf install` to install the required tools from [.tool-versions](./.tool-versions)
1. `yarn install` (`brew install yarn` if required).

### Local development

1. `yarn start`
1. Open [https://localhost:3000?filters=%7B%22date__gte%22%3A%5B%7B%22label%22%3A%222020-04-01%22%2C%22value%22%3A%222020-04-01%22%7D%5D%7D](https://localhost:3000?filters=%7B%22date__gte%22%3A%5B%7B%22label%22%3A%222020-04-01%22%2C%22value%22%3A%222020-04-01%22%7D%5D%7D) of e.g. [changeset#91638199](https://localhost:3000/changesets/91638199?filters=%7B%22date__gte%22%3A%5B%7B%22label%22%3A%222020-04-01%22%2C%22value%22%3A%222020-04-01%22%7D%5D%7D)
    - The app runs with HTTP; we recommend Firefox, which allows self-signed certificates.
    - The staging database does not have all the changesets that production has; thus, the filter is needed.

**To also edit the part of the UI that the OSM Changeset Viewer provides**

Checkout https://github.com/osmlab/changeset-map in a sibling folder.

_In `./changeset-map`:_

1. `yarn link`
1. `yarn build --watch`

_In `./osmcha-frontend`_

1. `yarn link "changeset-map"`
1. `yarn start`

Edits in both projects will result in a rebuild and reload of the browser.

When finished, reset "osmcha-frontend" back to the npm version of "changeset-map" with `yarn add changeset-map@latest`

### Local testing

Test the application before committing any changes. If you encounter any errors, make sure you have `Watchman` installed. [Installation Guide](https://facebook.github.io/watchman/docs/install.html).

```bash
yarn test
```

## Deploy/Release

- There are three stacks to deploy to
- ~~`yarn deploy:dev` deploys it to `mapbox.github.io`~~ (currently broken)
- `yarn deploy:staging` deploys it to `staging.osmcha.org`
- `yarn deploy:prod` deploys it to `osmcha.org`

1. Run the tests with `yarn test`

2. (optional) before deployment; you can increment the application's version number.
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

4. The next step involves deploying the `build` folder to GitHub. If you get an error like this `error: failed to push some refs to 'git'` while doing the deploy step. Run `rm -rf node_modules/gh-pages/.cache/`.
    ```
    yarn deploy:<stack>
    ```
    * here stack could be `dev`, `staging`, `prod`. Refer to package.json for more info.
    * `oh-pages` branch handles the build for `staging`, `prod` stacks.
    * `gh-pages` branch handles the build for `dev` stack.


5. (optional) You must draft a new GitHub release if you want to see new changes on a staging or prod stack. The convention is to append `-staging` or `-production` or just `-server` to the current version tag for the server to consume the build and separate concerns.
    * for eg. if the version npm module version was `v0.16.3`.
    * draft a GitHub release with a tag `v0.16.3-staging`. (Note the namespacing)
    * supply this version tag to the server.
    * Refer to GitHub's [article](https://help.github.com/articles/creating-releases/) for creating releases.


## Issues and feature requests

If you have any error reports or want to request new features, please
[read our contribution guide to file an issue](CONTRIBUTING.md).
