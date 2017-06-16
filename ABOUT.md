# OSMCha About Me Draft.md

<!-- toc -->

- [Introduction to OSMCha](#introduction-to-osmcha)
  * [Why use OSMCha?](#why-use-osmcha)
  * [What is vandalism?](#what-is-vandalism)
  * [What are flagged changesets and how are they automatically flagged?](#what-are-flagged-changesets-and-how-are-they-automatically-flagged)
  * [Why to review a changeset as Good/Bad 👍 / 👎 ?](#why-to-review-a-changeset-as-goodbad-%F0%9F%91%8D--%F0%9F%91%8E-)
  * [Future of OSMCha and validation using OSM-Compare](#future-of-osmcha-and-validation-using-osm-compare)
- [How to review a changeset?](#how-to-review-a-changeset)
  * [Changeset and Mapper details](#changeset-and-mapper-details)
  * [Using Changeset-map](#using-changeset-map)
- [Filters](#filters)
  * [Basic filters](#basic-filters)
  * [Applications for edit based search](#applications-for-edit-based-search)
- [FAQ](#faq)
  * [How are the changesets presented?](#how-are-the-changesets-presented)
  * [How can I login into OSMCha?](#how-can-i-login-into-osmcha)
  * [How do I logout of OSMCha?](#how-do-i-logout-of-osmcha)
  * [My changeset has been flagged by a reason, am I a bad mapper?](#my-changeset-has-been-flagged-by-a-reason-am-i-a-bad-mapper)
  * [Are there keyboard shortcuts in OSMCha?](#are-there-keyboard-shortcuts-in-osmcha)
  * [What are tags on OSMCha?](#what-are-tags-on-osmcha)
- [References](#references)
- [Other tools for validation](#other-tools-for-validation)
- [Feedback](#feedback)

<!-- tocstop -->

## Introduction to OSMCha

OSMCha is short for OpenStreetMap Changeset Analyser. OSMCha is a web tool to help  visualise and analyse edits made by other mappers on OpenStreetMap(OSM). OSMCha was originally written by [Wille Marcel](https://www.openstreetmap.org/user/wille) in 2015 to validate changesets on OSM. In collaboration with Wille, this global instance is hosted by Mapbox as an additional data Quality Analysis tool for the OpenStreetMap(OSM) community.

### Why use OSMCha?

- OSM is a crowdsourced project, and it is necessary to have user friendly tools for the community to guide new contributors to make a great map.
- Any given day, around 30,000 changesets containing additions, modifications, and deletions to the data make their way into OSM, which is driven by a strong community. With new users signing up on OSM every day, it is likely that the mapping guides on tagging scheme, general practices are not uniformly followed by every user, resulting in accidental edits and in rare cases bad edits that breaks the map.
- OSMCha is designed to be an integrated tool that can address various validation requirements of the community. OSMCha is also supported by an open source edit recognition project called [OSM-Compare](https://github.com/mapbox/osm-compare) which can be used for suggesting manual verification.

### What is vandalism?

- [Vandalism](https://wiki.openstreetmap.org/wiki/Vandalism) with respect to OpenStreetMap refers to deliberate acts of destruction or damage to the map data. These are intentional edits to the map data that causes visible breakages to the map and also breaking of crucial data such as route relations, boundaries, turn restrictions that is not visible but very important.

### What are flagged changesets and how are they automatically flagged?

- Flagged changesets are changesets on OpenStreetMap that are flagged by OSM-Compare for specific edit behaviours. _Ex: Deletion of valid data, incompatible data errors e.g. a swimming pool tagged as `natural=water`_

- OSMCha is supported by an edit detection pipeline called OSM-Compare. OSM-Compare is an open collection of compare functions written in Javascript that automatically checks for suspicous changes on OSM and push them into OSMCha to different categories of identifiable edit behaviours. Currently, there are compare functions in OSM-Compare for flagging deletions of cities and overlap between features.

### Why to review a changeset as Good/Bad 👍 / 👎 ?

- Any changeset on OSM can be reviewed by the community to confirm the quality of the edit. You can 👍 for edits that improve the map, and 👎 for those that reduce the overall quality of the data.

- This data is collected to help improve the compare functions in OSM-Compare project more efficient and robust by testing against a verified database of good and bad changesets.

- Consistent categorisation of changesets also helps to build an open source database for use in ventures related to machine learning or automating the detection process for bad edits instead of writing rule based compare functions for all possible scenarios of bad edits.



### Future of OSMCha and validation using OSM-Compare

- Machine learning based detection methods replace rule based edit detections. This makes it easier for analysis, automates maintenance and has prospects for better for detection rates to catch bad edits on OpenStreetMaps.
- OSMCha will continue to be an OpenStreetMap validation tool that gets feeds from OSM-Compare with constant maintenance, with features towards an easier user experience for validation of edits on OpenStreetMap.


----------

> Split into usage.md

## How to review a changeset?

OSMCha offers an interface similar to OpenStreetMap but with additional tools such as changeset-map to visualise the edits on the map, information about the mapper, other information related to the changeset and OSM user history that can help the reviewer identify a problematic edit on OSM. For a deep-dive into what a problematic edit is on OSM, please refer to our guide on Validating OpenStreetMap.


It is important that the reviewer has the necessary information about the changeset and the mapper to understand the changes in a particular changeset.

### Changeset and Mapper details


![](https://d2mxuefqeaa7sj.cloudfront.net/s_97A29C4444FB7626533E7DD42C06D768BD5A4FA0D1B3C76327F305F832774967_1497440261785_image.png)

- The details panel on OSMCha gives information of the changeset and the mapper.
- In the top right corner of the panel, in blue, yellow and red, number of additions, modifications and deletions of the changeset are presented.
- The details panels includes the username of the mapper, number of changesets the mapper has contributed on OSM, chnageset comment and further details like the editor and imagery used in making the edits on OSM.

![](https://d2mxuefqeaa7sj.cloudfront.net/s_97A29C4444FB7626533E7DD42C06D768BD5A4FA0D1B3C76327F305F832774967_1497440902765_image.png)

- When an edit is detected through a compare function on OSM-Compare, it is shown on the suspicious features tab. The reviewer can click on Map to view the edit on the changeset map or open it directly on JOSM for detailed review.




![](https://d2mxuefqeaa7sj.cloudfront.net/s_97A29C4444FB7626533E7DD42C06D768BD5A4FA0D1B3C76327F305F832774967_1497443028688_image.png)

<nicer screenshot on discussion>

- Similarly if there is a discussion on the changeset on OpenStreetMap, OSMCha presents the discussion under the discussion tab.


<screenshot on user profile>

- More details on the mapper can be found under the profile tab. This gives a good background information about the user for the reviewer for context including his history and pattern of contribution to OpenStreetMap.


### Using Changeset-map

- Changeset-map is a changeset visualiser for OSM. It helps the reviewer understand the edits of a changeset both in terms of geometry and feature properties.



![](https://d2mxuefqeaa7sj.cloudfront.net/s_97A29C4444FB7626533E7DD42C06D768BD5A4FA0D1B3C76327F305F832774967_1497443481288_image.png)

- The reviewer can click on any particular feature edited in that changeset and see the additions, deletions and modifications made to the feature to have an informed decision on quality of the edits.

- Click on map from Suspicious features tab and visualise it in changeset map.

![](https://d2mxuefqeaa7sj.cloudfront.net/s_97A29C4444FB7626533E7DD42C06D768BD5A4FA0D1B3C76327F305F832774967_1497444833373_image.png)

- Open the changeset in a preferred editor or a tool to inspect the changeset

- Using OSMCha by spotting a changeset on OSM

- If you come across a changeset on OSM while browsing through the history tab or a particular user’s changeset, it is sometimes necessary to see the changes that happened in a changeset visually.
  - In these cases, you can copy the changeset ID and open it in OSMCha for visualisation and easily spotting errors in a changeset.





## Filters


![](https://d2mxuefqeaa7sj.cloudfront.net/s_97A29C4444FB7626533E7DD42C06D768BD5A4FA0D1B3C76327F305F832774967_1497508625051_image.png)


Filters tab on OSMCha provides a variety of search parameters to fetch a specific list of changesets the reviewer is interested in. Hot project edits are a specific example for which a changeset comment with the associated hashtag can be used to retrieve all the changesets contributed for the task.



![](https://d2mxuefqeaa7sj.cloudfront.net/s_97A29C4444FB7626533E7DD42C06D768BD5A4FA0D1B3C76327F305F832774967_1497509089383_image.png)



### Basic filters

<full screenshot of filters>

![](https://d2mxuefqeaa7sj.cloudfront.net/s_97A29C4444FB7626533E7DD42C06D768BD5A4FA0D1B3C76327F305F832774967_1497509281015_image.png)

History tab on OpenStreetMap offers a very basic area based retrieval of changesets. It allows a user to zoom in to a specific area on the map and all the changesets in that area are shown on the sidebar in the order of newest first. OSMCha filters expands this feature with much more metadata based search.


These include -
- Changeset comment mentioned in the changeset by the mapper
- Changeset date based on the time the edits uploaded on OpenStreetMap
- Number of features added, modified and deleted in a changeset
- Changeset area on OpenStreetMap using a bounding box filter
- Geospatial filter for searching for changesets whose bounding box intersects with given geometry
- Changesets that are flagged by compare functions for edit behaviour through reason feed from OSM-Compare
- Source, Imagery mentioned in a changeset by the mapper
- Changeset comment mentioned Ex: #hotosm-project #MissingMaps
- Specific editor based search

### Applications for edit based search

![](https://d2mxuefqeaa7sj.cloudfront.net/s_97A29C4444FB7626533E7DD42C06D768BD5A4FA0D1B3C76327F305F832774967_1497513545989_image.png)




**Null island edits**

- New mappers tend to add fictional data on OpenStreetMap at 0, 0 coordinates. This is because OpenStreetMap opens at 0.0 coordinates by default and new mappers sometimes add fictional data here due to lack of practice/knowledge on OSM workflow, coordinates on the map and for test mapping.

**Edit count based search**

- Mass addition, mass modifications and mass deletions of features based on the number of edits made in a changeset.



**Using multiple filters on OSMCha**

- Local reviewers on OpenStreetMap maybe interested on changesets by searching for changesets based more than 1 condition
  - Ex: iD editor changesets that have deleted a lot of features
  - Ex: Mass additions of data by new mappers


----------

> Split into FAq.md

## FAQ

### How are the changesets presented?

- OSMCha reads all changesets from OpenStreetMap. They are presented in the order of newest first based on the filters applied by the OSMCha reviewer.

![](https://d2mxuefqeaa7sj.cloudfront.net/s_97A29C4444FB7626533E7DD42C06D768BD5A4FA0D1B3C76327F305F832774967_1497513993362_image.png)

- The list of changesets are presented on the sidebar.

- The reviewer can select each changeset to view the details of the changeset on the changeset panel and edits in the changeset map.

### How can I login into OSMCha?

- A reviewer on OSMCha can sign using their OpenStreetMap account on OSMCha. A reviewer needs to be signed in to input Good/Bad [review](#how-to-review-a-changeset) on OSMCha. For only viewing without review, authentication is not necessary.


### How do I logout of OSMCha?

- After authentication, the sign-in button on OSMCha shows the reviewer OpenStreetMap user name. The reviewer can sign out at anytime using logout button available on the dropdown beside the username.

### My changeset has been flagged by a reason, am I a bad mapper?


- No. Rule based detectors on OSM-Compare are inefficient in understanding context of an edit, place and mapping activity. This is the disadvantage and reason that these detections are false positives 80% of the time based on the compare function written.

- Ex: A place deleted compare function detects even when an experienced mapper has deleted a fake city previously added by another user. This context is unavailable to the rule based detector for better analysis.


### Are there keyboard shortcuts in OSMCha?


Yes. Keyboard shortcuts on OSMCha go through changesets help the reviewer go through a list of changesets quickly. Here are the available shortcuts on OSMCha currently


G - Good review input
B - Bad review input
U - Undo review
J - Open changeset in JOSM
Space - To go to next changeset in sidebar changeset list
Up - To go to previous changeset in the sidebar changeset list
Down - To go to next changeset in the sidebar changeset list


### What are tags on OSMCha?


<Tags screenshot>


- Tags on OSMCha provide the reviewer to give a more detailed review on a changeset based on review. Tags are recommended to be used only when a changeset is found to be bad.
  - Severity - Critical, High, Low to estimate how badly edits on a changeset affect OpenStreetMap data
  - Unresolved - To input action taken by the reviewer on a changeset. It is unresolved when the reviewer has commented on the changeset to inform the mapper for corrections or no action has been taken by the reviewer to correct the map data.
  - DWG - When a changeset needs to be reported to the Data Working Group

## References

- Wiki’s
  - [Vandalism on OSM](https://wiki.openstreetmap.org/wiki/Vandalism)
  - [Detect vandalism](https://wiki.openstreetmap.org/wiki/Detect_Vandalism)
  - [Quality Assurance on OpenStreetMap](https://wiki.openstreetmap.org/wiki/Quality_assurance)

- Projects related

  - [OSMCha-frontend](https://github.com/mapbox/osmcha-frontend/)
  - [OSM-Compare](https://github.com/mapbox/osm-compare)
  - [OSMLint](https://github.com/osmlab/osmlint)
  - [MapRoulette](http://www.maproulette.org/)


## Other tools for validation

- [OSM-Comments](https://www.mapbox.com/osm-comments/)
- [To-Fix](https://osmlab.github.io/to-fix/)
- [MapRoulette](http://www.maproulette.org/)
- [HDYC](http://hdyc.neis-one.org/)
- [WHODIDIT](http://simon04.dev.openstreetmap.org/whodidit/)
- [Who’s That](whosthat.osmz.ru)
- [Result Maps](http://resultmaps.neis-one.org/)

## Feedback

- To files bugs, feature requests on OSMCha - please file issues at https://github.com/mapbox/osmcha-frontend/
- To files bugs, feature requests on OSMCha - please file issues at https://github.com/osmlab/changeset-map/issues
