import React from 'react';
import { fromJS } from 'immutable';
import { shallow } from 'enzyme';
import { StaticRouter } from 'react-router';
import MockDate from 'mockdate';
import { List } from './index';
describe.skip('list index testing', () => {
  it('renders correctly', () => {
    MockDate.set(1497172627326);
    const mockReload = jest.fn();
    const currentPage = getcurrentPage();
    const list = shallow(
      <StaticRouter context={{}}>
        <List
          reloadPage={mockReload}
          activeChangesetId={49425586}
          currentPage={currentPage}
          loading={false}
          pageIndex={0}
        />
      </StaticRouter>
    );
    list.find('.icon-star');

    MockDate.reset();
  });

  function getcurrentPage() {
    return fromJS({
      type: 'FeatureCollection',
      count: 3371,
      next:
        'https://osmcha-django-staging.tilestream.net/api/v1/changesets/?checked=True&page=2&page_size=75',
      previous: null,
      features: [
        {
          id: 49434773,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-85.1849187, 38.5949394],
                [-85.1647341, 38.5949394],
                [-85.1647341, 38.6139169],
                [-85.1849187, 38.6139169],
                [-85.1849187, 38.5949394]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'badpap',
            uid: '163973',
            editor: 'JOSM/1.5 (12275 fr)',
            comment: '#maproulette Self-Intersecting_ways',
            source: 'Bing',
            imagery_used: 'Not reported',
            date: '2017-06-11T06:10:50Z',
            create: 2,
            modify: 2,
            delete: 0,
            area: 0.000383053246499837,
            is_suspect: false,
            harmful: true,
            checked: true,
            check_date: '2017-06-11T06:27:42.498667Z'
          }
        },
        {
          id: 49425589,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [5.2534035, 52.3026956],
                [5.2534035, 52.3026956],
                [5.2534035, 52.3026956],
                [5.2534035, 52.3026956],
                [5.2534035, 52.3026956]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [{ id: 1, name: 'intentional' }],
            features: [],
            user: 'tijder',
            uid: '3695721',
            editor: 'iD 2.2.1',
            comment: 'openings tijden',
            source: 'Not reported',
            imagery_used: 'PDOK Luchtfoto Beeldmateriaal 25cm',
            date: '2017-06-10T17:56:53Z',
            create: 0,
            modify: 1,
            delete: 0,
            area: 0.0,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-10T18:10:38.449683Z'
          }
        },
        {
          id: 49425588,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [12.9647126, 52.4074158],
                [12.9655083, 52.4074158],
                [12.9655083, 52.4088197],
                [12.9647126, 52.4088197],
                [12.9647126, 52.4074158]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'pruritus',
            uid: '46793',
            editor: 'JOSM/1.5 (12385 de)',
            comment: 'Potsdam Golm Hausnummern Am Golmer Weinberg',
            source: 'eigene Beobachtung',
            imagery_used: 'Not reported',
            date: '2017-06-10T17:56:48Z',
            create: 22,
            modify: 6,
            delete: 0,
            area: 1.1170832299989e-6,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-10T18:11:01.810880Z'
          }
        },
        {
          id: 49425587,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [12.709938, 59.0497524],
                [12.710669, 59.0497524],
                [12.710669, 59.0507344],
                [12.709938, 59.0507344],
                [12.709938, 59.0497524]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [{ id: 2, name: 'suspect_word' }],
            tags: [],
            features: [],
            user: 'henriko',
            uid: '34784',
            editor: 'Go Map!! 1.4',
            comment: 'Fixed a footpath that ends in some stairs, kind of.',
            source: 'Not reported',
            imagery_used: 'Not reported',
            date: '2017-06-10T17:56:47Z',
            create: 1,
            modify: 10,
            delete: 0,
            area: 7.17842000000389e-7,
            is_suspect: true,
            harmful: true,
            checked: true,
            check_date: '2017-06-10T18:11:05.370209Z'
          }
        },
        {
          id: 49425586,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [108.3738407, 11.700979],
                [108.384303, 11.700979],
                [108.384303, 11.7348985],
                [108.3738407, 11.7348985],
                [108.3738407, 11.700979]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'khuc tinh ca',
            uid: '6134674',
            editor: 'iD 2.2.1',
            comment: 'Tuyến 110kv Đức Trọng - Đa Dâng 2',
            source: 'Not reported',
            imagery_used: 'Bing aerial imagery',
            date: '2017-06-10T17:56:42Z',
            create: 1,
            modify: 1,
            delete: 0,
            area: 0.000354875984850009,
            is_suspect: false,
            harmful: true,
            checked: true,
            check_date: '2017-06-10T18:11:08.026653Z'
          }
        },
        {
          id: 49425585,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-71.0837, 42.34856],
                [-71.0837, 42.34856],
                [-71.0837, 42.34856],
                [-71.0837, 42.34856],
                [-71.0837, 42.34856]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'jokeefe',
            uid: '3966467',
            editor: 'Pushpin iOS',
            comment: 'added Surveillance Camera',
            source: 'Not reported',
            imagery_used: 'Not reported',
            date: '2017-06-10T17:56:40Z',
            create: 1,
            modify: 0,
            delete: 0,
            area: 0.0,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-10T18:11:12.848022Z'
          }
        },
        {
          id: 49425584,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [12.737821, 42.7355579],
                [12.7387188, 42.7355579],
                [12.7387188, 42.7368441],
                [12.737821, 42.7368441],
                [12.737821, 42.7355579]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [{ id: 2, name: 'suspect_word' }],
            tags: [],
            features: [],
            user: 'HGSandhagen',
            uid: '228662',
            editor: 'JOSM/1.5 (12275 de)',
            comment: 'Duplicate nodes fixed',
            source: 'Not reported',
            imagery_used: 'Not reported',
            date: '2017-06-10T17:56:37Z',
            create: 0,
            modify: 5,
            delete: 1,
            area: 1.15475035999453e-6,
            is_suspect: true,
            harmful: true,
            checked: true,
            check_date: '2017-06-10T18:11:20.861893Z'
          }
        },
        {
          id: 49425583,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-71.083695, 42.34854],
                [-71.083695, 42.34854],
                [-71.083695, 42.34854],
                [-71.083695, 42.34854],
                [-71.083695, 42.34854]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [{ id: 1, name: 'intentional' }],
            features: [],
            user: 'jokeefe',
            uid: '3966467',
            editor: 'Pushpin iOS',
            comment: 'added Surveillance Camera',
            source: 'Not reported',
            imagery_used: 'Not reported',
            date: '2017-06-10T17:56:27Z',
            create: 1,
            modify: 0,
            delete: 0,
            area: 0.0,
            is_suspect: false,
            harmful: true,
            checked: true,
            check_date: '2017-06-10T18:11:41.148436Z'
          }
        },
        {
          id: 49425580,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [9.9280864, 51.5850547],
                [9.9291271, 51.5850547],
                [9.9291271, 51.5863163],
                [9.9280864, 51.5863163],
                [9.9280864, 51.5850547]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'jengelh',
            uid: '1468043',
            editor: 'JOSM/1.5 (12039 en)',
            comment: 'Not reported',
            source: 'Not reported',
            imagery_used: 'Not reported',
            date: '2017-06-10T17:56:22Z',
            create: 0,
            modify: 7,
            delete: 0,
            area: 1.31294712000038e-6,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-10T18:12:28.417832Z'
          }
        },
        {
          id: 49425579,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [12.7528857, 47.9417452],
                [12.7547486, 47.9417452],
                [12.7547486, 47.9430491],
                [12.7528857, 47.9430491],
                [12.7528857, 47.9417452]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'Karsten Natebus',
            uid: '3249246',
            editor: 'JOSM/1.5 (12275 de)',
            comment: 'Grundrisse korrigiert.',
            source: 'Bayern (80 cm) Spiegelserver; survey',
            imagery_used: 'Not reported',
            date: '2017-06-10T17:56:21Z',
            create: 13,
            modify: 5,
            delete: 0,
            area: 2.42903531000515e-6,
            is_suspect: false,
            harmful: true,
            checked: true,
            check_date: '2017-06-10T18:12:32.406206Z'
          }
        },
        {
          id: 49425578,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [34.0490325, 61.8785073],
                [34.0491784, 61.8785073],
                [34.0491784, 61.8786185],
                [34.0490325, 61.8786185],
                [34.0490325, 61.8785073]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'Дружок',
            uid: '5764463',
            editor: 'iD 2.2.1',
            comment: 'Added  house',
            source: 'Not reported',
            imagery_used: 'Bing aerial imagery',
            date: '2017-06-10T17:56:13Z',
            create: 5,
            modify: 0,
            delete: 0,
            area: 1.62240799998499e-8,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-10T18:12:24.528729Z'
          }
        },
        {
          id: 49425321,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [12.493178, 41.8929694],
                [12.4932964, 41.8929694],
                [12.4932964, 41.8930441],
                [12.493178, 41.8930441],
                [12.493178, 41.8929694]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'Michi_',
            uid: '5402679',
            editor: 'JOSM/1.5 (12275 it)',
            comment: 'Sapienza University indoor mapping',
            source: 'survey',
            imagery_used: 'Not reported',
            date: '2017-06-10T17:42:41Z',
            create: 10,
            modify: 0,
            delete: 0,
            area: 8.84447999986864e-9,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-10T18:14:21.249409Z'
          }
        },
        {
          id: 49425320,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [12.4863627, 41.8376367],
                [12.489426, 41.8376367],
                [12.489426, 41.8395248],
                [12.4863627, 41.8395248],
                [12.4863627, 41.8376367]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'dieterdreist',
            uid: '26139',
            editor: 'Go Map!! 1.4',
            comment: 'details from survey',
            source: 'Not reported',
            imagery_used: 'Not reported',
            date: '2017-06-10T17:42:38Z',
            create: 0,
            modify: 3,
            delete: 0,
            area: 5.78381673000495e-6,
            is_suspect: false,
            harmful: true,
            checked: true,
            check_date: '2017-06-10T18:14:24.215632Z'
          }
        },
        {
          id: 49422408,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [10.2383348, 48.5129292],
                [10.2596504, 48.5129292],
                [10.2596504, 48.5381439],
                [10.2383348, 48.5381439],
                [10.2383348, 48.5129292]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'walloHerbrechtingen',
            uid: '464750',
            editor: 'iD 2.2.1',
            comment: 'Umbenennung in Günzburger Str. und einige Häuser',
            source: 'Not reported',
            imagery_used: 'Bing aerial imagery',
            date: '2017-06-10T14:51:55Z',
            create: 67,
            modify: 14,
            delete: 1,
            area: 0.000537466459319972,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-10T15:05:31.021927Z'
          }
        },
        {
          id: 49422407,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [5.8545652, 45.0254358],
                [5.8621066, 45.0254358],
                [5.8621066, 45.0307706],
                [5.8545652, 45.0307706],
                [5.8545652, 45.0254358]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'chimel38',
            uid: '148831',
            editor: 'JOSM/1.5 (12275 fr)',
            comment:
              'FR38 LA MORTE  Rapprochement BANO + Landuse et autres ajouts',
            source: 'BDOrtho IGN 2017 + Cadastre 2017',
            imagery_used: 'Not reported',
            date: '2017-06-10T14:51:53Z',
            create: 18,
            modify: 6,
            delete: 0,
            area: 4.023186072e-5,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-10T15:05:41.307369Z'
          }
        },
        {
          id: 49422406,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [30.4095986, 50.5087024],
                [30.4108177, 50.5087024],
                [30.4108177, 50.5122348],
                [30.4095986, 50.5122348],
                [30.4095986, 50.5087024]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'Sergey82K',
            uid: '2203602',
            editor: 'iD 2.2.1',
            comment: 'Дороги, проїзди',
            source: 'Not reported',
            imagery_used: 'Bing aerial imagery',
            date: '2017-06-10T14:51:47Z',
            create: 3,
            modify: 18,
            delete: 0,
            area: 4.30634884000603e-6,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-10T15:05:48.670994Z'
          }
        },
        {
          id: 49422404,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-3.1509076, 48.8341676],
                [-3.1489463, 48.8341676],
                [-3.1489463, 48.8351294],
                [-3.1509076, 48.8351294],
                [-3.1509076, 48.8341676]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'fylip22',
            uid: '514006',
            editor: 'Potlatch 2',
            comment: 'Pleubian',
            source: 'Not reported',
            imagery_used: 'Not reported',
            date: '2017-06-10T14:51:46Z',
            create: 41,
            modify: 0,
            delete: 0,
            area: 1.8863783399979e-6,
            is_suspect: false,
            harmful: true,
            checked: true,
            check_date: '2017-06-10T15:05:54.228132Z'
          }
        },
        {
          id: 49422403,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [7.0980637, 53.4264116],
                [7.0986039, 53.4264116],
                [7.0986039, 53.4269675],
                [7.0980637, 53.4269675],
                [7.0980637, 53.4264116]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'hover_dam',
            uid: '75078',
            editor: 'Potlatch 2',
            comment: 'Not reported',
            source: 'Not reported',
            imagery_used: 'Not reported',
            date: '2017-06-10T14:51:45Z',
            create: 1,
            modify: 7,
            delete: 0,
            area: 3.00297180000858e-7,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-10T15:05:59.630864Z'
          }
        },
        {
          id: 49422402,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-73.3374692, 8.4696197],
                [-73.3374692, 8.4696197],
                [-73.3374692, 8.4696197],
                [-73.3374692, 8.4696197],
                [-73.3374692, 8.4696197]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [{ id: 36, name: 'New mapper' }],
            tags: [],
            features: [],
            user: 'jose savad Paredes',
            uid: '6087748',
            editor: 'MAPS.ME android 7.3.5-Google',
            comment: 'Created a place_of_worship',
            source: 'Not reported',
            imagery_used: 'Not reported',
            date: '2017-06-10T14:51:43Z',
            create: 1,
            modify: 0,
            delete: 0,
            area: 0.0,
            is_suspect: true,
            harmful: true,
            checked: true,
            check_date: '2017-06-10T15:06:08.903361Z'
          }
        },
        {
          id: 49422401,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [7.1857613, 51.0661462],
                [7.1859759, 51.0661462],
                [7.1859759, 51.0668693],
                [7.1857613, 51.0668693],
                [7.1857613, 51.0661462]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'michael_f_osm',
            uid: '6082640',
            editor: 'JOSM/1.5 (12275 de)',
            comment: 'neue Objekte',
            source: 'survey',
            imagery_used: 'Not reported',
            date: '2017-06-10T14:51:36Z',
            create: 2,
            modify: 0,
            delete: 0,
            area: 1.55177260000126e-7,
            is_suspect: false,
            harmful: true,
            checked: true,
            check_date: '2017-06-10T15:06:04.701248Z'
          }
        },
        {
          id: 49415911,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [2.1788367, 48.6964899],
                [2.1788367, 48.6964899],
                [2.1788367, 48.6964899],
                [2.1788367, 48.6964899],
                [2.1788367, 48.6964899]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'pvk',
            uid: '11153',
            editor: 'iD 2.2.1',
            comment: 'Ajout dun acacia',
            source: 'Not reported',
            imagery_used: 'Bing aerial imagery',
            date: '2017-06-10T09:10:52Z',
            create: 1,
            modify: 0,
            delete: 0,
            area: 0.0,
            is_suspect: false,
            harmful: true,
            checked: true,
            check_date: '2017-06-10T09:29:38.354228Z'
          }
        },
        {
          id: 49415909,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [17.1974535, 50.2277996],
                [17.216853, 50.2277996],
                [17.216853, 50.246748],
                [17.1974535, 50.246748],
                [17.1974535, 50.2277996]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [{ id: 1, name: 'mass modification' }],
            tags: [],
            features: [],
            user: 'pschonmann',
            uid: '5748',
            editor: 'JOSM/1.5 (12275 cs)',
            comment: 'Ruianized buildings',
            source: 'Ruian TODO; Český RÚIAN budovy',
            imagery_used: 'Not reported',
            date: '2017-06-10T09:10:45Z',
            create: 1061,
            modify: 3248,
            delete: 312,
            area: 0.000367589485799962,
            is_suspect: true,
            harmful: true,
            checked: true,
            check_date: '2017-06-10T09:30:29.569131Z'
          }
        },
        {
          id: 49415333,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [138.5842176, -34.8743798],
                [138.5847347, -34.8743798],
                [138.5847347, -34.8740122],
                [138.5842176, -34.8740122],
                [138.5842176, -34.8743798]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [{ id: 4, name: 'notfixed' }],
            features: [],
            user: 'CloCkWeRX',
            uid: '172061',
            editor: 'iD 2.2.1',
            comment: 'Add recycling centre',
            source: 'Not reported',
            imagery_used: 'Bing aerial imagery',
            date: '2017-06-10T08:38:03Z',
            create: 6,
            modify: 0,
            delete: 0,
            area: 1.90085960007499e-7,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-10T08:52:29.958722Z'
          }
        },
        {
          id: 49395399,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-1.3106988, 11.7639832],
                [-1.2303618, 11.7639832],
                [-1.2303618, 12.0204201],
                [-1.3106988, 12.0204201],
                [-1.3106988, 11.7639832]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [{ id: 3, name: 'possible import' }],
            tags: [{ id: 1, name: 'intentional' }],
            features: [],
            user: 'matthewsheffield',
            uid: '347944',
            editor: 'JOSM/1.5 (12275 en_AU)',
            comment:
              'Burkina Faso, réseau routier consolidé vs gROADS#hotosm-project-1245',
            source: 'Bing',
            imagery_used: 'Not reported',
            date: '2017-06-09T11:44:35Z',
            create: 575,
            modify: 5,
            delete: 7,
            area: 0.0206013712353,
            is_suspect: true,
            harmful: false,
            checked: true,
            check_date: '2017-06-09T11:58:11.032435Z'
          }
        },
        {
          id: 49394957,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-3.1519496, 48.561816],
                [-3.1519496, 48.561816],
                [-3.1519496, 48.561816],
                [-3.1519496, 48.561816],
                [-3.1519496, 48.561816]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [{ id: 1, name: 'intentional' }],
            features: [],
            user: 'urbaggp',
            uid: '6141225',
            editor: 'iD 2.2.1',
            comment: '+',
            source: 'Not reported',
            imagery_used: 'Bing aerial imagery',
            date: '2017-06-09T11:29:10Z',
            create: 1,
            modify: 0,
            delete: 0,
            area: 0.0,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-09T11:42:54.310618Z'
          }
        },
        {
          id: 49394955,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [45.8152703, 32.5329131],
                [45.8424792, 32.5329131],
                [45.8424792, 32.5382302],
                [45.8152703, 32.5382302],
                [45.8152703, 32.5329131]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [{ id: 36, name: 'New mapper' }],
            tags: [{ id: 3, name: 'very-severe' }],
            features: [],
            user: 'Sarmad Saeed Albadrawi',
            uid: '6146366',
            editor: 'MAPS.ME android 7.3.5-Google',
            comment: 'Created a caravan_site and a government office',
            source: 'Not reported',
            imagery_used: 'Not reported',
            date: '2017-06-09T11:29:04Z',
            create: 2,
            modify: 0,
            delete: 0,
            area: 0.000144672442189967,
            is_suspect: true,
            harmful: false,
            checked: true,
            check_date: '2017-06-09T11:46:22.226790Z'
          }
        },
        {
          id: 49394218,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-3.1497696, 48.5560526],
                [-3.1497696, 48.5560526],
                [-3.1497696, 48.5560526],
                [-3.1497696, 48.5560526],
                [-3.1497696, 48.5560526]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [{ id: 1, name: 'intentional' }],
            features: [],
            user: 'urbaggp',
            uid: '6141225',
            editor: 'iD 2.2.1',
            comment: '+',
            source: 'Not reported',
            imagery_used: 'Bing aerial imagery',
            date: '2017-06-09T11:05:09Z',
            create: 1,
            modify: 0,
            delete: 0,
            area: 0.0,
            is_suspect: false,
            harmful: true,
            checked: true,
            check_date: '2017-06-09T11:20:55.803034Z'
          }
        },
        {
          id: 49394216,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [38.6093396, 55.0514693],
                [38.6098718, 55.0514693],
                [38.6098718, 55.0544052],
                [38.6093396, 55.0544052],
                [38.6093396, 55.0514693]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'Angrycat',
            uid: '864907',
            editor: 'JOSM/1.5 (12039 ru)',
            comment: 'Not reported',
            source: 'Not reported',
            imagery_used: 'Not reported',
            date: '2017-06-09T11:05:09Z',
            create: 0,
            modify: 2,
            delete: 0,
            area: 1.5624859800046e-6,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-09T11:18:04.545872Z'
          }
        },
        {
          id: 49394193,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [35.4439654, -15.4386198],
                [35.4451696, -15.4386198],
                [35.4451696, -15.4374889],
                [35.4439654, -15.4374889],
                [35.4439654, -15.4386198]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'piaco_dk',
            uid: '3442203',
            editor: 'JOSM/1.5 (12275 en_GB)',
            comment:
              '#hotosm-project-3100 #MissingMaps #Malawi #rodekruis #redcross #has20170606 #kragten20170608',
            source: 'Bing',
            imagery_used: 'Not reported',
            date: '2017-06-09T11:04:08Z',
            create: 62,
            modify: 3,
            delete: 0,
            area: 1.36182977999575e-6,
            is_suspect: false,
            harmful: true,
            checked: true,
            check_date: '2017-06-09T11:17:05.667830Z'
          }
        },
        {
          id: 49394192,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [24.9191791, 58.1574924],
                [24.9627525, 58.1574924],
                [24.9627525, 58.2042522],
                [24.9191791, 58.2042522],
                [24.9191791, 58.1574924]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'juhanjuku',
            uid: '152305',
            editor: 'JOSM/1.5 (12275 en)',
            comment: 'osmose corrections',
            source: 'maaamet',
            imagery_used: 'Not reported',
            date: '2017-06-09T11:04:06Z',
            create: 68,
            modify: 10,
            delete: 0,
            area: 0.00203748346931984,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-09T11:17:47.660646Z'
          }
        },
        {
          id: 49394191,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [142.1299883, -34.201851],
                [142.1299883, -34.201851],
                [142.1299883, -34.201851],
                [142.1299883, -34.201851],
                [142.1299883, -34.201851]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [{ id: 2, name: 'suspect_word' }],
            tags: [],
            features: [],
            user: 'Ewen Hill',
            uid: '935037',
            editor: 'iD 2.2.1',
            comment: 'keepright fixes in NW Victoria',
            source: 'Not reported',
            imagery_used: 'LPI NSW Imagery',
            date: '2017-06-09T11:04:03Z',
            create: 0,
            modify: 1,
            delete: 0,
            area: 0.0,
            is_suspect: true,
            harmful: true,
            checked: true,
            check_date: '2017-06-09T11:17:52.995675Z'
          }
        },
        {
          id: 49394190,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [90.0816973, 52.6507761],
                [90.0923799, 52.6507761],
                [90.0923799, 52.6549171],
                [90.0816973, 52.6549171],
                [90.0816973, 52.6507761]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'Алекс327',
            uid: '6142064',
            editor: 'iD 2.2.1',
            comment: 'улица',
            source: 'Not reported',
            imagery_used: 'Bing aerial imagery',
            date: '2017-06-09T11:03:59Z',
            create: 0,
            modify: 1,
            delete: 0,
            area: 4.42366465999502e-5,
            is_suspect: false,
            harmful: true,
            checked: true,
            check_date: '2017-06-09T11:17:55.750203Z'
          }
        },
        {
          id: 49394054,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-66.5983146, 45.9534624],
                [-66.573185, 45.9534624],
                [-66.573185, 45.9798911],
                [-66.5983146, 45.9798911],
                [-66.5983146, 45.9534624]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'lorandr_telenav',
            uid: '4973384',
            editor: 'JOSM/1.5 (12275 en)',
            comment: 'added road geoetry and name',
            source: 'Bing, Geobase Roads, Digitalglobe,Canvec',
            imagery_used: 'Not reported',
            date: '2017-06-09T10:59:06Z',
            create: 14,
            modify: 1,
            delete: 0,
            area: 0.000664142659520087,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-09T11:14:31.619094Z'
          }
        },
        {
          id: 49394053,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [30.1957598, -17.9752844],
                [30.1964525, -17.9752844],
                [30.1964525, -17.974224],
                [30.1957598, -17.974224],
                [30.1957598, -17.9752844]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'kombe1207',
            uid: '3046993',
            editor: 'JOSM/1.5 (10786 en_GB)',
            comment:
              '#hotosm-project-3144 #MissingMaps #EliminateMalaria #Zimbabwe',
            source:
              'tms[22]:https://api.mapbox.com/v4/digitalglobe.2lnp1jee/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNpd3A2OTAwODAwNGUyenFuNTkyZjRkeWsifQ.Y44JcpYP9gXsZD3p5KBZbA',
            imagery_used: 'Not reported',
            date: '2017-06-09T10:59:03Z',
            create: 15,
            modify: 0,
            delete: 0,
            area: 7.34539079998274e-7,
            is_suspect: false,
            harmful: true,
            checked: true,
            check_date: '2017-06-09T11:14:53.511647Z'
          }
        },
        {
          id: 49394052,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [10.1895198, 36.8982088],
                [10.1904028, 36.8982088],
                [10.1904028, 36.8989133],
                [10.1895198, 36.8989133],
                [10.1895198, 36.8982088]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'foufou08',
            uid: '88729',
            editor: 'iD 2.2.1',
            comment: 'Mise à jour dinformation',
            source: 'Not reported',
            imagery_used: 'Bing aerial imagery',
            date: '2017-06-09T10:59:00Z',
            create: 13,
            modify: 0,
            delete: 0,
            area: 6.22073499997915e-7,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-09T11:13:01.885071Z'
          }
        },
        {
          id: 49394051,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [6.8692076, 51.5639408],
                [6.8697881, 51.5639408],
                [6.8697881, 51.5670704],
                [6.8692076, 51.5670704],
                [6.8692076, 51.5639408]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'Dumens100',
            uid: '139430',
            editor: 'JOSM/1.5 (12275 de)',
            comment: 'Not reported',
            source: 'Not reported',
            imagery_used: 'Not reported',
            date: '2017-06-09T10:58:53Z',
            create: 0,
            modify: 3,
            delete: 0,
            area: 1.81673280000028e-6,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-09T11:14:14.669266Z'
          }
        },
        {
          id: 49394050,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [30.2350389, -17.8511145],
                [30.2350977, -17.8511145],
                [30.2350977, -17.8509344],
                [30.2350389, -17.8509344],
                [30.2350389, -17.8511145]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'danielzyt',
            uid: '3588829',
            editor: 'JOSM/1.5 (11427 en)',
            comment:
              '#hotosm-project-3144 #MissingMaps #EliminateMalaria #Zimbabwe #TeamGoodMappers #danielzyt',
            source:
              'tms[22]:https://api.mapbox.com/v4/digitalglobe.2lnp1jee/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNpd3A2OTAwODAwNGUyenFuNTkyZjRkeWsifQ.Y44JcpYP9gXsZD3p5KBZbA',
            imagery_used: 'Not reported',
            date: '2017-06-09T10:58:51Z',
            create: 22,
            modify: 0,
            delete: 0,
            area: 1.05898800003504e-8,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-09T11:14:18.712332Z'
          }
        },
        {
          id: 49394006,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [4.6192125, 52.6086879],
                [4.7360229, 52.6086879],
                [4.7360229, 52.6701916],
                [4.6192125, 52.6701916],
                [4.6192125, 52.6086879]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [{ id: 2, name: 'suspect_word' }],
            tags: [],
            features: [],
            user: 'A67-A67',
            uid: '553736',
            editor: 'JOSM/1.5 (11826 nl)',
            comment: 'Fix wandelnetwerk: typos',
            source: 'osma.vmarc.be',
            imagery_used: 'Not reported',
            date: '2017-06-09T10:56:58Z',
            create: 0,
            modify: 1,
            delete: 0,
            area: 0.00718427179848036,
            is_suspect: true,
            harmful: false,
            checked: true,
            check_date: '2017-06-09T11:15:09.531549Z'
          }
        },
        {
          id: 49393772,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [11.1156924, 46.658625],
                [11.1175562, 46.658625],
                [11.1175562, 46.6599188],
                [11.1156924, 46.6599188],
                [11.1156924, 46.658625]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'Pathumthani',
            uid: '2302962',
            editor: 'iD 2.2.1',
            comment: 'highway: name added',
            source: 'Not reported',
            imagery_used: 'South Tyrol Orthofoto 2014',
            date: '2017-06-09T10:46:52Z',
            create: 2,
            modify: 2,
            delete: 0,
            area: 2.41138443999689e-6,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-09T10:59:45.276029Z'
          }
        },
        {
          id: 49393771,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [5.190125, 7.2341652],
                [5.1907878, 7.2341652],
                [5.1907878, 7.235221],
                [5.190125, 7.235221],
                [5.190125, 7.2341652]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'Smart D',
            uid: '3522458',
            editor: 'iD 2.2.1',
            comment: '#hotosm-task-313, #YouthMappers#scfuta',
            source: 'Not reported',
            imagery_used:
              'Custom (https://api.mapbox.com/styles/v1/geocruizer/ciziuuy58001w2snv7octhtgl/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2VvY3J1aXplciIsImEiOiI3aHVNOHo0In0.otALjslgnRe1OPtToZqNSA)',
            date: '2017-06-09T10:46:51Z',
            create: 70,
            modify: 0,
            delete: 0,
            area: 6.99784240000055e-7,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-09T11:12:29.947002Z'
          }
        },
        {
          id: 49392269,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [12.4280654, 43.9371015],
                [12.442066, 43.9371015],
                [12.442066, 43.9499533],
                [12.4280654, 43.9499533],
                [12.4280654, 43.9371015]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'Samuele Battarra',
            uid: '51179',
            editor: 'JOSM/1.5 (12275 it)',
            comment: 'incrocio con fosso',
            source: 'keepright',
            imagery_used: 'Not reported',
            date: '2017-06-09T09:49:05Z',
            create: 2,
            modify: 1,
            delete: 0,
            area: 0.000179932911080013,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-09T10:03:19.346955Z'
          }
        },
        {
          id: 49392165,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [88.6228565, 24.3618434],
                [88.6305491, 24.3618434],
                [88.6305491, 24.3755404],
                [88.6228565, 24.3755404],
                [88.6228565, 24.3618434]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'Rifaa153',
            uid: '6130051',
            editor: 'iD 2.2.1',
            comment: 'Rajshahi University of Engineering and Technology (RUET)',
            source: 'Not reported',
            imagery_used: 'Bing aerial imagery',
            date: '2017-06-09T09:46:10Z',
            create: 0,
            modify: 1,
            delete: 0,
            area: 0.000105365542199958,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-09T10:00:05.105247Z'
          }
        },
        {
          id: 49389572,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-105.0495849, 39.7779568],
                [-105.0493724, 39.7779568],
                [-105.0493724, 39.778012],
                [-105.0495849, 39.778012],
                [-105.0495849, 39.7779568]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'chachafish',
            uid: '2237750',
            editor: 'iD 2.2.1',
            comment:
              'Adding houses, sidewalks, vegetation, businesses, roads and other pertinent information.',
            source: 'Not reported',
            imagery_used: 'Bing aerial imagery',
            date: '2017-06-09T08:12:09Z',
            create: 0,
            modify: 1,
            delete: 0,
            area: 1.172999999987e-8,
            is_suspect: false,
            harmful: true,
            checked: true,
            check_date: '2017-06-09T08:28:14.055757Z'
          }
        },
        {
          id: 49389571,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [5.619411, 47.3494009],
                [6.1085445, 47.3494009],
                [6.1085445, 47.7092621],
                [5.619411, 47.7092621],
                [5.619411, 47.3494009]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [{ id: 35, name: 'Unknown iD instance' }],
            tags: [],
            features: [],
            user: 'withoutrope',
            uid: '3495385',
            editor: 'iD 1.8.5-slide',
            comment: 'Precisions',
            source: 'Not reported',
            imagery_used:
              'Bing;Strava Global Heat;Strava Cycling Heat;Strava Running Heat;OpenStreetMap GPS traces',
            date: '2017-06-09T08:12:05Z',
            create: 483,
            modify: 143,
            delete: 9,
            area: 0.176020168270199,
            is_suspect: true,
            harmful: true,
            checked: true,
            check_date: '2017-06-09T08:28:20.299331Z'
          }
        },
        {
          id: 49388715,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [29.0059691, 47.7728426],
                [29.0059691, 47.7728426],
                [29.0059691, 47.7728426],
                [29.0059691, 47.7728426],
                [29.0059691, 47.7728426]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'AdventurerRussia',
            uid: '3050825',
            editor: 'MAPS.ME ios 7.3.4',
            comment: 'Updated a nightclub',
            source: 'Not reported',
            imagery_used: 'Not reported',
            date: '2017-06-09T07:38:09Z',
            create: 0,
            modify: 1,
            delete: 0,
            area: 0.0,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-09T07:51:41.204545Z'
          }
        },
        {
          id: 49388188,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [31.8890264, 55.2898539],
                [31.9320876, 55.2898539],
                [31.9320876, 55.3079197],
                [31.8890264, 55.3079197],
                [31.8890264, 55.2898539]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'bim2010',
            uid: '211028',
            editor: 'JOSM/1.5 (10966 ru)',
            comment: 'По ГИС ФГБУ «Национальный парк «Смоленское Поозерье»',
            source: 'По ГИС ФГБУ «Национальный парк «Смоленское Поозерье»',
            imagery_used: 'Not reported',
            date: '2017-06-09T07:18:09Z',
            create: 91,
            modify: 19,
            delete: 0,
            area: 0.000777935026960103,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-09T07:33:02.800362Z'
          }
        },
        {
          id: 49366826,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-91.6352383, 39.6911505],
                [-91.391614, 39.6911505],
                [-91.391614, 39.7913044],
                [-91.6352383, 39.7913044],
                [-91.6352383, 39.6911505]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'Richard',
            uid: '165',
            editor: 'Potlatch 2',
            comment: 'Minor roads',
            source: 'Not reported',
            imagery_used: 'Not reported',
            date: '2017-06-08T12:51:22Z',
            create: 1,
            modify: 11,
            delete: 3,
            area: 0.0243999237797699,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-09T05:22:50.743868Z'
          }
        },
        {
          id: 49366696,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [142.217889, -34.2724132],
                [142.2459286, -34.2724132],
                [142.2459286, -34.2061748],
                [142.217889, -34.2061748],
                [142.217889, -34.2724132]
              ]
            ]
          },
          properties: {
            check_user: 'wille',
            reasons: [{ id: 2, name: 'suspect_word' }],
            tags: [],
            features: [],
            user: 'Ewen Hill',
            uid: '935037',
            editor: 'iD 2.2.1',
            comment: 'keepright fixes in NW Victoria',
            source: 'Not reported',
            imagery_used: 'LPI NSW Imagery',
            date: '2017-06-08T12:47:20Z',
            create: 92,
            modify: 7,
            delete: 0,
            area: 0.00185729824064006,
            is_suspect: true,
            harmful: false,
            checked: true,
            check_date: '2017-06-08T13:44:29.879115Z'
          }
        },
        {
          id: 49362633,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [36.5737997, 55.1198903],
                [36.5762247, 55.1198903],
                [36.5762247, 55.1221565],
                [36.5737997, 55.1221565],
                [36.5737997, 55.1198903]
              ]
            ]
          },
          properties: {
            check_user: 'andygol',
            reasons: [],
            tags: [],
            features: [],
            user: 'rkham',
            uid: '658476',
            editor: 'iD 2.2.1',
            comment: 'ё',
            source: 'Not reported',
            imagery_used: 'Bing aerial imagery',
            date: '2017-06-08T10:25:36Z',
            create: 1,
            modify: 2,
            delete: 0,
            area: 5.49553499999189e-6,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-08T10:42:37.856357Z'
          }
        },
        {
          id: 49359048,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [5.7999433, 43.8287308],
                [5.8000921, 43.8287308],
                [5.8000921, 43.8288387],
                [5.7999433, 43.8288387],
                [5.7999433, 43.8287308]
              ]
            ]
          },
          properties: {
            check_user: 'nammala',
            reasons: [],
            tags: [],
            features: [],
            user: 'Pa413',
            uid: '688484',
            editor: 'iD 2.2.1',
            comment: 'Modification de lieux',
            source: 'Not reported',
            imagery_used: 'Bing aerial imagery',
            date: '2017-06-08T08:23:24Z',
            create: 0,
            modify: 1,
            delete: 0,
            area: 1.60555199994117e-8,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-08T08:44:06.096210Z'
          }
        },
        {
          id: 49358871,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [30.2792259, -17.8020592],
                [30.2810887, -17.8020592],
                [30.2810887, -17.8005846],
                [30.2792259, -17.8005846],
                [30.2792259, -17.8020592]
              ]
            ]
          },
          properties: {
            check_user: 'nammala',
            reasons: [],
            tags: [],
            features: [],
            user: 'christer1',
            uid: '3043915',
            editor: 'JOSM/1.5 (11639 en)',
            comment:
              '#hotosm-project-3133 #MissingMaps #EliminateMalaria #Zimbabwe',
            source:
              'tms[22]:https://api.mapbox.com/v4/digitalglobe.2lnp1jee/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNpd3A2OTAwODAwNGUyenFuNTkyZjRkeWsifQ.Y44JcpYP9gXsZD3p5KBZbA',
            imagery_used: 'Not reported',
            date: '2017-06-08T08:17:35Z',
            create: 30,
            modify: 0,
            delete: 0,
            area: 2.74688487999851e-6,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-08T08:32:17.262262Z'
          }
        },
        {
          id: 49358870,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-73.4415361, 45.4852708],
                [-73.4392447, 45.4852708],
                [-73.4392447, 45.4870634],
                [-73.4415361, 45.4870634],
                [-73.4415361, 45.4852708]
              ]
            ]
          },
          properties: {
            check_user: 'nammala',
            reasons: [],
            tags: [],
            features: [],
            user: 'petrar_telenav',
            uid: '4940486',
            editor: 'JOSM/1.5 (12039 en)',
            comment: 'corrected road name',
            source: 'Geobase',
            imagery_used: 'Not reported',
            date: '2017-06-08T08:17:34Z',
            create: 0,
            modify: 1,
            delete: 0,
            area: 4.1075636399698e-6,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-08T08:31:30.230232Z'
          }
        },
        {
          id: 49358869,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [48.8452775, 34.3030483],
                [48.8456818, 34.3030483],
                [48.8456818, 34.3033176],
                [48.8452775, 34.3033176],
                [48.8452775, 34.3030483]
              ]
            ]
          },
          properties: {
            check_user: 'nammala',
            reasons: [],
            tags: [],
            features: [],
            user: 'iran map 28',
            uid: '6081216',
            editor: 'Vespucci 0.9.8.1.1228',
            comment: 'Not reported',
            source: 'Not reported',
            imagery_used: 'Mapbox Satellite',
            date: '2017-06-08T08:17:34Z',
            create: 0,
            modify: 0,
            delete: 2,
            area: 1.08877989999629e-7,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-08T08:33:01.595724Z'
          }
        },
        {
          id: 49358868,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [130.41487, 33.595032],
                [130.41487, 33.595032],
                [130.41487, 33.595032],
                [130.41487, 33.595032],
                [130.41487, 33.595032]
              ]
            ]
          },
          properties: {
            check_user: 'nammala',
            reasons: [],
            tags: [],
            features: [],
            user: 'ari3104',
            uid: '2513066',
            editor: 'Pushpin iOS',
            comment: 'added Post Box',
            source: 'Not reported',
            imagery_used: 'Not reported',
            date: '2017-06-08T08:17:32Z',
            create: 1,
            modify: 0,
            delete: 0,
            area: 0.0,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-08T08:33:23.903670Z'
          }
        },
        {
          id: 49358867,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [35.4944329, 32.9560976],
                [35.494965, 32.9560976],
                [35.494965, 32.9564706],
                [35.4944329, 32.9564706],
                [35.4944329, 32.9560976]
              ]
            ]
          },
          properties: {
            check_user: 'nammala',
            reasons: [],
            tags: [],
            features: [],
            user: 'kobi81',
            uid: '6125015',
            editor: 'iD 2.2.1',
            comment: 'בניין',
            source: 'Not reported',
            imagery_used: 'Bing aerial imagery',
            date: '2017-06-08T08:17:31Z',
            create: 5,
            modify: 0,
            delete: 0,
            area: 1.98473300002094e-7,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-08T08:33:58.725088Z'
          }
        },
        {
          id: 49358865,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [74.5294172, 32.4843806],
                [74.5533248, 32.4843806],
                [74.5533248, 32.4993793],
                [74.5294172, 32.4993793],
                [74.5294172, 32.4843806]
              ]
            ]
          },
          properties: {
            check_user: 'nammala',
            reasons: [],
            tags: [],
            features: [],
            user: 'Imran999',
            uid: '5572758',
            editor: 'iD 2.2.1',
            comment: 'POI NEW',
            source: 'Not reported',
            imagery_used: 'Bing aerial imagery',
            date: '2017-06-08T08:17:30Z',
            create: 18,
            modify: 26,
            delete: 5,
            area: 0.000358582920120007,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-08T08:36:53.085057Z'
          }
        },
        {
          id: 49358864,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [22.6207359, 54.289795],
                [26.5708604, 54.289795],
                [26.5708604, 56.1480449],
                [22.6207359, 56.1480449],
                [22.6207359, 54.289795]
              ]
            ]
          },
          properties: {
            check_user: 'nammala',
            reasons: [],
            tags: [],
            features: [],
            user: 'Tomas Straupis',
            uid: '60129',
            editor: 'JOSM/1.5 (12275 lt)',
            comment: 'Žymėjimo tvarkymai',
            source: 'Not reported',
            imagery_used: 'Not reported',
            date: '2017-06-08T08:17:30Z',
            create: 37,
            modify: 106,
            delete: 5,
            area: 7.34031845711257,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-08T08:37:11.788047Z'
          }
        },
        {
          id: 49358863,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [43.0827598, 36.3642804],
                [43.0865737, 36.3642804],
                [43.0865737, 36.3677361],
                [43.0827598, 36.3677361],
                [43.0827598, 36.3642804]
              ]
            ]
          },
          properties: {
            check_user: 'nammala',
            reasons: [],
            tags: [],
            features: [],
            user: 'Simon0997',
            uid: '4865313',
            editor: 'iD 2.2.1',
            comment:
              'Irak, Mosul, #hotosm-task-562: added buildings\nsource=Bing',
            source: 'Not reported',
            imagery_used: 'Bing aerial imagery;Local GPX',
            date: '2017-06-08T08:17:27Z',
            create: 420,
            modify: 1,
            delete: 0,
            area: 1.31796942300284e-5,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-08T08:37:59.111713Z'
          }
        },
        {
          id: 49358862,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [11.5677695, 48.1212277],
                [11.6575036, 48.1212277],
                [11.6575036, 48.1315277],
                [11.5677695, 48.1315277],
                [11.5677695, 48.1212277]
              ]
            ]
          },
          properties: {
            check_user: 'nammala',
            reasons: [],
            tags: [],
            features: [],
            user: 'ToniE',
            uid: '8748',
            editor: 'JOSM/1.5 (12275 de)',
            comment:
              'oneway:except=psv durch oneway:psv=no ersetzt; oneway:bicycle=no gelöscht wo cycleway=opposite getagged ist',
            source: 'Fehler',
            imagery_used: 'Not reported',
            date: '2017-06-08T08:17:24Z',
            create: 0,
            modify: 4,
            delete: 0,
            area: 0.000924261230000071,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-08T08:39:19.615479Z'
          }
        },
        {
          id: 49358861,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [12.7099696, 12.6339511],
                [12.7826055, 12.6339511],
                [12.7826055, 12.6889746],
                [12.7099696, 12.6889746],
                [12.7099696, 12.6339511]
              ]
            ]
          },
          properties: {
            check_user: 'nammala',
            reasons: [],
            tags: [],
            features: [],
            user: 'Queezy',
            uid: '6139210',
            editor: 'iD 2.2.1',
            comment: '#hotosm-project-2768',
            source: 'Not reported',
            imagery_used: 'Bing aerial imagery;Local GPX',
            date: '2017-06-08T08:17:22Z',
            create: 207,
            modify: 4,
            delete: 0,
            area: 0.00399668144364992,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-08T08:42:29.724441Z'
          }
        },
        {
          id: 49354335,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [101.0664667, 4.5824012],
                [101.0741091, 4.5824012],
                [101.0741091, 4.5895945],
                [101.0664667, 4.5895945],
                [101.0664667, 4.5824012]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [
              { id: 1, name: 'intentional' },
              { id: 3, name: 'very-severe' }
            ],
            features: [],
            user: 'Chetan_Gowda',
            uid: '2644101',
            editor: 'JOSM/1.5 (12039 en)',
            comment: 'change of large building tag to industrial',
            source: 'Mapbox',
            imagery_used: 'Not reported',
            date: '2017-06-08T05:01:20Z',
            create: 0,
            modify: 23,
            delete: 5,
            area: 5.49740759199609e-5,
            is_suspect: false,
            harmful: true,
            checked: true,
            check_date: '2017-06-10T07:28:24.450718Z'
          }
        },
        {
          id: 49349235,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [33.7288519, -3.1830226],
                [33.7713952, -3.1830226],
                [33.7713952, -3.1432984],
                [33.7288519, -3.1432984],
                [33.7288519, -3.1830226]
              ]
            ]
          },
          properties: {
            check_user: 'nammala',
            reasons: [{ id: 72, name: 'Randomized flag' }],
            tags: [],
            features: [
              {
                osm_id: 484892975,
                url: 'way-484892975',
                name: null,
                reasons: [{ id: 72, name: 'Randomized flag' }]
              }
            ],
            user: 'Samuel BENETEAU',
            uid: '3542797',
            editor: 'iD 2.2.1',
            comment:
              '#TanzaniaDevelopmentTrust #Tanzania #missingmaps #hotosm-project-2609',
            source: 'Not reported',
            imagery_used: 'Bing aerial imagery;Local GPX',
            date: '2017-06-07T21:50:24Z',
            create: 55,
            modify: 12,
            delete: 1,
            area: 0.00168999855785995,
            is_suspect: true,
            harmful: false,
            checked: true,
            check_date: '2017-06-08T08:29:28.075071Z'
          }
        },
        {
          id: 49338301,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [2.329097, 50.5266148],
                [2.4206569, 50.5266148],
                [2.4206569, 50.601387],
                [2.329097, 50.601387],
                [2.329097, 50.5266148]
              ]
            ]
          },
          properties: {
            check_user: 'nammala',
            reasons: [{ id: 72, name: 'Randomized flag' }],
            tags: [],
            features: [
              {
                osm_id: 67373622,
                url: 'way-67373622',
                name: null,
                reasons: [{ id: 72, name: 'Randomized flag' }]
              }
            ],
            user: 'kritic',
            uid: '414659',
            editor: 'JOSM/1.5 (12275 fr)',
            comment: 'Osmose, BD Ortho IGN, Cadastre',
            source: 'Osmose, BD Ortho IGN, Cadastre',
            imagery_used: 'Not reported',
            date: '2017-06-07T14:31:19Z',
            create: 4,
            modify: 4,
            delete: 0,
            area: 0.00684613515478049,
            is_suspect: true,
            harmful: false,
            checked: true,
            check_date: '2017-06-08T08:48:47.168282Z'
          }
        },
        {
          id: 49331026,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [27.5438319, -29.422403],
                [27.5557344, -29.422403],
                [27.5557344, -29.4104243],
                [27.5438319, -29.4104243],
                [27.5438319, -29.422403]
              ]
            ]
          },
          properties: {
            check_user: 'nammala',
            reasons: [
              { id: 3, name: 'possible import' },
              { id: 72, name: 'Randomized flag' }
            ],
            tags: [],
            features: [
              {
                osm_id: 498812774,
                url: 'way-498812774',
                name: null,
                reasons: [{ id: 72, name: 'Randomized flag' }]
              }
            ],
            user: 'Lineo',
            uid: '1931244',
            editor: 'JOSM/1.5 (11427 en_GB)',
            comment: '#hotosm-project-1945 #maplesotho #mlmstask',
            source: 'Bing',
            imagery_used: 'Not reported',
            date: '2017-06-07T10:11:12Z',
            create: 459,
            modify: 18,
            delete: 0,
            area: 0.000142576476749978,
            is_suspect: true,
            harmful: false,
            checked: true,
            check_date: '2017-06-08T09:01:44.252983Z'
          }
        },
        {
          id: 49330639,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [36.0024993, 64.0131908],
                [36.0162155, 64.0131908],
                [36.0162155, 64.0264267],
                [36.0024993, 64.0264267],
                [36.0024993, 64.0131908]
              ]
            ]
          },
          properties: {
            check_user: 'nammala',
            reasons: [{ id: 72, name: 'Randomized flag' }],
            tags: [],
            features: [
              {
                osm_id: 498821594,
                url: 'way-498821594',
                name: null,
                reasons: [{ id: 72, name: 'Randomized flag' }]
              }
            ],
            user: 'Trollebas Trolleybusov Kaboomov',
            uid: '6115544',
            editor: 'iD 2.2.1',
            comment: 'Улучшаю',
            source: 'Not reported',
            imagery_used: 'Bing aerial imagery',
            date: '2017-06-07T09:52:46Z',
            create: 464,
            modify: 7,
            delete: 0,
            area: 0.000181546251580033,
            is_suspect: true,
            harmful: false,
            checked: true,
            check_date: '2017-06-08T09:49:58.739497Z'
          }
        },
        {
          id: 49330579,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [81.2133255, 50.3491416],
                [81.696792, 50.3491416],
                [81.696792, 50.567829],
                [81.2133255, 50.567829],
                [81.2133255, 50.3491416]
              ]
            ]
          },
          properties: {
            check_user: 'nammala',
            reasons: [
              { id: 3, name: 'possible import' },
              { id: 72, name: 'Randomized flag' }
            ],
            tags: [],
            features: [
              {
                osm_id: 497895813,
                url: 'way-497895813',
                name: null,
                reasons: [{ id: 72, name: 'Randomized flag' }]
              }
            ],
            user: 'Kuritsyn Roman',
            uid: '3318452',
            editor: 'JOSM/1.5 (12275 ru)',
            comment: 'Красный Яр',
            source: 'DigitalGlobe Premium',
            imagery_used: 'Not reported',
            date: '2017-06-07T09:49:40Z',
            create: 302,
            modify: 16,
            delete: 0,
            area: 0.105728031872101,
            is_suspect: true,
            harmful: false,
            checked: true,
            check_date: '2017-06-08T09:43:41.974523Z'
          }
        },
        {
          id: 49330260,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [30.189991, -17.7543483],
                [30.1901025, -17.7543483],
                [30.1901025, -17.7541398],
                [30.189991, -17.7541398],
                [30.189991, -17.7543483]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'tonny john',
            uid: '2780523',
            editor: 'JOSM/1.5 (10786 en)',
            comment:
              '#hotosm-project-3132 #MissingMaps #EliminateMalaria #Zimbabwe',
            source:
              'tms[22]:https://api.mapbox.com/v4/digitalglobe.2lnp1jee/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNpd3A2OTAwODAwNGUyenFuNTkyZjRkeWsifQ.Y44JcpYP9gXsZD3p5KBZbA',
            imagery_used: 'Not reported',
            date: '2017-06-07T09:34:34Z',
            create: 15,
            modify: 0,
            delete: 0,
            area: 2.32477499997556e-8,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-07T09:47:32.271909Z'
          }
        },
        {
          id: 49329865,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [91.653738, 24.4320514],
                [91.6859261, 24.4320514],
                [91.6859261, 24.4652178],
                [91.653738, 24.4652178],
                [91.653738, 24.4320514]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'Dewan Salimuddin Ahmed',
            uid: '4502097',
            editor: 'iD 2.2.1',
            comment: 'Road created',
            source: 'Not reported',
            imagery_used: 'Bing aerial imagery',
            date: '2017-06-07T09:15:42Z',
            create: 101,
            modify: 0,
            delete: 0,
            area: 0.00106756339984005,
            is_suspect: false,
            harmful: true,
            checked: true,
            check_date: '2017-06-07T14:34:35.198576Z'
          }
        },
        {
          id: 49329798,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [90.4393405, 23.6920521],
                [90.4438198, 23.6920521],
                [90.4438198, 23.6943514],
                [90.4393405, 23.6943514],
                [90.4393405, 23.6920521]
              ]
            ]
          },
          properties: {
            check_user: 'nammala',
            reasons: [
              { id: 3, name: 'possible import' },
              { id: 72, name: 'Randomized flag' }
            ],
            tags: [],
            features: [
              {
                osm_id: 498814580,
                url: 'way-498814580',
                name: null,
                reasons: [{ id: 72, name: 'Randomized flag' }]
              }
            ],
            user: 'Rayhan Hossen',
            uid: '5752560',
            editor: 'JOSM/1.5 (11826 en)',
            comment:
              '#hotosm-task-366 #OSMBD #BHOOT #MissingMaps #HOT #Mapillary #Dhaka_Mapathon #Pathao',
            source: 'Mapbox Satelite, Digital Globe Premium Imagery',
            imagery_used: 'Not reported',
            date: '2017-06-07T09:12:47Z',
            create: 725,
            modify: 0,
            delete: 0,
            area: 1.02992544899867e-5,
            is_suspect: true,
            harmful: false,
            checked: true,
            check_date: '2017-06-08T09:12:55.549269Z'
          }
        },
        {
          id: 49329486,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [30.1357457, -17.7752923],
                [30.1360565, -17.7752923],
                [30.1360565, -17.7751361],
                [30.1357457, -17.7751361],
                [30.1357457, -17.7752923]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [
              { id: 1, name: 'intentional' },
              { id: 3, name: 'very-severe' },
              { id: 2, name: 'unintentional' }
            ],
            features: [],
            user: 'tonny john',
            uid: '2780523',
            editor: 'JOSM/1.5 (10786 en)',
            comment:
              '#hotosm-project-3132 #MissingMaps #EliminateMalaria #Zimbabwe',
            source:
              'tms[22]:https://api.mapbox.com/v4/digitalglobe.2lnp1jee/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNpd3A2OTAwODAwNGUyenFuNTkyZjRkeWsifQ.Y44JcpYP9gXsZD3p5KBZbA',
            imagery_used: 'Not reported',
            date: '2017-06-07T08:56:36Z',
            create: 15,
            modify: 0,
            delete: 0,
            area: 4.85469599994014e-8,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-07T09:09:53.564660Z'
          }
        },
        {
          id: 49329485,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-2.4208979, 13.6404651],
                [-2.4179587, 13.6404651],
                [-2.4179587, 13.6430271],
                [-2.4208979, 13.6430271],
                [-2.4208979, 13.6404651]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [
              { id: 2, name: 'unintentional' },
              { id: 1, name: 'intentional' },
              { id: 3, name: 'very-severe' },
              { id: 4, name: 'notfixed' }
            ],
            features: [],
            user: 'Jean-Yves Longchamp',
            uid: '3600936',
            editor: 'JOSM/1.5 (12039 fr)',
            comment:
              '#hotosm-project-2333 #MissingMaps #Ouahigouya #BurkinaFaso #DigitalGlobe #NextView',
            source:
              'http://hiu-maps.net/hot/1.0.0/ouahigouya-28jan2015-flipped/{zoom}/{x}/{y}.png',
            imagery_used: 'Not reported',
            date: '2017-06-07T08:56:24Z',
            create: 5,
            modify: 2,
            delete: 1,
            area: 7.53023039999827e-6,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-07T09:10:38.017258Z'
          }
        },
        {
          id: 49329484,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [27.5280919, 53.8610378],
                [27.5280919, 53.8610378],
                [27.5280919, 53.8610378],
                [27.5280919, 53.8610378],
                [27.5280919, 53.8610378]
              ]
            ]
          },
          properties: {
            check_user: 'kepta',
            reasons: [],
            tags: [],
            features: [],
            user: 'Cosmopolit',
            uid: '196157',
            editor: 'iD 2.2.1',
            comment: 'колонки уже демонтированы',
            source: 'Not reported',
            imagery_used: 'OpenStreetMap (Standard)',
            date: '2017-06-07T08:56:21Z',
            create: 0,
            modify: 0,
            delete: 1,
            area: 0.0,
            is_suspect: false,
            harmful: false,
            checked: true,
            check_date: '2017-06-07T09:10:50.303506Z'
          }
        },
        {
          id: 49329182,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [90.4100105, 23.721121],
                [90.422456, 23.721121],
                [90.422456, 23.7308017],
                [90.4100105, 23.7308017],
                [90.4100105, 23.721121]
              ]
            ]
          },
          properties: {
            check_user: 'nammala',
            reasons: [{ id: 72, name: 'Randomized flag' }],
            tags: [],
            features: [
              {
                osm_id: 498809418,
                url: 'way-498809418',
                name: null,
                reasons: [{ id: 72, name: 'Randomized flag' }]
              }
            ],
            user: 'tasauf1980',
            uid: '2574748',
            editor: 'JOSM/1.5 (12039 en)',
            comment:
              '#hotosm-task-366 #OSMBD #BHOOT #MissingMaps #HOT #Mapillary #Pathao',
            source:
              'tms[22]:https://api.mapbox.com/v4/digitalglobe.2lnp1jee/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNpd3A2OTAwODAwNGUyenFuNTkyZjRkeWsifQ.Y44JcpYP9gXsZD3p5KBZbA',
            imagery_used: 'Not reported',
            date: '2017-06-07T08:42:39Z',
            create: 213,
            modify: 92,
            delete: 44,
            area: 0.000120481151849991,
            is_suspect: true,
            harmful: false,
            checked: true,
            check_date: '2017-06-08T08:49:27.671179Z'
          }
        },
        {
          id: 49329158,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [44.1542718, 44.7765525],
                [44.176786, 44.7765525],
                [44.176786, 44.7879844],
                [44.1542718, 44.7879844],
                [44.1542718, 44.7765525]
              ]
            ]
          },
          properties: {
            check_user: 'nammala',
            reasons: [
              { id: 3, name: 'possible import' },
              { id: 72, name: 'Randomized flag' }
            ],
            tags: [],
            features: [
              {
                osm_id: 498808757,
                url: 'way-498808757',
                name: null,
                reasons: [{ id: 72, name: 'Randomized flag' }]
              }
            ],
            user: 'Kazykan',
            uid: '1268842',
            editor: 'JOSM/1.5 (12039 ru)',
            comment: 'По снимкам bing',
            source: 'Bing',
            imagery_used: 'Not reported',
            date: '2017-06-07T08:41:29Z',
            create: 3160,
            modify: 63,
            delete: 24,
            area: 0.000257380082979995,
            is_suspect: true,
            harmful: false,
            checked: true,
            check_date: '2017-06-08T08:50:13.597835Z'
          }
        },
        {
          id: 49328955,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [44.6429572, 43.0104807],
                [44.6746492, 43.0104807],
                [44.6746492, 43.0316709],
                [44.6429572, 43.0316709],
                [44.6429572, 43.0104807]
              ]
            ]
          },
          properties: {
            check_user: 'nammala',
            reasons: [{ id: 72, name: 'Randomized flag' }],
            tags: [],
            features: [
              {
                osm_id: 498807370,
                url: 'way-498807370',
                name: null,
                reasons: [{ id: 72, name: 'Randomized flag' }]
              }
            ],
            user: 'K@KTyC',
            uid: '610889',
            editor: 'JOSM/1.5 (12275 ru)',
            comment: 'Прорисовка района',
            source: 'Bing+личные наблюдения',
            imagery_used: 'Not reported',
            date: '2017-06-07T08:33:13Z',
            create: 63,
            modify: 116,
            delete: 4,
            area: 0.000671559818399976,
            is_suspect: true,
            harmful: false,
            checked: true,
            check_date: '2017-06-08T08:50:46.469311Z'
          }
        }
      ]
    });
  }
});
