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

`yarn test`

Launches the test runner in the interactive watch mode.

`yarn build`

Builds the app for production to the build folder.

`yarn deploy`

Build and publish to the `gh-pages` branch.
