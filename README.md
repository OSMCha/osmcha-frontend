# osmcha-frontend

OSMCha is composed by a group of softwares that together has the aim to make it
easier to monitor and validate the changes in OpenStreetMap. [Learn more …](ABOUT.md)

- Production instance: https://osmcha.org
- Test instance: http://osmcha-django-staging.tilestream.net/

This repository contains the frontend code. Other repositories are:
* [`osmcha-django`](https://github.com/OSMCha/osmcha-django) - the backend Django application
* [`osmcha` (python library)](https://github.com/OSMCha/osmcha) - used by the backend to analyse OSM changesets
* [`maplibre-adiff-viewer`](https://github.com/OSMCha/maplibre-adiff-viewer) - used to display the changeset on the main map

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
1. Open [http://127.0.0.1:3000](http://127.0.0.1:3000)

Note: if you are running the frontend against the production backend (the
default), you won't be able to use OAuth to log in through the UI. Instead
you can copy your auth token from the DevTools console on the production
website (`localStorage.getItem("token")`) and then paste it into the console
on the development site (`localStorage.setItem("token", <value>)`). Refresh
the page and you should now be logged in.

If you are running your own local copy of the
[`osmcha-django`](https://github.com/OSMCha/osmcha-django) backend, you'll
need to register your own OAuth app on openstreetmap.org, configure the backend
to use that secret key, and then point this frontend at your local backend by
setting the `REACT_APP_PRODUCTION_API_URL` environment variable. After that,
normal OAuth login through the frontend UI should work.

### Local testing

Test the application before commiting any changes. If you encounter any error make sure you have `watchman` installed. [Installation Guide](https://facebook.github.io/watchman/docs/install.html).

```bash
yarn test
```

## Releasing and Deployment

Deployment of the [osmcha.org](https://osmcha.org) instance is managed in the [`osmcha-deploy`](https://github.com/OSMCha/osmcha-deploy). Tags pushed to this repo are automatically built into container images. Modifying the code in `osmcha-deploy` to change the pinned image version will automatically redeploy the production website.

When tagging a new release, be sure to also update the [CHANGELOG](./CHANGELOG.md) file to describe what's changed.

## Issues and feature requests

If you have any error reports of want to request new features, please
[read our contribution guide to file an issue](CONTRIBUTING.md).
