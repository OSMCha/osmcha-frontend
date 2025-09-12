[![Donate](https://img.shields.io/badge/Donate-green?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAVxQTFRFUlJSVFRUAAAAU1NTiYmJU1NTU1NTUlJSUlJSUlJSUlJSUlJSU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NT////edwsZQAAAHJ0Uk5TAAAAAABrPgkFL4GTMQIJBI7rsHOi49hBSJ26p10NOOjuT3fy+poRtKBL8HwSwv5gk9n5UK/0qvVHmeDpLPb9i5GEC6wZO8AUCl/OvC8PtdpnM3t2LkVyy2MQ2+rh7FZM3MgWfhPej9P8nCIBUngqHWYrvvAztAAAAAFiS0dEc0EJPc4AAAAJcEhZcwAADsQAAA7EAZUrDhsAAADjSURBVBjTY2BlY2fg4OTi5mHg5eNnYGRiEBAUEhYRLRITl5CUkpaRZWaQky8CAgVFJWUgpaKqxsCnDhLQ0NQCUUUq2gw6ukBaT9+gCAIMGRRBSo2MTaACpgxmIMrcwhIqYMVgCKKsbRRtwXw7ewYHMMPRScAIZJazC4OrNUjAzd3DU93LW9jHl8HDr6jIPyAwKNglRDw0LDyCIdKtKEqcOSTaTiwmVlnPPI4hXjlBnFlNUg9iSWISgxmYbwe1VZuZIVmcOUU1VTIt3agowyozi5khm5khJzePPzu/QCi5kJ+ZBQBQGUcm32cTxgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0wNS0xOVQwNDoxMjoyNCswMDowMBTFd+0AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMDUtMTlUMDQ6MTI6MjQrMDA6MDBlmM9RAAAARnRFWHRzb2Z0d2FyZQBJbWFnZU1hZ2ljayA2LjcuOC05IDIwMTQtMDUtMTIgUTE2IGh0dHA6Ly93d3cuaW1hZ2VtYWdpY2sub3Jn3IbtAAAAABh0RVh0VGh1bWI6OkRvY3VtZW50OjpQYWdlcwAxp/+7LwAAABh0RVh0VGh1bWI6OkltYWdlOjpoZWlnaHQAMTkyDwByhQAAABd0RVh0VGh1bWI6OkltYWdlOjpXaWR0aAAxOTLTrCEIAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADE1MjY3MDMxNDR3BIWdAAAAD3RFWHRUaHVtYjo6U2l6ZQAwQkKUoj7sAAAAVnRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vbW50bG9nL2Zhdmljb25zLzIwMTgtMDUtMTkvMmRiZTkxZDZjYjlmMmRhYTkzNzc4MTQ2N2M3ZGU1ZjEuaWNvLnBuZ7N30zYAAAAASUVORK5CYII=)](https://openstreetmap.app.neoncrm.com/forms/osmcha)

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
