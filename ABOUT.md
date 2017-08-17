

<!-- toc -->

- [Story behind OSMCha](#story-behind-osmcha)
    + [Validation and OpenStreetMap](#validation-and-openstreetmap)
    + [What is vandalism?](#what-is-vandalism)
      - [What is a problematic edit?](#what-is-a-problematic-edit)
    + [Automated flagging of changesets](#automated-flagging-of-changesets)
    + [Why to review a changeset as Good/Bad 👍 / 👎 ?](#why-to-review-a-changeset-as-goodbad-%F0%9F%91%8D--%F0%9F%91%8E-)
    + [Future of OSMCha and validation using OSM-Compare](#future-of-osmcha-and-validation-using-osm-compare)
- [Usage](#usage)
  * [How to review a changeset?](#how-to-review-a-changeset)
    + [Changeset and Mapper details](#changeset-and-mapper-details)
    + [Using Changeset-map](#using-changeset-map)
    + [Reviewing changesets in OSMCha from OpenStreetMap](#reviewing-changesets-in-osmcha-from-openstreetmap)
  * [Filters](#filters)
    + [Basic filters](#basic-filters)
    + [Applications for edit based search](#applications-for-edit-based-search)
- [FAQ](#faq)
    + [Can I view the changesets and use filters without logging into OSMCha?](#can-i-view-the-changesets-and-use-filters-without-logging-into-osmcha)
    + [My changeset has been flagged by a reason, am I doing something wrong?](#my-changeset-has-been-flagged-by-a-reason-am-i-doing-something-wrong)
    + [Are there keyboard shortcuts in OSMCha?](#are-there-keyboard-shortcuts-in-osmcha)
    + [What are tags on OSMCha?](#what-are-tags-on-osmcha)
    + [What if I want to change my review for a changeset?](#what-if-i-want-to-change-my-review-for-a-changeset)
    + [Can I review my own changesets?](#can-i-review-my-own-changesets)
- [Why did I get this error message](#why-did-i-get-this-error-message)
  * [Changeset views error messages](#changeset-views-error-messages)
- [References](#references)
- [Other tools for validation](#other-tools-for-validation)
- [Feedback](#feedback)

<!-- tocstop -->

# Story behind OSMCha

The idea to build OSMCha - OpenStreetMap Changeset Analyser was [initiated](https://www.openstreetmap.org/user/wille/diary/40511) by [Wille Marcel](https://www.openstreetmap.org/user/wille) in mid 2015. It was built with a motivation of detecting and discovering harmful changesets that lasted in the OpenStreetMap (OSM) database for a long time without anyone noticing it.
He strongly found the need of a system that can help to help visualise and analyse edits made my mappers on OSM. In collaboration with Wille, this global instance is hosted by Mapbox as an additional data Quality Analysis tool for the community.

### Validation and OpenStreetMap

OpenStreetMap is a crowdsourced project, which is driven by a strong community. Any given day, around 30,000 changesets containing additions, modifications, and deletions to the data make their way into OpenStreetMap. With new users signing up on OSM every day, it is likely that the mapping guides/wikis on tagging scheme, general practices are not uniformly followed by every contributor, resulting in accidental edits, and in rare cases [intentional vandalism](#what-is-vandalism) that breaks the map.

In situations like these, it's necessary to have user friendly tools for the community to identify such errors easily and support the new contributors to make a great map. OSMCha is designed to be an integrated tool that can address various [validation requirements](#how-to-review-a-changeset) of the community. It is also supported by an open source edit recognition project called [OSM-Compare](https://github.com/mapbox/osm-compare), which can be used for suggesting manual verification. This tool offers advanced filtering options that can help you [filter changesets](#filters) based on various attributes. (Ex: All changesets with hashtags, user specific changesets, etc.)

### What is vandalism?

[Vandalism](https://wiki.openstreetmap.org/wiki/Vandalism) with respect to OpenStreetMap refers to deliberate acts of destruction or damage to the map data. These include, intentional edits that causes visible breakages on the map and also break other crucial map data such as route relations, boundaries, turn restrictions, land use etc.

#### What is a problematic edit?

Every change to OpenStreetMap is contained in a changeset. They consist of either additions (new feature), modifications (change existing tags, feature location, or location of a referred feature) or deletions by a mapper.

When working with data in OpenStreetMap, you sometimes come across places where another mapper might have added bad features or tags, changed or moved or deleted a large set of data or an important set of tags. Changes that spoil the quality of OpenStreetMap data are considered problematic edits.

There are several kinds of potentially problematic changes. For example:

- Use of proprietary data (like Google Maps) to add data in OpenStreetMap.
- Modification to significant tags like place, boundary,  highway, etc.
- Undocumented imports.
- Modifications with outdated imagery.
- Unintentional dragging of nodes in way that results in geometry changes.

Creation and deletion of features, modification to tags and modification to a node’s location, result in a version increment. Every change by every user is retained as a separate version of the object in the OpenStreetMap database. Changes to nodes within a way, or to members of a relation, result in displayed changes to the way/relation but do not increment version. Read more about Validating OpenStreetMap in this [guide](https://www.mapbox.com/mapping/validating-osm/)


### Automated flagging of changesets

OSMCha is supported by an edit detection pipeline called [OSM-Compare](https://github.com/mapbox/osm-compare). It is an open collection of compare functions written in Javascript that automatically check for suspicious changes on OSM and pushes them into OSMCha to different categories of identifiable edit behaviour. Currently, there are compare functions in OSM-Compare for flagging deletions of cities, overlap between features, and similar rule based scenarios.

`Flagged changesets` are changesets that are flagged by OSM-Compare for specific edit behaviour. Like deletion of valid data, incompatible data errors. Example - A swimming pool tagged as `natural=water`. The rule based detectors in OSM-Compare are inefficient in understanding context of an edit, place and mapping activity. This is the disadvantage and reason that these detections are false positives 80% of the time, based on the compare function written.

These changesets are automatically flagged by [OSM-Compare](https://github.com/mapbox/osm-compare) for specific edit behaviour. We are working towards making this [detection](#future-of-osmcha-and-validation-using-osm-compare) better over time.



### Why to review a changeset as Good/Bad 👍 / 👎 ?

- Any changeset on OSM can be reviewed by the community to confirm the quality of the edit. You can 👍 for edits that do not cause any damage to the map, and 👎 for those that may break map data or is invalid data.

- This data is collected to help improve the compare functions in OSM-Compare project. Thus helping it become more efficient and robust by testing it against a verified database of good and bad changesets.

- Consistent categorisation of changesets also helps to build an open source database for use in ventures related to machine learning or automating the detection process for bad edits instead of writing rule based compare functions for all possible scenarios of bad edits.

### Future of OSMCha and validation using OSM-Compare

- Machine learning based detection methods replace rule based edit detections. This makes it easier for analysis, automates maintenance and has prospects for better for detection rates to catch bad edits on OpenStreetMap.
- OSMCha will continue to be an OpenStreetMap validation tool that get feeds from [OSM-Compare](https://github.com/mapbox/osm-compare) with constant maintenance, with features towards an easier user experience for validation of edits on OpenStreetMap.


# Usage

## How to review a changeset?

It is important that the reviewer has the necessary information about the changeset and the mapper to understand a particular changeset.

For this purpose, OSMCha offers an interface similar to OpenStreetMap but with additional tools such as changeset-map to visualise the edits, information about the mapper, other information related to the changeset and OSM user history that can help the reviewer identify a problematic edits on OSM. For a deep-dive into what a problematic edit is on OSM, please refer to our guide on [Validating OpenStreetMap](https://www.mapbox.com/mapping/validating-osm/).


### Changeset and Mapper details


![osmcha-details](https://user-images.githubusercontent.com/8921295/27320562-72ecbf8e-55b4-11e7-9d01-1e6e97247dae.png)


- The details panel on OSMCha gives information of the changeset and the mapper.
- In the top right corner of the panel, in blue, yellow and red, number of additions, modifications and deletions of the changeset are presented.
- The details panels includes the username of the mapper, number of changesets the mapper has contributed on OSM, chnageset comment and further details like the editor and imagery used in making the edits on OSM.

![osmcha-flagged](https://user-images.githubusercontent.com/8921295/27320646-c8a33dcc-55b4-11e7-87d3-b7adfe9c9c54.png)


- When an edit is [detected through a compare function](#why-to-review-a-changeset-as-goodbad-%F0%9F%91%8D--%F0%9F%91%8E-) on OSM-Compare, it is shown on the `Flagged features` tab. The reviewer can click on Map to view the edit on the changeset map or open it directly on JOSM for detailed review.


![osmcha-discussions](https://user-images.githubusercontent.com/8921295/27320827-7a156300-55b5-11e7-824a-c32db44c5c43.png)


<nicer screenshot on discussion>

- Similarly if there is a discussion on the changeset on OpenStreetMap, OSMCha presents the discussion under the discussion tab.


![osmcha-users](https://user-images.githubusercontent.com/8921295/27320897-c2d00c30-55b5-11e7-8912-2d2642fe70f9.png)


<screenshot on user profile>

- More details on the mapper can be found under the `profile tab`. This gives more context to the reviewer about the user history and their pattern of contribution to OpenStreetMap


### Using Changeset-map

- Changeset-map is a changeset visualiser for OSM. It helps the reviewer understand the edits of a changeset both in terms of geometry and feature properties.


![osmcha-changesetmap](https://d2mxuefqeaa7sj.cloudfront.net/s_97A29C4444FB7626533E7DD42C06D768BD5A4FA0D1B3C76327F305F832774967_1497443481288_image.png)

- The reviewer can click on any particular feature edited in that changeset and see the additions, deletions and modifications made to the feature to have an informed decision on quality of the edits.

- Click on map from `Flagged features tab` and visualise it in changeset map.

![osmcha-flagged](https://d2mxuefqeaa7sj.cloudfront.net/s_97A29C4444FB7626533E7DD42C06D768BD5A4FA0D1B3C76327F305F832774967_1497444833373_image.png)

- Open the changeset in a preferred editor or a tool to inspect the changeset

### Reviewing changesets in OSMCha from OpenStreetMap

- If you come across a changeset on OSM while browsing through the history tab or a particular user’s changeset, it is sometimes necessary to see the changes that happened in a changeset visually.
- In these cases, you can copy the changeset ID and open it in OSMCha for visualisation and easily spotting errors in a changeset.


## Filters


![osmcha-filters](https://user-images.githubusercontent.com/8921295/27320952-00283b7a-55b6-11e7-81c1-bc24d62b0d61.png)



Filters tab on OSMCha provides a variety of search parameters to fetch a specific list of changesets the reviewer is interested in. One can filter changesets based on a date range, new mapper edits, mass deletions, text in the source field, Bbox, editor used, etc.


![osmcha-is-hot](https://d2mxuefqeaa7sj.cloudfront.net/s_97A29C4444FB7626533E7DD42C06D768BD5A4FA0D1B3C76327F305F832774967_1497509089383_image.png)

_Hot project edits are a specific example for which a changeset comment with the associated hashtag can be used to retrieve all the changesets contributed for the task._



### Basic filters

<full screenshot of filters>

![osmcha-basic](https://user-images.githubusercontent.com/8921295/27292289-a5942d84-5530-11e7-8c9c-2eff5a9748ef.png)

The [history tab](https://www.openstreetmap.org/history) on OpenStreetMap offers a very basic area based retrieval of changesets. It allows a user to zoom in to a specific area on the map and all the changesets in that area are shown on the sidebar in the order of newest first. OSMCha filters expands this feature with much more metadata based search.

These include:

- Words in a changeset comment or changeset comment used by the mapper, for example: #hotosm-project #MissingMaps
- Changeset date based on the time the edits were uploaded on OpenStreetMap
- Number of features added, modified and deleted in a changeset
- Changeset area on OpenStreetMap using the **Bbox** filter
- Geospatial filter for searching changesets whose bounding box intersects with a given geometry
- Changesets that are flagged by compare functions for edit behaviour through reason feed from [OSM-Compare](#future-of-osmcha-and-validation-using-osm-compare)
- Source or imagery mentioned in a changeset by the mapper
- Specific editor based search

### Applications for edit based search

![osmcha-context](https://user-images.githubusercontent.com/8921295/27321085-91233242-55b6-11e7-997e-32f82b3255a1.png)



**Null island edits**

- New mappers tend to add fictional data at 0, 0 coordinates as OpenStreetMap by default opens at these coordinates. Mappers being new, tend to test map and add non existent data due to lack of practice and knowledge of the workflow involved.


**Edit count based search**

- One can filter changesets based on mass additions, mass modifications, mass deletions and the number of edits made in a changeset.


**Using multiple filters on OSMCha**

- Local reviewers on OpenStreetMap maybe interested on changesets by searching for changesets based more than 1 condition
  - Ex: iD editor changesets that have deleted a lot of features
  - Ex: Mass additions of data by new mappers

# FAQ

### Can I view the changesets and use filters without logging into OSMCha?

 You **must** be signed in-order to [review](#how-to-review-a-changeset) a changeset as good or bad. Authentication in not required if you are only viewing the changesets.


### My changeset has been flagged by a reason, am I doing something wrong?

No, not at all! These changesets are automatically flagged by [OSM-Compare](https://github.com/mapbox/osm-compare) for specific edit behaviour. We are working towards making this [detection](#future-of-osmcha-and-validation-using-osm-compare) better over time.


The rule based detectors in OSM-Compare are inefficient in understanding context of an edit, place and mapping activity. This is the disadvantage and reason that these detections are false positives 80% of the time, based on the compare function written.


For example, a place deleted compare function flags an experienced mapper's changeset even if he/she has deleted a fake city previously added by another user. This context is unavailable to the rule based detector for better analysis.


### Are there keyboard shortcuts in OSMCha?


Yes. Keyboard shortcuts on OSMCha help the reviewer to go through a list of changesets quickly. Here are the available shortcuts:


| _Description_                                    | _Shortcut_         |
|--------------------------------------------------|--------------------|
| **Navigating changeset list**                    |                    |
| Go to previous changeset (in the changeset list) | ` ↑ `              |
| Go to next changeset (in the changeset list)     | ` ↓ ` or ` Space ` |
| **Changeset detail view**                        |                    |
| Open changeset in JOSM                           | ` J `              |
| Open user profile in HDYC                        | ` H `              |
| Review changeset as good                         | ` G `              |
| Review changeset as bad                          | ` B `              |
| Undo or clear changeset review                   | ` U ` or ` C `     |
| **Changeset panels**                             |                    |
| Toggle Changeset details                         | ` 1 `              |
| Toggle Flagged features                          | ` 2 `              |
| Toggle Changeset discussions                     | ` 3 `              |
| Toggle User profile                              | ` 4 `              |
| Toggle Map controls                              | ` 5 `              |
| Toggle Filters                                   | ` \ `              |
| **Other**                                        |                    |
| Show shortcuts list                              | ` ? `              |


### What are tags on OSMCha?


<Tags screenshot>

![osmcha-tags](https://user-images.githubusercontent.com/8921295/27322174-b0561022-55ba-11e7-81e9-3507278d4f58.png)

The button `Tags` will only appear when you review a changeset good or bad, but it's recommended and essentially used to describe the details of the changeset that was found to be bad. Here are the different tags that can be used:

- **Severity**: **Critical**, **High** or **Low**, to estimate how bad do these edits on a changeset affect OpenStreetMap data
- **Unresolved**: To input action taken by the you (reviewer) on a changeset. It is unresolved when the you (reviewer) have commented on the changeset to inform the mapper for corrections or no action has been taken by the you (reviewer) to correct the map data.
- **Intent**: **Intentional** or **Unintentional** to capture the intent of the user. This is contextual information subjective to the edits and users.
- **DWG**: When a changeset needs to be reported to the Data Working Group

### What if I want to change my review for a changeset?

Yes, it is possible to change the review for a changeset from `Good` to `Bad` or vise versa. You can also unreview a changeset by clicking on the

![osmcha-undo](https://user-images.githubusercontent.com/8921295/27321404-bdcee81c-55b7-11e7-8114-86a53f642d99.gif)


### Can I review my own changesets?

No, you cannot review your own changesets, but you can view your changesets.


# Why did I get this error message

## Changeset views error messages

- This changeset is already reviewed!

You cannot review a changeset which was already reviewed by another user. Please choose a different changeset.

- You cannot check your own changeset!

You cannot review your own changesets.

- This changeset is not reviewed yet!

You cannot undo a review for a changeset if it's not reviewed before. Please go ahead and review the changeset.

- You do not have the permission to undo a review for this changeset.

You cannot undo a review for a changeset which is reviewed by another user. You have the permission to undo a review for changesets that are reviewed **only** by you.

- You cannot add tags to your own changeset.

You do not have the permission to add tags or review your own changesets.

- You cannot add tags to a changeset that is reviewed by another user.

You cannot perform any actions on changesets that are reviewed by other users.


- You can not remove tags from your own changeset.

If your changeset is reviewed by others and has some tags associated with it, you don't have permissions to remove or alter these tags.

- You can not remove tags from a changeset reviewed by another user.

You don't have permission to remove or alter tags of changesets that are reviewed by other users.

- Sign in error

You get this error, when you have not signed-in into OSMCha. Please sign-in using your OpenStreetMap name.

- Changeset map error

<need more info on this>


# References

- Wikis
  - [Vandalism on OSM](https://wiki.openstreetmap.org/wiki/Vandalism)
  - [Detect vandalism](https://wiki.openstreetmap.org/wiki/Detect_Vandalism)
  - [Quality Assurance on OpenStreetMap](https://wiki.openstreetmap.org/wiki/Quality_assurance)

- Related Projects

  - [OSMCha-frontend](https://github.com/mapbox/osmcha-frontend/)
  - [OSM-Compare](https://github.com/mapbox/osm-compare)
  - [OSMLint](https://github.com/osmlab/osmlint)
  - [MapRoulette](http://www.maproulette.org/)


# Other tools for validation

- [OSM-Comments](https://www.mapbox.com/osm-comments/)
- [To-Fix](https://osmlab.github.io/to-fix/)
- [MapRoulette](http://www.maproulette.org/)
- [HDYC](http://hdyc.neis-one.org/)
- [WHODIDIT](http://simon04.dev.openstreetmap.org/whodidit/)
- [Who’s That](whosthat.osmz.ru)
- [Result Maps](http://resultmaps.neis-one.org/)

# Feedback

- To file bugs, feature requests on OSMCha - please file issues at https://github.com/mapbox/osmcha-frontend/issues
- To file bugs, feature requests on Changeset map - please file issues at https://github.com/osmlab/changeset-map/issues
