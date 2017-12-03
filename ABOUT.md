## OSMCHA Guide

<!-- toc -->

* [Introduction to OSMCha](#introduction-to-osmcha)
  * [Why use OSMCha?](#why-use-osmcha)
  * [What is vandalism?](#what-is-vandalism)
  * [What are flagged changesets and how are they automatically flagged?](#what-are-flagged-changesets-and-how-are-they-automatically-flagged)
  * [Why to review a changeset as Good/Bad 👍 / 👎 ?](#why-to-review-a-changeset-as-goodbad-%F0%9F%91%8D--%F0%9F%91%8E-)
  * [Future of OSMCha and validation using OSM-Compare](#future-of-osmcha-and-validation-using-osm-compare)
* [Usage](#usage)
  * [How to review a changeset?](#how-to-review-a-changeset)
    * [Changeset and Mapper details](#changeset-and-mapper-details)
    * [Using Changeset-map](#using-changeset-map)
    * [Reviewing changesets in OSMCha from OpenStreetMap](#reviewing-changesets-in-osmcha-from-openstreetmap)
  * [Filters](#filters)
    * [Basic filters](#basic-filters)
    * [Applications for edit based search](#applications-for-edit-based-search)
* [FAQ](#faq)
  * [How are the changesets presented?](#how-are-the-changesets-presented)
  * [How can I sign-in into OSMCha?](#how-can-i-sign-in-into-osmcha)
  * [Can I view the changesets and use filters without logging into OSMCha?](#can-i-view-the-changesets-and-use-filters-without-logging-into-osmcha)
  * [How do I logout of OSMCha?](#how-do-i-logout-of-osmcha)
  * [My changeset has been flagged by a reason, am I doing something wrong?](#my-changeset-has-been-flagged-by-a-reason-am-i-doing-something-wrong)
  * [Are there keyboard shortcuts in OSMCha?](#are-there-keyboard-shortcuts-in-osmcha)
  * [What are tags on OSMCha?](#what-are-tags-on-osmcha)
  * [What if I want to change my review for a changeset?](#what-if-i-want-to-change-my-review-for-a-changeset)
  * [Can I review my own changesets?](#can-i-review-my-own-changesets)
* [Frequent error messages](#frequent-error-messages)
  * [Changeset views error messages](#changeset-views-error-messages)
    * [Changeset was already checked.](#changeset-was-already-checked)
    * [User can not check his own changeset.](#user-can-not-check-his-own-changeset)
    * [Changeset is not checked.](#changeset-is-not-checked)
    * [User does not have permission to uncheck this changeset.](#user-does-not-have-permission-to-uncheck-this-changeset)
    * [User can not add tags to his own changeset.](#user-can-not-add-tags-to-his-own-changeset)
    * [User can not add tags to a changeset checked by another user.](#user-can-not-add-tags-to-a-changeset-checked-by-another-user)
    * [User can not remove tags from his own changeset.](#user-can-not-remove-tags-from-his-own-changeset)
    * [User can not remove tags from a changeset checked by another user.](#user-can-not-remove-tags-from-a-changeset-checked-by-another-user)
  * [Feature views error messages](#feature-views-error-messages)
    * [Feature was already checked.](#feature-was-already-checked)
    * [User can not check his own feature.](#user-can-not-check-his-own-feature)
    * [Feature is not checked.](#feature-is-not-checked)
    * [User does not have permission to uncheck this feature.](#user-does-not-have-permission-to-uncheck-this-feature)
    * [User can not add tags to his own feature.](#user-can-not-add-tags-to-his-own-feature)
    * [User can not add tags to a feature checked by another user.](#user-can-not-add-tags-to-a-feature-checked-by-another-user)
    * [User can not remove tags from his own feature.](#user-can-not-remove-tags-from-his-own-feature)
    * [User can not remove tags from a feature checked by another user.](#user-can-not-remove-tags-from-a-feature-checked-by-another-user)
* [References](#references)
* [Other tools for validation](#other-tools-for-validation)
* [Feedback](#feedback)

<!-- tocstop -->

# Introduction to OSMCha

OSMCha is short for OpenStreetMap Changeset Analyser. OSMCha is a web tool to
help visualise and analyse edits made by mappers on OpenStreetMap(OSM). OSMCha
was originally written by
[Wille Marcel](https://www.openstreetmap.org/user/wille) in 2015 to validate
changesets. In collaboration with Wille, this global instance is hosted by
Mapbox as an additional data Quality Analysis tool for the community.

### Why use OSMCha?

* OSM is a crowdsourced project, and it is necessary to have user friendly tools
  for the community, to guide new contributors to make a great map.
* Any given day, around 30,000 changesets containing additions, modifications,
  and deletions to the data make their way into OSM, which is driven by a strong
  community.
* With new users signing up on OSM every day, it is likely that the mapping
  guides/wikis on tagging scheme, general practices are not uniformly followed
  by every contributor, resulting in accidental edits, and in rare cases
  [intentional vandalism](#what-is-vandalism) that breaks the map.
* OSMCha is designed to be an integrated tool that can address various
  [validation requirements](#how-to-review-a-changeset) of the community. OSMCha
  is also supported by an open source edit recognition project called
  [OSM-Compare](https://github.com/mapbox/osm-compare) which can be used for
  suggesting manual verification.
* This tool offers advanced filtering options that can help you
  [filter changesets](#filters) based on various attributes. (Ex: All changesets
  with hashtags, user specific changesets, etc.)

### What is vandalism?

[Vandalism](https://wiki.openstreetmap.org/wiki/Vandalism) with respect to
OpenStreetMap refers to deliberate acts of destruction or damage to the map
data. These include, intentional edits that causes visible breakages on the map
and also break other crucial map data such as route relations, boundaries, turn
restrictions, land use etc.

### What are flagged changesets and how are they automatically flagged?

* `Flagged changesets` are changesets that are flagged by
  [OSM-Compare](https://github.com/mapbox/osm-compare) for specific edit
  behaviour. Like deletion of valid data, incompatible data errors. Example - A
  swimming pool tagged as `natural=water`.

* OSMCha is supported by an edit detection pipeline called OSM-Compare. It is an
  open collection of compare functions written in Javascript that automatically
  check for suspicious changes on OSM and pushes them into OSMCha to different
  categories of identifiable edit behaviour. Currently, there are compare
  functions in OSM-Compare for flagging deletions of cities, overlap between
  features, and similar rule based scenarios.

### Why to review a changeset as Good/Bad 👍 / 👎 ?

* Any changeset on OSM can be reviewed by the community to confirm the quality
  of the edit. You can 👍 for edits that do not cause any damage to the map, and
  👎 for those that may break map data or is invalid data.

* This data is collected to help improve the compare functions in OSM-Compare
  project. Thus helping it become more efficient and robust by testing it
  against a verified database of good and bad changesets.

* Consistent categorisation of changesets also helps to build an open source
  database for use in ventures related to machine learning or automating the
  detection process for bad edits instead of writing rule based compare
  functions for all possible scenarios of bad edits.

### Future of OSMCha and validation using OSM-Compare

* Machine learning based detection methods replace rule based edit detections.
  This makes it easier for analysis, automates maintenance and has prospects for
  better for detection rates to catch bad edits on OpenStreetMap.
* OSMCha will continue to be an OpenStreetMap validation tool that get feeds
  from [OSM-Compare](https://github.com/mapbox/osm-compare) with constant
  maintenance, with features towards an easier user experience for validation of
  edits on OpenStreetMap.

# Usage

## How to review a changeset?

It is important that the reviewer has the necessary information about the
changeset and the mapper to understand a particular changeset.

For this purpose, OSMCha offers an interface similar to OpenStreetMap but with
additional tools such as changeset-map to visualise the edits, information about
the mapper, other information related to the changeset and OSM user history that
can help the reviewer identify a problematic edits on OSM. For a deep-dive into
what a problematic edit is on OSM, please refer to our guide on
[Validating OpenStreetMap](https://www.mapbox.com/mapping/validating-osm/).

### Changeset and Mapper details

<img width="300" alt="osmcha-changeset-details" src="https://user-images.githubusercontent.com/8921295/33522217-bcf61e42-d80c-11e7-8338-2ae4abe49693.png">

* The details panel on OSMCha gives information of the changeset and the mapper.
* In the top right corner of the panel, in blue, yellow and red, number of
  additions, modifications and deletions of the changeset are presented.
* The details panels includes the username of the mapper, number of changesets
  the mapper has contributed on OSM, changeset comment and further details like
  the editor and imagery used in making the edits on OSM.

<img width="300" alt="osmcha-flagged" src="https://user-images.githubusercontent.com/8921295/33522235-84e676fe-d80d-11e7-8c3a-685143958732.png">

* When an edit is
  [detected through a compare function](#why-to-review-a-changeset-as-goodbad-%F0%9F%91%8D--%F0%9F%91%8E-)
  on OSM-Compare, it is shown on the `Flagged features` tab. The reviewer can
  click on Map to view the edit on the changeset map or open it directly on JOSM
  for detailed review.

<img width="300" alt="osmcha-discussions" src="https://user-images.githubusercontent.com/8921295/33522260-49991fd8-d80e-11e7-88a3-a1c07774db78.png">

* Similarly if there is a discussion on the changeset on OpenStreetMap, OSMCha
  presents the discussion under the discussion tab.

<img width="300" alt="osmcha-users" src="https://user-images.githubusercontent.com/8921295/33522268-a7f36b06-d80e-11e7-8901-edf0376898fa.png">

<screenshot on user profile>

* More details on the mapper can be found under the `profile tab`. This gives
  more context to the reviewer about the user history and their pattern of
  contribution to OpenStreetMap

### Using Changeset-map

* Changeset-map is a changeset visualiser for OSM. It helps the reviewer
  understand the edits of a changeset both in terms of geometry and feature
  properties.

<img width="600" alt="osmcha-changesetmap" src="https://d2mxuefqeaa7sj.cloudfront.net/s_97A29C4444FB7626533E7DD42C06D768BD5A4FA0D1B3C76327F305F832774967_1497443481288_image.png">

* The reviewer can click on any particular feature edited in that changeset and
  see the additions, deletions and modifications made to the feature to have an
  informed decision on quality of the edits.

* Click on map from `Flagged features tab` and visualise it in changeset map.

<img width="300" alt="osmcha-flagged" src="https://user-images.githubusercontent.com/8921295/33522285-22bf5732-d80f-11e7-99bf-291f0c29d906.png">

* Open the changeset in a preferred editor or a tool to inspect the changeset

### Reviewing changesets in OSMCha from OpenStreetMap

* If you come across a changeset on OSM while browsing through the history tab
  or a particular user’s changeset, it is sometimes necessary to see the changes
  that happened in a changeset visually.
* In these cases, you can copy the changeset ID and open it in OSMCha for
  visualisation and easily spotting errors in a changeset.

---

## Filters

<img width="600" alt="osmcha-filters" src="https://user-images.githubusercontent.com/8921295/33522469-946070fc-d813-11e7-940d-2df6a797f655.png">

Filters tab on OSMCha provides a variety of search parameters to fetch a
specific list of changesets the reviewer is interested in. One can filter
changesets based on a date range, new mapper edits, mass deletions, text in the
source field, Bbox, editor used, etc.

<img width="300" alt="osmcha-is-hot" src="https://user-images.githubusercontent.com/8921295/33522494-128de644-d814-11e7-8510-e25efac79004.png">

_Hot project edits are a specific example for which a changeset comment with the
associated hashtag can be used to retrieve all the changesets contributed for
the task._

### Basic filters

<full screenshot of filters>

<img width="600" alt="osmcha-basic" src="https://user-images.githubusercontent.com/8921295/33522383-5598e18a-d811-11e7-9340-5fc48036523c.png">

The [history tab](https://www.openstreetmap.org/history) on OpenStreetMap offers
a very basic area based retrieval of changesets. It allows a user to zoom in to
a specific area on the map and all the changesets in that area are shown on the
sidebar in the order of newest first. OSMCha filters expands this feature with
much more metadata based search.

These include:

* Words in a changeset comment or changeset comment used by the mapper, for
  example: #hotosm-project #MissingMaps
* Changeset date based on the time the edits were uploaded on OpenStreetMap
* Number of features added, modified and deleted in a changeset
* Changeset area on OpenStreetMap using the **Bbox** filter
* Geospatial filter for searching changesets whose bounding box intersects with
  a given geometry
* Changesets that are flagged by compare functions for edit behaviour through
  reason feed from
  [OSM-Compare](#future-of-osmcha-and-validation-using-osm-compare)
* Source or imagery mentioned in a changeset by the mapper
* Specific editor based search

### Applications for edit based search

<img width="600" alt="osmcha-context" src="https://user-images.githubusercontent.com/8921295/27321085-91233242-55b6-11e7-997e-32f82b3255a1.png">

**Null island edits**

* New mappers tend to add fictional data at 0, 0 coordinates as OpenStreetMap by
  default opens at these coordinates. Mappers being new, tend to test map and
  add non existent data due to lack of practice and knowledge of the workflow
  involved.

**Edit count based search**

* One can filter changesets based on mass additions, mass modifications, mass
  deletions and the number of edits made in a changeset.

**Using multiple filters on OSMCha**

* Local reviewers on OpenStreetMap maybe interested on changesets by searching
  for changesets based more than 1 condition
  * Ex: iD editor changesets that have deleted a lot of features
  * Ex: Mass additions of data by new mappers

### Saving and sharing custom filters

OSMCha allows a logged-in user to save a filter template with custom search
parameters with a personalized name. There is no limit on how many filter
templates can be saved per user nor with the number of custom parameters that
can be set in a filter template.

Saved filters are visible in the user page which can be accessed by clicking on
your OSM username beside the OSMCha icon on the sidebar. Any saved filter can be
loaded to retrieve search results, shared with a permalink, removed from the
saved list or be used to setup an RSS.

<img width="600" alt="osmcha-saving-filters" src="https://user-images.githubusercontent.com/8921295/33522675-0ce1327e-d818-11e7-88c0-3f03359da6c2.png">

OSMCha saves these filters with a unique identifier code. Here is an example
filter -
https://osmcha.mapbox.com/filters?aoi=71247014-abbf-4253-8093-2a2afdda4169

### Setting up RSS feed - Area of Interest

Each saved filter has an RSS feed to update whenever a new changeset comes into
the custom filter. A real life application would be to get instant notifications
for all edits in the area you are currently surveying.

Here is an RSS feed for the filter we have setup in the above section -
https://osmcha.mapbox.com/api/v1/aoi/71247014-abbf-4253-8093-2a2afdda4169/changesets/feed/

Any third party RSS client can be used to push instant personal notifications
for the changesets that have come into your saved filters at set time intervals.

# FAQ

### How are the changesets presented?

OSMCha reads all changesets from OpenStreetMap. By default they are presented in
the order of the newest first based on the [filters](#filters) applied by the
OSMCha reviewer.

<img width="600" alt="osmcha-sidebar" src="https://user-images.githubusercontent.com/8921295/33522406-eec898be-d811-11e7-91ef-88e96fc0377a.png">

_The list of changesets are presented on the sidebar._

You can select the changeset from the changeset review panel and can view the
edits associated to it using the changeset map that appears on the right hand
side.

### How can I sign-in into OSMCha?

You can sign-in on OSMCha using their OpenStreetMap account. On clicking on
`sign-in`, a window (_like the one below_) appears, click on `Grant Access` and
you will be singed-in on OSMCha.

<img width="300" alt="osmcha-signin" src="https://user-images.githubusercontent.com/8921295/27321375-a4fada26-55b7-11e7-9516-f00f61f64cc1.png">

`Note:` It **is** necessary to be signed-in in-order to
[review](#how-to-review-a-changeset) a changeset as `Good` or `Bad`

### Can I view the changesets and use filters without logging into OSMCha?

You **must** be signed in-order to [review](#how-to-review-a-changeset) a
changeset as good or bad. Authentication in not required if you are only viewing
the changesets.

### How do I logout of OSMCha?

After the authentication, the sign-in button on OSMCha shows your OpenStreetMap
username. When you click on your username, a dropdown appears, by clicking on
the `logout` button you can sign-out of OSMCha.

### My changeset has been flagged by a reason, am I doing something wrong?

No, not at all! These changesets are automatically flagged by
[OSM-Compare](https://github.com/mapbox/osm-compare) for specific edit
behaviour. We are working towards making this
[detection](#future-of-osmcha-and-validation-using-osm-compare) better over
time.

The rule based detectors in OSM-Compare are inefficient in understanding context
of an edit, place and mapping activity. This is the disadvantage and reason that
these detections are false positives 80% of the time, based on the compare
function written.

For example, a place deleted compare function flags an experienced mapper's
changeset even if he/she has deleted a fake city previously added by another
user. This context is unavailable to the rule based detector for better
analysis.

### Are there keyboard shortcuts in OSMCha?

Yes. Keyboard shortcuts on OSMCha help the reviewer to go through a list of
changesets quickly. Here are the available shortcuts:

| _Description_                                    | _Shortcut_     |
| ------------------------------------------------ | -------------- |
| **Navigating changeset list**                    |                |
| Go to previous changeset (in the changeset list) | `↑`            |
| Go to next changeset (in the changeset list)     | `↓` or `Space` |
| **Changeset detail view**                        |                |
| Open changeset in JOSM                           | `J`            |
| Open user profile in HDYC                        | `H`            |
| Review changeset as good                         | `G`            |
| Review changeset as bad                          | `B`            |
| Undo or clear changeset review                   | `U` or `C`     |
| **Changeset panels**                             |                |
| Toggle Changeset details                         | `1`            |
| Toggle Flagged features                          | `2`            |
| Toggle Changeset discussions                     | `3`            |
| Toggle User profile                              | `4`            |
| Toggle Map controls                              | `5`            |
| **Other**                                        |                |
| Show shortcuts list                              | `?`            |

### What are tags on OSMCha?

<Tags screenshot>

<img width="200" alt="osmcha-tags" src="https://user-images.githubusercontent.com/8921295/27322174-b0561022-55ba-11e7-81e9-3507278d4f58.png">

The button `Tags` will only appear when you review a changeset good or bad, but
it's recommended and essentially used to describe the details of the changeset
that was found to be bad. Here are the different tags that can be used:

* **Severity**: **Critical**, **High** or **Low**, to estimate how bad do these
  edits on a changeset affect OpenStreetMap data
* **Unresolved**: To input action taken by the you (reviewer) on a changeset. It
  is unresolved when the you (reviewer) have commented on the changeset to
  inform the mapper for corrections or no action has been taken by the you
  (reviewer) to correct the map data.
* **Intent**: **Intentional** or **Unintentional** to capture the intent of the
  user. This is contextual information subjective to the edits and users.
* **DWG**: When a changeset needs to be reported to the Data Working Group

### What if I want to change my review for a changeset?

Yes, it is possible to change the review for a changeset from `Good` to `Bad` or
vise versa. You can also unreview a changeset by clicking on the

<img width="280" alt="osmcha-undo" src="https://user-images.githubusercontent.com/8921295/33522551-66bc5f1a-d815-11e7-810b-16725b33e1cf.gif">

### Can I review my own changesets?

No, you cannot review your own changesets, but you can view your changesets.

# Frequent error messages

## Changeset views error messages

### Changeset was already checked.

This is raised when someone tries to check a changeset that was already checked

### User can not check his own changeset.

This is raised when someone tries to check a changeset that was created by
him/her

### Changeset is not checked.

This is raised when someone tries to uncheck a changeset that is not checked

### User does not have permission to uncheck this changeset.

This is raised when someone tries to uncheck a changeset that another user
checked

### User can not add tags to his own changeset.

This is raised when someone tries to add tags to their own changesets

### User can not add tags to a changeset checked by another user.

This is raised when someone tries to add tags to a changeset reviewed by someone
else.

### User can not remove tags from his own changeset.

This is raised when someone tries to remove tags from their own changeset.

### User can not remove tags from a changeset checked by another user.

This is raised when someone tries to remove tags in a changeset that are added
by the other users.

## Feature views error messages

### Feature was already checked.

This is raised when someone tries to check a feature that was already checked

### User can not check his own feature.

This is raised when someone tries to check a feature that was created by
him/her.

### Feature is not checked.

This is raised when someone tries to uncheck a feature that is not checked

### User does not have permission to uncheck this feature.

This is raised when someone tries to uncheck a feature that another user checked

### User can not add tags to his own feature.

This is raised when someone tries to add tags to their own features

### User can not add tags to a feature checked by another user.

This is raised when someone tries to add tags to a feature reviewed by someone
else

### User can not remove tags from his own feature.

This is raised when someone tries to remove a tag from his/her own feature

### User can not remove tags from a feature checked by another user.

This is raised when someone tries to remove tags in a feature that are added by
the other users.

# References

* Wikis

  * [Vandalism on OSM](https://wiki.openstreetmap.org/wiki/Vandalism)
  * [Detect vandalism](https://wiki.openstreetmap.org/wiki/Detect_Vandalism)
  * [Quality Assurance on OpenStreetMap](https://wiki.openstreetmap.org/wiki/Quality_assurance)

* Related Projects

  * [osmcha-frontend](https://github.com/mapbox/osmcha-frontend/)
  * [osmcha-django](https://github.com/willemarcel/osmcha-django/)
  * [OSM-Compare](https://github.com/mapbox/osm-compare)
  * [OSMLint](https://github.com/osmlab/osmlint)

# Other tools for validation

* [OSM-Comments](https://www.mapbox.com/osm-comments/)
* [To-Fix](https://osmlab.github.io/to-fix/)
* [MapRoulette](http://www.maproulette.org/)
* [HDYC](http://hdyc.neis-one.org/)
* [WHODIDIT](http://simon04.dev.openstreetmap.org/whodidit/)
* [Who’s That](http://whosthat.osmz.ru)
* [Result Maps](http://resultmaps.neis-one.org/)
* [Missing Maps](http://missingmaps.org/users/)

# Feedback

* To file bugs, feature requests on OSMCha - please file issues at
  https://github.com/mapbox/osmcha-frontend/issues
* To file bugs, feature requests on Changeset map - please file issues at
  https://github.com/osmlab/changeset-map/issues
