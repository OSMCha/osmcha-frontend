## OSMCHA Guide

<!-- toc -->

- [Introduction to OSMCha](#introduction-to-osmcha)
    - [Why use OSMCha?](#why-use-osmcha)
    - [What is vandalism?](#what-is-vandalism)
    - [What are flagged changesets and how are they automatically flagged?](#what-are-flagged-changesets-and-how-are-they-automatically-flagged)
    - [Why to review a changeset as Good/Bad 👍 / 👎 ?](#why-to-review-a-changeset-as-goodbad----)
    - [Future of OSMCha and validation using OSM-Compare](#future-of-osmcha-and-validation-using-osm-compare)
- [Usage](#usage)
  - [How to review a changeset?](#how-to-review-a-changeset)
    - [Changeset and Mapper details](#changeset-and-mapper-details)
    - [Reviewing changesets in OSMCha from OpenStreetMap](#reviewing-changesets-in-osmcha-from-openstreetmap)
  - [Filters](#filters)
    - [Basic filters](#basic-filters)
    - [Applications for edit based search](#applications-for-edit-based-search)
    - [Saving and sharing custom filters](#saving-and-sharing-custom-filters)
    - [Setting up RSS feed - Area of Interest](#setting-up-rss-feed---area-of-interest)
  - [User page](#user-page)
- [FAQ](#faq)
    - [How are the changesets presented?](#how-are-the-changesets-presented)
    - [How can I sign-in into OSMCha?](#how-can-i-sign-in-into-osmcha)
    - [Can I view the changesets and use filters without logging into OSMCha?](#can-i-view-the-changesets-and-use-filters-without-logging-into-osmcha)
    - [How do I logout of OSMCha?](#how-do-i-logout-of-osmcha)
    - [My changeset has been flagged by a reason, am I doing something wrong?](#my-changeset-has-been-flagged-by-a-reason-am-i-doing-something-wrong)
    - [Are there keyboard shortcuts in OSMCha?](#are-there-keyboard-shortcuts-in-osmcha)
    - [What are tags on OSMCha?](#what-are-tags-on-osmcha)
    - [What if I want to change my review for a changeset?](#what-if-i-want-to-change-my-review-for-a-changeset)
    - [Can I review my own changesets?](#can-i-review-my-own-changesets)
- [Frequent error messages](#frequent-error-messages)
  - [Changeset views error messages](#changeset-views-error-messages)
    - [Changeset was already checked.](#changeset-was-already-checked)
    - [User can not check their own changeset.](#user-can-not-check-their-own-changeset)
    - [Changeset is not checked.](#changeset-is-not-checked)
    - [User does not have permission to uncheck this changeset.](#user-does-not-have-permission-to-uncheck-this-changeset)
    - [User can not add tags to their own changeset.](#user-can-not-add-tags-to-their-own-changeset)
    - [User can not add tags to a changeset checked by another user.](#user-can-not-add-tags-to-a-changeset-checked-by-another-user)
    - [User can not remove tags from their own changeset.](#user-can-not-remove-tags-from-their-own-changeset)
    - [User can not remove tags from a changeset checked by another user.](#user-can-not-remove-tags-from-a-changeset-checked-by-another-user)
- [References](#references)
- [Other tools for validation](#other-tools-for-validation)
- [Feedback](#feedback)
- [Donate](#donate)
- [Trademark notice](#trademark-notice)

<!-- tocstop -->

# Introduction to OSMCha

OSMCha is short for OpenStreetMap Changeset Analyser. It is a web tool to
help visualise and analyse edits made by mappers on OpenStreetMap (OSM). OSMCha
was originally written by
[Wille Marcel](https://www.openstreetmap.org/user/wille) in 2015 to validate
changesets. After almost 10 years being supported by Mapbox, OSMCha became an [OpenStreetMap US](https://openstreetmap.us/) charter project in 2023.

### Why use OSMCha?

* OpenStreetMap is a crowdsourced project, and it is necessary to have user
  friendly tools for the community, to guide new contributors to make a great
  map.

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
  [filter changesets](#filters) based on various OSM metatags and attributes. (Ex: All changesets
  with hashtags, user specific changesets, etc.).

### What is vandalism?

[Vandalism](https://wiki.openstreetmap.org/wiki/Vandalism) with respect to
OpenStreetMap refers to deliberate acts of destruction or damage to the map
data. These include, intentional edits that cause visible breakages on the map
and also break other crucial map data such as route relations, boundaries, turn
restrictions, land use classification etc.

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
  better detection rates to catch bad edits on OpenStreetMap.

* OSMCha will continue to be an OpenStreetMap validation tool that get feeds
  from [OSM-Compare](https://github.com/mapbox/osm-compare) with constant
  maintenance, with features towards an easier user experience for validation of
  edits on OpenStreetMap.

# Usage

## How to review a changeset?

It is important that the reviewer has the necessary information about the
changeset and understand the diff of modifications in the OSM data.

For this purpose, OSMCha offers an interface similar to OpenStreetMap but with
additional tools to visualise the edits, information about
the mapper, other information related to the changeset and OSM user history that
can help the reviewer identify a problematic edits on OSM. For a deep-dive into
what a problematic edit is on OSM, please refer to our guide on
[Validating OpenStreetMap](https://www.mapbox.com/mapping/validating-osm/).

### Changeset and Mapper details

<img width="300" alt="osmcha-changeset-details" src="https://user-images.githubusercontent.com/8921295/35939695-edaf1c40-0c1a-11e8-858e-6683680e79fc.png">

* The details panel on OSMCha provides information on the changeset and the mapper.

* In the top right corner of the panel, in blue, yellow and red, number of
  additions, modifications and deletions of the changeset are presented.

* The details include the username of the mapper, number of changesets
  the mapper has contributed on OSM, changeset discussion comments and further details like
  the editor and imagery used in making the edits on OSM.

<img width="300" alt="osmcha-flagged" src="https://user-images.githubusercontent.com/8921295/35939948-a4ebf0c2-0c1b-11e8-9db9-3b439f04d7fe.png">

* When an edit is
  [detected through a compare function](#why-to-review-a-changeset-as-goodbad-%F0%9F%91%8D--%F0%9F%91%8E-)
  on OSM-Compare, it is shown on the `Flagged features` tab. The reviewer can
  click on Map to view the edit on the changeset map or open it directly on JOSM
  for detailed review.

<img width="300" alt="osmcha-tag-changes" src="https://user-images.githubusercontent.com/666291/34695408-824871f0-f4a9-11e7-9968-ff41801e57ca.png">

* There is also a tab that shows all the features whose tags were modified in the changeset. This makes it easy to identify the modifications made in the features without the need of clicking on them one by one.

<img width="300" alt="osmcha-discussions" src="https://user-images.githubusercontent.com/666291/35882802-8090d3a0-0b6c-11e8-9da6-bc27ff82980c.png">

* Similarly, if there are comments on the changeset on OpenStreetMap, OSMCha presents the discussion under the discussion tab.

* User's can automatically post OSM changeset discussion comments directly from OSMCha. You can define comment templates on your [user page](https://osmcha.org/user), so you will have a base message to send to a user after reviewing the changeset as good or bad. Right after your review, the comment form will be filled with your saved text. We suggest you to communicate with other mappers to alert them of errors, aspects to improve or simply to welcome a new user or praise a good edit.

<img width="300" alt="osmcha-users" src="https://user-images.githubusercontent.com/8921295/35940051-ee1c8dce-0c1b-11e8-924a-4c1bcc31fcce.png">

<screenshot on user profile>

* More details on the mapper can be found under the `User tab`. This gives more context to the reviewer about the user history and their pattern of contribution to OpenStreetMap.

### Using the map view

* One of OSMCha's core features is the ability to visualize a changeset on a map. Every map element that the changeset touched is shown, colored to indicate whether the element was created, modified, or deleted. Clicking on a map element reveals additional details about what was changed (for example, which OSM tags were modified). The map view helps you understand the complete effect of a changeset.

<!--<img width="600" alt="osmcha-changesetmap" src="https://d2mxuefqeaa7sj.cloudfront.net/s_97A29C4444FB7626533E7DD42C06D768BD5A4FA0D1B3C76327F305F832774967_1497443481288_image.png">-->

* The reviewer can click on any particular feature edited in that changeset and see the additions, deletions and modifications made to the feature to have an informed decision on quality of the edits.

* Click on map from `Flagged features tab` and visualise it in changeset map.

<img width="300" alt="osmcha-mapcontrols" src="https://user-images.githubusercontent.com/8921295/35940114-236f8314-0c1c-11e8-9649-47c1f077ab02.png">

* The reviewer can also change the background map by
  toggling through the map style in `Map controls` tab.

<img width="300" alt="osmcha-flagged" src="https://user-images.githubusercontent.com/8921295/35940146-333e3d94-0c1c-11e8-8036-5adbbfea35be.png">

* Open the changeset in a preferred editor or a preferred tool to inspect the
  changeset.

### Reviewing changesets in OSMCha from OpenStreetMap

* If you come across a changeset on OSM while browsing through the history tab or a particular user’s changeset, it is sometimes necessary to see the changes that happened in a changeset visually.
* In these cases, you can copy the changeset ID and open it in OSMCha for visualisation and easily spotting errors in a changeset.

---

## Filters

<img width="600" alt="osmcha-filters" src="https://user-images.githubusercontent.com/666291/35921574-236d00ea-0c02-11e8-9cfb-bf53dde304a0.png">

The Filters tab on OSMCha provides a variety of search parameters to fetch a specific list of changesets the reviewer is interested in. One can filter changesets based on a date range, new mapper edits, mass deletions, text in the source field, location, editor used, etc.

<img width="250" alt="osmcha-is-hot" src="https://user-images.githubusercontent.com/8921295/33522494-128de644-d814-11e7-8510-e25efac79004.png">

_Hot project edits are a specific example for which a changeset comment with the associated hashtag can be used to retrieve all the changesets contributed for the task._

### Basic filters

<full screenshot of filters>

<img width="600" alt="osmcha-basic" src="https://user-images.githubusercontent.com/666291/35921419-adc7e184-0c01-11e8-8e37-a23751c5bad3.png">

The [history tab](https://www.openstreetmap.org/history) on OpenStreetMap offers a very basic area based retrieval of changesets. It allows a user to zoom in to a specific area on the map and all the changesets in that area are shown on the sidebar in the order of newest first. OSMCha filters expands this feature with much more metadata based search.

These include:

* Words in a changeset comment or changeset comment used by the mapper, for example: `#hotosm-project` `#MissingMaps`
* Changeset date based on the time the edits were uploaded on OpenStreetMap
* Number of features added, modified and deleted in a changeset
* Changeset location using the **Bbox** or the **Location** filter
* Changesets that are flagged by compare functions for edit behaviour through reason feed from [OSM-Compare](#future-of-osmcha-and-validation-using-osm-compare)
* Source or imagery mentioned in a changeset by the mapper
* Specific editor based search

### Applications for edit based search

<img width="600" alt="osmcha-context" src="https://user-images.githubusercontent.com/8921295/27321085-91233242-55b6-11e7-997e-32f82b3255a1.png">

**Null island edits**

* New mappers tend to add fictional data at 0, 0 coordinates as OpenStreetMap by default opens at these coordinates. Mappers being new, tend to test map and add non existent data due to lack of practice and knowledge of the workflow involved.

**Edit count based search**

* One can filter changesets based on mass additions, mass modifications, mass deletions and the number of edits made in a changeset.

**Using multiple filters on OSMCha**

* Local reviewers on OpenStreetMap maybe interested on changesets by searching for changesets based more than 1 condition
  * Ex: iD editor changesets that have deleted a lot of features
  * Ex: Mass additions of data by new mappers

**Filtering by other metadata**

![image](https://user-images.githubusercontent.com/666291/91881632-275e7380-ec58-11ea-834c-6fec8224c930.png)

Since August 2020, OSMCha is registering all arbitrary tags added to the changesets and it is possible to filter using that information. Scroll to the bottom of the filters page to see the "Other metadata field". For example, you can filter changesets by the hashtags information with `hashtags=value`.

It is also possible to filter numeric values by setting a minimum or a maximum threshold. For example, with `changesets_count__max=50`, you will get the changesets created by users that had created less than 50 changesets (that information is available only to changesets created by iD editor). Add `__max` or `__min` after any tag name that the value can be a number.

If you want to filter by the presence of a tag use `key=*`, for example `locale=*` to find changesets with a `locale` tag and any value.

It's possible to combine multiple metadata filters by separating the `key=value` statements with a comma.

### Saving and sharing custom filters

OSMCha allows a logged-in user to save a filter template with custom search parameters and a personalized name. There is no limit on how many filter templates can be saved per user nor with the number of custom parameters that can be set in a filter template.

<img width="600" alt="osmcha-save-filter-instructions" src="https://user-images.githubusercontent.com/666291/34695491-c7b995ac-f4a9-11e7-9e43-edca8365fadb.gif">

To save a filter, start setting your desired filter parameters, then click on the `Save` button on the top of the screen, give a name to it and press the `Confirm Save` button. The filter will be saved and applied, so the sidebar will update with the results. If you want to change something in your filter later, repeat those steps.

Saved filters are listed on the dropdown menu on the left side of the filters page.

<img width="300" alt="osmcha-listing-filters" src="https://user-images.githubusercontent.com/666291/42547817-5c9bcd68-849a-11e8-9e03-a24529692952.png">

They are available also in the user page which can be accessed by clicking on your OSM username beside the OSMCha icon on the sidebar. Any saved filter can be loaded to retrieve search results, shared with a permalink, removed from the saved list or be used to setup an RSS.

<img width="600" alt="osmcha-saving-filters" src="https://user-images.githubusercontent.com/8921295/33522675-0ce1327e-d818-11e7-88c0-3f03359da6c2.png">

OSMCha saves these filters with a unique identifier code. Here is a filter example - https://osmcha.org/filters?aoi=71247014-abbf-4253-8093-2a2afdda4169.

### Setting up RSS feed - Area of Interest

Each saved filter has an RSS feed to update whenever a new changeset comes into the custom filter. A real life application would be to get instant notifications for all edits in the area you are currently surveying.

Here is an RSS feed for the filter we have setup in the above section - https://osmcha.org/api/v1/aoi/71247014-abbf-4253-8093-2a2afdda4169/changesets/feed/.

Any third party RSS client can be used to push instant personal notifications for the changesets that have come into your saved filters at set time intervals.

## User page

The user page contains some details like your username and ids, your Review Comments Template and your Saved Filters.

<img width="600" alt="osmcha-sidebar" src="https://user-images.githubusercontent.com/666291/35931820-0d5b944a-0c1d-11e8-97bc-7c23caf7ed05.png">

In the Review Comments Template you can set a message template to use in the changeset comments. That way, after you review a changeset, the comment template will be loaded in the discussions tab and you can complement the text or just post the message.

Finally, in the Saved Filters section you can manage your filters, load them and get it's RSS link.

# FAQ

### How are the changesets presented?

OSMCha reads all changesets from OpenStreetMap. By default they are presented in the order of the newest first based on the [filters](#filters) applied by the OSMCha reviewer.

<img width="600" alt="osmcha-sidebar" src="https://user-images.githubusercontent.com/8921295/33522980-e95bbf14-d820-11e7-98ab-840ff8f7cd0e.png">

_The list of changesets are presented on the sidebar._

You can select the changeset from the changeset review panel and can view the edits associated to it using the changeset map that appears on the right hand side.

### How can I sign-in into OSMCha?

You can sign-in on OSMCha using their OpenStreetMap account. On clicking on `sign-in`, a window (_like the one below_) appears, click on `Grant Access` and you will be singed-in on OSMCha.

<img width="300" alt="osmcha-signin" src="https://user-images.githubusercontent.com/8921295/27321375-a4fada26-55b7-11e7-9516-f00f61f64cc1.png">

### Can I view the changesets and use filters without logging into OSMCha?

No, OSMCha requires a sign in with your OpenStreetMap account in order so see changesets.

### How do I logout of OSMCha?

After the authentication, the sign-in button on OSMCha shows your OpenStreetMap username. When you click on your username, a dropdown appears, by clicking on the `logout` button you can sign-out of OSMCha.

### My changeset has been flagged by a reason, am I doing something wrong?

No, not at all! These changesets are automatically flagged by [OSM-Compare](https://github.com/mapbox/osm-compare) for specific edit behaviour. We are working towards making this [detection](#future-of-osmcha-and-validation-using-osm-compare) better over time.

The rule based detectors in OSM-Compare are inefficient in understanding context of an edit, place and mapping activity. This is the disadvantage and reason that these detections are false positives 80% of the time, based on the compare function written.

For example, a place deleted compare function flags an experienced mapper's changeset even if he/she has deleted a fake city previously added by another user. This context is unavailable to the rule based detector for better analysis.

### Are there keyboard shortcuts in OSMCha?

Yes. Keyboard shortcuts on OSMCha help the reviewer to go through a list of changesets quickly. Here are the available shortcuts:

| _Description_                                    | _Shortcut_        |
| ------------------------------------------------ | ----------------- |
| **Navigating changeset list**                    |                   |
| Go to previous changeset (in the changeset list) | `↑`               |
| Go to next changeset (in the changeset list)     | `↓` or `→`        |
| Refresh changeset list                           | `R`               |
| **Changeset detail view**                        |                   |
| Open changeset in JOSM                           | `J`               |
| Open changeset in iD                             | `I`               |
| Open changeset in OSM                            | `O`               |
| Open changeset in Achavi                         | `V`               |
| Open user profile in HDYC                        | `H`               |
| Open changeset in Level0                         | `L`               |
| Review changeset as Good                         | `G`               |
| Review changeset as Bad                          | `B`               |
| Undo or clear changeset review                   | `U` or `C`        |
| Filter edits of the current changeset's user     | `A`               |
| **Changeset panels**                             |                   |
| Toggle Changeset details                         | `1`               |
| Toggle Flagged features                          | `2`               |
| Toggle Tag Changes                               | `3`               |
| Toggle Geometry Changes                          | `4`               |
| Toggle Other Features                            | `5`               |
| Toggle Changeset discussions                     | `6`               |
| Toggle User profile                              | `7`               |
| Toggle Map controls                              | `8`               |
| **Other**                                        |                   |
| Toggle Filters page                              | `\`               |
| Show this Guide page                             | `?` or `/`        |

### What are tags on OSMCha?

<Tags screenshot>

<img width="200" alt="osmcha-tags" src="https://user-images.githubusercontent.com/8921295/27322174-b0561022-55ba-11e7-81e9-3507278d4f58.png">

The button `Tags` will only appear when you review a changeset good or bad, but it's recommended and essentially used to describe the details of the changeset that was found to be bad. Here are the different tags that can be used:

* **Severity**: **Critical**, **High** or **Low**, to estimate how bad do these edits on a changeset affect OpenStreetMap data
* **Unresolved**: To input action taken by the you (reviewer) on a changeset. It is unresolved when the you (reviewer) have commented on the changeset to inform the mapper for corrections or no action has been taken by the you (reviewer) to correct the map data.
* **Intent**: **Intentional** or **Unintentional** to capture the intent of the user. This is contextual information subjective to the edits and users.
* **DWG**: When a changeset needs to be reported to the Data Working Group

### What if I want to change my review for a changeset?

Yes, it is possible to change the review for a changeset from `Good` to `Bad` or
vise versa. You can also unreview a changeset by clicking on the `'x'` beside your
username on the top right corner button.

<img width="280" alt="osmcha-undo" src="https://user-images.githubusercontent.com/8921295/33522551-66bc5f1a-d815-11e7-810b-16725b33e1cf.gif">

### Can I review my own changesets?

No, you cannot review your own changesets, but you can view your changesets.

# Frequent error messages

## Changeset views error messages

### Changeset was already checked.

This is raised when someone tries to check a changeset that was already checked

### User can not check their own changeset.

This is raised when someone tries to check a changeset that was created by him/her

### Changeset is not checked.

This is raised when someone tries to uncheck a changeset that is not checked

### User does not have permission to uncheck this changeset.

This is raised when someone tries to uncheck a changeset that another user checked

### User can not add tags to their own changeset.

This is raised when someone tries to add tags to their own changesets

### User can not add tags to a changeset checked by another user.

This is raised when someone tries to add tags to a changeset reviewed by someone else.

### User can not remove tags from their own changeset.

This is raised when someone tries to remove tags from their own changeset.

### User can not remove tags from a changeset checked by another user.

This is raised when someone tries to remove tags in a changeset that are added by the other users.

# References

* Wikis

  * [Vandalism on OSM](https://wiki.openstreetmap.org/wiki/Vandalism)
  * [Detect vandalism](https://wiki.openstreetmap.org/wiki/Detect_Vandalism)
  * [Quality Assurance on OpenStreetMap](https://wiki.openstreetmap.org/wiki/Quality_assurance)

* Related Projects

  * [osmcha-django](https://github.com/willemarcel/osmcha-django/)
  * [OSM-Compare](https://github.com/mapbox/osm-compare)
  * [OSMLint](https://github.com/osmlab/osmlint)

# Other tools for validation

* [MapRoulette](https://maproulette.org/)
* [HDYC](https://hdyc.neis-one.org/)
* [WHODIDIT](https://simon04.dev.openstreetmap.org/whodidit/)
* [Who’s That](http://whosthat.osmz.ru)
* [Result Maps](http://resultmaps.neis-one.org/)
* [Missing Maps](https://www.missingmaps.org/users/)
* [OSM user stats](https://www.openstreetmap.org/stats/data_stats.html)
* [OSM deep history](https://osmlab.github.io/osm-deep-history)
* [OSM History viewer](https://osmhv.openstreetmap.de/index.jsp)
* [OSM inspector](https://tools.geofabrik.de/osmi/)
* [OSMOSE](http://osmose.openstreetmap.fr/en/map/)
* [Overpass](http://overpass-turbo.eu/)

# Feedback

To file bugs, feature requests on OSMCha - please file issues at
https://github.com/osmcha/osmcha-frontend/issues

# Donate

Support OSMCha's hosting and development by making a donation: [https://openstreetmap.app.neoncrm.com/forms/osmcha](https://openstreetmap.app.neoncrm.com/forms/osmcha).

# Trademark notice

[OpenStreetMap (OSM)](https://osm.org) is a trademark of the [OpenStreetMap Foundation](https://osmfoundation.org), and is used with their permission. OSMCha is not endorsed by or affiliated with the OpenStreetMap Foundation.
