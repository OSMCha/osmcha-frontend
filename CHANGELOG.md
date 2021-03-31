# Change Log

Log of changes since the 2.0 version

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
