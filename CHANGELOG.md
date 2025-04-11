# Change Log

Log of changes since the 2.0 version

### 1.2.1

- Upgrade to maplibre-adiff-viewer 1.3.0, which contains tweaks to improve
  the visibility of elements on the map.
- Fix some filter input bugs (#779)
- Preserve order of relation members in the element info table (#780)

### 1.2.0

- Switch from using s3://real-changesets JSONs to using adiffs.osmcha.org
  augmented diffs (XML) for visualizing changesets on the map
- Remove dependency on changeset-map; add dependencies on
  @osmcha/maplibre-adiff-viewer and @osmcha/osm-adiff-parser
- Map rendering now uses MapLibre GL JS v5.1.0 (we were previously using
  Mapbox GL JS v1.13, via changeset-map)
- Clicking on a map element reveals a new details panel (the old one was part
  of changeset-map)
- New bounding box input for filtering, implemented using Terra Draw

More detailed description of the above changes available here:
https://github.com/OSMCha/osmcha-frontend/pull/772

### 1.1.1

- Fix display order of RTL tag values in Tag Changes view (#766)

### 1.1.0

- Fix Chinese text input in location search bar (#671)
- Add link to Pascal Neis' Changeset Visualization app (#690)
- Simplify Docker image configuration and deployment (#749)
- Switch to Plausible analytics (#750)

### 1.0.2
- Update changeset-map to 1.14.0
- Update @turf dependencies to 7.1.0

### 1.0.1
- Update changeset-map to 1.13.0
- Update Who's That server URL

### 1.0.0
- Add OSM US logo and update main logo

### 0.88.1
- Loads all tags and reasons to avoid errors

### 0.88.0
- Enable oauth2 authorization (#733)

### 0.87.5
- Update changeset-map version to 1.12.1

### 0.87.4
- Fix error in the copy changeset url link
  
### 0.87.3
- Fix error when loading AOIs with tags or flags filters

### 0.87.2
- Filter error in async Multiselect components of Filters page

### 0.87.1
- Remove order_by id option
- Fix bugs in Tags dropdown loading

### 0.87.0
- Add Github action to build and publish docker images
- Update Github URLs
- Add Donate link
- Fix error when reading the AOI and Watchlist response format (#700)
- Switch env variable to REACT_APP_DISABLE_REAL_CHANGESETS (#696)
- Update url for Rapid (#689)
- Add support for osm-revert (#691)

### 0.86.0
- Update changeset-map version
- Pass configuration to changeset-map

### 0.85.4
-  Improve UI on My Teams, Saved Filters, Watchlist & Trusted users pages (#654)

### 0.85.3
- Downgrade changeset-map version (#638)

### 0.85.2
- Add ANY and ALL options to tag_changes filter field

### 0.85.1
- Change default changesets API page_size to 25

### 0.85.0
- Add tag_changes field to Filters page (#619)
- Small code improvements (#620)

### 0.84.1
- Fix bug in changeset comment form

### 0.84.0
- Improve mobile responsiveness (#591)
- Refactored some components (#591)
- Update changeset-map to 1.11.0 (#592)

### 0.83.0
- Show additional changeset metadata information (#570)
- Add My Changesets and My Reviews links to the user menu (#575)

### 0.82.3
- Update default from date query to 2 days or 30 in case of users query (#563)
- Fix date parsing on the Discussions tab (#561)

### 0.82.2
- Fix bug in changeset date_lte query format

### 0.82.1
- Replace momentjs by date-fns (#554)
- Update react-datepicker to 4.1.1 (#554)
- Update TurfJS libraries (#558)
- Improve location filters with debounce and a better geometry simplification (#558)

### 0.82.0
- Update changeset-map to 1.10.0 (#553)
- Allow users to flag features (#553)
- Remove 10-character limit on the username sidebar button (#551)
- Fix description of "Editor" filter field (#550)
- New create and edit teams form (#557)

### 0.81.0
- Add icon on changeset list to indicate if user is trusted or watchlisted (#545)

### 0.80.0
- Switch between features with TAB (#543)

### 0.79.3
- Convert Tag Changes, Geometry Changes and Other features tabs components to functions (#537)
- Update React to 16.8.3 (#539)
- Update changeset-map to 1.9.4 (#541)

### 0.79.2
- Refactor code related to Watch and Trusted lists (#534)

### 0.79.1
- Update React to 16.8 (#527)
- Show feature type on Tag Changes tab + reuse FeatureListItem component (#531)
- Open iD and RapiD with the current OSMCha map viewport (#528)
- Update mousetrap and why-did-you-render libraries

### 0.79.0
- Add toggle to open & close all list items on feature tabs (#523, #524)
- Show tag changes values on the list (#522)

### 0.78.2
- Update changeset-map to 1.9.3 (#515)
- Get comments from OSM API (#515)
- Lint code (#516)

### 0.78.1
- Update changeset-map to 1.9.2 (#513)

### 0.78.0
- Update changeset-map to 1.9.1 (#512)
- List geometry changes, modified relations, created and deleted features (#511)
- Use json format to get user data from OSM API (#510)

### 0.76.1
- Update changeset-map to 1.9.0
- Update browserslist

### 0.76.0
- Change links on user tab to filter by uid instead of username
- Add link to user that reviewed the PR on the changeset list

### 0.74.1
- Update changeset-map to 1.7.0

### 0.74.0
- Add OpenStreetMap carto map style layer option
- Improve Map Style selector
- Add metatags to public HTML

### 0.72.0
- Show number of comments information on changesets list if it's higher than 0
- Allow filtering changesets by number of comments
- Add order by number of comments option

### 0.70.1
- Add filter by user id
- Modify changeset header to include RapiD link and organize better the other links
- Add links to good and bad changesets of a user
- Add a link to filter changesets of a user by their uid instead of username

### 0.70.0
- Update changeset-map to 1.6.1, which enables visualization of dragged nodes
- Update react-scripts to 3.4.3

### 0.68.1
- Update changeset-map to 1.5.0 to enable visualization of dragged nodes

### 0.68.0
- Add metadata field filter
- Avoid redirection when loading osm.org URLs

### 0.66.4
- Improve style of API key section of user profile page

### 0.66.3
- Update moment and redux libs

### 0.66.2
- Update websockets-extension

### 0.66.1

- Update changeset-map to 1.4.5
- Style improvement on changeset's user details' section
- Add copy OSMCha changeset URL link

### 0.66.0

- Simplify login on dev environment
- Replace bold css by strong html tag
- Add redirect removing www. from url
- Improve link on "Open changeset with iD" button

### 0.64.3

- Update changeset-map to 1.4.4
- Handle 401 and 403 errors separately
- Update OSMCha logo

### 0.64.2

- Update changeset-map to 1.4.3
  - Add zoom controls to touchscreen devices
  - Fix tags truncate problem

### 0.64.1
- Update changeset-map to 1.4.2
- Add Bing as background layer option
- Add copy to clipboard button on filter header

### 0.64.0
- Update URLs to osmcha.org

### 0.62.4
- Update changeset-map to 1.4.1

### 0.62.3
- Update changeset-map to 1.4.0

### 0.62.2
- fix bug when creating new teams
- fix josm url

### 0.62.1
- Update changeset-map to 1.3.10
- Update history and some other libs

### 0.62.0
- Update changeset-map to 1.3.9

### 0.60.2
- remove OSM-HV link
- link to changeset in Achavi with relations=true

### 0.60.1

- Update dependencies
- Fix production build

### 0.60.0

- disable logout when requests fails
- adjust status modal position

### 0.58.2

- Add solution to filter out changesets newer than 5 minutes on the API request

### 0.58.0

- Exclude changesets newer than 5 minutes from query results
- Change position of status notification
- Show unverified teams and add string to distinct the verified ones on the filters page

### 0.56.2

- Add system status modal

### 0.56.1

- Update changeset-map to 1.3.4

### 0.56.0

- Show some stats of a deleted user on the changeset user panel
- Add Mapping Team filter fields
- Add forms to allow the creation and management of Mapping Teams
- Code linting and text improvements

### 0.54.1

- Fix error in trusted-users page link

### 0.54.0

- Add the watchlist field to filters
- Separate Saved Filters, Watchlist and Trusted Users in different views
- Replace the user button by a dropdown menu
- Add logout to user menu options
- Change header of user pages
- Add Filter changesets button in the watchlist page

### 0.52.0

- Add whitelist and blacklist sagas
- Modify blacklist API to be available to all users

### 0.50.0

- Show the feature's note when the mouse is over a reason
- Replace the osm-comments-api by our osmcha backend API

#### 0.48.1

- Show login button in the changeset list panel in the home and user pages

#### 0.48.0

- Removes user metadata to unauthenticated requests
- Enable service-worker again
- Show current user token on the user page
- Change feature panel to be compatible with the new feature reasons serialization

#### 0.46.3

- Disable service-worker temporarily

#### 0.46.2

- Update saved filters documentation

#### 0.46.1

- Show number of active filters in the Filter toggle button

#### 0.46.0

* Add dropdown "My Filters" to the Filters page
* Check if the current aoi belongs to the user before sending a save request

#### 0.44.0

* Remove vertical margins on homepage
* Use https in links to OSM.org website and APIs
* Change message to 401 and 403 network errors and use handleErrors functions in all requests
* Add shortcut to refresh changeset list
* Add keyboards to the 'open in' menu options

#### 0.42.1

* Remove date filter from the OSMCha user link (#215)
* Fix '?' and '/' keyboard shortcuts and update shortcuts list

#### 0.42.0

* Fix error when the filters parameters are bigger than supported by the server (#274)
* Fix error when date__gte filter field is cleared (#266)
* Removed to-fix link

#### 0.40.1

* Update changeset-map and other dependencies
* Fix missing max-height CSS class in map sidebar
* Add link to RSS feed in the filters page

#### 0.40.0

* Update assembly to 0.21.0
* Add support to Cyrillic and other scripts in OpenSans font
* Update moment js to 2.21.0
* Align images in the center on about page

#### 0.38.2

* Make documentation and all software messages gender neutral
* Update documentation to match the 0.38.0 changes
* Improve post comment success/error messages

#### 0.38.1

* Avoid post comment success and error messages to be shown at the same time

#### 0.38.0

* Allow users to post comments to changesets from inside OSMCha
* Add Review Comments Template settings in User page
* Add Location filter field
* Fix bug in Imagery layers toogle
* Fix bug with URLs in changeset source section

#### 0.36.1

* Fix bug in BBox filter

#### 0.36.0

* Add Tag Changes tab

#### 0.34.0

* Redesign the Save Filter UI
* Add News Alert
