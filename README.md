# osmcha-frontend
[![CircleCI](https://circleci.com/gh/mapbox/osmcha-frontend.svg?style=svg)](https://circleci.com/gh/mapbox/osmcha-frontend)

- Frontend for the osmcha-django REST API  
- API Testing endpoint: https://osmcha-django-api-test.tilestream.net/api-docs/
- API staging http://osmcha-django-staging.tilestream.net/api-docs

Published to Github Pages at https://mapbox.github.io/osmcha-frontend/

## Setting up editor

### Prettier
This repository uses [prettier](https://github.com/prettier/prettier) to keep the code consistent and formatted. You can config your favourite editor by the following links
- Atom users can simply install the [prettier-atom](https://atom.io/packages/prettier-atom) package and use Ctrl+Alt+F to format a file (or format on save if enabled).
- Visual Studio Code users can Search for Prettier - JavaScript formatter.

## Workflow

`yarn start`

Runs the app in the development mode.
Open http://localhost:3000 to view it in the browser.


### Prerequisite
- Make sure your node version is 7.
- Install `yarn` globally using `brew install yarn`.
- Install `watchman` globally with `brew install watchman`.

### Deploy/Release
- There are three stacks to deploy to
- `yarn deploy:dev` deploys it to `mapbox.github.io`
- `yarn deploy:staging` deploys it to `osmcha-django-staging.tilestream.net`
- `yarn deploy:prod` deploys it to `osmcha.mapbox.com`

1. Test the application before commiting any changes. If you encounter any error make sure you have `watchman` installed. [Installation Guide](https://facebook.github.io/watchman/docs/install.html).

```bash
yarn test
```

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


5. (optional) If you want to see the new changes on a `staging` or `prod` stack. You will need to draft a new github release. The convention is to append `-server` to the current version tag for the server to consume the build and separate concerns.
    * for eg. if the version npm module version was `v0.16.3`.
    * draft a github release with a tag `v0.16.3-server`. (Note the -server part)
    * supply this version tag to the server.
    * Refer to githubs [article](https://help.github.com/articles/creating-releases/) for creating releases.
