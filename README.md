# osmcha-frontend

This is the web frontend for [osmcha.org](https://osmcha.org/), a tool for reviewing and analyzing edits to [OpenStreetMap](https://openstreetmap.org/about).

Other relevant repositories that contain parts of the OSMCha application are:
* [`osmcha-django`](https://github.com/OSMCha/osmcha-django) - the backend Django application
* [`osmcha` (python library)](https://github.com/OSMCha/osmcha) - used by the backend to analyse OSM changesets
* [`maplibre-adiff-viewer`](https://github.com/OSMCha/maplibre-adiff-viewer) - used to display the changeset on the main map

## Development

To set up a local development environment:

1. Install Node.js and npm. The recommended Node.js version is listed in [.tool-versions](./.tool-versions). Tool managers like [asdf](https://asdf-vm.com/) or [mise](https://mise.jdx.dev/) can read this file and install the right version for you if you want. 
1. Run `npm install` to install the required JavaScript dependencies.
1. Run `npm run start` to start the frontend (it will rebuild automatically when you make changes)
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
setting the `OSMCHA_API_URL` environment variable. After that, normal OAuth
login through the frontend UI should work.

### Testing and quality checks

- `npm run typecheck` runs TypeScript to verify that the code does not have any type errors
- `npm run check` checks that the code is formatted correctly and runs the linter (it also runs typechecking)
- `npm run format` reformats code to match the expected conventions
- `npm run test` runs the automated test suite

## Releasing and Deployment

Deployment of the [osmcha.org](https://osmcha.org) instance is managed in the [`osmcha-deploy`](https://github.com/OSMCha/osmcha-deploy). Tags pushed to this repo are automatically built into container images. Modifying the code in `osmcha-deploy` to change the pinned image version will automatically redeploy the production website.

When tagging a new release, be sure to also update the [CHANGELOG](./CHANGELOG.md) file to describe what's changed.

## Issues and feature requests

If you have any error reports of want to request new features, please
[read our contribution guide to file an issue](CONTRIBUTING.md).
