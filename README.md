# osmcha-frontend

OSMCha is composed by a group of softwares that together has the aim to make it
easier to monitor and validate the changes in OpenStreetMap. [Learn more …](ABOUT.md)

- Production instance: https://osmcha.org
- Test instance: http://osmcha-django-staging.tilestream.net/

This repository contains the frontend code. Other repositories are:
* [OSMCha backend code](https://github.com/willemarcel/osmcha-django)
* [OSMCha python library](https://github.com/willemarcel/osmcha) is used to analyse the OSM changesets
* [OSM Compare](https://github.com/mapbox/osm-compare) is used to analyse OSM features
* [OSM Changeset Viewer](https://github.com/osmlab/changeset-map) is used to display the changeset on the main map


## Setting up editor

### Prettier

This repository uses [prettier](https://github.com/prettier/prettier) to keep the code consistent and formatted. You can config your favourite editor by the following links
- Atom users can simply install the [prettier-atom](https://atom.io/packages/prettier-atom) package and use Ctrl+Alt+F to format a file (or format on save if enabled).
- Visual Studio Code users can Search for Prettier - JavaScript formatter.

### Prerequisite

1. Install [asdf version manager](https://asdf-vm.com/guide/getting-started.html#getting-started)
1. `asdf install` to install the required tools from [.tool-versions](./.tool-versions)
1. `yarn install` (`brew install yarn` if required).

### Local development

1. `yarn start`
1. Open [https://localhost:3000?filters=%7B%22date__gte%22%3A%5B%7B%22label%22%3A%222020-04-01%22%2C%22value%22%3A%222020-04-01%22%7D%5D%7D](https://localhost:3000?filters=%7B%22date__gte%22%3A%5B%7B%22label%22%3A%222020-04-01%22%2C%22value%22%3A%222020-04-01%22%7D%5D%7D) of e.g. [changeset#91638199](https://localhost:3000/changesets/91638199?filters=%7B%22date__gte%22%3A%5B%7B%22label%22%3A%222020-04-01%22%2C%22value%22%3A%222020-04-01%22%7D%5D%7D)
    - The app runs with https; Firefox is recommended since it allows self signed certificates.
    - The staging database does not have all the changesets that production has, therefore the filter is needed.

**To also edit the part of the UI that is provided by the OSM Changeset Viewer**

Checkout https://github.com/osmlab/changeset-map in a sibling folder.

_In `./changeset-map`:_

1. `yarn link`
1. `yarn build --watch`

_In `./osmcha-frontend`_

1. `yarn link "changeset-map"`
1. `yarn start`

Edits in both projects will result in a rebuild and reload the browser.

When finished, reset "osmcha-frontend" back to the npm version of "changeset-map" with `yarn add changeset-map@latest`

### Local testing

Test the application before commiting any changes. If you encounter any error make sure you have `watchman` installed. [Installation Guide](https://facebook.github.io/watchman/docs/install.html).

```bash
yarn test
```

## Deploy/Release

- There are three stacks to deploy to
- ~~`yarn deploy:dev` deploys it to `mapbox.github.io`~~ (currently broken)
- `yarn deploy:staging` deploys it to `staging.osmcha.org`
- `yarn deploy:prod` deploys it to `osmcha.org`

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


## Issues and feature requests

If you have any error reports of want to request new features, please
[read our contribution guide to file an issue](CONTRIBUTING.md).
